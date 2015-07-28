//Hapi is a class
var Hapi = require('hapi');

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

//Any other dependecies
var plugins = [
//Require Mongo
  {
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