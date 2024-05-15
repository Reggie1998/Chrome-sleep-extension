function timer() {
    setInterval(function () {
        let currentHour = new Date().getHours();
        let isOnBlockedsite = false;
        const blockedSites = ['youtube', 'twitch', 'reddit'];
        for (let i = 0; i < blockedSites.length; i++) {
            if (window.location.href.indexOf(blockedSites[i]) > -1) {
                isOnBlockedsite = true;
                break;
            }

        }
        if (currentHour >= 22 && isOnBlockedsite) {
            document.body.style.opacity = "0";
        }
    }, 60000); //add zero
}
window.onload = function () {
    timer();
};