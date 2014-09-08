#欢迎使用front-face-twister
## 用node.js实现的前端代理

This is a document of Chinese language. If you are interested at the other language, please contact @eelets at Twister

欢迎使用专门为twister设计的反向代理。通过这个代理，可以帮助你轻易的在VPS上面架设Twister服务，让你能通过互联网和手机随时随地的使用Twister。
如果你不知道什么是Twister，请访问 [Twister](http://twister.net.co/) 这是下一代基于P2P网络的微博。没有审查，也很难在技术上被屏蔽。

##为什么会有这个项目

从技术上来说，基于P2P的应用需要客户端的支持，这样才能把自己作为一个节点加入到网络中，并获得网络数据。在家庭网络里当然是一件很容易的事情。可是在公司环境或者手机环境上，运行一个随时在线的P2P客户端是一件很有挑战的事情。Twister本身提供了一个JSON API和HTML的网页客户端，可以通过网络远程调用来获得相应的数据和内容，并完成诸如用户注册，发推等功能。但是这个JSON API如果以public service mode的模式来运行，功能太弱（甚至用户无法登录）；如果以private service mode的模式来运行，功能又太全面（可以dump出唯一的private key）。默认也只能通过http的方式来运行。使用nginx是一个方案，但是依然暴露了全部的JSON API接口（单纯修改网页和JS文件是没有用的）。所以才有了这个项目，可以过滤部分Twister JSON API，让twister能够更好的在托管环境下运行。

##怎么运行

首先，你需要有一个VPS。然后你需要编译并安装了Twister。最后你还需要有git和nodejs的环境。

 1. clone这个项目
      
      git clone https://github.com/Twistergeek/front-face-twister
 
 2. 运行npm install

    npm install

 3. 为网站生成一个自签名的key（还是安全点好，如果条件允许，可以申请一个ssl key和cert）
 
      openssl req -x509 -newkey rsa:1024 -keyout apache.pem -out twister.pem -nodes -days 999

     上面可以生成自签名的证书 twister.pem
 4. 配置项目
     在config.js中，我们需要对代理做一些配置
      - port，配置代理监听的端口。（作者脑残，如果是https的话，端口请在servers.js中修改）
      - sslKey， 放你SSL Key的路径，如果是自签名证书，就是twister.pem的位置
      - sskCert， 放SSL Cert的路径，如果是自签名证书，就是twister.pem的位置
      - users, 配置用户名和密码以及权限分组的地方。具体说明如下：
     
        
    ```javascript
          users: {
            'user' : {    //这里是用户名
                  username : 'user'  //继续由于作者脑残，这个用户名没什么用
                      ,password : 'passw0rd' //密码
                      ,groups : [
                        'user','twister'  //权限分组
                      ]
                },
    ```
    
    - route_table， 转发的路由表
        
   ```javascript
    {
      "eel.tuiku.me" :{
        "_" : "@secure(user,test) twister2"  //感谢网友提供的域名，这里对twister2路由处理器做安全处理
      },
      "_" :
      {
        "_" : "https://www.google.com"   //如果使用IP地址或者其他没有绑定的域名访问，则自动做Google的反向代理，你也可以自己设置
      }
    }
    ```
  
 5. 运行项目


    ./twisterd -port=30002 -daemon -rpcuser=user -rpcpassword=pwd -rpcallowip=127.0.0.1 -rpcport=40002
     sudo node servers   #在ubuntu下面80或者443等端口监听必须是sudo 

 6. 设置http跳转到https

    sudo node to_https.js

 7. 手机访问，域名是 https://<yourdomain>/tmobile.html

##怎么开发

具体的业务逻辑都在./handlers/twister2.js里面。如果你有兴趣，我希望你能一起加入到这个有趣的小项目里面。可以在twister和我联系(@eelets)。看看我们是否可以把他做成让小白用户都能使用的twister托管平台。

##感谢

感谢miguelfreitas提供了这么好的一个p2p的产品， 感谢@xialan提供了好用的windows版本的twister让更多的小白用户能够使用这个产品，感谢@wenyunchao积极推广twister，让我能够接触并了解他，感谢@chinanet等twister用户为项目提供早期的反馈。感谢tuiku同学提供了域名。我现在运行了一个公共的帐号，供同学们体验。处于目前服务器的性能压力考虑，需要的同学请在twister和我联系。

##安全提示

目前的twister运行机制无法修改private key，而private key是账号安全的唯一保障。而运行在公共托管平台上最大的风险就是private key可能会泄漏。我强烈建议在条件允许的情况下在本地运行twister客户端，或者自我托管（在自己的VPS上部署本软件），或者在可信任的范围内使用公共托管平台。


