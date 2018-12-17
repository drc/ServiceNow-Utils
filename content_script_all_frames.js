//attach event listener from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "runFunction") {
        runFunction(request.myVars);
    } else if (request.method == "runFunctionChild") {
        runFunction(request.myVars, 'child');
    } else if (request.snippet) {
        insertTextAtCursor(request.snippet);
    }

});

(function(){
    var s = document.createElement('script');
    s.setAttribute("id","snUtils");
    s.setAttribute("data-extension", chrome.runtime.id);
    s.setAttribute("data-syncpage", chrome.runtime.getURL("filesync.html"));
    s.src = chrome.runtime.getURL('inject.js');
    s.onload = function() {
       // this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
  })();

function runFunction(f, context) {
    var doc;

    if (context == 'child' && jQuery('#gsft_main').length)
        return;

    if (jQuery('#gsft_main').length)
        doc = jQuery('#gsft_main')[0].contentWindow.document;
    else
        doc = document;
    
    var script = doc.createElement('script');
    script.appendChild(doc.createTextNode(f));
    doc.body.appendChild(script);

}


function insertTextAtCursor(text) {
    var el = document.activeElement;
    var val = el.value;
    var endIndex;
    var range;
    var doc = el.ownerDocument;
    if (typeof el.selectionStart === 'number' &&
        typeof el.selectionEnd === 'number') {
        endIndex = el.selectionEnd;
        el.value = val.slice(0, endIndex) + text + val.slice(endIndex);
        el.selectionStart = el.selectionEnd = endIndex + text.length;
    } else if (doc.selection !== 'undefined' && doc.selection.createRange) {
        el.focus();
        range = doc.selection.createRange();
        range.collapse(false);
        range.text = text;
        range.select();
    }
}

