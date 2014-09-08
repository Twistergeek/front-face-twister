var Twister=function()
{

}
var _SuperClass;
$I("BaseHandler",function(BaseHandler){
  Twister.prototype=new BaseHandler();
  _SuperClass=BaseHandler;
})
Twister.prototype.getTarget=function()
{
  return "http://127.0.0.1:40002/";
}
Twister.prototype.proxyRequest=function(proxyReq, req, res, options)
{
    proxyReq.setHeader('Authorization',"Basic "+new Buffer("user:pwd").toString('base64'));
}
Twister.prototype.handle=function(request,response)
{
  if(request.method  === "POST")
  {
    //interrupt with the post method
    var body=''
    request.on('data',function(data){
      body+=data;
      if (body.length > 1e6)
        request.connection.destroy();
    });
    request.on('end',function(){
      var forbidden=['dumpprivkey','setspammsg',"stop","setgenerate"];
      try{
        if(forbidden.indexOf(JSON.parse(body).method) >=0)
        {
          data={"result":[],"error":null,"id":1}
          response.end(JSON.stringify(data));
        }else if(JSON.parse(body).method === 'listwalletusers')
        {
          data={"result":['twistergeek','chinese_test'],"error":null,"id":1}
          response.end(JSON.stringify(data));
        }
        else
        {
          continueProxy();
        }
      }catch(e)
      {
        continueProxy();
      }
    })
    var that=this;
    var continueProxy=function()
    {
        var stream=require("stream");
        var buffer=new stream.PassThrough();
        buffer.write(body);
        buffer.end();

        _SuperClass.prototype.handle.call(that,request,response,buffer);
    }
  }else
  {
    _SuperClass.prototype.handle.apply(this,arguments);
  }
}

exports.instance=function(proxy)
{
  return new Twister(proxy);
}
