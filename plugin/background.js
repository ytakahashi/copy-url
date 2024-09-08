const notify = value => {
  const popup = message => {
    const popupWindow = document.createElement('div')
    popupWindow.classList.add('popup-window')
    const popupText = document.createElement('div')
    popupText.classList.add('popup-text')

    popupText.innerHTML = `<p>${message}</p>`

    popupWindow.appendChild(popupText)
    document.body.appendChild(popupWindow)

    const modalMask = document.createElement('div')
    modalMask.classList.add('modal-mask')
    document.body.appendChild(modalMask)

    const removePopup = () => {
      if (document.body.contains(popupWindow)) {
        document.body.removeChild(popupWindow)
      }
      if (document.body.contains(modalMask)) {
        document.body.removeChild(modalMask)
      }
    }

    document.body.addEventListener('click', removePopup)
    setTimeout(removePopup, 4000)
  }

  if (typeof value === 'string') {
    popup(`Copied!: ${value}`)
  } else {
    popup('Copied!')
  }
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

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  let result
  switch (info.menuItemId) {
    case 'url':
      result = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: url,
      })
      break

    case 'title':
      result = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: title,
      })
      break

    case 'md':
      result = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: md,
      })
      break

    case 'html':
      result = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: html,
      })
      break
  }
  const value = result[0].result
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: notify,
    args: [value],
  })
})

chrome.action.onClicked.addListener(async tab => {
  const result = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: md,
  })
  const value = result[0].result
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: notify,
    args: [value],
  })
})

const url = () => {
  const item = location.href
  navigator.clipboard.writeText(item)
  return item
}
const title = () => {
  const item = document.title
  navigator.clipboard.writeText(item)
  return item
}
const md = () => {
  const item = `[${document.title}](${location.href})`
  navigator.clipboard.writeText(item)
  return item
}
const html = () => {
  const body = `<a href="${location.href}">${document.title}</a>`
  const blob = new Blob([body], { type: 'text/html' })
  const blobPlain = new Blob([body], { type: 'text/plain' })
  const item = [new window.ClipboardItem({ 'text/html': blob, 'text/plain': blobPlain })]
  navigator.clipboard.write(item)
  return item
}
