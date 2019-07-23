const browser = require('webextension-polyfill');

async function sendMessage(data) {
  await browser.runtime.sendMessage({ application: 'Sats Extension by Casa', response: true, data });
}

// Add click event listener for lightning payment requests
if (document) {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', ev => {
      var target = ev.target;
      if (!target || !target.closest) {
        return;
      }
      const lightningLink = target.closest('[href^="lightning:"]');
      if (lightningLink) {
        var href = lightningLink.getAttribute('href');
        var paymentRequest = href.replace('lightning:', '');
        sendMessage({ paymentRequest }); // message background script
        ev.preventDefault();
      }
    });
  });
}
