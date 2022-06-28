// =================================================================
// Defines the user settings available in DEW extension.
var USER_SETTINGS = {
    useLowercase: false,
    spoilLastWord: false
};

// ================================================================= 
// Define functions and setup using 'browser' syntax and
// promise format for Safari and Firefox.
function onGotUseLowercaseFormSetting(item) {
    if (item.useLowercase !== undefined) {
        console.log("(DEW) Found user setting for item.useLowercase=", item.useLowercase)
        USER_SETTINGS.useLowercase = item.useLowercase;
    }
    console.log("(DEW) Using useLowercase value=", USER_SETTINGS.useLowercase)
}
function onGotSpoilLastWordFormSetting(item) {
    if (item.spoilLastWord !== undefined) {
        console.log("(DEW) Found user setting for item.spoilLastWord=", item.spoilLastWord)
        USER_SETTINGS.spoilLastWord = item.spoilLastWord;
    }
    console.log("(DEW) Using spoilLastWord value=", USER_SETTINGS.spoilLastWord)
}

if (useBrowserSyntax) {
    console.log("(DEW) Found Firefox or Safari...")   
    
    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let useLowercaseFormSetting = browser.storage.sync.get("useLowercase");
    useLowercaseFormSetting.then(onGotUseLowercaseFormSetting, onError);

    let spoilLastWordFormSetting = browser.storage.sync.get("spoilLastWord");
    spoilLastWordFormSetting.then(onGotSpoilLastWordFormSetting, onError);
}
// ================================================================= 
// Define functions and setup using 'chrome' syntax 
// for Chrome, Edge, Opera, etc.
else {
    console.log("(DEW) Found Chrome or similar browser...")
    chrome.storage.sync.get(['useLowercase'], onGotUseLowercaseFormSetting);    
    chrome.storage.sync.get(['spoilLastWord'], onGotSpoilLastWordFormSetting);
}