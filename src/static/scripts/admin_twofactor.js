"use strict";
/* eslint-env es2017, browser */
/* exported BASE_URL, _post */

function draw_qr() {
    $('.qr_code').qrcode({"render": "image","size": 87,"text": 'mytext'});
}

// onLoad events
document.addEventListener("DOMContentLoaded", (/*event*/) => {
    draw_qr();
});