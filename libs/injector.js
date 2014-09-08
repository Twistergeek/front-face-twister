var that=this;
var Injector=function()
{
	this.deps={};
}

Injector.prototype={
	register : function(name, content)
	{
		switch(typeof content)
		{
			case "function":
				this.deps[name]=content;
				break;
			case "object":
				this.deps[name]=content;
				break;
			case "string" : //content is the path name of dep
				this.deps[name]=require(content);
				break;
			default:
				//do nothing
		}
	},
	process: function()
	{
		var that=this;
		var argumentsLength=arguments.length;
		var args=[];
		for(var i=0;i<argumentsLength;i++){
			args.push(arguments[i]);
		}
		var toInjects=args
						.slice(0,argumentsLength-1)
						.map(function(injectName){
							var toInject=that.deps[injectName];
							if(typeof toInject === 'undefined'
								|| toInject === null)
							{
								toInject=require(injectName);
							}
							return toInject;
						})
		var fn=args[argumentsLength-1];
		var fnScope=that;
		if(typeof fn === 'object')
		{
			fnScope=fn['scope'];
			fn=fn['fn'];
		}
		fn.apply(fnScope,toInjects);
	},
	cloneDeps: function(anotherInjector)
	{
		for(var key in anotherInjector.deps)
		{
			this.deps[key]=anotherInjector.deps[key];
		}
	}
}

exports.getInstance=function()
{
  if(typeof GLOBAL.injector === 'undefined')
  {
    GLOBAL.injector=new Injector();
		//register the global function
		GLOBAL.$R=function()
		{
			GLOBAL.injector.register.apply(GLOBAL.injector,arguments);
		};
		GLOBAL.$I=function()
		{
			GLOBAL.injector.process.apply(GLOBAL.injector,arguments);
		}
  }
  return GLOBAL.injector;
}
