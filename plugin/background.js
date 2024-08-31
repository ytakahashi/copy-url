const copyAndNotify = value => {
  const popup = () => {
    const popupWindow = document.createElement('div')
    popupWindow.classList.add('popup-window')
    const popupText = document.createElement('div')
    popupText.classList.add('popup-text')

    popupText.innerHTML = `<p>Copied!: ${value}</p>`

    popupWindow.appendChild(popupText)
    document.body.appendChild(popupWindow)

    const modalMask = document.createElement('div')
    modalMask.classList.add('modal-mask')
    document.body.appendChild(modalMask)

    const removePopup = () => {
      document.body.removeChild(popupWindow)
      document.body.removeChild(modalMask)
    }

    document.body.addEventListener('click', removePopup)
    setTimeout(removePopup, 4000)
  }

  navigator.clipboard.writeText(value).then(popup)
}

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
    id: 'title',
    title: 'only Title',
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

    case 'title':
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: title,
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

chrome.action.onClicked.addListener(async tab => {
  const result = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getMarkdown,
  })
  const value = result[0].result
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: copyAndNotify,
    args: [value],
  })
})

const url = () => navigator.clipboard.writeText(location.href)
const title = () => navigator.clipboard.writeText(document.title)
const md = () => navigator.clipboard.writeText(`[${document.title}](${location.href})`)
const getMarkdown = () => `[${document.title}](${location.href})`
const html = () => {
  const body = `<a href="${location.href}">${document.title}</a>`
  const blob = new Blob([body], { type: 'text/html' })
  const blobPlain = new Blob([body], { type: 'text/plain' })
  const item = [new window.ClipboardItem({ 'text/html': blob, 'text/plain': blobPlain })]

  navigator.clipboard.write(item)
}
