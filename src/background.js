const browser = require('webextension-polyfill');

function payInvoice(request) {
  // set direct local storage entry due to store.dispatch clearing vuex
  localStorage.setItem('invoice', request.data.paymentRequest);

  return new Promise((resolve, reject) => {
    // open as popup window and attach listeners
    browser.windows
      .create({ url: browser.runtime.getURL('./popup/popup.html#/popup/pay/review'), type: 'popup', width: 400, height: 600 })

      .then(window => {
        const tabId = window.tabs[0].id;

        const onMessageListener = (message, sender) => {
          console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
          if (message && message.response && sender.tab && sender.tab.id === tabId) {
            browser.tabs.onRemoved.removeListener(onRemovedListener);
            if (message.error) {
              reject(new Error(message.error));
            } else {
              resolve(message.data);
            }
            browser.windows.remove(sender.tab.windowId);
          }
        };

        const onRemovedListener = tid => {
          if (tabId === tid) {
            browser.runtime.onMessage.removeListener(onMessageListener);
            reject(new Error('Prompt was closed'));
          }
        };

        browser.runtime.onMessage.addListener(onMessageListener);
        browser.tabs.onRemoved.addListener(onRemovedListener);
      });
  });
}

// Add message listener
browser.runtime.onMessage.addListener(async request => {
  if (!request || !request.data || request.application !== 'Casa Extension') {
    return;
  }
  // open extension in popup window
  try {
    await payInvoice(request);
  } catch (e) {
    console.log(e);
  }
});
