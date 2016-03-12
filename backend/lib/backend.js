var unirest = require('unirest');

module.exports = {
  getMessage: function(type) {
    return 'Hello ' + type + ' world!';
  },
  getFacialRecogntion: function(face, context){
    unirest.post("https://lambda-face-recognition.p.mashape.com/recognize")
        .header("X-Mashape-Key", "")
        .field("album", "COMBO")
        .field("albumkey", "")    
        .field("urls", "https://s3.amazonaws.com/2015gphackathon/scottTest.jpg")
    .end(function (result) {
        console.log(result.status, result.headers, result.body);
        context.succeed(result.body);
    });
  }
};

