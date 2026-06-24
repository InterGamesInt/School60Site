<template>
  <div>
    <HeroSection />
    <AboutSection />
    <ProjectsSection />
  </div>
</template>

<script>
import HeroSection from '../components/HeroSection.vue';
import AboutSection from '../components/AboutSection.vue';
import ProjectsSection from '../components/ProjectsSection.vue';

export default {
  components: {
    HeroSection,
    AboutSection,
    ProjectsSection
  }
}
</script>