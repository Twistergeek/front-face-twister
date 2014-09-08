var Promise = require('promise');
var Passport=function(username,password)
{
  this.username=username;
  this.password=password;
  var that=this;
  injector.process("securityContext",function(sc)
  {
    that.securityContext=sc;
  })
}
Passport.prototype._verifyGroup=function(srcGroup,targetGroup){
  if(srcGroup.indexOf("admin")>=0 || targetGroup === null){
    return true;
  }
  if(JSON.stringify(targetGroup)===JSON.stringify([""])) return true;
  for(var i=0;i<targetGroup.length;i++){
    if(srcGroup.indexOf(targetGroup[i])<0){
      return false;
    }
  }
  return true;
}

Passport.prototype.validate=function()
{
  var groups=null;
  if(arguments.length==1){
    groups=arguments[0]
  }else if(arguments.length ==2){
    this.username=arguments[0];
    this.password=arguments[1];
  }else if(arguments.length>=3){
    this.username=arguments[0];
    this.password=arguments[1];
    groups=arguments[3];
  }

  var that=this;
  return new Promise(function(resolve,reject)
  {
    var sc=that.securityContext;
    var user=sc[that.username];
    if(!!!user)
    {
      that.valid=false;
      that.msg = "user doesn't exist"
      reject(that);
    }else if(user.password != that.password)
    {
      that.valid=false;
      that.msg = "username or password doesn't match"
      reject(that);
    }else
    {
      if(that._verifyGroup(user.groups,groups)){
        that.valid=true;
        that.user=user
        resolve(that);
      }else{
        that.valid=false;
        that.msg="user group is not right";
        reject(that);
      }
    }
  })
}
Passport.prototype.belongsToGroup=function(group)
{
  return this.user.groups.indexOf(group)>=0;
}


exports.Passport=Passport;
