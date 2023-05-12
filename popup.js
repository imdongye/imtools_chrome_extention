// const images = Array.from(document.querySelectorAll("img"));

// images.forEach((img)=> {
//     img.addEventListener("click", () =>{
//         chrome.storage.local.set({image: img.src});
//     });
// });

const countBtn = document.getElementById("countBtn");
const countSpan = document.getElementById("count");
let count = 0;

countBtn.addEventListener("click", () => {
  count++;
  countSpan.textContent = count;
});
