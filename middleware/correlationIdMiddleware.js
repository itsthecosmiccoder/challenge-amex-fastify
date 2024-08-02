function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

function correlationIdMiddleware(req, reply, done) {
  let correlationId = req.headers['correlationid'];

  if (!correlationId) {
    correlationId = generateUniqueId();
  }

  req.correlationId = correlationId;

  reply.header('correlationId', correlationId);

  console.log(`Correlation ID: ${correlationId}`);

  done();
}
module.exports = correlationIdMiddleware;