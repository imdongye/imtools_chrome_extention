//
//  2023-04-12 / im dongye
//
//  todo:
//  0. pdf페이지 연동 #toolbar=1&pages=5
//  2. new Promise((res) => setTimeout(res, ms))
//
//  1. document.addEventListener( "DOMContentLoaded"
//  2. window.addEventListener( "load",
//
//  todo feature:
//  1. 휠클랙으로 쇼츠 들어갔을때 버그
//  2. 나무위키 검색기록
//  3. 나무위키 새탭현재탭설정
//  4. 다국어 지원
//

chrome.runtime.onInstalled.addListener(async () => {
    console.log("hi im dongye.");

    chrome.storage.local.set({ SHORTS_CHECKED: true, NAVER_MOBILE_CHECHED: true });

    chrome.contextMenus.create({
        title: "나무위키로 검색",
        contexts: ["selection"],
        id: "namu",
    });
    chrome.contextMenus.create({
        title: "쇼츠말고 동영상플레이어로 열기",
        contexts: ["link"],
        targetUrlPatterns: ["https://www.youtube.com/shorts/*"],
        id: "shorts",
    });
    chrome.contextMenus.create({
        title: "툴바 없애기/보이기",
        contexts: ["frame"],
        id: "pdf",
        enabled: false,
        visible: false,
    });
});

// (info, tab)으로 현재 tab을 가져올수있지만 pdf에서 tabid가 -1로 들어옴.
chrome.contextMenus.onClicked.addListener(async (info) => {
    // [tab] : Destructuring Assignment
    let [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
    });

    switch (info.menuItemId) {
        case "namu":
            var url = new URL(`https://namu.wiki/w/${info.selectionText}`);
            await chrome.tabs.create({ url: url.href, index: tab.index + 1 });
            await chrome.tabs.highlight({ tabs: tab.index });
            break;

        case "shorts":
            var url = new URL(info.linkUrl.replace("shorts/", "watch?v="));
            await chrome.tabs.update(tab.id, { url: url.href });
            break;

        case "pdf":
            var url = new URL(info.frameUrl);

            if (url.hash.includes("#toolbar=0") > 0) {
                url.hash = "";
            } else {
                url.hash = "#toolbar=0";
            }

            // pdf는 update로 url을 바꾸고 reload해줘야 toolbar=0이 적용된다.
            // 하지만 pdf는 이상하게 비동기 처리해도 url이 안바뀐채로 reload돼서 sleep해준다.
            // 컴퓨터에 따라서 sleep 시간(30ms)이 바뀔수 있다.
            await chrome.tabs.update(tab.id, { url: url.href });
            await new Promise((res) => setTimeout(res, 30));
            await chrome.tabs.reload(tab.id);
            break;
    }
});

async function updatePdfContextMenuBtn(tabId) {
    const tab = await chrome.tabs.get(tabId);

    // todo: <embed type="application/pdf">
    const isPdf = tab.url.includes("pdf") > 0 || tab.title.includes("pdf") > 0 || tab.title.includes("div") > 0;

    chrome.contextMenus.update("pdf", {
        contexts: isPdf ? ["all"] : ["action"],
        enabled: isPdf,
        visible: isPdf,
    });
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    await updatePdfContextMenuBtn(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    if (changeInfo.status === "loading" && changeInfo.url) {
        chrome.storage.local.get(["SHORTS_CHECKED"]).then((rst) => {
            const isChecked = rst.SHORTS_CHECKED;
            if (isChecked && changeInfo.url.includes("youtube.com/shorts/") > 0) {
                const url = new URL(changeInfo.url.replace("shorts/", "watch?v="));
                chrome.tabs.update(tabId, { url: url.href });
            }
        });

        chrome.storage.local.get(["NAVER_MOBILE_CHECHED"]).then((rst) => {
            const isChecked = rst.NAVER_MOBILE_CHECHED;
            if (isChecked && changeInfo.url.includes("m.blog.naver") > 0) {
                const url = new URL(changeInfo.url.replace("m.", ""));
                chrome.tabs.update(tabId, { url: url.href });
            }
        });

        await updatePdfContextMenuBtn(tabId);
    }
});
