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
        let key = JSON.parse(resp_text).Key
        // $('.qr_code').qrcode({"render": "image","size": 87,"text": key})[0].classList.add('m-auto');
        $('.qr_code').qrcode({"render": "image","size": 87,"text": `otpauth://totp/Vaultwarden:admin?secret=${key}&issuer=Vaultwarden`}); // Change 
        $('.qr_code').find('table')[0].classList.add('m-auto');

        $('#authenticator_code').text(key);
        $('#Key').val(key);
    });
}

// onLoad events
document.addEventListener("DOMContentLoaded", (/*event*/) => {
    draw_qr();
});