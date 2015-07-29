//Defining the plugin
exports.register = function(server, options, next){
  //Define routes
  server.route([
    // I am receiving a POST request
    {
      method: 'POST',
      path: '/users',
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

        db.collection('users').count(uniqUserQuery, function(err, userExist){
          if (userExist) {
            return reply('Error: Username already exist', err);
          } 
          else {
            db.collection('users').insert(user, function(err, writeResult){
            reply(writeResult);
            });
          }
        });

      }
    }
  ]);

  next(); //DO NOT FORGET THIS
};

//Defining the description if the plugin
exports.register.attributes = {
  name: 'user-routes',
  version: '0.0.1'
};  