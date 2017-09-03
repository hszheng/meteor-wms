#Web App Client Demo

#文件结构以及意义
webAppClientDemo
	|---client							保存客户端必须加载的所有资源。
	|     |---compatibility				保存所有需要是全局变量的第三方资源，例如jQuery等。
	|	  |---config					保存配置文件。
	|	  |     |---config.js 			客户端的配置文件。
	|	  |     |---router.js 			客户端所有的route。
	|	  |
	|	  |---lib						保存最优先加载的第三方资源。
	|	  |     |---a.reset.css 		初始化css。
	|	  |     |---utility.js			前端公用方法。
	|	  |
	|	  |---startup					保存客户端启动时的代码文件。
	|	  |     |---startup.js 			客户端启动后执行的逻辑代码。
	|	  |
	|	  |---views
	|	        |---common 				保存页面通用的代码，例如页面的head。
	|	        |     |---common.css 	公用css。
	|	        |     |---head.html 	页面head的html代码。
	|	        |
	|	        |---footer				页面的footer。
	|	        |---header				页面的header。
	|	        |---home				首页。
	|	        |---layouts				页面所有的布局。
	|	        |     |---basic.html  	页面默认布局。
	|	        |
	|	        |---login 				登录。
	|	        |---notFound			找不到访问路径时显示的内容。
	|	              |---notFound.html 找不到访问路径时显示的内容。
	|
	|---lib								保存客户端服务端共用资源，比如定义collection等。
	|     |---collections.js 			定义项目中使用的所有的collections。
	|
	|---packages 						保存项目通过npm安装的package。
	|---private							保存所有的私有资源，只能通过服务端代码访问，可以使用Assets加载，不能通过外部访问。
	|---public 							保存所有的公有资源，不会默认加载到前端，通过路径访问。
	|---server 							保存服务端使用的所有资源。
	|	  |---config 					保存服务端的配置文件。
	|	  |     |---config.js 			服务端的配置文件。
	|	  |
	|	  |---lib 						保存服务端使用的第三方资源。
	|	  |      |---utility.js 		后台公用方法。
	|	  |
	|	  |---methods					保存服务端所有的methods文件。
	|	  |      |---common.js			服务端公用的methods。
	|	  |
	|	  |---permission				设置collections的权限。
	|	  |      |---users.js			用户信息的权限设置。
	|	  |
	|	  |---publications				collections数据publish规则。
	|	  |
	|	  |---restapi					保存服务端所有的接口文件。
	|	  |      |---restapi.js			服务端所有的接口。
	|	  |
	|	  |---startup 					保存服务端启动时的代码文件。
	|	        |---startup.js 		服务端启动时的逻辑代码。
	|
	|---packages.json					设置项目依赖的npm安装的packages。