define("page/driver_register_edition/hard_update.js",function(i,n){var t=i("tool/tool.js");n.lessThanVersion=function(i,n){return t.isWidthinApp()?void t.getAppVersion(function(e){n(e<t.standardizationAppVersion(i))}):!1},n.alertUpdate=function(){dd.dialog.alert({tip:"你的客户端版本太旧，更新后才能进行车主认证",btn:{val:"升级客户端",handler:function(){location.replace("http://diditaxi.com.cn/api/v1/share")}}})}});