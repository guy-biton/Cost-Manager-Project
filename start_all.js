const { spawn } = require('child_process');
const path = require('path');

const services = [
  'logs_service.js',
  'users_service.js',
  'costs_service.js',
  'about_service.js'
];

console.log('Starting all Cost Manager Microservices...');
services.forEach(service => {
  const child = spawn('node', [path.join(__dirname, service)], { stdio: 'inherit' });
  child.on('exit', code => {
    console.log(`${service} exited with code ${code}`);
    process.exit(code);
  });
});
