$(document).ready(function(){

var Profile = function(){
}

Profile.prototype.signUp = function(name,username,email,password){
  $.ajax({
    method: 'POST',
    url:'users', //just the path without the "/"
    data: {
      user: {
        name: name,
        username: username,
        email: email,
        password: password
      }
    },
    dataType: 'json',
    success: function(response){
      console.log('new profile added');
      $('#name').val("");
      $('#username').val("");
      $('#email').val("");
      $('#password').val("");
    },
    error: function(response){
      console.log(response);
      $('#error_message i').text('Sorry pal, username or email already exists');
    }
  });
};

Profile.prototype.signIn = function(username,password){
  $.ajax({
    method: 'POST',
    url: 'sessions',
    data: {
      user:{
        username: username,
        password: password
      }
    },
    dataType: 'json',
    success: function(response){
      console.log("cookie added / session added");
    },
    error: function(response){
      console.lof("error creating session");
    }
  })
};

var profile = new Profile();

$('form').submit(function(){
  event.preventDefault();
});

$('#submit_new_user').click(function(){
  var newName = $('#name').val();
  var newUsername = $('#username').val();
  var newEmail = $('#email').val();
  var newPassword = $('#password').val();
  profile.signUp(newName,newUsername,newEmail,newPassword);
});

$('#sign_in_user').click(function(){
  var usernameSignIn = $('#username_signin').val();
  var passwordSignIn = $('#password_signin').val();
  profile.signIn(usernameSignIn,passwordSignIn);
});

})