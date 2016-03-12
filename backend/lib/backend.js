var AWS = require('aws-sdk');
var s3 = new AWS.S3();

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
      unirest.post("https://lambda-face-recognition.p.mashape.com/recognize")
        .header("X-Mashape-Key", config.apiKey)
        .field("album", config.apiAlbum)
        .field("albumkey", config.apiAlbumKey)    
        .field("urls", authorize.key)
    .end(function (result) {
        //console.log(result.status, result.headers, result.body);
        if (result.status == 200){
            var bestMatch = result.body.photos[0].tags[0].uids[0].prediction;
            if (bestMatch == authorize.identity)
                context.succeed("Authorized");
            else
                context.done(JSON.stringify('Unauthorized: Unable to verify identity'));
        } else {
            context.done(JSON.stringify('Unauthorized: Unable to verify identity'));
        } 
    });
  },
  doTender: function(tender, context){
      // TODO: Call Global Payments API with retrieved CC Information!
      context.succeed("");
  }, 
  toggleLocation: function(toggleLocation, context){
    //console.log(JSON.stringify(event, null, 2));
    var s3 = new AWS.S3();

    var param = {Bucket: '2015gphackathon', Key: 'uploads/' + toggleLocation};
    s3.headObject(param, function (err, metadata) {
        if (err && err.code === 'NotFound') {
            param.Body = 'true';
            s3.upload(param, function(err, data) {
                if (err) {
                    console.log(err);
                    context.fail('Error occurred retrieving location data');
                } else { 
                    context.succeed('Location activated');
                }
            });  
        } else if (err) {  
            console.log(err);
            context.fail('Error occurred retriving location data');  
        } else {
            param.Delete = {Objects: [{Key: param.Key}]};
            delete param.Key;
            s3.deleteObjects(param, function(err, data) {
                if (err) {
                    console.log(err);
                    context.fail('Error occurred retriving location data');
                } else {     
                    context.succeed('Location deactivated')
                }
            });
        }
    });
  } 
};

