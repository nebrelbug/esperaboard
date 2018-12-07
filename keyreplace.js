var table = {
    "s": "ŝ",
    "S": "Ŝ",
    "h": "ĥ",
    "H": "Ĥ",
    "c": "ĉ",
    "C": "Ĉ",
    "g": "ĝ",
    "G": "Ĝ",
    "j": "ĵ",
    "J": "Ĵ",
    "u": "ŭ",
    "U": "Û",
}

var enabled = true
chrome.storage.local.get(['enabled'], function (data) {
    //console.log("enabled set to: " + data.enabled)
    enabled = data.enabled
});
chrome.storage.sync.get(['uOrV'], function (data) {
    //console.log(data.uOrV)
    if (data.uOrV === 'v') {
        //console.log("it's v!")
        table.v = "ŭ"
        table.V = "Û"
        delete table.u
        delete table.U
    }
});


chrome.storage.onChanged.addListener(function (changes, namespace) {
    //console.log('changed')
    for (key in changes) {
        var storageChange = changes[key];
        newValue = storageChange.newValue
        //console.log("newValue: " + newValue)
        if (key === 'uOrV') {
            if (newValue === 'v') {
                table['v'] = "ŭ"
                table['V'] = "Û"
                if (table.hasOwnProperty('u')) {
                    delete table.u
                }
                if (table.hasOwnProperty('U')) {
                    delete table.U
                }
            } else if (newValue === 'u') {
                table['u'] = "ŭ"
                table['U'] = "Û"
                if (table.hasOwnProperty('v')) {
                    delete table.v
                }
                if (table.hasOwnProperty('V')) {
                    delete table.V
                }
            }
        } else if (key === 'enabled') {
            enabled = newValue
        }
        //console.log("table: " + JSON.stringify(table))
    }
});


document.addEventListener('keypress', function (e) {
    if (enabled) {
        var target = e.target;
        var typed = String.fromCharCode(e.charCode);
        if (e.target.value && (typed == "X" || typed == "x")) {
            var start = target.selectionStart;
            if (start > 0) {
                var lastChar = target.value.substring(start - 1, start);
                var replacement = table[lastChar];
                if (replacement) {
                    target.value = target.value.substring(0, start - 1) + replacement + target.value.substring(start);
                    target.selectionStart = start;
                    target.selectionEnd = start;
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        } else if (e.target.isContentEditable && (typed == "X" || typed == "x")) {
            var start = getCaretPosition(target)
            if (start > 0) {
                var lastChar = target.innerHTML.substring(start - 1, start);
                var replacement = table[lastChar];
                if (replacement) {
                    target.innerHTML = target.innerHTML.substring(0, start - 1) +
                        replacement +
                        target.innerHTML.substring(start);
                    setCaret(target, start)
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }
    }
});


function getCaretPosition(editableDiv) {
    var caretPos = 0,
        sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            if (range.commonAncestorContainer.parentNode == editableDiv) {
                caretPos = range.endOffset;
            }
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        if (range.parentElement() == editableDiv) {
            var tempEl = document.createElement("span");
            editableDiv.insertBefore(tempEl, editableDiv.firstChild);
            var tempRange = range.duplicate();
            tempRange.moveToElementText(tempEl);
            tempRange.setEndPoint("EndToEnd", range);
            caretPos = tempRange.text.length;
        }
    }
    return caretPos;
}


function setCaret(el, pos) {
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(el.childNodes[0], pos);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
}