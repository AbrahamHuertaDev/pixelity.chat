module.exports = {
  apps: [
    {
      name: 'pixelity-modules',
      script: 'src/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
    }
  ]
}; 