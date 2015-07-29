var Bcrypt = require('bcrypt');

exports.register = function(server, options, next){

  server.route([
    {
      method:'POST',
      path:'/sessions',
      handler: function(request,reply){
        var db = request.server.plugins['hapi-mongodb'].db; //load the database
        var user = request.payload.user; 
        db.collection('users').findOne({username: user.username},function(err, userMongo){
          
          if (err){ return reply('Internal MongoDB error', err);}
          
          // 1. stop if user does not exist
          if (userMongo === null){
            return reply({ userExists: false});
          }

          // 2. check the password
          Bcrypt.compare(user.password,userMongo.password, function(err,same){
            if (!same){
              return reply({ authorized: false});
            }

          });//end Bcrypt
        
          // 3. create a session in the sessions collection
          var randomKeyGenerator = function() {
              return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
          };
          var session_id = randomKeyGenerator();
          var session = {
            user_id:  userMongo._id,
            session_id: session_id
          };

          db.collection('sessions').insert(session, function(err, writeResult){
            if (err){ return reply('Internal MongoDB error', err);}
          });

          // 4. Set the same session_id in the CLIENT's cookie
          request.session.set('hapi_twitter_session', session);
          reply({ authorized: true });
        
        });//end db.collection.findOne
      }//end handler
    }// end POST
  ]);

  next();
};

exports.register.attributes = {
  name: 'sessions-route',
  version: '0.0.1'
}