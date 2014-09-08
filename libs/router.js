var Router=function()
{
  var that=this;
  $I("config",function(config)
  {
    that.handlers=config.handlers;
  });
}

Router.prototype.route=function(request)
{
  var host=request.headers.host.replace(/:\d+$/,""); //remove the port number
  var path=request.url;
  var ret;
  injector.process("route_table","config",function(t,config)
  {
    var hostNode=t[host] || t["_"];
    for(var prop in hostNode)
    {
      if(hostNode.hasOwnProperty(prop))
      {
        var pathNode=hostNode[prop]
        if(path.indexOf(prop)===0)
        {
          ret=pathNode;
          request.url=request.url.replace(prop,"");
          return;
        }
      }
    }
    ret=hostNode["_"];
    request.url=request.url.replace("/","");
  })
  return ret;
}

Router.prototype.proxy=function(proxy,request,response,target)
{
  var url;
  injector.process("url",function(u)
  {
    url=u;
  })
  if(target.indexOf("http://")===0
      || target.indexOf("https://")===0)
  {
      var urlObject=url.parse(target);
      request.url= urlObject.path + request.url;
      proxy.on('proxyReq', function(proxyReq, req, res, options)
      {
        proxyReq.setHeader("Host",urlObject.host);
      });
      proxy.web(request,response,{target:urlObject.href});
  }else
  {
    var handler = require("../"+ this.handlers + "/" + target).instance();
    handler.proxy=proxy;
    handler.handle(request,response);
  }
}

exports.router=new Router();
