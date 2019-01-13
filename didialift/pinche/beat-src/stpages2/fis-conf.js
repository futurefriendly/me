var testDomain = 'http://test.diditaxi.com.cn/static/pinche/beat-dist';
var testReceiver = 'http://10.10.8.172:8055/beat/receiver.php';
var testStaticDir = '/home/webroot/webroot/static/pinche/beat-dist';
// var testTplDir = '/home/xiaoju/webroot/pinche_recruit/v1/views/orageday';
var nameSpace = 'stpages2';

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
            , {
                reg: /\.(sh|bat)$/
                , release: false
            }
            // These PNGs are compressed in bigger size output.
            , {
                reg: /^\/static(\/img\/.*-15091[179]\/.*\.png)$/
                , useOptimizer: false
                , release: '/static/' + nameSpace + '$1'
            }
            , {
                reg: /^\/static(\/img\/tutorial-150925\/.*\.png)$/
                , useOptimizer: false
                , release: '/static/' + nameSpace + '$1'
            }
        ]

        , domain: testDomain
    }

    , deploy: {

        // 发布到测试机
        test: [
            {
                receiver: testReceiver
                , from: '/'
                , to: testStaticDir
                , include: /^\/(static|template)\//
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
// fis.config.del('modules.optimizer.css');

