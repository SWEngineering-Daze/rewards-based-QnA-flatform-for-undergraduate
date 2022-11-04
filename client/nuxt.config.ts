// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  root: true,
  modules: ['@nuxtjs/tailwindcss'],
  css: ['@/assets/css/fonts.css'],

  app: {
    head: {
      title: '얼렁뚱땅', // 임시
      htmlAttrs: {
        lang: 'ko',
      },
      meta: [{ name: 'description', content: '팀 얼렁뚱땅' }],
    },
  },
});
