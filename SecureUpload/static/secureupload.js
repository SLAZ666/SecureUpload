"use strict";

function encryptFile(file, done) {
    let fileReader = new FileReader();

    fileReader.onload = () => {
        let options = {
            message: openpgp.message.fromBinary(new Uint8Array(fileReader.result)),
            passwords: ['test'],
            armor: false
        };
        openpgp.encrypt(options).then(function(ciphertext) {
            done(new Blob([ciphertext.message.packets.write()], {type: 'application/octet-stream'}));
        });

    };
    fileReader.readAsArrayBuffer(file);

}

Dropzone.options.myDropzone = {
    init: function() {
        let myDropzone = this;
        this.element.querySelector("button[type=submit]").addEventListener("click", function(e) {
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

