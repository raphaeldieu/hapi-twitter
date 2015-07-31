var Joi = require('joi');
var Auth = require('./auth');

exports.register = function(server,options,next){
  server.route([
    {
      method: 'GET',
      path: '/tweets',
      handler: function(request,reply){
        var db = request.server.plugins['hapi-mongodb'].db;
        db.collection('tweets').find().toArray(function(err, tweets){
          // convert into array because otherwise it replies a mobo object an not an object you can use.
          if (err) {return reply('Internal MongoDB error', err);}
          reply(tweets);
        });
      }
    },
    {
      //GET ONE TWEET
      method: 'GET',
      path: '/tweets/{id}',
      handler: function(request,reply){
        var tweet_id = encodeURIComponent(request.params.id);
        var db = request.server.plugins['hapi-mongodb'].db ;
        var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;

        db.collection('tweets').findOne({"_id": ObjectId(tweet_id)}, function(err, tweet){
          if (err) {return reply('Internal MongoDB error', err); }
          
          reply(tweet);
        });
      }
    },
    {
      method: 'POST',
      path: '/tweets',
      config: {
        handler: function(request,reply){
          Auth.authenticated(request, function(result){
            if(result.authenticated){
              var db = request.server.plugins['hapi-mongodb'].db;
              var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;
              var tweet = {
                message: request.payload.tweet.message,
                user_id: ObjectId(result.user_id)
              }

              db.collection('tweets').insert(tweet, function(err, writeResult){
                if (err) { return reply('Internal MongoDB error',err) };
                reply(writeResult);
              });

            } else {
              reply(result.message);
            }
          })
        },//end handler
        validate: {
          payload: {
            tweets: {
              message: Joi.string().min(1).max(140).required()
            }
          }
        }
      }//end config
    }//end POST method
  ]);//end server.route

  next();
};

exports.register.attributes = {
  name: 'tweets-route',
  version: '0.0.1'
}

