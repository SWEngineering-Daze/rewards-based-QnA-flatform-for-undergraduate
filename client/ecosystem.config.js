module.exports = {
  apps: [
    {
      name: 'SWClient',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
    },
  ],
};
