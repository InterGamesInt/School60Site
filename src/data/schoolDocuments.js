import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  writeBatch
} from 'firebase/firestore';

export const FIRESTORE_PDF_CHUNK_SIZE = 650000;
export const FIRESTORE_PDF_CHUNKS_PER_BATCH = 8;

export const schoolDocumentSlots = [
  {
    id: 'commission',
    title: 'Створення комісії',
    description: 'Наказ або документ про створення комісії з розгляду випадків булінгу.'
  },
  {
    id: 'response',
    title: 'Порядок реагування',
    description: 'Порядок реагування на доведені випадки булінгу (цькування).'
  },
  {
    id: 'submission',
    title: 'Процедура подання',
    description: 'Процедура подання та розгляду заяв про випадок булінгу.'
  },
  {
    id: 'statement',
    title: 'Заява про випадок',
    description: 'Форма заяви про випадок булінгу (цькування).'
  }
];

export function mergeSchoolDocuments(savedDocuments = {}) {
  return schoolDocumentSlots.map(slot => {
    const savedDocument = savedDocuments?.[slot.id] || {};

    return {
      ...slot,
      fileName: savedDocument.fileName || '',
      sourceType: savedDocument.sourceType || savedDocument.storageType || '',
      size: savedDocument.size || 0,
      chunkCount: savedDocument.chunkCount || 0,
      chunkSize: savedDocument.chunkSize || FIRESTORE_PDF_CHUNK_SIZE,
      dataPath: savedDocument.dataPath || '',
      updatedAt: savedDocument.updatedAt || null,
      src: savedDocument.url || savedDocument.src || ''
    };
  });
}

export function getSchoolDocumentChunksCollection(db, documentId) {
  return collection(db, 'siteSettings', 'schoolDocuments', 'files', documentId, 'chunks');
}

export function getSchoolDocumentChunkDoc(db, documentId, chunkIndex) {
  return doc(getSchoolDocumentChunksCollection(db, documentId), String(chunkIndex).padStart(4, '0'));
}

export function splitBase64IntoChunks(base64, chunkSize = FIRESTORE_PDF_CHUNK_SIZE) {
  const chunks = [];

  for (let index = 0; index < base64.length; index += chunkSize) {
    chunks.push(base64.slice(index, index + chunkSize));
  }

  return chunks;
}

export function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || '');
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error || new Error('File reading failed'));
    reader.readAsDataURL(file);
  });
}

function base64ToUint8Array(base64) {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);

  for (let index = 0; index < binaryString.length; index += 1) {
    bytes[index] = binaryString.charCodeAt(index);
  }

  return bytes;
}

export function createPdfObjectUrlFromBase64Chunks(chunks) {
  const byteChunks = chunks
    .filter(Boolean)
    .map(chunk => base64ToUint8Array(chunk));

  if (!byteChunks.length) return '';

  return URL.createObjectURL(new Blob(byteChunks, { type: 'application/pdf' }));
}

export async function deleteFirestorePdfChunks(db, documentId) {
  const snapshot = await getDocs(getSchoolDocumentChunksCollection(db, documentId));
  const docs = snapshot.docs;

  for (let index = 0; index < docs.length; index += 450) {
    const batch = writeBatch(db);
    docs.slice(index, index + 450).forEach(chunkDoc => {
      batch.delete(chunkDoc.ref);
    });
    await batch.commit();
  }
}

export async function uploadPdfToFirestoreChunks(db, documentSlot, file, options = {}) {
  const onProgress = typeof options.onProgress === 'function' ? options.onProgress : () => {};

  onProgress({ stage: 'reading', progress: 5, message: 'Читання PDF-файлу...' });
  const base64 = await readFileAsBase64(file);
  const chunks = splitBase64IntoChunks(base64);

  onProgress({ stage: 'cleanup', progress: 12, message: 'Підготовка місця у Firestore...' });
  await deleteFirestorePdfChunks(db, documentSlot.id);

  for (let index = 0; index < chunks.length; index += FIRESTORE_PDF_CHUNKS_PER_BATCH) {
    const batch = writeBatch(db);

    chunks.slice(index, index + FIRESTORE_PDF_CHUNKS_PER_BATCH).forEach((chunk, offset) => {
      const chunkIndex = index + offset;
      batch.set(getSchoolDocumentChunkDoc(db, documentSlot.id, chunkIndex), {
        index: chunkIndex,
        data: chunk
      });
    });

    await batch.commit();
    onProgress({
      stage: 'uploading',
      progress: Math.round(12 + ((Math.min(index + FIRESTORE_PDF_CHUNKS_PER_BATCH, chunks.length) / chunks.length) * 82)),
      message: `Завантажено ${Math.min(index + FIRESTORE_PDF_CHUNKS_PER_BATCH, chunks.length)} з ${chunks.length} частин...`
    });
  }

  const metadata = {
    title: documentSlot.title,
    fileName: file.name,
    contentType: 'application/pdf',
    size: file.size,
    chunkCount: chunks.length,
    chunkSize: FIRESTORE_PDF_CHUNK_SIZE,
    sourceType: 'firestore-chunks',
    dataPath: `siteSettings/schoolDocuments/files/${documentSlot.id}/chunks`,
    updatedAt: Timestamp.now()
  };

  await setDoc(
    doc(db, 'siteSettings', 'schoolDocuments', 'files', documentSlot.id),
    metadata,
    { merge: true }
  );

  onProgress({ stage: 'done', progress: 100, message: 'PDF успішно завантажено.' });
  return metadata;
}

export async function loadPdfDataUrlFromFirestoreChunks(db, documentId) {
  const chunksSnapshot = await getDocs(
    query(getSchoolDocumentChunksCollection(db, documentId), orderBy('index', 'asc'))
  );

  const base64 = chunksSnapshot.docs
    .map(chunkDoc => chunkDoc.data().data || '')
    .join('');

  return base64 ? `data:application/pdf;base64,${base64}` : '';
}

export async function loadPdfObjectUrlFromFirestoreChunks(db, documentId) {
  const chunksSnapshot = await getDocs(
    query(getSchoolDocumentChunksCollection(db, documentId), orderBy('index', 'asc'))
  );

  const chunks = chunksSnapshot.docs.map(chunkDoc => chunkDoc.data().data || '');

  return createPdfObjectUrlFromBase64Chunks(chunks);
}

export async function clearFirestorePdfDocument(db, documentId) {
  await deleteFirestorePdfChunks(db, documentId);
  await deleteDoc(doc(db, 'siteSettings', 'schoolDocuments', 'files', documentId));
}
