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
	dewButton.style.marginLeft = "5px";
	addDiscordIcon(dewButton);
	
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

// Add discord icon to DEW button.
// SVG path data from https://icons.getbootstrap.com/icons/discord/
function addDiscordIcon(dewButton) {
	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
	svg.setAttribute('fill', 'currentColor');
	svg.setAttribute('viewBox', "0 0 16 16");
	svg.style.marginLeft = "8px";
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	
	var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
	path.setAttribute("d","M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"); //Set path's data	
	svg.appendChild(path);
	
	dewButton.appendChild(svg);
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
