
function timer() {
    console.log("pepega");
    setInterval(function () {
        let currentHour = new Date().getHours();
        if (currentHour >= 22) {
            document.body.style.opacity = "0";
        }
    }, 120000); //add zero
}

window.onload = function () {
    timer();
};

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "changeStyle") {
        document.body.style.opacity = "0";
        console.log("Content script: Page styling changed!");
    }
});