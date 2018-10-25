"use strict";

let pubkeys;

function encryptFile(file, done) {
    let fileReader = new FileReader();

    fileReader.onload = () => {
        let options = {
            message: openpgp.message.fromBinary(new Uint8Array(fileReader.result)),
            publicKeys: pubkeys,
            armor: false
        };
        openpgp.encrypt(options).then(function (ciphertext) {
            done(new Blob([ciphertext.message.packets.write()], {type: 'application/octet-stream'}));
        });

    };
    fileReader.readAsArrayBuffer(file);

}

Dropzone.options.myDropzone = {
    init: function () {
        let myDropzone = this;
        this.element.querySelector("button[type=submit]").addEventListener("click", function (e) {
            // Make sure that the form isn't actually being sent.
            e.preventDefault();
            e.stopPropagation();
            myDropzone.processQueue();
        });

    },
    transformFile: encryptFile,
    createImageThumbnails: false,
    autoProcessQueue: false,
    addRemoveLinks: true,
    maxFilesize: null
};

/*
 * contentloaded.js
 *
 * Author: Diego Perini (diego.perini at gmail.com)
 * Summary: cross-browser wrapper for DOMContentLoaded
 * Updated: 20101020
 * License: MIT
 * Version: 1.2
 *
 * URL:
 * http://javascript.nwbox.com/ContentLoaded/
 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
 */

// @win window reference
// @fn function reference
var contentLoaded = function contentLoaded(win, fn) {
    var done = false;
    var top = true;
    var doc = win.document;
    var root = doc.documentElement;
    var add = doc.addEventListener ? "addEventListener" : "attachEvent";
    var rem = doc.addEventListener ? "removeEventListener" : "detachEvent";
    var pre = doc.addEventListener ? "" : "on";
    var init = function init(e) {
        if (e.type === "readystatechange" && doc.readyState !== "complete") {
            return;
        }
        (e.type === "load" ? win : doc)[rem](pre + e.type, init, false);
        if (!done && (done = true)) {
            return fn.call(win, e.type || e);
        }
    };

    var poll = function poll() {
        try {
            root.doScroll("left");
        } catch (e) {
            setTimeout(poll, 50);
            return;
        }
        return init("poll");
    };

    if (doc.readyState !== "complete") {
        if (doc.createEventObject && root.doScroll) {
            try {
                top = !win.frameElement;
            } catch (error) {
            }
            if (top) {
                poll();
            }
        }
        doc[add](pre + "DOMContentLoaded", init, false);
        doc[add](pre + "readystatechange", init, false);
        return win[add](pre + "load", init, false);
    }
};

function initKeys() {
    let pubkeyElems = document.getElementsByClassName("pubkey");
    let pubkeyTexts = [];
    for (let elem of pubkeyElems) {
        pubkeyTexts.push(elem.innerText);
    }
    let promises = pubkeyTexts.map(async (text) => {
        return (await openpgp.key.readArmored(text)).keys[0];
    });

    Promise.all(promises).then(function (keys) {
        pubkeys = keys
    });
}

contentLoaded(window, initKeys);