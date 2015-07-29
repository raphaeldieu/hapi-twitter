$(document).ready(function(){

var Profile = function(){
  this.user = {};
}

Profile.prototype.signUp = function(user){
  $.ajax({
    method: 'POST',
    url:'users', //just the path without the "/"
    data: {
      user: user
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

Profile.prototype.createUser = function(name,username,email,password) {
    this.user = {
      name: name,
      username: username,
      email: email,
      password: password
    }
};



var profile = new Profile();

$('#new_user_form').submit(function(){
  event.preventDefault();
})

$('#submit_new_user').click(function(){
  profile.name = $('#name').val();
  profile.username = $('#username').val();
  profile.email = $('#email').val();
  profile.password = $('#password').val();
  profile.createUser(profile.name,profile.username,profile.email,profile.password);
  profile.signUp(profile.user);
})

})