// =================================================================
// Save/Load options for the extension

// =================================================================
// Identify the browser type to ensure proper syntax and usage
// is implemented for settings.
//
// CONTRIBUTING NOTE:
// If you change code in this file, please update browsertype.js
// to contain the same syntax. Because we can not guarantee
// browsertype.js is loaded before options.js we must redefine
// the same variables...
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';
// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
const useBrowserSyntax = isFirefox || isSafari;

if (useBrowserSyntax) {
  function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
      useLowercase: document.querySelector("#useLowercase").checked,
      spoilLastWord: document.querySelector("#spoilLastWord").checked
    });
  }

  function restoreOptions() {
    function setCurrentChoiceULC(result) {
      document.querySelector("#useLowercase").checked = result.useLowercase || false;
    }
    function setCurrentChoiceSLW(result) {
      document.querySelector("#spoilLastWord").checked = result.spoilLastWord || false;
    }
    function onError(error) {
      console.log(`Error: ${error}`);
    }

    let getLower = browser.storage.sync.get("useLowercase");
    getLower.then(setCurrentChoiceULC, onError);

    let getSpoil = browser.storage.sync.get("spoilLastWord");
    getSpoil.then(setCurrentChoiceSLW, onError);
  }
  
} else {
  function saveOptions(e) {
    e.preventDefault();
    chrome.storage.sync.set({
      useLowercase: document.querySelector("#useLowercase").checked,
      spoilLastWord: document.querySelector("#spoilLastWord").checked
    });
  }

  function restoreOptions() {
    chrome.storage.sync.get({
      useLowercase: false,
      spoilLastWord: false
    }, function (items) {
      document.querySelector('#useLowercase').checked = items.useLowercase;
      document.querySelector('#spoilLastWord').checked = items.spoilLastWord;
    });
  }
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
