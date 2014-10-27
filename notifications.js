'use strict';

function notifyListening(tabId, callback) {
    chrome.tabs.get(tabId, function (tab) {
        chrome.notifications.create("", {
            "type": "basic",
            "iconUrl": '/images/record-grey.png',
            "title": 'Starting to record network data',
            "message": 'Your activity on tab "' + tab.title + '" is now being recorded. Click on the red recoding button on the top left of your browser to stop the recording.'
        }, callback);
    });
}

function notifyDone(notificationId) {
    chrome.notifications.clear(notificationId, function () {
        chrome.notifications.create("", {
            "type": "image",
            "iconUrl": '/images/record-grey.png',
            "title": 'End of network data recording',
            "message": 'The data is available in your downloaded files in the bottom of your browser window.',
            "imageUrl": '/images/download.png'
        }, function () {

        });
    });
}