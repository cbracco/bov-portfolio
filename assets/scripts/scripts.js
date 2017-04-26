// DOM ready function
function ready (fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

// On DOM ready,
ready(function () {
  // Initialize smoothScroll
  if (smoothScroll) {
    var menubarNav = document.querySelector('.js-menubar__nav');
    menubarNav.addEventListener('click', function (event) {
      if (event.target.hash) {
        smoothScroll.init(
          document.querySelector(event.target.hash),
          500,
          'easeInOutCubic'
        );
      }
    });
  }
});
