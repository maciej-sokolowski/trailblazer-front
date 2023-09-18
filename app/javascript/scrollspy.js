import ScrollMagic from 'scrollmagic';

export function rightTOCScrollSpy() {
  var controller = new ScrollMagic.Controller();
  var documentationContainer = document.querySelector('#documentation');
  var calloutSection = document.querySelector('#callout-section');
  var relativeDocumentationHeight = documentationContainer.offsetHeight - calloutSection.offsetHeight - 210;
  var leftSidebarLinks = document.querySelectorAll('#sideNav a[href^="#"]');

  leftSidebarLinks.forEach(function (anchor, index) {
    var headerAnchor = anchor.getAttribute('href').split('#')[1];
    var tocElement = `#right-toc-${headerAnchor}`;

    // Make respective TOC visible as per the active header
    var scene = new ScrollMagic.Scene({
      triggerElement: `#${headerAnchor}`,
      // Stick first TOC once first header is visible in DOM (onEnter - 100px)
      // For remaining headers, stick it's TOC once it's header is scrolled to the top of screen (onLeave - 100px)
      triggerHook: index === 0 ? 'onEnter' : 'onLeave',
      offset: -100
    })
      .setClassToggle(tocElement, 'xl:block')
      .addTo(controller);

    // Make TOC position fixed once it's header is scrolled to the top of screen till the end of documentation
    scene.on('enter', function () {
      new ScrollMagic.Scene({
        offset: 100,
        duration: relativeDocumentationHeight
      })
        .setClassToggle(tocElement, 'xl:fixed')
        .addTo(controller);
    });
  });
}

export function tocLinkScrollSpy(tocId, headerSelector, activeClass) {
  var controller = new ScrollMagic.Controller();
  var headers = document.querySelectorAll(headerSelector);
  var scenes = [];

  function getLinkHref(headerId) {
    return `${tocId} a[href="${headerId}"]`;
  }

  function togglePreviousScene(event, index) {
    if (scenes[index - 1]) {
      var headerId = `#${headers[index - 1].getAttribute('id')}`;

      if (event.scrollDirection === 'FORWARD') {
        document.querySelector(getLinkHref(headerId)).classList.remove(activeClass);
      } else {
        document.querySelector(getLinkHref(headerId)).classList.add(activeClass);
      }
    }
  }

  headers.forEach(function (header, index) {
    var headerId = `#${header.getAttribute('id')}`;

    var scene = new ScrollMagic.Scene({
      triggerElement: headerId,
      triggerHook: '0.2'
    })
      .setClassToggle(getLinkHref(headerId), activeClass)
      .addTo(controller)
      .on('progress', function (event) {
        togglePreviousScene(event, index);
      });

    scenes.push(scene);
  });
}

export default {
  init() {
    rightTOCScrollSpy();
    tocLinkScrollSpy('#sideNav', '#documentation h2', 'xl:bg-selected');
    tocLinkScrollSpy('#right-toc', '#documentation h3, #documentation h4', 'xl:bg-bg-orange');
  }
};
