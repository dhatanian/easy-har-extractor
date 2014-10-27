'use strict';

function createIfRequiredAndPush(array, index, value) {
    if (array[index] == undefined) {
        array[index] = [];
    }
    array[index].push(value);
}
function onBeforeRequest(args) {
    var tabStatus = getTabStatus(args.tabId);
    createIfRequiredAndPush(tabStatus.data, args.requestId, {
        listener: "onBeforeRequest",
        url: args.url,
        method: args.method,
        frameId: args.frameId,
        parentFrameId: args.parentFrameId,
        requestBody: args.requestBody,
        type: args.type,
        timeStamp: args.timeStamp
    });
    setTabStatus(tabStatus);
}

function onSendHeaders(args) {
    var tabStatus = getTabStatus(args.tabId);
    createIfRequiredAndPush(tabStatus.data, args.requestId, {
        listener: "onSendHeaders",
        timeStamp: args.timeStamp,
        requestHeaders: args.requestHeaders
    });
    setTabStatus(tabStatus);
}

function onHeadersReceived(args) {
    var tabStatus = getTabStatus(args.tabId);
    createIfRequiredAndPush(tabStatus.data, args.requestId, {
        listener: "onHeadersReceived",
        timeStamp: args.timeStamp,
        statusLine: args.statusLine,
        responseHeaders: args.responseHeaders
    });
    setTabStatus(tabStatus);
}

function onResponseStarted(args) {
    var tabStatus = getTabStatus(args.tabId);
    createIfRequiredAndPush(tabStatus.data, args.requestId, {
        listener: "onResponseStarted",
        timeStamp: args.timeStamp,
        ip: args.ip,
        fromCache: args.fromCache,
        statusCode: args.statusCode,
        responseHeaders: args.responseHeaders,
        statusLine: args.statusLine
    });
    setTabStatus(tabStatus);
}

function onCompleted(args) {
    var tabStatus = getTabStatus(args.tabId);
    createIfRequiredAndPush(tabStatus.data, args.requestId, {
        listener: "onCompleted",
        timeStamp: args.timeStamp,
        ip: args.ip,
        fromCache: args.fromCache,
        statusCode: args.statusCode,
        responseHeaders: args.responseHeaders,
        statusLine: args.statusLine
    });
    setTabStatus(tabStatus);
}

function onErrorOccurred(args) {
    var tabStatus = getTabStatus(args.tabId);
    createIfRequiredAndPush(tabStatus.data, args.requestId, {
        listener: "onErrorOccurred",
        timeStamp: args.timeStamp,
        ip: args.ip,
        fromCache: args.fromCache,
        error: args.error
    });
    setTabStatus(tabStatus);
}

function buildListeners() {
    return {
        onBeforeRequest: copy(onBeforeRequest),
        onSendHeaders: copy(onSendHeaders),
        onHeadersReceived: copy(onHeadersReceived),
        onResponseStarted: copy(onResponseStarted),
        onCompleted: copy(onCompleted),
        onErrorOccurred: copy(onErrorOccurred)
    }
}

//We need to copy the callbackq so that they look different when registering the listeners
function copy(baseFunction) {
    return function () {
        return baseFunction.apply(this, arguments);
    }
}

function registerListeningCallbacksForTab(tabId, callback) {
    var listeners = buildListeners();
    chrome.webRequest.onBeforeRequest.addListener(listeners.onBeforeRequest, {urls: ["<all_urls>"], tabId: tabId}, ["requestBody"]);
    chrome.webRequest.onSendHeaders.addListener(listeners.onSendHeaders, {urls: ["<all_urls>"], tabId: tabId}, ["requestHeaders"]);
    chrome.webRequest.onHeadersReceived.addListener(listeners.onHeadersReceived, {urls: ["<all_urls>"], tabId: tabId}, ["responseHeaders"]);
    chrome.webRequest.onResponseStarted.addListener(listeners.onResponseStarted, {urls: ["<all_urls>"], tabId: tabId}, ["responseHeaders"]);
    chrome.webRequest.onCompleted.addListener(listeners.onCompleted, {urls: ["<all_urls>"], tabId: tabId}, ["responseHeaders"]);
    chrome.webRequest.onErrorOccurred.addListener(listeners.onErrorOccurred, {urls: ["<all_urls>"], tabId: tabId});
    callback(listeners);
}

function unregisterListeningCallbacksForTab(tabId, listeners, callback) {
    chrome.webRequest.onBeforeRequest.removeListener(listeners.onBeforeRequest);
    chrome.webRequest.onSendHeaders.removeListener(listeners.onSendHeaders);
    chrome.webRequest.onHeadersReceived.removeListener(listeners.onHeadersReceived);
    chrome.webRequest.onResponseStarted.removeListener(listeners.onResponseStarted);
    chrome.webRequest.onCompleted.removeListener(listeners.onCompleted);
    chrome.webRequest.onErrorOccurred.removeListener(listeners.onErrorOccurred);
    callback();
}