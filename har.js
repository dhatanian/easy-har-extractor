//TODO copy entry in constructor for redirects
//TODO cookies
//TODO headers
//TODO httpversion not sure if feasible
//TODO headers size (not sure feasible)
//TODO cache (not sure feasible)
//TODO timings (not sure feasible)

/**
 * Based on http://www.softwareishard.com/blog/har-12-spec
 * @returns {{print: print}}
 * @constructor
 */
function HARPrinter() {

    function startedDateTimeFromTimestamp(timeStamp) {
        return new Date(timeStamp).toISOString();
    }

    function getEntriesForRequest(webRequestData) {
        var entries = [];
        var currentEntry = new HAREntry();
        var currentEntryStartTime;
        for (requestStepIndex in webRequestData) {
            var requestStep = webRequestData[requestStepIndex];
            switch (requestStep.listener) {
                case "onBeforeRequest":
                    currentEntryStartTime = requestStep.timeStamp;
                    currentEntry.startedDateTime = startedDateTimeFromTimestamp(requestStep.timeStamp);
                    currentEntry.request.url = requestStep.url;
                    currentEntry.request.method = requestStep.method;
                    //TODO set post data from requestStep.requestBody.raw or requestStep.requestBody.formData
                    currentEntry.request.bodySize = requestStep.requestBody && requestStep.requestBody.raw ? requestStep.requestBody.raw.length : 0
                    break;
                case "onSendHeaders":
                    //TODO : headers, header size, http version, cookies, queryString
                    break;
                case "onHeadersReceived":
                    currentEntry.response.statusText = requestStep.statusLine;
                    //TODO : headers, header size, http version, cookies, redirectURL
                    break;
                case "onResponseStarted":
                    currentEntry.response.status = requestStep.statusCode;
                    currentEntry.serverIPAddress = requestStep.ip;
                    //TODO cache from fromCache
                    break;
                case "onCompleted":
                    //TODO
                    currentEntry.time = Math.round(requestStep.timeStamp - currentEntryStartTime);
                    entries.push(currentEntry);
                    currentEntry = new HAREntry(currentEntry);
                    break;
                case "onErrorOccurred":
                    //TODO
                    break;
            }
        }
        return entries;
    }


    function HARRequest() {
        return {
            method: "",
            url: "",
            httpVersion: "",
            cookies: [],
            headers: [],
            queryString: [],
            postData: null,
            headersSize: -1,
            bodySize: -1
        }
    }

    function HARResponse() {
        return {
            status: 0,
            statusText: "",
            httpVersion: "",
            cookies: [],
            headers: [],
            content: null,
            redirectURL: "",
            headersSize: -1,
            bodySize: -1
        }
    }

    function HARCache() {
        return{
            beforeRequest: null,
            afterRequest: null
        }
    }

    function HARTimings() {
        return {
            blocked: -1,
            dns: -1,
            connect: -1,
            send: -1,
            wait: -1,
            receive: -1,
            ssl: -1
        }
    }

    /**
     * HAR entries have the following format in the spec :
     * "entries": [
     {
         "pageref": "page_0",
         "startedDateTime": "2009-04-16T12:07:23.596Z",
         "time": 50,
         "request": {...},
         "response": {...},
         "cache": {...},
         "timings": {},
         "serverIPAddress": "10.0.0.1",
         "connection": "52492",
         "comment": ""
     }
     ]
     We will omit pageRef, comment and connection which are optional

     * @returns {Array}
     */
    function HAREntry(entryToCopy) {
        return {
            startedDateTime: "",
            time: -1,
            request: new HARRequest(),
            response: new HARResponse(),
            cache: new HARCache(),
            timings: new HARTimings(),
            serverIPAddress: ""
        }
    }

    return{
        print: function (networkData) {
            var result = {
                log: {
                    version: "1.2",
                    creator: {
                        name: "Easy HAR extractor",
                        version: "1.0"
                    },
                    browser: {
                        name: "Google Chrome",
                        version: "unknown"
                    },
                    entries: []
                }
            };

            for (var requestId in networkData) {
                result.log.entries = result.log.entries.concat(getEntriesForRequest(networkData[requestId]));
            }
            return result;
        }
    }
}