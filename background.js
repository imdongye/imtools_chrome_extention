//
//  2023-04-12 / im dongye
//
//  todo:
//  0. pdf페이지 연동 #toolbar=1&pages=5
//  1. popup에 옵션을 키면 쇼츠 자동으로 변환해서 열기 (webRequset)
//  2. new Promise((res) => setTimeout(res, ms))
//

chrome.contextMenus.onClicked.addListener(imOnClick);

// (info, tab)으로 현재 tab을 가져올수있지만 pdf에서 tabid가 -1로 들어옴.
async function imOnClick(info) {
  // [tab] : Destructuring Assignment
  var [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  switch (info.menuItemId) {
    case 'namu':
      var url = new URL(`https://namu.wiki/w/${info.selectionText}`);
      await chrome.tabs.create({ url: url.href, index: tab.index + 1 });
      await chrome.tabs.highlight({ tabs: tab.index });
      break;

    case 'shorts':
      var url = new URL(info.linkUrl.replace('shorts/', 'watch?v='));
      await chrome.tabs.update(tab.id, { url: url.href });
      break;

    case 'pdf':
      var url = new URL(info.frameUrl);

      if (url.hash.includes('#toolbar=0') > 0) {
        console.log('no');
        url.hash = '';
      } else {
        console.log('has');
        url.hash = '#toolbar=0';
      }

      // function getPdf() {
      //   const pdfViewer = window.PDFViewerApplication;
      //   return pdfViewer;
      // }

      // chrome.scripting
      //   .executeScript({
      //     target: { tabId: tab.id },
      //     func: getPdf,
      //   })
      //   .then(function (pdfViewer) {
      //     console.log(pdfViewer.currentPageNumber);
      //   });

      // pdf는 update로 url을 바꾸고 reload해줘야 toolbar=0이 적용된다.
      // 하지만 pdf는 이상하게 비동기 처리해도 url이 안바뀐채로 reload돼서 sleep해준다.
      // 컴퓨터에 따라서 sleep 시간(30ms)이 바뀔수 있다.
      await chrome.tabs.update(tab.id, { url: url.href });
      await new Promise((res) => setTimeout(res, 30));
      await chrome.tabs.reload(tab.id);
      break;
  }
}

chrome.runtime.onInstalled.addListener(imOnInstalled);

async function imOnInstalled() {
  console.log('hi im dongye.');
  chrome.contextMenus.create({
    title: '나무위키로 검색',
    contexts: ['selection'],
    id: 'namu',
  });
  chrome.contextMenus.create({
    title: '쇼츠말고 동영상플레이어로 열기',
    contexts: ['link'],
    targetUrlPatterns: ['https://www.youtube.com/shorts/*'],
    id: 'shorts',
  });
  chrome.contextMenus.create({
    title: '툴바 없애기/보이기',
    contexts: ['frame'],
    id: 'pdf',
    enabled: false,
    visible: false,
  });
}

chrome.tabs.onActivated.addListener(imActivated);

async function imActivated(info) {
  const tab = await chrome.tabs.get(info.tabId);

  var isPdf = tab.url.includes('.pdf') > 0;

  chrome.contextMenus.update('pdf', {
    contexts: isPdf ? ['all'] : ['action'],
    enabled: isPdf,
    visible: isPdf,
  });
}
