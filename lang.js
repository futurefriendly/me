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
    // la_2 : ['文字写作节选','Creative Writing'],
    la_3 : ['技术图书翻译','Translation'],
    // la_4 : ['设计分享交流','Keynotes'],
    la_5 : ['设计规范建设','Design System'],
    la_6 : ['交互原型设计','Interaction Design'],
    la_7 : ['交互动效设计','Motion Design'],
    la_8 : ['网站设计制作','Make Websites'],
    la_9 : ['设计工具开发','Build Tools'],
    la_10 : ['我的联系方式','Get in Touch'],
    la_11 : ['Dongfang','Dongfang'],
    la_12 : ['你好！欢迎并感谢莅临本网页。我是一名语文教育和互联网行业的从业者，曾供职清华附中、滴滴出行、腾讯等，常住北京。','Welcome! This is a craftsman living in Beijing\. He used to work for Tsinghua University High School, DiDi Chuxing, and Tencent\.'],
    la_13 : ['我乐于为个人或组织提供以下帮助：','I\'m glad to provide you with the following helps\:'],
    la_14 : ['一、为基于iOS或Android平台的移动应用做交互设计。','1) Interaction design for mobile application\;'],
    la_15 : ['二、响应式网站设计。','2) Design consultation of making a responsive website\;'],
    la_16 : ['三、技术翻译或文学翻译（英译中）。','3) Technical translation, from English to Chinese\;'],
    la_17 : ['四、简体和繁體中文的软件本地化工作。','4) Chinese localization copywriting, Simplified or Traditional\.'],
    la_18 : ['作为「营销为主、客户第一」的公司，滴滴出行在设计团队中设置了品牌设计、交互设计、UI设计、视觉设计4种角色。2015年起，我在9人设计团队中负责了20余个运营活动的交互设计，确保了最终效果的实现。','As a marketing-oriented group\, there are 4 roles within the design center of DiDi\: Brand Designer\, Interaction Designer\, UI Designer\, and Graphic Designer\. Since the middle of 2015\, with a 9-member design team\, I was responsible for the interaction design and effects implementation of more than 20 promotion webpages\.'],
    la_19 : ['为了方便快速了解，下图显示了我的兴趣所在。以往的经验已在图中分类标注。','The picture below depicts what I\'m interested in\. Past experience is listed in it by relevance\.'],
    // la_20 : ['人工智能','A\.I\.'],
    // la_21 : ['2019年1月，第45届\<a target\=\"_blank\" href\=\"http\:\/\/ylaa\.org\.hk\"\>「青年文學獎」\<\/a\>小小说组优异奖','2019\, THE 45\<sup\>th\<\/sup\> \<a target\=\"_blank\" href\=\"http\:\/\/ylaa\.org\.hk\/\"\>YOUTH LITERARY AWARD\<\/a\> OF MERIT'],
    la_22 : ['作为一个重视产品体验的组织，腾讯各业务线的设计团队均拥有交互设计、视觉设计、UI开发三种角色。在网络媒体事业部的微视项目中，我作为交互设计师负责移动客户端产品流程的设计。','As an organization that values user experience\, there are 3 roles in each of the design team of different product department in Tencent\: UX Designer\, Visual Designer\, and UI Developer\. In the Weishi project of Online Media Group\, I was responsible for the mobile product process design as an interaction designer\.'],
    la_23 : ['2015年后，设计体系取代了设计规范，渐渐成为了更有效率的设计实践方式。一些组织，如\<a href=\"https\:\/\/www\.lightningdesignsystem\.com\" target=\"_blank\"\>Salesforce\<\/a\>，做出了设计体系的最佳实践。设计体系将内容与可访问性等元素纳入了设计需求的一部分，将设计规范和组件库统一了起来。结合之前我在腾讯微博维护Web设计规范的经验和Brad Frost的Atomic Design模块化设计思想，我们制作了这份顺风车的设计体系。','Since 2015\, The design system replaced the guideline\, gradually became a more efficient design practice\. Some organizations\, such as \<a href=\"https\:\/\/www\.lightningdesignsystem\.com\" target=\"_blank\"\>Salesforce\<\/a\>, have done best practices in that way\. The design system incorporates elements such as content strategy and accessibility into the design requirements and unifies the design guideline and component library\. Rely on my previous experience of Tencent Weibo\'s Web design guideline\, and Brad Frost\'s Atomic Design philosophy\, we created this design system of DiDi Hitch\.'],
    la_24 : ['2015年，作为交互设计和前端开发的角色，我参与了北京大学国际版官方网站改版工程。3人团队，3个版本，6个月设计开发周期后交付并通过最终评估。','From June to November 2015\, I was responsible for interaction design and front-end development in the redesign project of the International Official Website of Peking University\. 3-member team\, 3 editions\, delivered after the 6-month design & development cycle and passed the final assessment\.'],
    // la_25 : ['第一年，亲爱的，你说「替我画一只蓝羽毛的孔雀。」我说好的，画出来了。','In the first year\, my dear\, you said\: \<i\>\"Draw a peacock with blue feathers for me\.\"\<\/i\> I said ok\, then I did it\.'],
    // la_26 : ['第二年，你说：「画一只孔雀。」我说好的，画出来了，蓝羽毛的。','In the second year\, you said\: \<i\>\"Draw a peacock\.\"\<\/i\> I said ok\, I did it\, with blue feathers\.'],
    // la_27 : ['第三年，你说要画一只鸟，我说好的，画出来了一只蓝羽毛的孔雀。你说「你知道我想画孔雀，真贴心。」','In the third year\, you said you want to draw a bird\. I said ok\, then drew a peacock with blue feathers\. You said\: \<i\>\"You do know what I want is to draw peacocks\, really sweet\.\"\<\/i\>'],
    // la_28 : ['第四年，你说想画画，我画出来了，你说「你怎么知道我想要一只鸟？」','In the fourth year\, you said you want a picture\. I satisfied you\. You said\: \<i\>\"How do you know I want a BIRD\?\"\<\/i\>'],
    // la_29 : ['第五年，你心情不好，说：「要有鸟。」我画画给你看，然后你说：「好开心。」','In the fifth year\, you said \<i\>\"Let There Be Bird\"\<\/i\> in a bad mood\. I painted for you\. Then you said\: \<i\>\"I\'m really happy\.\"\<\/i\>'],
    // la_30 : ['第六年，我画画给你看，你说「嘿嘿。」','In the sixth year\, I painted for you\, you said \<i\>\"Haha\"\<\/i\>\.'],
    // la_31 : ['第七年，我画画给你看，你揍了我。我觉得我不懂你。','Last year\, I did the same for you\. You hurt me\. I could not understand you\, my dear\.'],
    la_32 : ['2017，人民邮电出版社','2017\, POST & TELECOM PRESS'],
    la_33 : ['译自《ADAPTIVE WEB DESIGN\: CRAFTING RICH EXPERIENCES WITH PROGRESSIVE ENHANCEMENT \(第2版\)》，原作者 AARON GUSTAFSON','TRANSLATED FROM\: GUSTAFSON\, A\. \(2016\)\. ADAPTIVE WEB DESIGN \(SECOND EDITION\)\.'],
    la_34 : ['样章：','SAMPLE PARAGRAPH\:'],
    la_35 : ['译自《DATA VISUALIZATION WITH JAVASCRIPT》，原作者 STEPHEN A\. THOMAS','TRANSLATED FROM\: THOMAS\, S\. A\. \(2015\)\. DATA VISUALIZATION WITH JAVASCRIPT\.'],
    // la_36 : ['情感化内容策略','From Voice & Tone to Content Strategy'],
    // la_37 : ['这次分享在滴滴顺风车设计团队内部讨论了两类内容设计规范，UBER 的 \"Copy Style\" 和 MAILCHIMP 的 \"Voice \& Tone\"。同时涉及了内容策略的一些基本原则。','I introduced two types of content guideline to DiDi Hitch\'s design team members: Uber\'s \"Copy Style\" and MailChimp\'s \"Voice \& Tone\"\. At the same time\, the essential principles of Content Strategy were also mentioned in this presentation\.'],
    la_38 : ['本书讲述的“渐进增强”概念提供了一种思维方式，这种思维方式沟通了设计师和工程师各自思考问题的路径，使大家不为分工所局限，共同实现业务目标。','\<i\>The concept of Progressive Enhancement conveys in this book has provided an approach of thinking\. It\'s about the best practice of communication between designers and developers\. This approach has enabled them to go beyond the limits of their own perspective and achieve business goals together\.\<\/i\>'],
    la_39 : ['——五八赶集集团CTO 邢宏宇 推荐','— Comments by Hongyu XING\, CTO of 58\.com Inc\.'],
    // la_40 : ['面向未来的友好设计','Future Friendly Web Design'],
    // la_41 : ['在腾讯网络媒体事业部内部的分享。介绍了近年来的设计趋势和「面向未来的友好设计」的设计概念。介绍了一些已经出版或引进的设计图书和资源，讲了这些设计资源彼此之间的脉络联系。','This keynote is for junior designers of Tencent online media group\. Here I introduced some fantastic shares by great designers around the world\, sorted the core concepts and principles of Future Friendly Web Design\, listed some designers\, books\, and resources about FFLY\.'],
    la_42 : ['数据化时代，两项专业技能非常重要：数据的分析能力和数据的表达能力。让数据提供信息，把信息进行最有效的沟通，对从业人员有非常高的要求。数据可视化在信息爆炸，时间碎片化的现实情况下成为最为有效的沟通手段。本书没有停留在晦涩难懂的理论，用生动的实例系统介绍了不同图像展示和交互方法。译者具有良好的技术功底，真实反映原著的精髓。','\<i\>In the data age\, two professional skills become very important\: the ability to analyze data and the ability to express data. Whether refining information from data or using information for the most effective communication\, it places high demands on practitioners\. Therefore\, data visualization becomes the most effective means of communication in the realities of information explosion and time fragmentation\. This book does not stop at the obscure theory\, but introduces the display and interaction methods of different images with a vivid example system\. In addition\, the translator has a good technical background and truly reflects the essence of the original\.\<\/i\>'],
    la_43 : ['——云峰金融集团CEO 李婷 推荐','— Comments by Ting LI\, CEO of Yunfeng Capital'],
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
    la_54 : ['首先，这份设计规范服务于滴滴顺风车的Web产品，既包含APP中以webserver方式引入的部分，也包含供社交平台传播的H5页面。其次，这份设计规范服务于滴滴顺风车的用户体验设计师和前端开发工程师，既是UI开发规范，也是一个交互组件库。','Firstly\, this design system serves Web products of DiDi Hitch\, including the built-in webserver and the promotion pages\. Secondly\, this design system serves UX designer and front-end developer\. It is both a front-end guideline and a UI component library\.'],
    la_55 : ['订单完成后的用户评价页面：','The Survey Page After A Hitch Journey\: '],
    la_56 : ['订单结束后，滴滴顺风车会通过此页面收集乘客和车主对本次行程的主观感受，这些数据将作为我们持续提升平台质量，优化产品细节的参考。评价页分为实名和匿名两部分。车主和乘客双方可以看到彼此以实名方式给出的正面评价，而双方的负面评价我们会以匿名方式提交给系统，作为双方信任值的评价标准之一。','After the trip\, we will collect passengers\' evaluation data on his or her driver to help us continuously improve the quality of our services\. The survey page is divided into a real-name part and an anonymous part\. The driver client will see a positive evaluation written by the passenger\, and the negative evaluation written by the passenger will be submitted directly to the backend system anonymously as evidence\, we will use that data to analyze whether a driver is good enough\.'],
    la_57 : ['我和设计团队一起负责了滴滴顺风车的全流程交互设计。为了方便快速迭代和数据更新，滴滴顺风车项目中，70%的UI元素以webserver方式实现。','Together with the design team\, as an interaction designer\, I was responsible for the entire product flow of DiDi Hitch\. For fast-paced iterations, 70\% of DiDi client\'s UI was implemented by webserver way\, no exception this page was\.'],
    la_58 : ['腾讯微视 (OMG版本)','Weishi APP (OMG Version)'],
    la_59 : ['转发视频：','Interaction of Forwarding A Video: '],
    la_60 : ['网络媒体事业部(OMG)早期立项的「微视」是一个8秒短视频分享平台。考虑到iOS和Android操作系统的操作习惯不同，我们将两个平台上面的交互设计做了差异化处理。举例来说，我们在iOS平台的类ActionSheet组件上面合并了「分享」和「转发」操作，减少了视频详情页中可见的操作按钮数量。','Weishi was a Vine-like short video sharing App\. In this project\, considering the difference between iOS and Android platform\, we applied different design strategies for them\. For example\, on the iOS platform\, we combined \"share\" and \"forward\" operations into the iOS-only actionsheet to reduce the number of buttons visible on the video page\.'],
    la_61 : ['滴滴顺风车的端外运营页面：','Promotion Pages of DiDi Hitch Mobile: '],
    la_62 : ['我们相信共享是优雅而美好的，所以我们在运营页面的设计上尽量雕琢细节。除了视觉设计，声音和动效也是我们重视的设计元素。如果一个运营页面同时具备动画和背景音乐，我们会将动画的单位时长和音乐节拍进行对位，使动画和音乐的节奏保持统一。','We believe in Sharing because it is of rock and sexy\. Therefore\, we should keep harmony between background music and the motion rhythm if a web page contains those elements\. The value of animation-duration in the source code should be strictly tuned to be equal to an integer multiple of one beat\.'],
    la_63 : ['如果你使用的是桌面浏览器，不妨在手机区域内尝试下点按或拖拽操作，以便预览完整动画。','Tap or drag the content on the PHONE area to preview more if you are using a desktop browser\.'],
    la_64 : ['轻春运：空座共享计划','Transport During The Spring Festival'],
    la_65 : ['2016年12月','December 2016'],
    la_66 : ['顺风飞船一周年大数据','Trip Data on The 1\<sup\>st\<\/sup\> Anniversary Show'],
    la_67 : ['少有的翻译的通俗易懂的书，让你知道渐进增强是什么。','\<i\>Well translated and easy to understand\. It lets you know what progressive enhancement is\.\<\/i\>'],
    la_68 : ['——豆瓣网友','— A user from douban\.com'],
    la_69 : ['2016年6月','June 2016'],
    la_70 : ['北京大学官方网站（国际版）','The International Official Website'],
    la_71 : ['北京大学官方网站（国际版）于2015年11月20日改版上线。网站基于「面向未来的友好设计」设计思想，应用栅格布局和响应式设计方法，向前兼容IE7浏览器。','The International Official Portal Website of Peking University has made its debut on November 20\<sup\>th\<\/sup\> 2015\. This new responsive site is designed with \"Future-Friendly Design\" thinking\, applied bootstrap grid system\, and support IE7+ browser\.'],
    la_72 : ['UFO Animate','UFO Animate'],
    la_73 : ['个人项目','PERSONAL PROJECT'],
    la_74 : ['UFO Animate 是一个用来快速预览CSS动画效果的在线工具，支持中文和英文两种语言的操作界面。','UFO Animate is a CSS animation system that can quickly build CSS animation effects visually\. Depends on your system language settings\, English and Simplify Chinese are supported\.'],
    la_75 : ['欢迎邮件联系 \<u\>\<span class\=\"email\"\>\<\/span\>\<\/u\>。','Feel free to contact me at \<u\>\<span class\=\"email\"\>\<\/span\>\<\/u\>\.'],
    la_76 : ['\<a target\=\"_blank\" href\=\"\.\/assets\/map\.svg\" class\=\"btn2\"\>在新窗口中查看大图\<\/a\>','\<a target\=\"_blank\" href\=\"\.\/assets\/map\.svg\" class\=\"btn2\"\>View it in a new window\<\/a\>'],
    la_77 : ['去京东看读者评论','View comments on JD.com'],
    la_78 : ['去epubit.com看电子书','E-book on epubit.com'],
    la_79 : ['在线查看','View it online'],
    // la_80 : ['英文版','English ver.'],
    // la_81 : ['查看更多写作样章（简体中文）','More writing samples in Simplify Chinese'],
    la_82 : ['查看并播放','Display'],
    la_83 : ['访问网站','Visit it online'],
    la_84 : ['设计稿一','Draft 1'],
    la_85 : ['设计稿二','Draft 2'],
    la_86 : ['在线试用','Try it online'],
    la_87 : ['渐进增强：跨平台用户体验设计','Jianjin-zengqiang: Kuapingtai Yonghu Tiyan Sheji'],
    la_88 : ['小','A'],
    la_89 : ['中','A'],
    la_90 : ['大','A'],
    la_91 : ['发送邮件','Send message to me'],
    // la_92 : ['\<a target\=\"_blank\" href\=\"https\:\/\/www\.linkedin\.com\/in\/bennychak\/\"\>点击这里\<\/a\> 访问我的领英主页，','Click \<a target\=\"_blank\" href=\"https\:\/\/www\.linkedin\.com\/in\/bennychak\/\"\>HERE\<\/a\> to visit my profile via LinkedIn\, '],
    // la_93 : ['\<object data=\".\/assets\/map.svg\" type=\"image\/svg+xml\"\>\<\/object\>','\<object data=\".\/assets\/map.svg\" type=\"image\/svg+xml\"\>\<\/object\>'],
    // la_94 : ['2018年8月','2018'],
    la_95 : ['版权 \&copy\;2011-2021 by futurefriendly\.cn\, 保留所有权利，包括以任何形式复制本网站或其中部分内容的权利。有关信息，请咨询内容发布者。','Copyright \&copy\;2011 - 2022 by futurefriendly\.cn\, all rights reserved\, including the right to reproduce this site or portions thereof in any form whatsoever\. For information\, address the content publisher\.'],
    // la_96 : ['展开全文 \&raquo\;','Full Text \&raquo\;'],
    // la_97 : ['……','...'],
    // la_98 : ['如何理解香港的本土意识','How Should We Understand Hong Kong\'s Local Consciousness'],
    // la_99 : ['和北京、上海等城市不同，香港的自我意识是在英国的帮助下建立起来的。','Unlike other cities such as Beijing and Shanghai\, Hong Kong\'s self-awareness was established with the help of the United Kingdom\.'],
    // la_100 : ['在50年代和70年代，香港分别吸收了大量移民，这些移民操着客家话、上海话、北方方言以及广东话，其中并没有任何一种所谓香港本土居民的语言，英语是唯一的官话。六七暴动后，英政府意识到华人的不团结会影响到殖民地的投资收益，所以强制采用广东话作为香港人使用中文的规范。香港今年关于汉语和广东话孰为母语的争论，在外省人看来似乎是白马非马乎的怪论，但在香港人看来是有必要的。因香港的中文传统是英国人帮助建立起来的，他若要在1997之后找到自己屹立于汉族文化之林的文化根源，就必须回望广东话是如何成为这个地区的官方语言的历史。','In the 1950s and 1970s\, Hong Kong absorbed a large number of immigrants who spoke Hakka\, Wu dialect\, Mandarin and Cantonese\. There is no such thing as \"Hong Kong dialect\"\. English is the only official language\. After the 1967 leftist riots\, the British government realized that it would reduce the investment income of the colonies if the Chinese people were not united\. Therefore\, they forced Hong Kong residents to learn and use Cantonese in a unified manner\. In the perspective of foreigners\, the debate of \<i\>\"Which is the mother tongue, Chinese or Cantonese\?\"\<\/i\> seems strange\. However\, this question seems necessary for Hong Kong people\. As the Chinese tradition of Hong Kong was established with the help of the British\, if Hong Kong needs to find its own cultural roots and confidence after 1997\, it must re-examine its history\, that is how Cantonese became the region\'s official language\.'],
    // la_101 : ['有些人至今在公共场合挥舞龙狮旗帜，这里面包含两种人，一种是反贼，另一种是通过对1967年的致敬，去试图找到香港文化在中华文化圈的定位。在内地看，香港人是一种自我隔离的自负；在香港本地看，这却是一种文化定位模糊的自卑，这便是香港文化的吊诡。','In recent years\, we could see some people waved the Dragon and Lion Flag in public\. Half of them want to express their dissatisfaction with the Chinese government in this way\. The other half just attempt to discover the uniqueness of local culture in Hong Kong by commemorating 1967\. From the perspective of the Mainland\, Hong Kong people are both self-isolated and conceited\. In Hong Kong\, this is a kind of inferiority with a vague cultural orientation\. This is a strange aspect of Hong Kong culture\.'],
    // la_102 : ['1985年，北京的刘索拉在《你别无选择》里说：「去找找看。」这句话说出了改革开放中成长的一代人的心声。而在70年代的香港，西西在《我城》里说：「这个城市里，每天总有这些那些，和我们默然道别。」','In 1985\, the Beijinger Liu Sola said \<i\>\"Go look for it\"\<\/i\> in her book "You Have No Choice". This sentence tells the voice of a generation that grew up in the wave of the Chinese Economic Reform\. However\, In Hong Kong in the 1970s\, Xi Xi said in her book \"My City\"\: \<i\>\"In this city\, there are always these and those things\, say goodbye to us in silence\.\"\<\/i\>'],
    // la_103 : ['北京是一座向前看的城市，因为它厚重的文化积淀给予了人们充足的自信。英子的皇城根，骆驼祥子的茶馆，冯小刚溜着鸟回敬不懂礼貌的游客：「叫大爷。」奥运会时候带红袖箍的大爷大妈人人学英文，家里开公交的二伯二叔依然一碗卤煮，一盆麻小。相反，香港是一座向后看的城市，它的文化太短了，现代主义？那是台湾的事，星岛日报？那是南来文人的阵地。许地山来了，叶灵凤来了，刘以鬯来了，陶里来了，大家带来了四面八方的文化。都说乡愁是一枚小小的邮票，写信的时候，收信人地址很重要，寄信人地址？想写就写一写吧。','Beijing is a forward-looking city because its rich cultural heritage gives people plenty of confidence\. Yingzi\'s memory of the old Beijing\; the Rickshaw Boy\'s Teahouse\; Feng Xiaogang replied to the impolite visitors in a hutong\: \<i\>\"You should call me Uncle\"\<\/i\>\. During the 2008 Olympic Games\, even every elderly security officer who was wearing a red cuff was learning English\; the uncle of the bus driver still ate a bowl of fried noodles and a spicy crayfish\. On the contrary\, Hong Kong is a backward-looking city\. Its culture is too short\, modernism\? That is the matter of Taiwan\. Sing Tao Daily\? That is the position of the southbound literati\. Xu Dishan came\, Ling-feng Yeh came\, Liu Yichang came\, Taoli came, and all of them brought different cultures from different directions\. It is said that the homesickness is a small stamp\. While someone was writing a letter\, the address of the addressee is important\, the address of the sender\? If you really want to write\, just write it\.'],
    // la_104 : ['香港文化之源在哪里呢？小思老师将香港文化历史装进了档案袋，标志着向七十年代之前寻找的行为告一段落。2018年香港书展上推出了西西研究资料，煌煌四巨册。那麦理浩总督管辖的亚洲四小龙之一，才是本地文化信心的起源，才是国人更能懂得的香港。','Where is the source of Hong Kong culture\? Professor Xiao Si put Hong Kong\'s cultural history into the portfolio\, marked the end of the search in the 1970s\. In the 2018 Hong Kong Book Fair\, a set of four books on Xi Xi literature research was launched\. Perhaps\, one of the Four Asian Tigers under the management of Governor MacLehose is the origin of local cultural confidence\, and it is surely a better Hong Kong imagination that Chinese people could understand\.'],
    // la_105 : ['亲身经历，这十二年的中国互联网','China\'s Internet in 12 Years'],
    // la_106 : ['2018，节选','2018\, An excerpt'],
    la_107 : ['JavaScript数据可视化编程','JavaScript Shuju Keshihua Biancheng'],
    // la_108 : ['2009年，六度人脉理论及平台意识：校内网改名人人网。Web2\.0火。康盛创想发布UCenter Home，众多平台各自为战，最后的个人站长时代。','\<span class=\"tx_up\"\>2009\, Six-degree Network Theory And Platform Awareness\<\/span\>\: The Xiaonei\.com was known as China\'s Facebook\, which initially served only for student users\. This year\, it changed its product strategy\, like Facebook\, everyone can register and use it from now on\. At the same time\, it was renamed Renren\.com. In addition\, Web 2\.0 became popular this year\. Comsenz corporation\, which owns \"Discuz\!\"\, released the \"UCenter Home\" series\. Many platforms were fighting each other\, this is the last \"Personal webmaster\" era\.'],
    // la_109 : ['——UCenter Home（可集成于Discuz!X中）是中国个人站长时代最后一个可以凭个人或小团队力量部署的平台级Web2\.0社区产品，康盛创想提供包括主机托管、游戏平台在内的完整服务链条。次年，坐标北京上地环岛的康盛创想被腾讯收购，原CEO戴志康改任新成立的腾讯电商控股公司总经理。此后，运用个人力量搭建与巨头分羹的平台已经变得不可能。','— \"UCenter Home\"\, which can be integrated into Discuz\!X\, is the last platform-level social network service that can be deployed by individuals or start-up teams in China\'s personal webmaster era\. Comsenz corporation could provide virtual hosting and gaming platform support\. The following year\, Comsenz\, which located in Shangdi Beijing\, was acquired by Tencent\. The former CEO Dai Zhikang was appointed as the general manager of the newly established Tencent E-Commerce Holdings\. Since then\, it has become impossible for individuals to deploy a platform that has the ability to compete with giants\.'],
    // la_110 : ['2010年，网页游戏及跑马圈地：ActionScript3\.0的逻辑呈现分离为Adobe Flash带来最后的辉煌，而 ActionScript3\.0是网页游戏遍地开花的技术基础。开心网火，全民抢车位、开心农场等。腾讯收购康盛创想，将BBS作为精准投放的水平渠道，结合腾讯网的垂直渠道，实现了横纵两个方向的广告平台布局。海淀大街上的微博之战打响，腾讯微博大V刘翔于亚运会夺冠。','\<span class=\"tx_up\"\>2010\, Web Games And New Tracks\<\/span\>\: ActionScript 3\.0 physically separated the code from the animation\, it was the last shining of Adobe Flash\. Almost all of the popular webpage games this year were based on ActionScript 3\.0 technology\. These webpage games such as \"Parking Wars\" and \"Happy Farm\" were incredibly popular on Kaixin001\.com\. After the acquisition of Comsenz\, Tencent got a BBS ecosystem that could be used as an important advertising channel by aggregating users with interest\. With the influence of this BBS ecosystem and QQ\.com\, Tencent built a giant advertising platform\. In this year\, Sina (weibo\.com) and Tencent (t\.qq\.com) started the Weibo battle on Haidian Street\. Liu Xiang\, the biggest athlete star of Tencent Weibo\, won the championship in the Asian Games\.'],
    // la_111 : ['——如果你还记得腾讯微博，可能也记得官方服务号“腾讯薇薇”。蒲公英Logo正是出于薇薇之手。起初，腾讯微博的slogan是“与其在别处仰望，不如在这里并肩”。这个slogan是针对新浪微博的以大V为中心，忽视草根声音而提出。后改为“你的心声，世界的回声”，意为草根的声音也能在微博平台得到回应。','— If you still remember Tencent Weibo \(t\.qq\.com\)\, you may also remember an official service account \"Tencent WeiWei\" that owns a young lady\'s avatar\. Actually\, WeiWei is a visual designer of Tencent\, the Dandelion Logo of that product is designed by her\. In the beginning\, the slogan of Tencent Weibo was \<i\>\"It\’s better to be together here than to envy others elsewhere\.\"\<\/i\> Tencent Weibo believes that Sina Weibo pays too much attention to the key opinion leaders and ignores the voice of the general public\, so this slogan conveys the meaning that Tencent pays more attention to ordinary users\. Later\, Tencent Weibo\'s slogan was changed to \<i\>\"Your voice\, the echo of the world\"\<\/i\>\. This means that the voices of ordinary people can also be widely spread and responded\.'],
    la_112 : ['春运暖心日历：','SPRING FESTIVAL TRANSPORTATION CALENDAR: '],
    la_113 : ['这是一个和单向空间合作的运营页面。为了吸引用户互动，我们在产品中加入了一个对联游戏。除此以外，为了配合合作方的产品风格，我们在这个页面中设计了一些微动效。','This is a promotion webpage which cooperates with One-Way Street Bookstore\. It can be accessed via a link in DiDi\'s Mobile Client\. In order to attract users\, we added a traditional Chinese Couplet game into this page\.'],
    la_114 : ['滴滴顺风车运营活动','Promotion Webpages of DiDi Hitch'],
    la_115 : ['滴滴顺风车产品流程','Product Flow of DiDi Hitch'],
    la_116 : ['腾讯微博、微视','Tencent Weibo, Weishi'],
    la_117 : ['将视觉设计方案转换为以HTML、CSS、JavaScript构建的UI界面。应用BEM方法提升UI开发质量，改善团队工作流程。设计规范的创建和管理，响应式设计和带宽优化工作。','Responsible for creating user interfaces by frontend coding, PSD to HTML/CSS/JavaScript. Apply BEM methodology to improve coding quality, Web design guideline management. Responsive Web design, and bandwidth-oriented optimization work.']
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
            $('.f_langs .txt').text('简体中文');
            $('.contactform [name=_replyto]').attr('placeholder','Your Email');
            $('.contactform [name=message]').attr('placeholder','Message');
            $('body').removeClass('cn').addClass('en');
            $('#root').attr('lang','en');
            break;
        case "zh":
            /* 简体中文 */
            $('[data-lang]').each(function(){
              thislang = $(this).data('lang');
              $(this).html(eval('lang.' + thislang)[0]);
            });
            $('.f_langs .txt').text('English');
            $('.contactform [name=_replyto]').attr('placeholder','你的邮箱地址');
            $('.contactform [name=message]').attr('placeholder','邮件内容');
            $('body').removeClass('en').addClass('cn');
            $('#root').attr('lang','zh-cn');
            break;
        default:
            /* default no match */   
    }   
}

function handleSwitchlang(){
  if($('.f_langs:eq(0)').children('.txt').text() == 'English'){
    switchlang('en')
  }else{
    switchlang('zh')
  }
}
// language detection end

$(function(){
  checklang();

  $('.f_langs').click(function(){
    handleSwitchlang();
    return false;
  });
});