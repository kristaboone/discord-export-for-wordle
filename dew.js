// =================================================================
// dew.js : Discord Export for Wordle
// Krista Boone
// 3/13/2022
//
// Details:
// Edit the share button on Wordle so that the player's guesses
// are exported in spoiler-hidden text alongside the emoji icons.
// =================================================================
const app = document.querySelector("#wordle-app-game");

function getGuess(guessNumber) {
    if(guessNumber > 6 || guessNumber < 1) {
        throw "Invalid guess number passed to getGuess(). Must be between 1-6 (inclusive)."
    }

    const index = guessNumber - 1
    const gameRows = app.querySelectorAll('[class^="Row-module_row_"]')
    return gameRows[index].textContent.toUpperCase()
}

// Edit the text from the share button export so that the 
// player's guesses are appended to each row.
function editShareText(originalClipText) {
    // Split each row
    const lines = originalClipText.split(/\r\n|\r|\n/)
    let newText = ""

    for(var i = 0; i < lines.length; ++i) {
        newText += lines[i]

        // Lines 2-n will be guesses
        if (i > 1 && i != lines.length-1) {
            var guessNumber = i - 1
            var guessText = getGuess(guessNumber)
            if(guessText === "") {
                throw "ERROR"
            }

            newText += " ||`" + guessText + "`||"
        }

        newText += "\n"
    } 
    
    // Write new text to clipboard
    navigator.clipboard.writeText(newText)
}

// Add a secondary share button for DEW
function addDewButton(shareButton) {
    var dewButton = shareButton.cloneNode(true);
    dewButton.textContent = "Discord";
    dewButton.setAttribute("style", "background: #5865F2");
    dewButton.addEventListener('click', event => {
        // Do not let the event bubble up to the parent
        event.preventDefault();
        event.stopPropagation();

        // Execute the normal share logic to fill the clipboard
        shareButton.click();

        // Pause while the default callback fills the clipboard
        // A little janky, yes, but it does the trick.
        setTimeout(function() { navigator.clipboard.readText()
            .then(clipText => editShareText(clipText))}, 500);
    });

    shareButton.parentElement.append(dewButton);
}

// Callback for when mutation of the app element is observed
const mutationObserverCallback = function (mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            for (const node of mutation.addedNodes) {
                // Add our custom button next to the share button
                var shareButton = node.querySelector("#share-button");
                if (shareButton) {
                    addDewButton(shareButton);
                }
            }
        }
    }
};

// Options for the mutation observer
const config = { childList: true }

// Create an observer instance linked to the callback function
const observer = new MutationObserver(mutationObserverCallback);

// Start observing the target node for configured mutations
observer.observe(app, config);
