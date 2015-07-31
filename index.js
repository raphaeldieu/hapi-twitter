//Hapi is a class
var Hapi = require('hapi');
var Path = require('path');
//Instantiation
var server = new Hapi.Server();

//Configure server connections / host
server.connection({
  host:'0.0.0.0',
  port:3000,
  routes: {
    cors:{
      headers: ["Access-Control-Allow-Credentials"],
      credentials: true
    }
  }
});

server.views({
  engines: {
    html: require('handlebars')
  },
  path: Path.join(__dirname, 'templates') // Users/Raph/GA/happi-twitter/templates
});

//Any other dependecies
var plugins = [
  {register: require('./routes/static-pages.js')},
  {register: require('./routes/users.js')},
  {register: require('./routes/sessions.js')},
  {register: require('./routes/tweets.js')},
  {//Reauire yar
    register: require('yar'),
    options: {
      cookieOptions: {
        password: 'asdasdasd',
        isSecure: false // we are not going to use https, yet
      }
    }
  },
  {//Require Mongo
    register: require('hapi-mongodb') ,
    options: {
      url: 'mongodb://127.0.01:27017/hapi-twitter',
      settings: {
        db: {
          native_parser: false
        }
      }
    }
  }
];


//Start the server
server.register(plugins, function(err){
  //check if there is an error
  if (err){
    throw err;
  }

  //start
  server.start(function(){
    console.log('info', 'server running at : ' + server.info.uri);
  });

});