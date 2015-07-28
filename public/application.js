$(document).ready(function(){

var Profile = function(){
  this.user = {};
}

Profile.prototype.addNewUser = function(user){
  $.ajax({
    method: 'POST',
    url:'http://localhost:3000/users',
    data: {
      user: user
    },
    dataType: 'json',
    success: function(response){
      console.log('new profile added' + name + username + email);
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
  profile.addNewUser(profile.user);
})

})