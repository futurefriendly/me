define("hard_update",function(i,n){var t=i("tool"),a=i("ddbridge");n.lessThanVersion=function(i,n){return t.isWidthinApp()?void a.getAppVersion(function(a){n(t.standardizationAppVersion(a)<t.standardizationAppVersion(i))}):!1},n.alertUpdate=function(){dd.dialog.alert({tip:"你的客户端版本太旧，更新后才能进行车主认证",btn:{val:"升级客户端",handler:function(){location.replace("http://diditaxi.com.cn/api/v1/share")}}})}});