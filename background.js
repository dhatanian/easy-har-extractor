/**
 * Created by David on 27/10/2014.
 */

var devToolsListener = function (message, sender, sendResponse) {
    if (message.command == "notify") {
        chrome.notifications.create("", message.notification, function () {
        });
    } else if (message.command == "download") {
        var blob = new Blob([JSON.stringify(message.data)], {type: 'application/json'});
        var downloadUrl = URL.createObjectURL(blob);
        chrome.downloads.download({url: downloadUrl, filename: "network-logs.har"}, function (downloadId) {
        });
    }
};

chrome.runtime.onMessage.addListener(devToolsListener);