var lib = require('./lib/backend.js');

// Entrypoint for AWS Lambda
exports.handler = function(event, context) {
  if(event.type) {
    return context.succeed(lib.getMessage(event.type));
  }
  if (event.face) {
      // Function should call context.succeed
      return lib.getFacialRecogntion(event.face, context);
  }
  if (event.authorize) {
      return lib.doAuthorization(event.authorize, context);
  }
  if (event.tender) {
      return lib.doTender(event.tender, context);
  }
  if (event.toggleLocation){
      return lib.toggleLocation(event.toggleLocation, context);
  }
  
  return context.fail('No type provided!');
};
