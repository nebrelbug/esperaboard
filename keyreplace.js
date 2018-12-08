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

console.log('Esperaboard should now work')
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


document.addEventListener('keypress', replaceKey, true)

function replaceKey(e) {

    if (enabled) {
        var target = e.target;
        var typed = e.key;
        if (e.target.value && (typed == "X" || typed == "x")) {
            var start = target.selectionStart;
            if (start > 0) {
                var lastChar = target.value.substring(start - 1, start);
                var replacement = table[lastChar];
                if (replacement) {
                    console.log("yes")
                    target.value = target.value.substring(0, start - 1) + replacement + target.value.substring(start);
                    target.selectionStart = start;
                    target.selectionEnd = start;
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        } else if (target.isContentEditable && (typed == "X" || typed == "x")) {
            // Get selection and range based on position of caret
            // (we assume nothing is selected, and range points to the position of the caret)
            var sel = window.getSelection();
            var range = sel.getRangeAt(0);

            // check that we have at least 1 characters in our container
            if (range.startOffset - 1 >= 0) {
                // clone the range, so we can alter the start and end
                var clone = range.cloneRange();
                // alter start and end of cloned range, so it selects 1 character
                clone.setStart(range.startContainer, range.startOffset - 1);
                clone.setEnd(range.startContainer, range.startOffset);
                // get contents of cloned range
                var contents = clone.toString();
                if (table[contents]) { //If the character should be replaced
                    e.preventDefault();
                    e.stopPropagation();
                    // delete the contents of the range
                    clone.deleteContents();
                    // create a text node with the new character
                    var txtNode = document.createTextNode(table[contents]);
                    range.insertNode(txtNode);
                    // set the start of the range after the inserted node, so we have the caret after the inserted text
                    range.setStartAfter(txtNode);
                    // Chrome fix
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
                console.log("contents: " + contents)
            }
        }
    }
}