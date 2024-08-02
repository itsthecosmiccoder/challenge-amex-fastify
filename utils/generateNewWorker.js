const { Worker } = require('worker_threads');
const path = require('path');
const requestTracker = require('./requestTracker');


const generateNewWorker = (workerName) => {
  const worker = new Worker(path.join(__dirname, '../workers', workerName));
  worker.on('message', (data) => {
    const { response, requestId } = data;
 
    if (requestTracker[requestId]) {
      requestTracker[requestId](response);
      delete requestTracker[requestId];
    }

  });

  worker.on('error', (err) => {
    console.error(`Worker error: ${err.message}`);
    worker.terminate();
  });

  worker.on('exit', (code) => {
    console.log(`Worker exited with code: ${code}`);
  });

  console.log(`Created new worker: ${worker.threadId}`);
  return worker;
}

module.exports = generateNewWorker;