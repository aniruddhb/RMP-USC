chrome.runtime.onMessage.addListener(function(searchURL, sender, callback) {
  // format XMLHttpReq
  var request = new XMLHttpRequest();
  request.onload = function() {
    callback(request.responseText);
  }

  // open and send request
  request.open('GET', searchURL, true);
  request.send();

  // return true to stop early-trigger of callback
  return true;
});
