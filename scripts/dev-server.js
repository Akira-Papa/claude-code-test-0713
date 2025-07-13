const { spawn } = require('child_process');

// Start the Next.js development server
const server = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  server.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGINT', () => {
  server.kill('SIGINT');
  process.exit(0);
});