async function scan_tab(){
    result = await chrome.storage.sync.get(['websiteArray', 'blockMode'])
    blockedWebsites = result.websiteArray || []
    // Default to blacklist if nothing is saved
    const currentMode = result.blockMode || 'blacklist'
    console.log(blockedWebsites);
    // Grab current tab's URL
    const currentURL = window.location.href
    console.log("User currently on " + currentURL)

    const parsedURL = new URL(currentURL)
    // Get domain AND pathname
    let currentCleanedURL = parsedURL.hostname.replace(/^www\./, '') + parsedURL.pathname
    
    if (currentCleanedURL.endsWith('/')) {
        currentCleanedURL = currentCleanedURL.slice(0, -1);
    }

    let isMatch = blockedWebsites.some(savedSite => {
        return currentCleanedURL === savedSite || currentCleanedURL.startsWith(savedSite + "/");
    });

    let shouldBlock = false; 
    if (currentMode === 'blacklist'){
        if (isMatch){
            shouldBlock = true;
        }
    }

    else if (currentMode === 'whitelist'){
        if (!isMatch && currentCleanedURL !== "") {
            shouldBlock = true
        }
    }
    
    if (shouldBlock){
        enforceBlock()
    }
    
    else {
        console.log("Site is safe!")
    }

}

function enforceBlock(){
    const blockPageURL = chrome.runtime.getURL("blocked.html");
    window.location.replace(blockPageURL)
}

scan_tab()