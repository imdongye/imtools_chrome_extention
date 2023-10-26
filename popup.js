const count_span = document.getElementById("count");

const shorts_checkbox = document.getElementById("shorts_checkbox");
const naver_mobile_checkbox = document.getElementById("naver_mobile_checkbox");

shorts_checkbox.addEventListener("change", async () => {
    chrome.storage.local.set({ SHORTS_CHECKED: shorts_checkbox.checked });
});

naver_mobile_checkbox.addEventListener("change", async () => {
    chrome.storage.local.set({ NAVER_MOBILE_CHECHED: naver_mobile_checkbox.checked });
});

document.addEventListener("DOMContentLoaded", async () => {
    chrome.storage.local.get(["SHORTS_CHECKED"]).then((rst) => {
        shorts_checkbox.checked = rst.SHORTS_CHECKED;
    });
    chrome.storage.local.get(["NAVER_MOBILE_CHECHED"]).then((rst) => {
        naver_mobile_checkbox.checked = rst.NAVER_MOBILE_CHECHED;
    });
});
