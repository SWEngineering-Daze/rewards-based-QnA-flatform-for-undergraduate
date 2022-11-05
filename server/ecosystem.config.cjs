module.exports = {
  apps: [
    {
      name: "SWServer",
      exec_mode: "cluster",
      instances: "max",
      script: "./app.js",
    },
  ],
};
