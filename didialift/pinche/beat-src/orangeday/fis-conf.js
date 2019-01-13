var testDomain = 'http://test.diditaxi.com.cn/static/pinche/beat-dist';
var testReceiver = 'http://10.10.8.172:8014/receiver';
var testStaticDir = '/home/webroot/webroot/static/pinche/beat-dist';
var testTplDir = '/home/xiaoju/webroot/pinche_recruit/v1/views/orageday';
var testTplDir_1 = '/home/xiaoju/webroot/pinche_recruit/v1/views/app-pages';
var nameSpace = 'orangeday';

fis.config.merge({

    namespace: nameSpace

    , roadmap: {
        path : [
            {
                reg: /static\/css\/import/
                , release: false
            }
            , {
                reg: /static\/img\/.+psd$/
                , release: false
            }
        ]

        , domain: testDomain
    }

    , deploy: {

        // 发布到测试机
        test: [
            {
                receiver: testReceiver
                , from: '/static'
                , to: testStaticDir
                , include: /^\/static\//
                , replace: {
                    from: '/static/common/'
                    , to: testDomain + '$&'
                }
            }
            , {
                receiver: testReceiver
                , from: '/template/' + nameSpace + '/page'
                , subOnly: true
                , to: testTplDir
                , include: /^\/template\//
                , replace: {
                    from: '/static/common/'
                    , to: testDomain + '$&'
                }
            }
            , {
                receiver: testReceiver
                , from: '/static/' + nameSpace + '/html'
                , subOnly: true
                , to: testTplDir_1
                , replace: {
                    from: '/static/common/'
                    , to: testDomain + '$&'
                }
            }
        ]

    }

});


fis.config.del('modules.optimizer.html');

// Animation 动画，在压缩后可能导致问题
fis.config.del('modules.optimizer.css');

