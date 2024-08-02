const fastify = require('fastify')({ logger: true, connectionTimeout: 5000 });
const generateNewWorker = require('./utils/generateNewWorker');
const requestTracker = require('./utils/requestTracker');
const correlationIdMiddleware = require('./middleware/correlationIdMiddleware');

fastify.addHook('onRequest', correlationIdMiddleware);

fastify.get('/getCatsInfo', function handler(request, reply) {
  console.log('correlation Id: ', request.correlationId);
  requestTracker[request.id] = (result) => reply.send(result);

  const getCatsWorker = generateNewWorker('getCatsWorker'); // Create a new worker for each request
  getCatsWorker.postMessage({ requestId: request.id });
})

fastify.get('/getDogsInfo', function handler(request, reply) {
  requestTracker[request.id] = (result) => reply.send(result);

  const getDogsWorker = generateNewWorker('getDogsWorker'); // Create a new worker for each request
  getDogsWorker.postMessage({ requestId: request.id });
})

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
