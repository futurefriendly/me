// ================================
// 触控检测 & 点击事件类型
// ================================
export const hasTouch = "ontouchstart" in window;
export const tapend = hasTouch ? "touchend" : "click";

// ================================
// 全局变量
// ================================
export let scrollPos = 0;
export let windowH = $(window).height();
export let windowW = $(window).width();
export let documentH = 0;
export let pct = 0;
export const sectionOffset = [];

// 缓存常用 DOM 元素
const bodyEl = $("body");
const loadBarEl = $("#loadbar");
const sections = $("section");
const navEl = $("nav");
const optionTxtsizeEl = document.getElementById("option_txtsize");

// ================================
// 工具函数: requestAnimationFrame 节流
// ================================
export function rafThrottle(fn) {
  let ticking = false;
  return function (...args) {
    if (!ticking) {
      requestAnimationFrame(() => {
        fn.apply(this, args);
        ticking = false;
      });
      ticking = true;
    }
  };
}

// ================================
// 初始化 Section 高度
// ================================
export function secHeight() {
  sections.each((i, el) => {
    sectionOffset[i] = Math.floor($(el).offset().top);
  });
}

// ================================
// 滚动处理
// ================================
export function onScroll() {
  scrollPos = Math.floor($(document).scrollTop());

  bodyEl.toggleClass("scroll", scrollPos > 290);

  // 减少重复操作，只操作必要 class
  if (scrollPos > sectionOffset[2]) bodyEl.addClass("f_dark_bg");
  else if (scrollPos <= sectionOffset[2]) bodyEl.removeClass("f_dark_bg");

  if (scrollPos > sectionOffset[4]) bodyEl.removeClass("f_dark_bg");
  if (scrollPos > sectionOffset[7]) bodyEl.addClass("f_dark_bg");
  if (scrollPos > sectionOffset[8]) bodyEl.removeClass("f_dark_bg");

  documentH = $(document).height();
  pct = 100 - (scrollPos / documentH) * 100 + "%";

  loadBarEl.css("transform", `translateX(-${pct})`);
}

// ================================
// 窗口尺寸变化处理
// ================================
export function onResize() {
  secHeight();
  windowH = $(window).height();
  windowW = $(window).width();
}

// ================================
// 字号切换
// ================================
export function textsize(n, o) {
  const htmlEl = $("html");
  htmlEl.removeClass("f_font14 f_font16 f_font18").addClass("f_font" + n);

  if (optionTxtsizeEl) {
    optionTxtsizeEl.childNodes.forEach(child => {
      if (child.style) child.style.textDecoration = "none";
    });
  }

  if (o && o.style) o.style.textDecoration = "underline";

  secHeight();
}

// ================================
// 初始化 OwlCarousel
// ================================
export function initCarousel(selector, options) {
  const defaultOptions = {
    autoplay: false,
    smartSpeed: 250,
    lazyLoad: true,
    margin: 20,
  };
  $(selector).owlCarousel(Object.assign(defaultOptions, options));
}

// ================================
// 页面初始化
// ================================
export function initPage() {
  secHeight();
  navEl.show();

  navEl.find("a").on(tapend, secHeight);

  $(".f_play").on(tapend, function () {
    $(this).attr("target", windowW > 1239 ? "h5stage" : "_blank");
  });

  $(".f_display").on(tapend, function () {
    $("#scene .layer").remove();
    const showexp = $("#showexp")[0];
    if (showexp) {
      $("#showexp").css("opacity", "1");
      showexp.play();
    }
  });

  $(".f_expand").on(tapend, function () {
    $(this).closest(".f_sm").hide().siblings(".hid").show();
  });

  // 批量初始化 OwlCarousel
  const carousels = [
    { selector: ".f_owl-carousel_map", options: { loop: false, responsive: { 0: { items: 1 }, 480: { items: 1 } } } },
    { selector: ".f_owl-carousel_designsystem", options: { loop: true, responsive: { 0: { items: 1 }, 800: { items: 2 } } } },
    { selector: ".f_owl-carousel_pku", options: { loop: false, responsive: { 0: { items: 1 }, 480: { items: 1 } } } },
    { selector: ".f_owl-carousel_ufo", options: { loop: true, responsive: { 0: { items: 2 }, 600: { items: 3 } } } },
    { selector: ".f_owl-carousel_wb", options: { autoplay: true, autoplayTimeout: 3000, autoplayHoverPause: true, loop: true, responsive: { 0: { items: 1 }, 800: { items: 2 } } } },
    { selector: ".f_owl-carousel_dd", options: { smartSpeed: 100, loop: true, responsive: { 0: { items: 2 }, 800: { items: 4 }, 1240: { items: 5 } } } },
  ];

  carousels.forEach(c => initCarousel(c.selector, c.options));

  $("#h5stage").attr("src", "https://www.futurefriendly.cn/ds/page/invitation2016.html");

  // ================================
  // 统一窗口事件绑定
  // ================================
  $(window).on("scroll", rafThrottle(onScroll));
  $(window).on("resize", rafThrottle(onResize));
  $(window).on("load", () => {
    onScroll();
    onResize();
  });

  // ================================
  // 平滑滚动
  // ================================
  new SmoothScroll('a[href*="#"]', { speed: 1000 });
}

// ================================
// 自动初始化
// ================================
$(document).ready(() => {
  initPage();
});
