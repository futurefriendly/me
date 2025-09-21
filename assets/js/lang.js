// =======================
// Main JS - Language Detection & Switching
// =======================

import { langData } from 'https://designer.futurefriendly.cn/assets/js/langData.min.js';

// =======================
// 缓存 DOM 元素
// =======================
const dataLangElements = Array.from(document.querySelectorAll('[data-lang]'));
const langBtnTxtElements = Array.from(document.querySelectorAll('.f_langs .txt'));
const replyInput = document.querySelector('.contactform [name=_replyto]');
const messageInput = document.querySelector('.contactform [name=message]');
const rootEl = document.getElementById('root');
const bodyEl = document.body;

// =======================
// 工具函数
// =======================
function detectBrowserLang() {
  const lang = (navigator.language || navigator.userLanguage || 'zh').substring(0,2).toLowerCase();
  return lang === 'en' ? 'en' : 'zh';
}

function setElementText(el, text) {
  if (el && text !== undefined && el.innerHTML !== text) {
    el.innerHTML = text;
  }
}

function setPlaceholder(el, text) {
  if (el && text !== undefined && el.placeholder !== text) {
    el.setAttribute('placeholder', text);
  }
}

// =======================
// 切换语言
// =======================
function switchLang(langCode) {
  const isEnglish = langCode === 'en';

  // 更新 data-lang 元素，只修改不同文本
  dataLangElements.forEach(el => {
    const key = el.getAttribute('data-lang');
    if (langData[key]) {
      const newText = isEnglish ? langData[key][1] : langData[key][0];
      setElementText(el, newText);
    }
  });

  // 更新语言切换按钮，只修改不同文本
  const btnText = isEnglish ? '简体中文' : 'English';
  langBtnTxtElements.forEach(el => {
    if (el.textContent !== btnText) {
      el.textContent = btnText;
    }
  });

  // 更新占位符，只修改不同文本
  setPlaceholder(replyInput, isEnglish ? 'Your Email' : '你的邮箱地址');
  setPlaceholder(messageInput, isEnglish ? 'Message' : '邮件内容');

  // 更新 body / root 类和属性
  if (isEnglish) {
    if (!bodyEl.classList.contains('en')) bodyEl.classList.add('en');
    bodyEl.classList.remove('cn');
  } else {
    if (!bodyEl.classList.contains('cn')) bodyEl.classList.add('cn');
    bodyEl.classList.remove('en');
  }

  if (rootEl) {
    const newLang = isEnglish ? 'en' : 'zh-cn';
    if (rootEl.getAttribute('lang') !== newLang) {
      rootEl.setAttribute('lang', newLang);
    }
  }
}

// =======================
// 语言切换按钮点击处理
// =======================
function handleLangToggle() {
  switchLang(bodyEl.classList.contains('en') ? 'zh' : 'en');
}

// =======================
// 初始化
// =======================
document.addEventListener('DOMContentLoaded', () => {
  switchLang(detectBrowserLang());

  // 给所有语言切换按钮绑定事件
  document.querySelectorAll('.f_langs').forEach(langBtn => {
    langBtn.addEventListener('click', e => {
      e.preventDefault();
      handleLangToggle();
    });
  });
});