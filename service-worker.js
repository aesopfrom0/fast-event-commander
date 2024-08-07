function authenticate(interactive) {
  console.log('interactive: ', interactive);
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken(
      { interactive: interactive },
      function (token) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(token);
        }
      }
    );
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('request: ', request);
  if (request.type === 'authenticate') {
    authenticate(true)
      .then((token) => {
        sendResponse({ token: token });
      })
      .catch((error) => {
        sendResponse({ error: error });
      });
    return true;
  }
});

let cachedToken = null;

chrome.runtime.onInstalled.addListener(() => {
  authenticate(false)
    .then((token) => {
      cachedToken = token;
      console.log('Token acquired:', token);
    })
    .catch((error) => {
      console.error(
        'Error during initial authentication:',
        JSON.stringify(error, null, 2)
      );
      console.dir(error);
    });
});
