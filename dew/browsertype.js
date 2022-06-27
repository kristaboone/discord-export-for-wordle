// =================================================================
// Identify the browser type to ensure proper syntax and usage
// is implemented for settings.
//
// CONTRIBUTING NOTE:
// If you change code in this file, please update options.js
// to contain the same syntax. Because we can not guarantee
// browsertype.js is loaded before options.js we must redefine
// the same variables...

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';
// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
const useBrowserSyntax = isFirefox || isSafari;