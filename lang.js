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
    la_2 : ['文字写作样章','Writing'],
    la_3 : ['技术翻译样章','Translation'],
    la_4 : ['设计分享交流','Keynotes'],
    la_5 : ['规范体系建设','Design System'],
    la_6 : ['交互原型设计','Interaction'],
    la_7 : ['网页动效设计','Animation'],
    la_8 : ['网站设计制作','Make Websites'],
    la_9 : ['设计工具开发','Build Tools'],
    la_10 : ['我的联系方式','Get in Touch'],
    la_11 : ['Dongfang','Dongfang'],
    la_12 : ['你好！欢迎并感谢莅临本网页。我叫东方，常住北京，中文和互联网交叉背景。香港教育大学文学硕士。曾在腾讯、滴滴出行等公司任交互设计师。','Welcome\! Dōngfāng is a craftsman with a cross-knowledge background located in Beijing\. As a UX designer or UI developer who is passionate about Web design and writing\, he holds a master degree of arts from the Education University of Hong Kong\, and used to work for Tencent and DiDi Chuxing group for years\.'],
    la_13 : ['我乐于为个人或组织提供以下帮助：','Dōngfāng can provide you with the following helps\:'],
    la_14 : ['一、手工制作定制化的响应式设计网站。','1) Design consultation of making a responsive website\;'],
    la_15 : ['二、为基于iOS或Android平台的移动应用做交互设计。','2) Interaction design for mobile application\;'],
    la_16 : ['三、高质量技术翻译或文学翻译（英译中）。','3) Technical translation, from English to Chinese\;'],
    la_17 : ['四、简体和繁體中文的软件本地化工作。','4) Copy localization, both of Mandarin and Cantonese\;'],
    la_18 : ['五、讲授图画书的选择和鉴赏课程。','5) Giving lessons on how should you read a children\'s picture book\.'],
    la_19 : ['为了方便快速了解，下图显示了我的知识结构中和设计工作有关的部分。以往的经验已在图中分类标注。','The picture below depicts Dōngfāng\'s knowledge structure about design\, past experience is listed in it by relevance\.'],
    la_20 : ['人工智能','A\.I\.'],
    la_21 : ['2019年1月，第45届\<a target\=\"_blank\" href\=\"http\:\/\/ylaa\.org\.hk\"\>「青年文學獎」\<\/a\>小小说组优异奖，221字','2019\, THE 45\<sup\>th\<\/sup\> \<a target\=\"_blank\" href\=\"http\:\/\/ylaa\.org\.hk\/\"\>YOUTH LITERARY AWARD\<\/a\> OF MERIT\, 153 words'],
    la_25 : ['第一年，亲爱的，你说「替我画一只蓝羽毛的孔雀。」我说好的，画出来了。','In the first year\, my dear\, you said\: \<i\>\"Draw a peacock with blue feathers for me\.\"\<\/i\> I said ok\, then I did it\.'],
    la_26 : ['第二年，你说：「画一只孔雀。」我说好的，画出来了，蓝羽毛的。','In the second year\, you said\: \<i\>\"Draw a peacock\.\"\<\/i\> I said ok\, I did it\, with blue feathers\.'],
    la_27 : ['第三年，你说要画一只鸟，我说好的，画出来了一只蓝羽毛的孔雀。你说「你知道我想画孔雀，真贴心。」','In the third year\, you said you want to draw a bird\. I said ok\, then drew a peacock with blue feathers\. You said\: \<i\>\"You do know what I want is to draw peacocks\, really sweet\.\"\<\/i\>'],
    la_28 : ['第四年，你说想画画，我画出来了，你说「你怎么知道我想要一只鸟？」','In the fourth year\, you said you want a picture\. I satisfied you\. You said\: \<i\>\"How do you know I want a BIRD\?\"\<\/i\>'],
    la_29 : ['第五年，你心情不好，说：「要有鸟。」我画画给你看，然后你说：「好开心。」','In the fifth year\, you said \<i\>\"Let There Be Bird\"\<\/i\> in a bad mood\. I painted for you\. Then you said\: \<i\>\"I\'m really happy\.\"\<\/i\>'],
    la_30 : ['第六年，我画画给你看，你说「嘿嘿。」','In the sixth year\, I painted for you\, you said \<i\>\"Haha\"\<\/i\>\.'],
    la_31 : ['第七年，我画画给你看，你揍了我。我觉得我不懂你。','Last year\, I did the same for you\. You hurt me\. I could not understand you\, my dear\.'],
    la_32 : ['人民邮电出版社 (2017)','POST \& TELECOM PRESS \(2017\)\.'],
    la_33 : ['译自《ADAPTIVE WEB DESIGN\: CRAFTING RICH EXPERIENCES WITH PROGRESSIVE ENHANCEMENT \(第2版\)》，原作者 AARON GUSTAFSON','TRANSLATED FROM\: GUSTAFSON\, A\. \(2016\)\. ADAPTIVE WEB DESIGN \(SECOND EDITION\)\.'],
    la_34 : ['翻译样章：','SAMPLE PARAGRAPH\:'],
    la_35 : ['译自《DATA VISUALIZATION WITH JAVASCRIPT》，原作者 STEPHEN A\. THOMAS','TRANSLATED FROM\: THOMAS\, S\. A\. \(2015\)\. DATA VISUALIZATION WITH JAVASCRIPT\.'],
    la_36 : ['情感化内容策略','From Voice & Tone to Content Strategy'],
    la_37 : ['这次分享在滴滴顺风车设计团队内部讨论了两类内容设计规范，UBER 的 \"Copy Style\" 和 MAILCHIMP 的 \"Voice \& Tone\"。同时涉及了内容策略的一些基本原则。','I introduced two types of content guideline to DiDi Hitch\'s design team members: Uber\'s \"Copy Style\" and MailChimp\'s \"Voice \& Tone\"\. At the same time\, the essential principles of Content Strategy were also mentioned in this presentation\.'],
    la_38 : ['Web设计基础','The Overview of Web Design'],
    la_39 : ['考虑到滴滴的设计师以移动设计背景为主，此分享从H5的概念开始，讲述了移动网页的设计特点，如何在设计中考虑移动设备的适应性，以及近年来的Web设计趋势等等。','Considering most designers in DiDi\'s design team were more familiar with the mobile platform than desktop\, This presentation focus on mobile\: how should we present a graceful web page on mobile devices\? how should we take the advantage of adaptivity for web pages\? what is the design trend in recent years\? In the end\, I reviewed some concepts that frequently be discussed by UI developers\.'],
    la_40 : ['面向未来的友好设计','Future Friendly Web Design'],
    la_41 : ['在腾讯网络媒体事业部内部的分享。介绍了近年来的设计趋势和「面向未来的友好设计」的设计概念。介绍了一些已经出版或引进的设计图书和资源，讲了这些设计资源彼此之间的脉络联系。','This keynote is for junior designers of Tencent online media group\. Here I introduced some fantastic shares by great designers around the world\, sorted the core concepts and principles of Future Friendly Web Design\, listed some designers\, books\, and resources about FFLY\.'],
    la_42 : ['响应式设计','Responsive Web Design\: Rebuild as Design'],
    la_43 : ['响应式设计将设计风格和技术解决方案结合在了一起。分享中涉及了响应式设计的实践经验，设计原则，以及改进工作流程，将性能纳入设计考虑的思考。这场分享以直播形式，面向腾讯北京、上海、深圳分公司的约200名设计师。','Responsive Web Design combines design style and tech solution together\. In this live speak which was for 200 audiences of 3 cities\, I addressed the best practices of responsive web design\: how should we deal with the increasing development of mobile devices and resolutions\? With the rules\, methods and new design workflow evolution\, performance would be considered as a significant part of our design process\.'],
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
    la_93 : ['\<img src\=\"\.\/assets\/cdm_cn\.svg\" alt\=\"设计知识结构\" style\=\"box-shadow\:none\; margin-top\:0\; margin-bottom\:0\" \/\>','\<img src\=\"\.\/assets\/cdm\.svg\" alt\=\"Image of Craft Development Map\" style\=\"box-shadow\:none\; margin-top\:0\; margin-bottom\:0\" \/\>'],
    la_94 : ['2018年8月，845字','2018, 568 words'],
    la_95 : ['版权 2018-2019 \&copy\;futurefriendly\.cn\, 保留所有权利，包括以任何形式复制本网站或其中部分内容的权利。\<br\>有关信息，请咨询内容发布者。','Copyright 2018-2019 \&copy\;futurefriendly\.cn\, all rights reserved\, including the right to reproduce this site or portions thereof in any form whatsoever\. \<br\>For information\, address the content publisher\.'],
    la_96 : ['展开全文 \&raquo\;','Full Text \&raquo\;'],
    la_97 : ['……','...'],
    la_98 : ['如何理解香港的本土意识','How Should We Understand Hong Kong\'s Local Consciousness'],
    la_99 : ['和北京、上海等城市不同，香港的自我意识是在英国的帮助下建立起来的。在50年代和70年代，香港分别吸收了大量移民，这些移民操着客家话、上海话、北方方言以及广东话，其中并没有任何一种所谓香港本土居民的语言，英语是唯一的官话。','Unlike other cities such as Beijing and Shanghai\, Hong Kong\'s self-awareness was established with the help of the United Kingdom\. In the 1950s and 1970s\, Hong Kong absorbed a large number of immigrants who spoke Hakka\, Wu dialect\, Mandarin and Cantonese\. There is no such thing as \"Hong Kong dialect\"\. English is the only official language\.'],
    la_100 : ['六七暴动后，英政府意识到华人的不团结会影响到殖民地的投资收益，所以强制采用广东话作为香港人使用中文的规范。香港今年关于汉语和广东话孰为母语的争论，在外省人看来似乎是白马非马乎的怪论，但在香港人看来是有必要的。因香港的中文传统是英国人帮助建立起来的，他若要在1997之后找到自己屹立于汉族文化之林的文化根源，就必须回望广东话是如何成为这个地区的官方语言的历史。有些人至今在公共场合挥舞龙狮旗帜，这里面包含两种人，一种是反贼，另一种是通过对1967年的致敬，去试图找到香港文化在中华文化圈的定位。在内地看，香港人是一种自我隔离的自负；在香港本地看，这却是一种文化定位模糊的自卑，这便是香港文化的吊诡。','After the 1967 leftist riots\, the British government realized that it would reduce the investment income of the colonies if the Chinese people were not united\. Therefore\, they forced Hong Kong residents to study and use Cantonese in a unified manner\. In the perspective of foreigners\, the debate of \<i\>\"Which is the mother tongue, Chinese or Cantonese\?\"\<\/i\> seems strange\. However\, this question seems necessary for Hong Kong people\. As the Chinese tradition of Hong Kong was established with the help of the British\, if Hong Kong needs to find its own cultural roots and confidence after 1997\, it must re-examine its history\, that is how Cantonese became the region\'s official language\. In recent years\, we could see some people waved the Dragon and Lion Flag in public\. Half of them want to express their dissatisfaction with the Chinese government in this way\. The other half just attempt to discover the uniqueness of local culture in Hong Kong by commemorating 1967\. From the perspective of the Mainland\, Hong Kong people are both self-isolated and conceited\. In Hong Kong\, this is a kind of inferiority with a vague cultural orientation\. This is a strange aspect of Hong Kong culture\.'],
    la_101 : ['1985年，北京的刘索拉在《你别无选择》里说：「去找找看。」这句话说出了改革开放中成长的一代人的心声。而在70年代的香港，西西在《我城》里说：「这个城市里，每天总有这些那些，和我们默然道别。」','In 1985\, the Beijinger Liu Sola said \<i\>\"Go look for it\"\<\/i\> in her book "You Have No Choice". This sentence tells the voice of a generation that grew up in the wave of the Chinese Economic Reform\. However\, In Hong Kong in the 1970s\, Xi Xi said in her book \"My City\"\: \<i\>\"In this city\, there are always these and those things\, say goodbye to us in silence\.\"\<\/i\>'],
    la_102 : ['北京是一座向前看的城市，因为它厚重的文化积淀给予了人们充足的自信。英子的皇城根，骆驼祥子的茶馆，冯小刚溜着鸟回敬不懂礼貌的游客：「叫大爷。」奥运会时候带红袖箍的大爷大妈人人学英文，家里开公交的二伯二叔依然一碗卤煮，一盆麻小。相反，香港是一座向后看的城市，它的文化太短了，现代主义？那是台湾的事，星岛日报？那是南来文人的阵地。许地山来了，叶灵凤来了，刘以鬯来了，陶里来了，大家带来了四面八方的文化。都说乡愁是一枚小小的邮票，写信的时候，收信人地址很重要，寄信人地址？想写就写一写吧。','Beijing is a forward-looking city because its rich cultural heritage gives people plenty of confidence\. Yingzi\'s memory of the old Beijing\; the Rickshaw Boy\'s Teahouse\; Feng Xiaogang replied to the impolite visitors in a hutong\: \<i\>\"You should call me Uncle\"\<\/i\>\. During the 2008 Olympic Games\, even every elderly security officer who was wearing a red cuff was learning English\; the uncle of the bus driver still ate a bowl of fried noodles and a spicy crayfish\. On the contrary\, Hong Kong is a backward-looking city\. Its culture is too short\, modernism\? That is the matter of Taiwan\. Sing Tao Daily\? That is the position of the southbound literati\. Xu Dishan came\, Ling-feng Yeh came\, Liu Yichang came\, Taoli came, and all of them brought different cultures from different directions\. It is said that the homesickness is a small stamp\. While someone was writing a letter\, the address of the addressee is important\, the address of the sender\? If you really want to write\, just write it\.'],
    la_103 : ['香港文化之源在哪里呢？小思老师将香港文化历史装进了档案袋，标志着向七十年代之前寻找的行为告一段落。2018年香港书展上推出了西西研究资料，煌煌四巨册。那麦理浩总督管辖的亚洲四小龙之一，才是本地文化信心的起源，才是国人更能懂得的香港。','Where is the source of Hong Kong culture\? Professor Xiao Si put Hong Kong\'s cultural history into the portfolio\, marked the end of the search in the 1970s\. In the 2018 Hong Kong Book Fair\, a set of four books on Xi Xi literature research was launched\. Perhaps\, one of the Four Asian Tigers under the management of Governor MacLehose is the origin of local cultural confidence\, and it is surely a better Hong Kong imagination that Chinese people could understand\.']
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
            $('#root').attr('lang','en');
            break;
        case "zh":
            /* 简体中文 */
            $('[data-lang]').each(function(){
              thislang = $(this).data('lang');
              $(this).html(eval('lang.' + thislang)[0]);
            });
            $('#langs').text('To English');
            $('body').removeClass('en').addClass('cn');
            $('#root').attr('lang','zh-cn');
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