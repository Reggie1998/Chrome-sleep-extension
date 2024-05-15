function timer() {
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