var loggerLevel={
  "info" : true
  ,"warning" : true
  ,"fine" : true
  ,"error" : true
}
exports.logger={
  info: function(msg){
    if(loggerLevel.info)
      console.log("INFO "+msg);
  },
  warning: function(msg)
  {
    if(loggerLevel.warning)
      console.warn("WARN "+msg);
  },
  fine: function(msg)
  {
    if(loggerLevel.fine) console.log("FINE "+msg);
  },
  error: function(msg)
  {
    if(loggerLevel.error) console.error("ERROR "+msg);
  }
}
