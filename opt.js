function autoSave(){ // Runs on any instance of putting text in Add Website box or pressing Remove Website
    var websiteArray = [];
    const allChildren = document.querySelectorAll('.input');
    for (var i = 0; i < allChildren.length; i++){
        let rawInput = allChildren[i].value.trim()
        
        if (rawInput !== "") {  // Add check for empty string
            let urlString;
            try {
                // Add http/https if not already, for URL object to parse correctly
                if (rawInput.startsWith('http')){
                    urlString = rawInput;
                }
                else{
                    urlString = 'https://' + rawInput;
                }
                // Keep domain AND specific page path for more specific blocking of pagess
                let parsedURL = new URL(urlString);
                let cleanURL = parsedURL.hostname.replace(/^www\./, '') + parsedURL.pathname;

                // Remove trailing slash
                if (cleanURL.endsWith('/')){
                    cleanURL = cleanURL.slice(0, -1)
                }

                websiteArray.push(cleanURL)
            }
            catch(e){
                // Fallback if something they typed breaks the URL parser
                websiteArray.push(rawInput)
            }
        }
    }

    let selectedMode = 'blacklist';
    const modeRadios = document.querySelectorAll('.mode-radio');
    // Collect selectedMode (loop will run a max of 2 times)
    for (var j = 0; j < modeRadios.length; j++){
        if (modeRadios[j].checked){
            selectedMode = modeRadios[j].value;
            break;
        }
    }
    
    chrome.storage.sync.set({'websiteArray': websiteArray, 'blockMode': selectedMode});
    console.log(websiteArray);
}

async function restore_options(){ // Restores previous options by the user (auto saved)
    const result = await chrome.storage.sync.get(['websiteArray', 'blockMode']);
    const allChildren = result.websiteArray || [];
    websiteHolder = document.querySelector('.website-holder');

    // Update the saved mode from blacklist/whitelist
    const savedMode = result.blockMode || 'blacklist'; 
    if (savedMode === 'whitelist') {
        document.getElementById('whitelist').checked = true;
    } else {
        document.getElementById('blacklist').checked = true;
    }

    // Restore all pages that the user saved previously
    for (var i = 0; i < allChildren.length; i++){
        newRow = document.createElement('div');
        newRow.className = 'input-website';
        newRow.innerHTML = `<label>Website</label>
        <input class='input' type="text" value="" placeholder="Website URL"/>
        <button class='remove-website'>Remove Website</button>`;
        newRow.querySelector('.input').value = allChildren[i];
        
        // FIX B: Listen for changes on old/restored input boxes
        newRow.querySelector('.input').addEventListener('change', autoSave);
        
        removeButton = newRow.querySelector('.remove-website');
        removeButton.addEventListener('click', removeWebsite);
        websiteHolder.appendChild(newRow);
    }
    updateButtonState();
}

function removeWebsite(){ // Applies on pressing Remove Website button
    this.parentNode.remove();
    autoSave();
    updateButtonState();
}
    
function createWebsite(){ // Applies on pressing Add Website button
    var newRow = document.createElement('div');
    newRow.className = 'input-website';
    newRow.innerHTML = `<label>Website</label>
    <input class='input' type="text" value="" placeholder="Website URL"/>
    <button class='remove-website'>Remove Website</button>`;
    document.querySelector('.website-holder').appendChild(newRow);

    newRow.querySelector('.input').addEventListener('change', autoSave);
    const removeButton = newRow.querySelector('.remove-website');
    removeButton.addEventListener('click', removeWebsite);
    updateButtonState();
}

function updateButtonState() {
    const addButton = document.querySelector('.add-website');
    const websiteCount = document.querySelectorAll('.input-website').length;
    const LIMIT = 200;
    const WARNING_THRESHOLD = 150;

    if (websiteCount >= LIMIT) {
        addButton.disabled = true;
        addButton.style.opacity = "0.5";
        addButton.style.cursor = "not-allowed";
        addButton.textContent = "Add Website (Limit Reached)";
    } else if (websiteCount >= WARNING_THRESHOLD) {
        addButton.disabled = false;
        addButton.style.opacity = "1";
        addButton.style.cursor = "pointer";
        addButton.textContent = `Add Website (${LIMIT - websiteCount} Remaining)`;
    } else {
        addButton.disabled = false;
        addButton.style.opacity = "1";
        addButton.style.cursor = "pointer";
        addButton.textContent = "+ Add Website";
    }
}

/// Adds eventListener to the Add Website button
document.querySelector('.add-website').addEventListener('click', createWebsite);

// Restore options upon reloading of the extension
document.addEventListener('DOMContentLoaded', () => {
    restore_options();
    
    // Listen for clicks on the Blacklist/Whitelist buttons
    const modeRadios = document.querySelectorAll('.mode-radio');
    for (var i = 0; i < modeRadios.length; i++) {
        modeRadios[i].addEventListener('change', autoSave);
    }
});




// // Temporary Clear all websites button for dev use
// document.querySelector('.clear-all-btn').addEventListener('click', () => {
//     chrome.storage.sync.clear(() => {
//         console.log("Storage wiped!");
//         location.reload(); // Automatically refreshes the page
//     });
// });