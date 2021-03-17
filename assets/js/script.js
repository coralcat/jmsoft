"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// helper functions
var MathUtils = {
  // map number x from range [a, b] to [c, d]
  map: function map(x, a, b, c, d) {
    return (x - a) * (d - c) / (b - a) + c;
  },
  // linear interpolation
  lerp: function lerp(a, b, n) {
    return (1 - n) * a + n * b;
  },
  // Random float
  getRandomFloat: function getRandomFloat(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
  }
}; // body element

var body = document.body; // calculate the viewport size

var winsize;

var calcWinsize = function calcWinsize() {
  return winsize = {
    width: window.innerWidth,
    height: window.innerHeight
  };
};

calcWinsize(); // and recalculate on resize

window.addEventListener('resize', calcWinsize); // scroll position

var docScroll; // for scroll speed calculation

var lastScroll;
var scrollingSpeed = 0; // scroll position update function

var getPageYScroll = function getPageYScroll() {
  return docScroll = window.pageYOffset || document.documentElement.scrollTop;
};

window.addEventListener('scroll', getPageYScroll);
/* =====================================================
   SmoothScroll
   ===================================================== */

var SmoothScroll = /*#__PURE__*/function () {
  function SmoothScroll() {
    var _this = this;

    _classCallCheck(this, SmoothScroll);

    // the <main> element
    this.DOM = {
      main: document.querySelector('main')
    }; // the scrollable element
    // we translate this element when scrolling (y-axis)

    this.DOM.scrollable = this.DOM.main.querySelector('div[data-scroll]'); // the items on the page

    this.items = [];
    this.DOM.content = this.DOM.main.querySelector('.content');

    _toConsumableArray(this.DOM.content.querySelectorAll('.content__item')).forEach(function (item) {
      return _this.items.push(new Item(item));
    }); // here we define which property will change as we scroll the page
    // in this case we will be translating on the y-axis
    // we interpolate between the previous and current value to achieve the smooth scrolling effect


    this.renderedStyles = {
      translationY: {
        // interpolated value
        previous: 0,
        // current value
        current: 0,
        // amount to interpolate
        ease: 0.1,
        // current value setter
        // in this case the value of the translation will be the same like the document scroll
        setValue: function setValue() {
          return docScroll;
        }
      }
    }; // set the body's height

    this.setSize(); // set the initial values

    this.update(); // the <main> element's style needs to be modified

    this.style(); // init/bind events

    this.initEvents(); // start the render loop

    requestAnimationFrame(function () {
      return _this.render();
    });
  }

  _createClass(SmoothScroll, [{
    key: "update",
    value: function update() {
      // sets the initial value (no interpolation) - translate the scroll value
      for (var key in this.renderedStyles) {
        this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
      } // translate the scrollable element


      this.layout();
    }
  }, {
    key: "layout",
    value: function layout() {
      this.DOM.scrollable.style.transform = "translate3d(0,".concat(-1 * this.renderedStyles.translationY.previous, "px,0)");
    }
  }, {
    key: "setSize",
    value: function setSize() {
      // set the heigh of the body in order to keep the scrollbar on the page
      body.style.height = "".concat(this.DOM.scrollable.scrollHeight, "px");
    }
  }, {
    key: "style",
    value: function style() {
      // the <main> needs to "stick" to the screen and not scroll
      // for that we set it to position fixed and overflow hidden
      this.DOM.main.style.position = 'fixed';
      this.DOM.main.style.width = this.DOM.main.style.height = '100%';
      this.DOM.main.style.top = this.DOM.main.style.left = 0;
      this.DOM.main.style.overflow = 'hidden';
    }
  }, {
    key: "initEvents",
    value: function initEvents() {
      var _this2 = this;

      // on resize reset the body's height
      window.addEventListener('resize', function () {
        return _this2.setSize();
      });
      window.addEventListener('click', function () {
        return _this2.setSize();
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      // Get scrolling speed
      // Update lastScroll
      scrollingSpeed = Math.abs(docScroll - lastScroll);
      lastScroll = docScroll; // update the current and interpolated values

      for (var key in this.renderedStyles) {
        this.renderedStyles[key].current = this.renderedStyles[key].setValue();
        this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].ease);
      } // and translate the scrollable element


      this.layout(); // for every item

      var _iterator = _createForOfIteratorHelper(this.items),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;

          // if the item is inside the viewport call it's render function
          // this will update item's styles, based on the document scroll value and the item's position on the viewport
          if (item.isVisible) {
            if (item.insideViewport) {
              item.render();
            } else {
              item.insideViewport = true;
              item.update();
            }
          } else {
            item.insideViewport = false;
          }
        } // loop..

      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      requestAnimationFrame(function () {
        return _this3.render();
      });
    }
  }]);

  return SmoothScroll;
}();
/***********************************/

