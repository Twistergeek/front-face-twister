require("./dependencies");
var injector=require('./libs/injector').getInstance();

injector.process('https','http-proxy','basic-auth','config','Passport','logger','router','fs',
function(http,httpProxy,basicAuth,config,Passport,logger,router,fs){
  var proxy=httpProxy.createProxy();
  proxy.on('error', function (err, req, res) {
    logger.error(err);
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });

    res.end('Something went wrong. And we are reporting a custom error message.');
  });
  logger.info("listen to the port 443");
  var options = {
    key : fs.readFileSync(config.sslKey),
    cert : fs.readFileSync(config.sslCert)
  }
  http.createServer(options,function(req,res){
    var target=router.route(req);
    if(target.indexOf("@secure") === 0){//secured url
      var m=target.match(/^\@secure(\s|\(\S*\)\s)/)
      var groups
      try{
        groups=m[1].trim().replace(/^\(|\)$/g,"").split(",");
      }catch(e){
        groups=null;
      }
      target=target.replace(/^\@secure(\s|\(\S*\)\s)/,"");
      var user=basicAuth(req);
      if(!!!user)
      {
        res.writeHead(401, {
          'WWW-Authenticate': 'Basic realm="' + config.realm + '"'
        })
        res.end("<h1>401 Unauthenticated Error</h1><p>Please contact your system admin for support</p>");
        return;
      }
      var passport=new Passport(user.name,user.pass);
      passport.validate(groups).then(function(pass){
        router.proxy(proxy,req,res,target);
      }).catch(function(pass){
        logger.warning(pass);
        res.writeHead(401, {
          'WWW-Authenticate': 'Basic realm="' + config.realm  + '"'
        })
        res.end("<h1>401 Unauthenticated Error</h1><p>Please contact your system admin for support</p>");
      })
    }else{
      router.proxy(proxy,req,res,target);
    }
  }).listen(443);
})
