var onlineDomain = 'http://static.xiaojukeji.com/pinche/beat-dist';

fis.config.merge({

    namespace: 'oneyuan'

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

        , domain: onlineDomain
    }

    , deploy: {

        // 发布正式代码
        dist: [
            {
                to: '../../beat-dist'
                , include: /^\/static\//
                , replace: {
                    from: '/static/common/'
                    , to: onlineDomain + '$&'
                }
            }
            , {
                // @todo: 发布至pinche_recruit仓库
                to: '../../beat-dist'
                , include: /^\/template\//
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
fis.config.del('modules.optimizer.css');

