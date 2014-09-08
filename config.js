//You also need to change the password in ./libs/securityContex.js
exports.config={
  port: 80,
  handlers: "./handlers",
  sslKey : "./ssl/twister.pem",
  sslCert : "./ssl/twister.pem",
  realm : "front-face-twister" 
  users: {
    'user' : {
      username : 'user'
      ,password : 'passw0rd'
      ,groups : [
        'user','twister'
      ]
    },
    'admin' : {
      username : 'admin'
      ,password : 'admin'
      ,groups : [
        'user'
        , 'admin'
      ]
    },
    'test' : {
      username : 'test'
      ,password: 'test'
      ,groups : [
        'user'
        ,'test'
      ]
    }
  },
  route_table:
  {
    "eel.tuiku.me" :{
      "_" : "@secure(user,test) twister2"
    },
    "_" :
    {
      "_" : "https://www.google.com"
    }
  }
}
