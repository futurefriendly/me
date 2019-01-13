var onlineDomain = 'http://static.xiaojukeji.com/pinche/beat-dist';
var nameSpace = 'stpages';

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
            // , {
            //     reg: /^\/static(\/img\/xianxing-150814\/\d\.png)$/
            //     , useOptimizer: false
            //     , release: '/static/' + nameSpace + '$1'
            // }
        ]

        , domain: onlineDomain
    }

    , deploy: {

        // 发布正式代码
        dist: [
            {
                from: '/'
                , to: '../../beat-dist'
                , include: /^\/(static|template)\//
                , replace: {
                    from: '/static/common/'
                    , to: onlineDomain + '$&'
                }
            }
        ]

    }

});


fis.config.del('modules.optimizer.html');

// Animation 动画，在压缩后可能导致问题
// fis.config.del('modules.optimizer.css');


