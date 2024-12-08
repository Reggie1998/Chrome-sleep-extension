console.log('onStartup');

const blockKeys = ["reddit", "youtube", "twitch"];
let interval;
let currKey
const allowedTime = 3600; //1h

blockKeys.forEach((key) => {
    chrome.storage.local.get(key).then((result) => {
        let currDateDay = new Date().getDate();
        console.log(key + "_CHECKING");
        if (!result || result.currDay !== currDateDay) {
            console.log(key + "_RESETING");
            chrome.storage.local.set({ [key]: { time: 0, currDay: currDateDay } })
        }
    });
})

const updateInterval = (key) => {
    if (currKey != key) {
        if (!!interval) {
            clearInterval(interval);
        }

        interval = setInterval(async function () {
            if (await checkChromeFocus()) {
                chrome.storage.local.get([key]).then((result) => {
                    let res = result[key];
                    if (res.time >= allowedTime) {
                        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                            if (tabs.length > 0) {
                                chrome.tabs.sendMessage(tabs[0].id, { action: "changeStyle" });
                            } else {
                                console.error("No active tab found.");
                            }
                        });
                    } else {
                        chrome.storage.local.set({ [key]: { time: res.time + 1 || 0, currDay: res.currDay } })
                    }
                    console.log(res.time + 1);
                    console.log(res.currDay);
                });
            }

        }, 1000);
    }

}

const runTimerForKey = (key) => {
    const currTime = chrome.storage.local.get(key);
    console.log(currTime);

    // chrome.storage.local.set({ [key]: {} });

}

const checkForKey = (url) => {
    if (!url) return null;

    return blockKeys.find(key => url.toLowerCase().includes(key.toLowerCase()));
}

const getCurrUrl = async (settings = { active: true, lastFocusedWindow: true }) => {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            if (tabs.length === 0) {
                resolve(undefined); // No active tabs found
            } else {
                resolve(tabs[0]?.url); // Return the URL of the first matched tab
            }
        });
    });
}

//IDK IF ALL BELOW ARE NEEDED I STOLE THEM FROM SOMEWHERE
//BUT  ALSO FINE SINCE TIMER IS UNRESETABLE
// Helper to check if Chrome's window is focused
const checkChromeFocus = async () => {
    return new Promise((resolve) => {
        chrome.windows.getLastFocused((window) => {
            resolve(window.focused);
        });
    });
};

// Handle tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    let key = checkForKey(await getCurrUrl());
    if (key) {
        updateInterval(key)
    }
});

// Handle window focus change
chrome.windows.onFocusChanged.addListener(async (windowId) => {
    let key = checkForKey(await getCurrUrl());
    if (key) {
        updateInterval(key)
    }
});

// Handle tab URL updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    let key = checkForKey(await getCurrUrl());
    if (key) {
        updateInterval(key)
    }
});


// On browser startup, restore saved data
chrome.runtime.onStartup.addListener(async () => {
    let key = checkForKey(await getCurrUrl());
    if (key) {
        updateInterval(key)
    }
});



chrome?.windows?.getLastFocused({ populate: true }, async (lastFocusedWindow) => {
    let key = checkForKey(await getCurrUrl());
    if (key) {
        updateInterval(key)
    }
});

chrome?.windows?.getCurrent({ populate: true }, async (currentWindow) => {
    let key = checkForKey(await getCurrUrl());
    if (key) {
        updateInterval(key)
    }
});