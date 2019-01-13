(function () {

'/static/common/'


__inline("./getTicket.js");


var imageResources = $.map(
        $('link[rel="imgpreload"]'),
        function (item) {
            return $(item).attr('href');
        }
    );

var sceneList = [ 
    'scene_1'
    , 'scene_1_1'
    , 'scene_1_2'

    , 'scene_2'

    , 'scene_3'
    , 'scene_3_1'
    , 'scene_3_2'
    , 'scene_3_3'
    , 'scene_3_4'
    , 'scene_3_5'

    , 'scene_4'
    , 'scene_4_1'
    , 'scene_4_2'
    , 'scene_4_3'
    , 'scene_4_4'

    , 'scene_5'
    , 'scene_5_1'
    , 'scene_5_2'
    , 'scene_5_3'

    , 'scene_6'
];

var sceneDuration = {
    // 帧名  : 启动多长时间后开启下一帧
    // 0-2
    'scene_1': 1000 
    , 'scene_1_1': 4000
    , 'scene_1_2': 1500

    // 3
    , 'scene_2': 2000

    // 4-9
    , 'scene_3': 500  
    , 'scene_3_1': 1000
    , 'scene_3_2': 1500
    , 'scene_3_3': 2000
    , 'scene_3_4': 100      // Empty
    , 'scene_3_5': 1000

    // 10-14
    , 'scene_4': 750
    , 'scene_4_1': 500
    , 'scene_4_2': 1000     // 摆好姿势
    , 'scene_4_3': 1500     // 金币出现
    , 'scene_4_4': 1000     // 金币归拢

    // 15-18
    , 'scene_5': 100
    , 'scene_5_1': 100     // 
    , 'scene_5_2': 1500
    , 'scene_5_3': 1500

    // 19
    , 'scene_6': 1500
};


var $wrapper = $('#wrapper');
var $lamp = $('.lamp-shine-layer');
var debug = /debug=1/.test(location.href) ? 1 : 0;
var startScene 
    = /start_scene=(\d+)/.test(location.href)
        ? RegExp.$1 - 0 : -1;
    

var defaultSceneConfig = {
    currentScene: 0
    , sceneList: sceneList.slice()
    , sceneDuration: sceneDuration
};


var sceneConfig1 = {
    currentScene: 0
    , sceneList: sceneList.slice(0, 7)
    , sceneDuration: sceneDuration
};

var sceneConfig2 = {
    currentScene: 3
    // Ensure that list start from big frame
    , sceneList: sceneList.slice(4, 8)
    , sceneDuration: sceneDuration
};

var sceneConfig2_1 = {
    currentScene: 4
    , sceneList: sceneList.slice(4, 19)
    , sceneDuration: sceneDuration
};

var sceneConfig3 = {
    currentScene: 0
    , sceneList: sceneList.slice(19)
    , sceneDuration: sceneDuration
};

// Scene Config Validation
(function () {
    for (var i=0; i < sceneList.length; ++i) {
        if (defaultSceneConfig.sceneDuration[sceneList[i]]) {
            continue;
        } 
        else {
            throw Error('No scene duration or not all scenes have duration!');
        }
    }
})();


$(document).on('touchmove', function(e){
    e.stopPropagation();
    e.preventDefault();
});



(function(){
    function resize(){
        var width = window.innerWidth,
            height = window.innerHeight,
            fsize = Math.round( 20 * width / 320 );
        if(fsize > 25) {
            fsize = 20;
        }
        document.getElementsByTagName('html')[0].style.fontSize = fsize + 'px';

        // Avoid compressing height to visible region 
        // when soft keyboard is called out  
        document.getElementsByTagName('body')[0].style.height = height + 'px';
    }
    window.addEventListener('resize', function(){
        resize();
    });

    window.addEventListener('load', function(){
        resize();
        setTimeout(function(){
            resize();
        }, 500);
    });
})();



function init () {

    loadImages(
        imageResources

        // oncomplete
        , function(){

            $('.loading-layer').hide();

            setTimeout( function () {
                // Called again to ensure height is set correctly
                $('body').css('height', $(window).height() + 'px');
            }, 0 );


            if (debug) {
                $('.btn-next').show();
                $('.btn-prev').show();

                defaultSceneConfig.currentScene = startScene;
                nextScene();

                $('.btn-next').on('click', function () {
                    nextScene();
                });
                $('.btn-prev').on('click', function () {
                    prevScene();
                });

            }
            else {

                $('.btn-next').hide();
                $('.btn-prev').hide();

                // Todo: use promise
                play(sceneConfig1, function () {

                    $wrapper.on('touchstart', function(){

                        play(sceneConfig2, function () {

                            play(sceneConfig2_1, function () {
                                $('.btn-get').on('click', function () {
                                    getTicket(function () {
                                        play(sceneConfig3);
                                    });
                                });
                            });

                        });
                        $wrapper.off('touchstart');

                    });
                });
            }
        }

        // onprogress
        , function(progress){
            $('.loading-layer span')
                .html(progress); 
        }

    );
}




function getNextScene (current, config) {
    return getScene(true, current, config);
}

function getPrevScene (current, config) {
    return getScene(false, current, config);
}

function getScene (isNext, current, config) {
    config = config || defaultSceneConfig;
    sceneList = config.sceneList; 

    var step = isNext ? 1 : -1; 

    if (undefined === current) {
        current = config.currentScene; 
    }

    return ( current + step + sceneList.length ) 
        % sceneList.length;
}


function nextScene (config) {
    config = config || defaultSceneConfig;
    sceneList = config.sceneList; 

    var nextScene = getNextScene(undefined, config),
        nextSceneName = sceneList[nextScene],
        sceneClass = getSceneClass(nextSceneName, config);;

    debug && console.log(nextScene + ':' + sceneClass);

    config.currentScene = nextScene;
    $wrapper.attr('class', sceneClass);
}

function prevScene (config) {
    config = config || defaultSceneConfig;
    sceneList = config.sceneList; 

    var prevScene = getPrevScene(undefined, config),
        prevSceneName = sceneList[prevScene],
        sceneClass = getSceneClass(prevSceneName, config);

    debug && console.log(prevScene + ':' + sceneClass);

    config.currentScene = prevScene;
    $wrapper.attr('class', sceneClass);
}

function getSceneFromSceneName(sceneName, config) {
    config = config || defaultSceneConfig;
    var sceneList = config.sceneList; 
    for (var i=0; i < sceneList.length; ++i) {
        if (sceneName == sceneList[i]) {
            return i;
        }
    }
    return 0;
}

/**
 * @example
 * input : scene_5
 * output: scene_5
 * input : scene_3_2
 * output: scene_3 scene_3_1 scene_3_2
 */
function getSceneClass (sceneName, config) {

    // Big Scene
    if(!/scene_\d+_\d+/.test(sceneName)){
        return sceneName;
    }

    config = config || defaultSceneConfig;
    sceneList = config.sceneList; 
    current = getSceneFromSceneName(sceneName, config);

    // Small Scene
    var cls = sceneName,
        current = getPrevScene(current, config),
        s = sceneList[current];

    while(/scene_\d+_\d+/.test(s)){
        cls = s + ' ' + cls; 
        current = getPrevScene(current, config),
        s = sceneList[current];
    }
    cls = s + ' ' + cls;
    return cls;
}

function isLastScene(scene, config) {
    config = config || defaultSceneConfig;

    return scene < config.sceneList.length 
        && ( 
            config.sceneList.length == scene + 1
            || config.sceneList.length == 0
        ); 
}

function play(config, oncomplete) {
    config = config || defaultSceneConfig;
    if (!config.sceneList 
        || !config.sceneList.length) {
        return;
    }

    var scene = config.currentScene,
        sceneName = config.sceneList[scene],
        currentSceneName = sceneName;


    function _play() {

        console.log(
            scene + ':' + sceneName
            + ':' + getSceneClass(sceneName, config)
        );

        $wrapper.attr(
            'class'
            , getSceneClass(sceneName, config)
        ); 


        if (!isLastScene(scene, config)) {
            scene = getNextScene(scene, config); 
            currentSceneName = sceneName;
            sceneName = config.sceneList[scene];

            setTimeout(function () {
                _play();
            }, config.sceneDuration[currentSceneName]);
        }
        else {
            setTimeout(
                function(){
                    oncomplete && oncomplete();
                }
                , config.sceneDuration[currentSceneName]
            );
        }

    } 

    _play();
    
}


function loadImages(images, oncomplete, onprogress){
    if(!images || !images.length) {
        oncomplete && oncomplete();
        return;
    } 
    var len = images.length, 
        i = 0,
        finished = 0,
        img;
    
    onprogress = onprogress || function(){};
    onprogress(30);

    while(i < len){
        img = new Image();
        img.src = images[i++];
        img.onload = img.onabort 
            = img.onerror 
            = function(){
                finished++; 
                onprogress(Math.ceil(70 * finished / len + 30));
                if(finished >= len){
                    setTimeout(function(){
                        oncomplete && oncomplete();
                    }, 100);
                }
            };
    } 
}



// start
$(function(){
    init();
});



})();
