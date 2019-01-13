var onlineDomain = 'http://static.xiaojukeji.com/pinche/beat-dist';
var nameSpace = 'xinshouli';

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
                from: '/template/' + nameSpace + '/page' 
                , subOnly: true
                // 发布至pinche_recruit仓库，确保pinche_recruit仓库与static仓库在同一目录下
                , to: '../../../../pinche_recruit/src/views/' + nameSpace 
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


