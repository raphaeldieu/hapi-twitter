module.exports = {}; //connection
// module.exports === Auth

//Auth.authenticated = ...
module.exports.authenticated = function(request,callback){
  //return true if user is logged in
  //return false if user is not loged in

  //1. retrieve session_id from cookie
  var cookie = request.session.get('hapi_twitter_session');
  if  (!cookie){
    return callback({ authenticated: false });
  }

  var session_id = cookie.session_id;

  //2. look inyo the db to find matching session_id
  var db = request.server.plugins['hapi-mongodb'].db;

  db.collection('sessions').findOne({session_id: session_id}, function(err, session){

    //3. return true or false
    if (!session){
      return callback({authenticated: false});
    }

    callback({ authenticated: true, user_id: session.user_id });
  });

};