// =======================
// Main JS - Language Detection & Switching
// =======================

import { langData } from 'https://designer.futurefriendly.cn/assets/js/langData.min.js';

// =======================
// 工具函数
// =======================

function detectBrowserLang() {
  const lang = (navigator.language || navigator.userLanguage || 'zh').substring(0,2).toLowerCase();
  return lang === 'en' ? 'en' : 'zh';
}

function setElementText(el, text) {
  if (el && text !== undefined) el.innerHTML = text;
}

function setPlaceholder(selector, text) {
  const el = document.querySelector(selector);
  if (el && text !== undefined) el.setAttribute('placeholder', text);
}

// =======================
// 切换语言
// =======================

function switchLang(langCode) {
  // 更新所有 data-lang 元素
  document.querySelectorAll('[data-lang]').forEach(el => {
    const key = el.getAttribute('data-lang');
    if (langData[key]) {
      setElementText(el, langCode === 'en' ? langData[key][1] : langData[key][0]);
    }
  });

  const langBtnTxt = document.querySelector('.f_langs .txt');

  if (langCode === 'en') {
    if (langBtnTxt) langBtnTxt.textContent = '简体中文';
    setPlaceholder('.contactform [name=_replyto]', 'Your Email');
    setPlaceholder('.contactform [name=message]', 'Message');
    document.body.classList.remove('cn');
    document.body.classList.add('en');
    const root = document.getElementById('root');
    if (root) root.setAttribute('lang','en');
  } else {
    if (langBtnTxt) langBtnTxt.textContent = 'English';
    setPlaceholder('.contactform [name=_replyto]', '你的邮箱地址');
    setPlaceholder('.contactform [name=message]', '邮件内容');
    document.body.classList.remove('en');
    document.body.classList.add('cn');
    const root = document.getElementById('root');
    if (root) root.setAttribute('lang','zh-cn');
  }
}

function handleLangToggle() {
  const isEnglish = document.body.classList.contains('en');
  switchLang(isEnglish ? 'zh' : 'en');
}

// =======================
// 初始化
// =======================

document.addEventListener('DOMContentLoaded', () => {
  switchLang(detectBrowserLang());

  const langBtn = document.querySelector('.f_langs');
  if (langBtn) {
    langBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLangToggle();
    });
  }
});
