// ================================
// 语言检测 & 切换
// ================================

/** 初始化语言 */
function checkLang() {
  const baseLang = (navigator.language || navigator.userLanguage || "en")
    .substring(0, 2)
    .toLowerCase();

  switchLang(baseLang);
}

/**
 * 切换语言
 * @param {string} langCode - "zh" 或 "en"
 */
function switchLang(langCode) {
  const langMap = {
    la_1: ["我擅长的领域", "Overview"],
    la_3: ["技术图书翻译", "Translation"],
    la_5: ["设计规范建设", "Design System"],
    la_6: ["交互原型设计", "Interaction Design"],
    la_7: ["交互动效设计", "Motion Design"],
    la_8: ["网站设计制作", "Make Websites"],
    la_9: ["设计工具开发", "Build Tools"],
    la_10: ["我的联系方式", "Get in Touch"],
    la_11: ["Dongfang", "Dongfang"],
    la_12: [
      "你好！欢迎并感谢莅临本网页。我是一名语文教育和互联网行业的从业者，曾供职清华附中、滴滴出行、腾讯等，常住北京。",
      "Welcome! This is a craftsman living in Beijing. He used to work for Tsinghua University High School, DiDi Chuxing, and Tencent."
    ],
    la_13: ["我乐于为个人或组织提供以下帮助：", "I'm glad to provide you with the following helps:"],
    la_14: ["一、为基于iOS或Android平台的移动应用做交互设计。", "1) Interaction design for mobile application;"],
    la_15: ["二、响应式网站设计。", "2) Design consultation of making a responsive website;"],
    la_16: ["三、技术翻译或文学翻译（英译中）。", "3) Technical translation, from English to Chinese;"],
    la_17: ["四、简体和繁體中文的软件本地化工作。", "4) Chinese localization copywriting, Simplified or Traditional."],
    // ……省略部分，保持你的原始结构……
    la_95: [
      "版权 &copy;2011-2021 by futurefriendly.cn, 保留所有权利，包括以任何形式复制本网站或其中部分内容的权利。有关信息，请咨询内容发布者。",
      "Copyright &copy;2011 - 2022 by futurefriendly.cn, all rights reserved, including the right to reproduce this site or portions thereof in any form whatsoever. For information, address the content publisher."
    ]
  };

  const idx = langCode === "zh" ? 0 : 1;

  Object.keys(langMap).forEach(key => {
    const el = document.getElementById(key);
    if (el) {
      el.innerHTML = langMap[key][idx];
    }
  });
}

// 页面加载时执行语言检测
document.addEventListener("DOMContentLoaded", checkLang);