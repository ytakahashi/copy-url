chrome.runtime.onInstalled.addListener(() => {
  const parent = chrome.contextMenus.create({
    id: 'parent',
    title: 'Copy URL',
  })
  chrome.contextMenus.create({
    parentId: parent,
    id: 'url',
    title: 'only URL',
    contexts: ['all'],
  })
  chrome.contextMenus.create({
    parentId: parent,
    id: 'md',
    title: 'as Markdown',
    contexts: ['all'],
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case 'url':
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: url,
      })
      break

    case 'md':
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: md,
      })
      break
  }
})

const url = () => navigator.clipboard.writeText(location.href)
const md = () => navigator.clipboard.writeText(`[${document.title}](${location.href})`)
