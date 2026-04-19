const LIMIT = 200;
// Step 1: Wait for the popup to load
document.addEventListener('DOMContentLoaded', async () => {
    
    // Step 2: Ask Chrome what tab the user is currently looking at
    chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
        let currentTab = tabs[0];
        let currentURL = currentTab.url;
        
        const statusIcon = document.getElementById('status-icon');
        const statusText = document.getElementById('status-text');
        const modifyBtn = document.getElementById('modify-btn');

        // Hide the icon container to completely remove the emojis
        if (statusIcon) {
            statusIcon.style.display = 'none';
        }

        // Safety check: Don't try to parse internal chrome pages or new tabs
        if (!currentURL || !currentURL.startsWith('http')) {
            statusText.textContent = "Extension or System Page";
            
            // Default button behavior for system pages
            modifyBtn.textContent = "Modify Block List";
            modifyBtn.onclick = () => {
                if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
                else window.open(chrome.runtime.getURL('opt.html'));
            };
            return;
        }

        // Step 3: Clean the URL exactly like we do in script.js and opt.js
        const parsedURL = new URL(currentURL);
        
        // Grab ONLY the base domain for the quick-add button (e.g., youtube.com)
        const baseDomain = parsedURL.hostname.replace(/^www\./, '');
        
        let currentCleanUrl = baseDomain + parsedURL.pathname;
        if (currentCleanUrl.endsWith('/')) {
            currentCleanUrl = currentCleanUrl.slice(0, -1);
        }

        // Step 4: Fetch the user's saved settings
        const result = await chrome.storage.sync.get(['websiteArray', 'blockMode']);
        const blockedWebsites = result.websiteArray || [];
        const currentMode = result.blockMode || 'blacklist';

        // Step 5: Check if it matches the block list rules
        let isMatch = blockedWebsites.some(savedSite => {
            return currentCleanUrl === savedSite || currentCleanUrl.startsWith(savedSite + "/");
        });
        let shouldBlock = false;

        if (currentMode === 'blacklist') {
            if (isMatch) shouldBlock = true;
        } else if (currentMode === 'whitelist') {
            if (!isMatch && currentCleanUrl !== "") shouldBlock = true;
        }

        // Step 6 & 7: Update the popup UI AND the button behavior based on the result
        if (shouldBlock) {
            statusText.textContent = "This website is blocked";
            statusText.style.color = "var(--error)"; 
            
            // Site is blocked, keep normal Modify button
            modifyBtn.textContent = "Modify Block List";
            modifyBtn.onclick = () => {
                if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
                else window.open(chrome.runtime.getURL('opt.html'));
            };

        } else {
            statusText.textContent = "This website is unblocked";
            statusText.style.color = "var(--primary)"; 

            // SAFETY CHECK: If reached the 200 site limit, add explicit background styling
            if (blockedWebsites.length >= LIMIT) {
                modifyBtn.textContent = "Modify Block List (Limit Reached)";
                
                modifyBtn.style.backgroundColor = "#f3f4f6"; // Light gray background
                modifyBtn.style.color = "#1f2937";           // Dark text
                modifyBtn.style.padding = "12px 20px";       // Padding to create the "background"
                modifyBtn.style.borderRadius = "12px";       // Rounded corners to match your UI
                modifyBtn.style.border = "1px solid #e5e7eb";
                modifyBtn.style.fontWeight = "700";
                modifyBtn.style.width = "100%";              // Ensures the background spans the popup
                modifyBtn.style.cursor = "pointer";
                
                modifyBtn.onclick = () => {
                    if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
                    else window.open(chrome.runtime.getURL('opt.html'));
                };
            } 
            // If in blacklist mode AND under the limit, turn into a quick-block button
            else if (currentMode === 'blacklist') {
                modifyBtn.textContent = "Block Website";
                modifyBtn.style.backgroundColor = "var(--error)"; // Indicates blocking action
                modifyBtn.style.color = "white"; 
                modifyBtn.style.padding = "12px 20px";
                modifyBtn.style.borderRadius = "12px";
                modifyBtn.style.border = "none";
                
                modifyBtn.onclick = async () => {
                    // Add the base domain to the array if it isn't already there
                    if (!blockedWebsites.includes(baseDomain)) {
                        blockedWebsites.push(baseDomain);
                        await chrome.storage.sync.set({'websiteArray': blockedWebsites});
                    }
                    
                    // Reload the active tab so the block takes effect instantly
                    chrome.tabs.reload(currentTab.id);
                    
                    // Close the popup
                    window.close(); 
                };
            } else {
                // If in whitelist mode, keep normal Modify button
                modifyBtn.textContent = "Modify Block List";
                modifyBtn.onclick = () => {
                    if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
                    else window.open(chrome.runtime.getURL('opt.html'));
                };
            }
        }
    });
});