var testDomain = 'http://test.diditaxi.com.cn/static/pinche/beat-dist';
var testReceiver = 'http://10.10.8.172:8014/receiver';
var testStaticDir = '/home/webroot/webroot/static/pinche/beat-dist';
var testTplDir = '/home/webroot/webroot/static/pinche/beat-dist';

fis.config.merge({

    namespace: 'common'

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
            , {
                reg: /\.(sh|bat)$/
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
                , from: '/template'
                , to: testTplDir
                , include: /^\/template\//
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