/********** Preload stuff **********/
// Preload images


var preloadImages = function preloadImages() {
  return new Promise(function (resolve, reject) {
    imagesLoaded(document.querySelectorAll('.slide'), {
      background: true
    }, resolve);
  });
}; // And then..


preloadImages().then(function () {
  // Remove the loader
  document.body.classList.remove('loading'); // Get the scroll position and update the lastScroll variable

  getPageYScroll();
  lastScroll = docScroll; // Initialize the Smooth Scrolling

  new SmoothScroll();
});
/* =====================================================
   Scroll Menu
   ===================================================== */

var header;
var logo = document.querySelector('header .logo');
var hamburgerMenu = document.querySelectorAll('.hamburger-menu path');

function init() {
  header = document.querySelector("header");
  document.addEventListener("scroll", scrollMenu, false);
}

function scrollMenu() {
  if (document.documentElement.scrollTop > 50) {
    header.classList.add("scroll");
  } else {
    header.classList.remove("scroll");
  }
}

document.addEventListener("DOMContentLoaded", init, false);
/* =====================================================
   Menu Trigger & Image/Text Reveal Effects
   ===================================================== */

var sections = document.querySelectorAll('section');
var footer = document.querySelector('footer');
document.addEventListener('scroll', function () {
  sections.forEach(function (section) {
    if (document.documentElement.scrollTop >= section.offsetTop - 500) {
      section.style.opacity = '1';
    }
  });

  if (document.documentElement.scrollTop >= footer.offsetTop - 500) {
    footer.style.opacity = '1';
  }
});
sections.forEach(function (section) {
  if (document.documentElement.scrollTop >= section.offsetTop - 500) {
    section.style.opacity = '1';
  }
});
window.addEventListener('scroll', function () {
  var scrollLocation = document.documentElement.scrollTop; // 현재 스크롤바 위치

  var windowHeight = window.innerHeight; // 스크린 창

  var fullHeight = document.body.scrollHeight; //  margin 값은 포함 x

  var media = window.matchMedia('(min-width: 768px)');

  if (matchMedia('(min-width: 768px)').matches) {
    if (scrollLocation + windowHeight >= fullHeight - 100) {
      var _footer = document.querySelector('footer');

      _footer.style.opacity = "1";
    }
  }
});
/* =====================================================
   Tab Menu
   ===================================================== */

var tabMenus = document.querySelectorAll('.tabs li');
var tabContents = document.querySelectorAll('.tab-content > div');

var activeSection = function activeSection(e) {
  e.stopPropagation();

  var menuIndex = _toConsumableArray(tabMenus).indexOf(e.target);

  tabMenus.forEach(function (menu) {
    _toConsumableArray(tabMenus).indexOf(menu) === menuIndex ? menu.classList.add('active') : menu.classList.remove('active');
  });
  tabContents.forEach(function (content) {
    _toConsumableArray(tabContents).indexOf(content) === menuIndex ? content.classList.add('active') : content.classList.remove('active');
  });
};

if (tabMenus) {
  tabMenus.forEach(function (menu) {
    _toConsumableArray(tabMenus)[0].classList.add('active');

    _toConsumableArray(tabContents)[0].classList.add('active');

    menu.addEventListener('click', activeSection);
  });
}