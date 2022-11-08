// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  root: true,
  modules: ['@nuxtjs/tailwindcss'],
  css: ['@/assets/css/fonts.css', '@/assets/css/main.css'],
  build: {
    transpile: ['vue-toastification'],
  },

  app: {
    head: {
      title: '쉿! 교수님 몰래 들어오세요..', // 임시
      htmlAttrs: {
        lang: 'ko',
      },
      meta: [{ name: 'description', content: '리워드 기반 학술 질문/답변 플랫폼' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
});
