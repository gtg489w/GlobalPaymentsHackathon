var unirest = require('unirest');
var config = require('../config');

module.exports = {
  getMessage: function(type) {
    return 'Hello ' + type + ' world!';
  },
  getFacialRecogntion: function(face, context){
    unirest.post("https://lambda-face-recognition.p.mashape.com/recognize")
        .header("X-Mashape-Key", config.apiKey)
        .field("album", config.apiAlbum)
        .field("albumkey", config.apiAlbumKey)    
        .field("urls", face)
    .end(function (result) {
        //console.log(result.status, result.headers, result.body);
        if (result.status == 200){
            context.succeed(result.body.photos[0].tags[0].uids);    
        } else {
            context.succeed("Error processing recognition: " + result.status);
        } 
    });
  },
  doAuthorization: function(authorize, context){
      context.succeed("Successful Auth!");
  },
  doTender: function(tender, context){
      context.succeed("Successful Tender!");
  }
};

