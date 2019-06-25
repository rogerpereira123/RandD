define(['config/ServerConfig', 'url'] ,function(config, url){
var auth = function(req){
var isAuthenticationSuccessfull = false;
var message = 'You are not authenticated user.';
 var authKey = req.query.auth_key;
 isAuthenticationSuccessfull = authKey == config.AUTH_KEY; 
 return {
  'IsAuthenticated' : isAuthenticationSuccessfull,
  'Message' :  message
 };
}
return auth;       
});