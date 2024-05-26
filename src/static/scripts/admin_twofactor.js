"use strict";
/* eslint-env es2017, browser */
/* exported BASE_URL, _post */

function draw_qr() {
    
    fetch(`${BASE_URL}/admin/two-factor/get-authenticator`, {
        method: "POST",
        body: "",
        mode: "same-origin",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" }
    }).then(resp => {
        return resp.text()
    }).then( resp_text => {
        $('.qr_code').qrcode({"render": "image","size": 87,"text": JSON.parse(resp_text).Key});
    });
}

// onLoad events
document.addEventListener("DOMContentLoaded", (/*event*/) => {
    draw_qr();
});