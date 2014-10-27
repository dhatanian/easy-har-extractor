var tabs = {};

function getTabStatus(tabId) {
    return tabs[tabId];
}

function setTabStatus(tabId, tabStatus) {
    tabs[tabId] = tabStatus;
}

function removeTabStatus(tabId) {
    delete tabs[tabId];
}