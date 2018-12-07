chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({
        uOrV: 'u'
    }, function () {
        //console.log('uOrv set');
    });
    chrome.storage.local.set({
        enabled: true
    }, function () {
        //console.log('set enabled to true');
    });
    chrome.contextMenus.create({
        id: "uOrV",
        title: "Use vx instead of ux for ŭ",
        contexts: ["browser_action"],
        type: "checkbox",
        checked: false
    });

    chrome.contextMenus.onClicked.addListener(function (info, tab) {
        if (info.menuItemId == "uOrV") {
            var letter
            if (info.checked) {
                letter = "v"
            } else {
                letter = "u"
            }
            chrome.storage.sync.set({
                uOrV: letter
            }, function () {
                //console.log('uOrv set to: ' + letter);
            });
        }
    });
});

chrome.storage.local.get(['enabled'], function (data) {
    //console.log(JSON.stringify(data))
    //console.log("enabled is: " + data.enabled)
});

chrome.browserAction.onClicked.addListener(function (tab) {
    //console.log("clicked")
    chrome.storage.local.get(['enabled'], function (data) {
        //console.log("enabled was: " + data.enabled)
        enabled = !data.enabled
        chrome.storage.local.set({
            enabled: enabled
        }, function () {});
        chrome.browserAction.setIcon({
            path: enabled ? enabled_icons : disabled_icons
        });
    });
});


var enabled_icons = {
    "16": "images/color16.png",
    "32": "images/color32.png",
    "48": "images/color48.png",
    "64": "images/color64.png",
    "128": "images/color128.png",
    "512": "images/color512.png"
};
var disabled_icons = {
    "16": "images/grey16.png",
    "32": "images/grey32.png",
    "48": "images/grey48.png",
    "64": "images/grey64.png",
    "128": "images/grey128.png",
    "512": "images/grey512.png"
};