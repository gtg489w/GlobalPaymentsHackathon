var lib = require('./lib/backend.js');

// Entrypoint for AWS Lambda
exports.handler = function(event, context) {
  if(event.type) {
    return context.succeed(lib.getMessage(event.type));
  }
  if (event.face) {
      // Function should call context.succeed
      lib.getFacialRecogntion(event.face, context);
  }
  //return context.fail('No type provided!');
};
