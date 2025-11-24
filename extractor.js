// Content extractor script - paste this in browser console of the opened page
(function() {
  window.addEventListener('message', function(event) {
    if (event.data?.type === 'EXTRACT_HTML') {
      const html = document.documentElement.outerHTML;
      event.source.postMessage({
        type: 'HTML_EXTRACTED',
        html: html
      }, event.data.origin);
    }
  });
})();