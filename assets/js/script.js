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
  const seccount = $("section").length;
  for (let i = 0; i < seccount; i++) {
    sectionOffset[i] = Math.floor($("section").eq(i).offset().top);
  }
}

// ================================
// 滚动处理
// ================================
export function onScroll() {
  scrollPos = Math.floor($(document).scrollTop());

  $("body").toggleClass("scroll", scrollPos > 290);

  if (scrollPos > sectionOffset[2]) {
    $("body").addClass("f_dark_bg");
  } else {
    $("body").removeClass("f_dark_bg");
  }
  if (scrollPos > sectionOffset[4]) {
    $("body").removeClass("f_dark_bg");
  }
  if (scrollPos > sectionOffset[7]) {
    $("body").addClass("f_dark_bg");
  }
  if (scrollPos > sectionOffset[8]) {
    $("body").removeClass("f_dark_bg");
  }

  documentH = $(document).height();
  pct = 100 - (scrollPos / documentH) * 100 + "%";
  $("#loadbar").css("transform", `translateX(-${pct})`);
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
  $("html").removeClass("f_font14 f_font16 f_font18").addClass("f_font" + n);

  const children = document.getElementById("option_txtsize").childNodes;
  children.forEach(child => {
    if (child.style) child.style.textDecoration = "none";
  });

  o.style.textDecoration = "underline";
  secHeight();
}

// ================================
// 初始化 OwlCarousel
// ================================
export function initCarousel(selector, options) {
  $(selector).owlCarousel(
    Object.assign(
      {
        autoplay: false,
        smartSpeed: 250,
        lazyLoad: true,
        margin: 20,
      },
      options
    )
  );
}

// ================================
// 页面初始化
// ================================
export function initPage() {
  secHeight();
  $("nav").show();

  $("nav a").on(tapend, secHeight);

  $(".f_play").on(tapend, function () {
    $(this).attr("target", windowW > 1239 ? "h5stage" : "_blank");
  });

  $(".f_display").on(tapend, function () {
    $("#scene .layer").remove();
    $("#showexp").css("opacity", "1")[0].play();
  });

  $(".f_expand").on(tapend, function () {
    $(this).parents(".f_sm").hide().siblings(".hid").show();
  });

  initCarousel(".f_owl-carousel_map", {
    loop: false,
    responsive: { 0: { items: 1 }, 480: { items: 1 } },
  });

  initCarousel(".f_owl-carousel_designsystem", {
    loop: true,
    responsive: { 0: { items: 1 }, 800: { items: 2 } },
  });

  initCarousel(".f_owl-carousel_pku", {
    loop: false,
    responsive: { 0: { items: 1 }, 480: { items: 1 } },
  });

  initCarousel(".f_owl-carousel_ufo", {
    loop: true,
    responsive: { 0: { items: 2 }, 600: { items: 3 } },
  });

  initCarousel(".f_owl-carousel_wb", {
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    loop: true,
    responsive: { 0: { items: 1 }, 800: { items: 2 } },
  });

  initCarousel(".f_owl-carousel_dd", {
    smartSpeed: 100,
    loop: true,
    responsive: { 0: { items: 2 }, 800: { items: 4 }, 1240: { items: 5 } },
  });

  $("#h5stage").attr(
    "src",
    "https://www.futurefriendly.cn/ds/page/invitation2016.html"
  );

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
  const scroll = new SmoothScroll('a[href*="#"]', { speed: 1000 });
}

// ================================
// 自动初始化
// ================================
$(document).ready(() => {
  initPage();
});
