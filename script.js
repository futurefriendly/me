// language detection start

function checklang(){
  
    /* get browser default lang */    
    if (navigator.userLanguage) {
        baseLang = navigator.userLanguage.substring(0,2).toLowerCase();    
    } else {    
        baseLang = navigator.language.substring(0,2).toLowerCase();    
    }
    switchlang(baseLang);
}

function switchlang(bl){

  var lang = {
    la_1 : ['我擅长的领域','Overview'],
    la_2 : ['文学写作样章','Micro-Fiction'],
    la_3 : ['技术翻译样章','Translation'],
    la_4 : ['设计分享交流','Keynotes'],
    la_5 : ['规范体系建设','Design System'],
    la_6 : ['交互原型设计','Interaction'],
    la_7 : ['网页动效设计','Animation'],
    la_8 : ['网站设计制作','Make Websites'],
    la_9 : ['设计工具开发','Build Tools'],
    la_10 : ['我的联系方式','Get in Touch'],
    la_11 : ['Dongfang','Dongfang'],
    la_12 : ['你好！欢迎并感谢莅临本网页。我叫东方，常住北京，中文和互联网交叉背景。香港教育大学文学硕士。9年互联网从业经验，曾在腾讯、滴滴出行等公司任交互设计师。','Welcome\! Dōngfāng is a craftsman with a cross-knowledge background located in Beijing\. As a UX designer or UI developer who is passionate about Web design and writing\, he holds a master degree of arts from the Education University of Hong Kong\, and used to work for Tencent and DiDi Chuxing group for years\.'],
    la_13 : ['我乐于为个人或组织提供以下帮助：','Dōngfāng can provide you with the following helps\:'],
    la_14 : ['一、手工制作定制化的响应式设计网站。','1) Design consultation of making a responsive website\;'],
    la_15 : ['二、为基于iOS或Android平台的移动应用做交互设计。','2) Interaction design for mobile application\;'],
    la_16 : ['三、高质量技术翻译或文学翻译（英译中）。','3) Technical translation, from English to Chinese\;'],
    la_17 : ['四、简体和繁體中文的软件本地化工作。','4) Copy localization, both of Mandarin and Cantonese\;'],
    la_18 : ['五、讲授图画书的选择和鉴赏课程。','5) Giving lessons on how to read a children\'s picture book\.'],
    la_19 : ['为了方便快速了解，下图显示了我的知识结构中和设计工作有关的部分。以往的经验已在图上分类标注。','The picture below depicts Dōngfāng\'s knowledge structure about design\, past experience is listed in it by relevance\.'],
    la_20 : ['人工智能','A\.I\.'],
    la_21 : ['第45届\<a target\=\"_blank\" href\=\"http\:\/\/ylaa\.org\.hk\"\>「青年文學獎」\<\/a\>小小说组优异奖 (2019)','THE 45\<sup\>th\<\/sup\> \<a target\=\"_blank\" href\=\"http\:\/\/ylaa\.org\.hk\/\"\>YOUTH LITERARY AWARD\<\/a\> OF MERIT IN 2019'],
    la_25 : ['第一年，亲爱的，你说「替我画一只蓝羽毛的孔雀。」我说好的，画出来了。','In the first year\, my dear\, you said\: \"Draw a peacock with blue feathers for me\.\" I said ok\, then I did it\.'],
    la_26 : ['第二年，你说：「画一只孔雀。」我说好的，画出来了，蓝羽毛的。','In the second year\, you said\: \"Draw a peacock\.\" I said ok\, I did it\, with blue feathers\.'],
    la_27 : ['第三年，你说要画一只鸟，我说好的，画出来了一只蓝羽毛的孔雀。你说「你知道我想画孔雀，真贴心。」','In the third year\, you said you want to draw a bird\. I said ok\, then drew a peacock with blue feathers\. You said\: \"You do know what I want is to draw peacocks\, really sweet\.\"'],
    la_28 : ['第四年，你说想画画，我画出来了，你说「你怎么知道我想要一只鸟？」','In the fourth year\, you said you want a picture\. I satisfied you\. You said\: \"How do you know I want a BIRD\?\"'],
    la_29 : ['第五年，你心情不好，说：「要有鸟。」我画画给你看，然后你说：「好开心。」','In the fifth year\, you said \"Let There Be Bird\" in a bad mood\. I painted for you\. Then you said\: \"I\'m really happy\.\"'],
    la_30 : ['第六年，我画画给你看，你说「嘿嘿。」','In the sixth year\, I painted for you\, you said \"Haha\"\.'],
    la_31 : ['第七年，我画画给你看，你揍了我。我觉得我不懂你。','Last year\, I did the same for you\. You hurt me\. I could not understand you\, my dear\.'],
    la_32 : ['人民邮电出版社 (2017)','POST \& TELECOM PRESS \(2017\)\.'],
    la_33 : ['译自《ADAPTIVE WEB DESIGN\: CRAFTING RICH EXPERIENCES WITH PROGRESSIVE ENHANCEMENT \(第2版\)》，原作者 AARON GUSTAFSON','TRANSLATED FROM\: GUSTAFSON\, A\. \(2016\)\. ADAPTIVE WEB DESIGN \(SECOND EDITION\)\.'],
    la_34 : ['翻译样章：','SAMPLE PARAGRAPH\:'],
    la_35 : ['译自《DATA VISUALIZATION WITH JAVASCRIPT》，原作者 STEPHEN A\. THOMAS','TRANSLATED FROM\: THOMAS\, S\. A\. \(2015\)\. DATA VISUALIZATION WITH JAVASCRIPT\.'],
    la_36 : ['情感化内容策略','From Voice & Tone to Content Strategy'],
    la_37 : ['这次分享在滴滴顺风车设计团队内部讨论了两类内容设计规范，UBER 的 \"Copy Style\" 和 MAILCHIMP 的 \"Voice \& Tone\"。同时涉及了内容策略的一些基本原则。','I introduced two types of content guideline to DiDi Hitch\'s design team members: Uber\'s \"Copy Style\" and MailChimp\'s \"Voice \& Tone\"\. At the same time\, the essential principles of Content Strategy were also mentioned in this presentation\.'],
    la_38 : ['Web设计基础','The Overview of Web Design'],
    la_39 : ['考虑到滴滴的设计师以移动设计背景为主，此分享从H5的概念开始，讲述了移动网页的设计特点，如何在设计中考虑移动设备的适应性，以及近年来的Web设计趋势等等。','Considering most designers in DiDi\'s design team were more familiar with the mobile platform than desktop\, This presentation focus on mobile\: how to present a graceful web page on mobile devices\? how to take the advantage of adaptivity for web pages\? what is the design trend in recent years\? In the end\, I reviewed some concepts that frequently be discussed by UI developers\.'],
    la_40 : ['面向未来的友好设计','Future Friendly Web Design'],
    la_41 : ['在腾讯网络媒体事业部内部的分享。介绍了近年来的设计趋势和「面向未来的友好设计」的设计概念。介绍了一些已经出版或引进的设计图书和资源，讲了这些设计资源彼此之间的脉络联系。','This keynote is for junior designers of Tencent online media group\. Here I introduced some fantastic shares by great designers around the world\, sorted the core concepts and principles of Future Friendly Web Design\, listed some designers\, books\, and resources about FFLY\.'],
    la_42 : ['响应式设计','Responsive Web Design\: Rebuild as Design'],
    la_43 : ['响应式设计将设计风格和技术解决方案结合在了一起。分享中涉及了响应式设计的实践经验，设计原则，以及改进工作流程，将性能纳入设计考虑的思考。这场分享以直播形式，面向腾讯北京、上海、深圳分公司的约200名设计师。','Responsive Web Design combines design style and tech solution together\. In this live speak which was for 200 audiences of 3 cities\, I addressed the best practices of responsive web design\: how to deal with the increasing development of mobile devices and resolutions\? With the rules\, methods and new design workflow evolution\, performance would be considered as a significant part of our design process\.'],
    la_44 : ['滴滴顺风车','DiDi Hitch'],
    la_45 : ['用户界面设计','UI Design'],
    la_46 : ['用户界面开发','UI Development'],
    la_47 : ['产品原型设计','Prototyping'],
    la_48 : ['交互设计','Interaction Design'],
    la_49 : ['组织头脑风暴','Brainstorming'],
    la_50 : ['故事板设计','Storyboarding'],
    la_51 : ['动效设计','Motion Design'],
    la_52 : ['前端开发','Front-end Development'],
    la_53 : ['本地化','Localization'],
    la_54 : ['首先，这份设计规范服务于滴滴顺风车的Web产品，既包含APP中以webserver方式引入的部分，也包含供社交平台传播的H5页面。其次，这份设计规范服务于滴滴顺风车的用户体验设计师和前端开发工程师，既是UI开发规范，也是一个交互组件库。','Firstly\, this design system serves Web products of DiDi Hitch\, including the built-in webserver and the operational activity web pages\. Secondly\, this design system serves UX designer and front-end developer\. It is both a front-end guideline and a UI component library\.'],
    la_55 : ['订单完成后的用户评价页面：','The Survey Page After A Hitch Journey\: '],
    la_56 : ['订单结束后，滴滴顺风车会通过此页面收集乘客和车主对本次行程的主观感受，这些数据将作为我们持续提升平台质量，优化产品细节的参考。评价页分为实名和匿名两部分。车主和乘客双方可以看到彼此以实名方式给出的正面评价，而双方的负面评价我们会以匿名方式提交给系统，作为双方信任值的评价标准之一。','After the trip\, we will collect passengers\' evaluation data on his or her driver to help us continuously improve the quality of our services\. The survey page is divided into a real-name part and an anonymous part\. The driver client will see a positive evaluation written by the passenger\, and the negative evaluation written by the passenger will be submitted directly to the backend system anonymously as evidence\, we will use that data to analyze whether a driver is good enough\.'],
    la_57 : ['为了方便快速迭代和数据更新，滴滴顺风车项目中，70%的UI元素以webserver方式实现。','For fast-paced iterations, 70\% of DiDi client\'s UI was implemented by webserver way\, no exception this page was\.'],
    la_58 : ['腾讯微视 (早期版本)','Weishi APP (Early Version)'],
    la_59 : ['转发视频：','Interaction of Forwarding A Video: '],
    la_60 : ['网络媒体事业部早期立项的「微视」是一个8秒短视频分享平台。考虑到iOS和Android操作系统的操作习惯不同，我们将两个平台上面的交互设计做了差异化处理。举例来说，我们在iOS平台的类ActionSheet组件上面合并了「分享」和「转发」操作，减少了视频详情页中可见的操作按钮数量。','Weishi was a Vine-like short video sharing App\. In this project\, considering the difference between iOS and Android platform\, we applied different design strategies for them\. For example\, on the iOS platform\, we combined \"share\" and \"forward\" operations into the iOS-only actionsheet to reduce the number of buttons visible on the video page\.'],
    la_61 : ['滴滴顺风车的端外运营页面：','Operational Pages of DiDi Hitch Mobile: '],
    la_62 : ['我们相信共享是优雅而美好的，所以我们在运营页面的设计上尽量雕琢细节。除了视觉设计，声音和动效也是我们重视的设计元素。如果一个运营页面同时具备动画和背景音乐，我们会将动画的单位时长和音乐节拍进行对位，使动画和音乐的节奏保持统一。','We believe in Sharing because it is of rock and sexy\. Therefore\, we should keep harmony between background music and the animation rhythm if a web page contains those elements\. The value of animation-duration in the source code should be strictly tuned to be equal to an integer multiple of one beat\.'],
    la_63 : ['如果你使用的是桌面浏览器，不妨在手机区域内尝试下点按或拖拽操作，以便预览完整动画。','Tap or drag the content on the PHONE area to preview more if you are using a desktop browser\.'],
    la_64 : ['轻春运：空座共享计划','Transport During The Spring Festival'],
    la_65 : ['2016年12月','December 2016'],
    la_66 : ['顺风飞船一周年大数据','Trip Data on The 1\<sup\>st\<\/sup\> Anniversary Show'],
    la_69 : ['2016年6月','June 2016'],
    la_70 : ['北京大学官方网站（国际版）','The International Official Website of Peking University'],
    la_71 : ['北京大学官方网站（国际版）于2015年11月20日改版上线。网站基于「面向未来的友好设计」设计思想，应用栅格布局和响应式设计方法，向前兼容IE7浏览器。','The International Official Portal Website of Peking University has made its debut on November 20\<sup\>th\<\/sup\> 2015\. This new responsive site is designed with \"Future-Friendly Design\" thinking\, applied bootstrap grid system\, and support IE7+ browser\.'],
    la_72 : ['UFO Animate','UFO Animate'],
    la_73 : ['个人项目','PERSONAL PROJECT'],
    la_74 : ['UFO Animate 是一个用来快速预览CSS动画效果的在线工具，支持中文和英文两种语言的操作界面。','UFO Animate is a CSS animation system that can quickly build CSS animation effects visually\. Depends on your system language settings\, English and Simplify Chinese are supported\.'],
    la_75 : ['或者邮件联系 \<u\>\<span class\=\"email\"\>\<\/span\>\<\/u\>。','or also feel free to contact me at \<u\>\<span class\=\"email\"\>\<\/span\>\<\/u\>\.'],
    la_76 : ['\<a target\=\"_blank\" href\=\"\.\/assets\/cdm_cn\.svg\" class\=\"btn2\"\>在新窗口中查看大图\<\/a\>','\<a target\=\"_blank\" href\=\"\.\/assets\/cdm\.svg\" class\=\"btn2\"\>View it in a new window\<\/a\>'],
    la_77 : ['去京东看读者评论','View comments on JD.com'],
    la_78 : ['去epubit.com看电子书','E-book on epubit.com'],
    la_79 : ['在线查看','View it online'],
    la_80 : ['英文版链接','In English'],
    la_81 : ['简体中文版链接','In Simplify Chinese'],
    la_82 : ['查看并播放','Display'],
    la_83 : ['访问 newsen.pku.edu.cn','Visit newsen.pku.edu.cn'],
    la_84 : ['飞机稿1号','Draft 1'],
    la_85 : ['飞机稿2号','Draft 2'],
    la_86 : ['在线试用','Try it online'],
    la_87 : ['回到顶部','back to top'],
    la_88 : ['小','A'],
    la_89 : ['中','A'],
    la_90 : ['大','A'],
    la_91 : ['发送邮件','Send message to me'],
    la_92 : ['\<a target\=\"_blank\" href\=\"https\:\/\/www\.linkedin\.com\/in\/bennychak\/\"\>点击这里\<\/a\> 访问我的领英主页，','Click \<a target\=\"_blank\" href=\"https\:\/\/www\.linkedin\.com\/in\/bennychak\/\"\>HERE\<\/a\> to visit my profile via LinkedIn\, '],
    la_93 : ['\<img src\=\"\.\/assets\/cdm_cn\.svg\" alt\=\"设计知识结构\" style\=\"box-shadow\:none\; margin-top\:0\; margin-bottom\:0\" \/\>','\<img src\=\"\.\/assets\/cdm\.svg\" alt\=\"Image of Craft Development Map\" style\=\"box-shadow\:none\; margin-top\:0\; margin-bottom\:0\" \/\>']
  };
  var thislang = '';
         
    /* language match */   
    switch(bl)
    {      
        case "en":
            /* english */
            $('[data-lang]').each(function(){
              thislang = $(this).data('lang')
              $(this).html(eval('lang.' + thislang)[1]);
            });
            $('#langs').text('切换为简体中文');
            $('body').removeClass('cn').addClass('en');
            break;
        case "zh":
            /* 简体中文 */
            $('[data-lang]').each(function(){
              thislang = $(this).data('lang');
              $(this).html(eval('lang.' + thislang)[0]);
            });
            $('#langs').text('To English');
            $('body').removeClass('en').addClass('cn');
            break;
        default:
            /* default no match */   
    }   
}

function handleSwitchlang(){
  if($('#langs').text() == 'To English'){
    switchlang('en')
  }else{
    switchlang('zh')
  }
}
// language detection end

$(function(){
  checklang();

  $('#langs').click(function(){
    handleSwitchlang();
    return false;
  });
});