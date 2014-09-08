var http=require('http')

function loop()
{
    console.log("start to listen to port 80");
    http.createServer(function(req,res){
        res.statusCode = 302;
        res.setHeader('Location','https://'+req.headers.host);
	res.end();
    }).listen(80);
};


loop();
