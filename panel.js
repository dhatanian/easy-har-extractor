'use strict';
var currentlyLogging = false;
var requests = [];

function updateButtonLook() {
    var img = document.getElementById("harimage");
    var message = document.getElementById("harmessage");

    if (currentlyLogging) {
        img.src = "images/record-red.png";
        message.innerHTML = "Click here to stop the logs generation and download the result";
    } else {
        img.src = "images/record-grey.png";
        message.innerHTML = "Click here to start generating network logs";
    }
}

function addRequestToList(request) {
    request.startedDateTime = request.startedDateTime.toISOString();
    requests.push(request);
}

function updateNetworkHandlers() {
    if (currentlyLogging) {
        chrome.devtools.network.onRequestFinished.addListener(addRequestToList);
    } else {
        chrome.devtools.network.onRequestFinished.removeListener(addRequestToList);
    }
}

function generateHAR() {
    //TODO return pages
    return {
        log: {
            version: "1.2",
            creator: {
                name: "Easy Har Extractor by David Hatanian",
                version: "1.0"
            },
            pages: [],
            entries: requests
        }
    };
}

function returnHarFileToUser(harData) {
    simulateDownload(harData);
}
document.getElementById("harbutton").onclick = function () {
    currentlyLogging = !currentlyLogging;
    if (currentlyLogging) {
        requests = [];
    }
    updateButtonLook();
    updateNetworkHandlers();
    if (!currentlyLogging) {
        var harObject = generateHAR();
        returnHarFileToUser(harObject);
        notifyDone();
    } else {
        notifyListening();
    }
}

updateButtonLook();