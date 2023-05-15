// const images = Array.from(document.querySelectorAll("img"));

// images.forEach((img)=> {
//     img.addEventListener("click", () =>{
//         chrome.storage.local.set({image: img.src});
//     });
// });

const count_btn = document.getElementById("count_btn");
const count_span = document.getElementById("count");

const shorts_checkbox = document.getElementById("shorts_checkbox");

count_btn.addEventListener("click", () => {
    chrome.storage.local.get(["TEST_COUNT"]).then((rst) => {
        const count = rst.TEST_COUNT;
        chrome.storage.local.set({ TEST_COUNT: count + 1 });
        count_span.textContent = count + 1;
    });
});

shorts_checkbox.addEventListener("change", async () => {
    chrome.storage.local.set({ SHORTS_CHECKED: shorts_checkbox.checked });
});

document.addEventListener("DOMContentLoaded", async () => {
    chrome.storage.local.get(["SHORTS_CHECKED"]).then((rst) => {
        shorts_checkbox.checked = rst.SHORTS_CHECKED;
    });

    chrome.storage.local.get(["TEST_COUNT"]).then((rst) => {
        count_span.textContent = rst.TEST_COUNT;
    });
});
