var Bcrypt = require('bcrypt');
var Joi = require('joi');
var Auth = require('./auth');


//Defining the plugin
exports.register = function(server, options, next){
  //Define routes
  server.route([
    // I am receiving a POST request
    {
      method: 'POST',
      path: '/users',

      config: {
        handler: function(request, reply){
          var db = request.server.plugins['hapi-mongodb'].db;
          var user = request.payload.user;
          // user = {
          //   name:...,
          //   email:....,
          //   ....
          // }

          // Check if there is an existing user with the same username or the same email address
          var uniqUserQuery = { $or: [{username: user.username}, {email: user.email}]};

          //Encrypt password
          Bcrypt.genSalt(10, function(err, salt){
            Bcrypt.hash(user.password,salt,function(err, encrypted){
              user.password = encrypted;
              db.collection('users').count(uniqUserQuery, function(err, userExist){// userExist === result. format of function in db request function(err, result) --> Whatever request, the db always only respond or have an error.

                if (userExist) {
                  return reply('Error: Username already exist', err);
                } 
                else {
                  db.collection('users').insert(user, function(err, writeResult){
                    if (err) {
                      return reply('Internal MongoDB error', err)
                    }
                    else {
                      reply(writeResult);
                    }
                  });
                }
              });
            });
          });
        },//end handler POST
        validate: {
          payload: {
            user: {
              email: Joi.string().email().max(50).required(),
              password: Joi.string().min(5).max(20).required(),
              username: Joi.string().min(3).max(20).required(),
              name: Joi.string().min(3).max(20)
            }
          }
        }//end validate
      }//end config
    },//end POST method
    
    {
      method: 'GET',
      path:'/users',
      handler: function(request,reply){
        var callback = function(result){
          if (result.authenticated){
            var db = request.server.plugins['hapi-mongodb'].db; //connect with the database
        
            db.collection('users').find().toArray(function(err, users){
          
              if (err) { return reply('Internal MongoDB error', err); }
          

              reply(users);
            });
          }
          else{
            reply(result);
          }
        };//end callback
          
        Auth.authenticated(request, callback);
      }//end handler GET
    }//end GET method.
  ]);//end server.route

  next(); //DO NOT FORGET THIS
};

//Defining the description if the plugin
exports.register.attributes = {
  name: 'user-routes',
  version: '0.0.1'
};  