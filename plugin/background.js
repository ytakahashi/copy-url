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
  chrome.contextMenus.create({
    parentId: parent,
    id: 'html',
    title: 'as Rich URL',
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

    case 'html':
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: html,
      })
      break
  }
})

const url = () => navigator.clipboard.writeText(location.href)
const md = () => navigator.clipboard.writeText(`[${document.title}](${location.href})`)
const html = () => {
  const body = `<a href="${location.href}">${document.title}</a>`
  const blob = new Blob([body], { type: 'text/html' })
  const blobPlain = new Blob([body], { type: 'text/plain' })
  const item = [new window.ClipboardItem({ 'text/html': blob, 'text/plain': blobPlain })]

  navigator.clipboard.write(item)
}
