import DOMPurify from 'dompurify';

export function sanitizeRichText(html) {
  if (!html) return '';

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'u', 's', 'strike', 'del',
      'a', 'ul', 'ol', 'li', 'blockquote',
      'p', 'br', 'img', 'h1', 'h2', 'h3', 'h4', 'span', 'div',
      'iframe', 'video', 'source', 'pre', 'code', 'hr'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'style',
      'width', 'height', 'frameborder', 'allowfullscreen', 'allow',
      'controls', 'autoplay', 'muted', 'loop', 'data-wrap', 'data-text-align'
    ]
  });
}
