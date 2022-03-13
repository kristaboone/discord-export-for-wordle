// =================================================================
// dew.js : Discord Export for Wordle
// Krista Boone
// 3/13/2022
//
// Details:
// Edit the share button on Wordle so that the player's guesses
// are exported in spoiler-hidden text alongside the emoji icons.
// =================================================================
const app = document.querySelector("game-app");
const gameManager = app.shadowRoot.querySelector("game-theme-manager")

// The game modal will contain "game-stats" once the modal is opened
const modalNode = gameManager.querySelector("game-modal")

function getGuess(guessNumber) {
    if(guessNumber > 6 || guessNumber < 1) {
        throw "Invalid guess number passed to getGuess(). Must be between 1-6 (inclusive)."
    }

    const index = guessNumber - 1
    const gameRows = gameManager.getElementsByTagName("game-row")
    return gameRows[index].getAttributeNode("letters").textContent
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

// Executed when the share button is clicked
function onShareClicked() {
    // Pause while the default callback fills the clipboard
    // A little janky, yes, but it does the trick.
    setTimeout(function() { navigator.clipboard.readText()
        .then(clipText => editShareText(clipText))}, 500);
}

// Callback for when mutation of the game modal is observed
const mutationObserverCallback = function (mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
        if (mutation.type === 'attributes') {
            if (mutation.attributeName === 'open') {
                // Try to access the stats whenever available
                if (modalNode.hasAttribute('open')) {
                    const stats = modalNode.querySelector("game-stats").shadowRoot
                    const shareButton = stats.getElementById("share-button")

                    // If available to share...
                    if(shareButton) {
                        shareButton.onclick = onShareClicked    
                    }
                }
            }
        }
    }
};

// Options for the mutation observer
const config = { attributes: true }

// Create an observer instance linked to the callback function
const observer = new MutationObserver(mutationObserverCallback);

// Start observing the target node for configured mutations
observer.observe(modalNode, config);
