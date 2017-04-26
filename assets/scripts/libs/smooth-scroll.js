/**
 * SMOOTH-SCROLL NAVIGATION
 * @author Chris Bracco
 */

var smoothScroll = (function () {

  // STRICT MODE
  'use strict';

  // DEFINE EASING CONSTANTS
  var easings = {
    linear(t) {
      return t;
    },
    easeInQuad(t) {
      return t * t;
    },
    easeOutQuad(t) {
      return t * (2 - t);
    },
    easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic(t) {
      return t * t * t;
    },
    easeOutCubic(t) {
      return (--t) * t * t + 1;
    },
    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart(t) {
      return t * t * t * t;
    },
    easeOutQuart(t) {
      return 1 - (--t) * t * t * t;
    },
    easeInOutQuart(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    },
    easeInQuint(t) {
      return t * t * t * t * t;
    },
    easeOutQuint(t) {
      return 1 + (--t) * t * t * t * t;
    },
    easeInOutQuint(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }
  };

  //
  // PUBLIC METHODS
  //
  function init (destination, duration, easing, callback) {
    // Get/Set defaults
    var start = window.pageYOffset;
    var startTime = 'now' in window.performance ? performance.now() : new Date.getTime();
    var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    var destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
    var destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

    // If requestAnimationFrame is not supported, do a simple scroll
    if ('requestAnimationFrame' in window === false) {
      window.scroll(0, destinationOffsetToScroll);
      if (callback) {
        callback();
      }
      return;
    }

    // Scrolling function
    var scroll = function () {
      // Get/Set defaults
      var now = 'now' in window.performance ? performance.now() : new Date.getTime();
      var time = Math.min(1, ((now - startTime) / duration));
      var timeFunction = easing ? easings[easing](time) : easings['linear'];
      // Scroll the window
      window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));
      if (window.pageYOffset === destinationOffsetToScroll) {
        if (callback) {
          callback();
        }
        return;
      }
      requestAnimationFrame(scroll);
    }

    scroll();
  }

  //
  // EXPOSE PUBLIC METHODS
  //
  return {
    init: init
  }

})();
