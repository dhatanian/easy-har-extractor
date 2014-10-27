'use strict';

var harPrinter = new HARPrinter();

function setPopupIcon(iconName, tabId) {
    chrome.browserAction.setIcon({"path": "images/" + iconName, "tabId": tabId});
}
function showListeningPopupIcon(tabId) {
    setPopupIcon("record-red.png", tabId);
}

function showNotListeningPopupIcon(tabId) {
    setPopupIcon("record-grey.png", tabId);
}

function returnResultToUser(harResult, tabId) {
    var blob = new Blob([harResult], {type: 'application/json'});
    var downloadUrl = URL.createObjectURL(blob);
    chrome.downloads.download({url: downloadUrl, filename: "network-" + tabId + ".har"}, function (downloadId) {
    });
}

function generateHAR(tabStatus) {
    return JSON.stringify(harPrinter.print(tabStatus.data));
}

function toggleListening(tabId, tabStatus) {
    if (tabStatus == undefined) {
        tabStatus = {data: {}};
        registerListeningCallbacksForTab(tabId, function (listeners) {
            tabStatus.listeners = listeners;
            setTabStatus(tabId, tabStatus);
            showListeningPopupIcon(tabId);
            notifyListening(tabId, function (notificationId) {
                tabStatus = getTabStatus(tabId);
                tabStatus.notificationId = notificationId;
                setTabStatus(tabId, tabStatus);
            });
        });
    } else {
        unregisterListeningCallbacksForTab(tabId, tabStatus.listeners, function () {
            removeTabStatus(tabId);
            showNotListeningPopupIcon(tabId);
            var harResult = generateHAR(tabStatus);
            returnResultToUser(harResult, tabId);
            notifyDone(tabStatus.notificationId);
        });
    }
}

function onBadgeClicked(tabId) {
    var tabStatus = getTabStatus(tabId);
    toggleListening(tabId, tabStatus);
}

chrome.browserAction.onClicked.addListener(
    function (tab) {
        onBadgeClicked(tab.id);
    }
);

//When the user clicks on a link, the popup goes back to the default value so we reset it
chrome.tabs.onUpdated.addListener(
    function (tabId) {
        var tabStatus = getTabStatus(tabId);
        if (tabStatus != undefined) {
            showListeningPopupIcon(tabId);
        }
    }
)

//When the tab is closed we end up the recording and we return the HAR
chrome.tabs.onRemoved.addListener(
    function (tabId) {
        var tabStatus = getTabStatus(tabId);
        if (tabStatus != undefined) {
            toggleListening(tabId, tabStatus)
        }
    }
)