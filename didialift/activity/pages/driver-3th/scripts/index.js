window.addEventListener("DOMContentLoaded",function(ev){
    var base = dd.base || {};
    var  dialog = dd.dialog || {};
    var pauseMusic = document.querySelector("#playmusic");

    var addClass = function (ele,strClass){
        var reg = new RegExp("(?:^| )" + strClass + "(?: |$)");
        if(reg.test(ele.className)){
            //如果此类样式已经存在，则什么也不需要做
        }else{//不存在
            ele.className = ele.className.trim() + " " + strClass;
        }
    };

    var removeClass=function (ele,strClass){
        if(!(ele&&ele.nodeType == 1)){
            alert('第一参数ele需要是一个DOM元素对象');
            throw new Error('第一参数ele需要是一个DOM元素对象');
        }
        if(typeof strClass != 'string'){
            alert('第二参数必须为string类型');
            throw new Error('第二参数必须为string类型');

        }

        var reg=new RegExp("(?:^| )" + strClass + "(?: |$)","g");
        ele.className = ele.className.replace(reg,'').trim();
    };

    base.touch(pauseMusic,function(ev){
        if(pauseMusic.className === "stopmusic"){
            removeClass(pauseMusic,"stopmusic");
            addClass(pauseMusic,"startmusic");
            document.querySelector("audio").pause();
            pauseMusic.querySelector("img").setAttribute("src", "../static/images/startmusic.png");
        }else{
            removeClass(pauseMusic,"startmusic");
            addClass(pauseMusic,"stopmusic");
            document.querySelector("audio").play();
            pauseMusic.querySelector("img").setAttribute("src", "../static/images/stopmusic.png");
        }
    });
    document.querySelector("audio").pause();

    setTimeout(function(){
        document.querySelector("audio").play();
    },5000);


    //将小数转化为两位的
    changeTwoDecimal_f= function (floatvar)
    {
        var f_x = parseFloat(floatvar);
        if (isNaN(f_x))
        {
            alert('function:changeTwoDecimal->parameter error');
            return false;
        }
        var f_x = Math.round(f_x*100);

        return f_x;
    };


    (function(){


        document.getElementsByClassName("swiper-container")[0].style.display="none";
        var globalCount = document.getElementsByTagName("img").length;
        var count = 0;

        for (var i=0 ; i< globalCount ; i++){
            var img = new Image();
            img.src=document.getElementsByTagName("img")[i].src;
            img.onload=function(){
                count++;
                var percentage = count/globalCount;
                percentage=changeTwoDecimal_f(percentage);
                document.getElementsByClassName("jindu")[0].innerHTML=(percentage + "%");
                if (percentage >99){
                    document.getElementsByClassName("loadpage")[0].style.display="none";
                    document.getElementsByClassName("swiper-container")[0].style.display="block";

                    var mySwiper = new Swiper('.swiper-container',{
                        paginationClickable: true,
                        mode: 'vertical',
                    });
                }
            }
        }

        //var base = dd.base || {};
        //var  dialog = dd.dialog || {};
        ////alert(1);
        //base.ajax({
        //    method:"GET",
        //    url:"http://10.10.9.87:8042/api/getdata",
        //    succFunc: function(data) {
        //        //data=JSON.parse(data);
        //        if(data['Code']==200){
        //            alert(data['Code']);
        //        }
        //    },
        //    failFunc: function(data) { dialog.alert("网络有问题，请重新加载！"); }
        //
        //})



    })();



})