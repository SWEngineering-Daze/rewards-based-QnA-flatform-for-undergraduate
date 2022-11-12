const title = '쉿! 교수님 몰래 들어오세요';
const description = '리워드 기반 학술 정보 QnA 커뮤니티';
const thumb = 'https://sw.bisue.shop/thumb.png';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  root: true,
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  css: ['@/assets/css/fonts.css', '@/assets/css/main.css'],
  build: {
    transpile: ['vue-toastification'],
  },

  app: {
    head: {
      title,
      htmlAttrs: {
        lang: 'ko',
      },
      meta: [
        { name: 'description', content: description },
        { name: 'og:title', content: title },
        { name: 'og:description', content: description },
        { name: 'og:image', content: thumb },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
});
