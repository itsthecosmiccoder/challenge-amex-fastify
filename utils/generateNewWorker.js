const { Worker } = require('worker_threads');
const path = require('path');
const requestTracker = require('./requestTracker');

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

const generateNewWorker = (workerName) => {
  const worker = new Worker(path.join(__dirname, '../workers', workerName));
  let idleTimer;

  const resetIdleTimer = () => {
    if (idleTimer) {
      clearTimeout(idleTimer);
    }
    idleTimer = setTimeout(() => {
      console.log(`Terminating worker due to inactivity: ${worker.threadId}`);
      worker.terminate();
    }, IDLE_TIMEOUT);
  };

  resetIdleTimer();

  worker.on('message', (data) => {
    const { response, requestId } = data;
    if (requestTracker[requestId]) {
      requestTracker[requestId](response);
      delete requestTracker[requestId];
    }

    resetIdleTimer();
  });

  worker.on('error', (err) => {
    console.error(`Worker error: ${err.message}`);
    worker.terminate();
  });

  worker.on('exit', (code) => {
    console.log(`Worker exited with code: ${code}`);
    clearTimeout(idleTimer);
  });

  console.log(`Created new worker: ${worker.threadId}`);
  return worker;
}

module.exports = generateNewWorker;