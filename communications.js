'use strict';

function notify(notificationObject) {
    chrome.runtime.sendMessage({
        command: "notify",
        notification: notificationObject
    });
}

function notifyListening() {
    notify({
        "type": "basic",
        "iconUrl": '/images/record-grey.png',
        "title": 'Starting to record network data',
        "message": 'Your activity is now being recorded. Click on the same button to stop the recording.'
    });
}

function notifyDone() {
    notify({
        "type": "image",
        "iconUrl": '/images/record-grey.png',
        "title": 'End of network data recording',
        "message": 'The data is available in your downloaded files in the bottom of your browser window.',
        "imageUrl": '/images/download.png'
    });
}

function simulateDownload(dataToDownload) {
    chrome.runtime.sendMessage({
        command: "download",
        data: dataToDownload
    });
}

