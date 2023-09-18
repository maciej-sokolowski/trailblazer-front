import hljs from 'highlight.js/lib/core';
import ruby from 'highlight.js/lib/languages/ruby';
import anchorJS from 'anchor-js';

import ScrollSpy from 'scrollspy';
import 'navigations';

document.addEventListener('DOMContentLoaded', function () {
  hljs.registerLanguage('ruby', ruby);
  hljs.highlightAll();

  ScrollSpy.init();

  var anchors = new anchorJS();
  anchors.add('h2, h3, h4');
});
