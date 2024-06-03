"use strict";
/* eslint-env es2017, browser */
/* exported BASE_URL, _post */

function draw_form(enabled) {
    if (enabled) {
        $('#not-enabled-form').hide();
        $('#enabled-form').show();
    } else {
        $('#not-enabled-form').show();
        $('#enabled-form').hide();
    }
}

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
        let resp_json = JSON.parse(resp_text);
        let key = resp_json.Key;
        draw_form(resp_json.Enabled);
        $('.qr_code').qrcode({"render": "image","size": 87,"text": `otpauth://totp/Vaultwarden:admin?secret=${key}&issuer=Vaultwarden`});
        $('.qr_code').find('table')[0].classList.add('m-auto');

        $('#authenticator_code').text(key);
        $('#key').val(key);
    });
}

// onLoad events
document.addEventListener("DOMContentLoaded", (/*event*/) => {
    draw_qr();
    $('#not-enabled-form').on('submit', (event) => {
        event.preventDefault();
        const data = {
            Key: $('#key').val(),
            Token: $('#token').val(),
        };
        fetch(`${BASE_URL}/admin/two-factor/authenticator`, {
            method: 'POST',
            body: JSON.stringify(data),
            mode: "same-origin",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
        }).then(resp => {
            return resp.text()
        }).then( resp_text => {
            let resp_json = JSON.parse(resp_text);
            draw_form(resp_json.Enabled);
        });
    });
    $('#enabled-form').on('submit', (event) => {
        event.preventDefault();
        const data = {
            Type: $('#type').val(),
        };
        fetch(`${BASE_URL}/admin/two-factor/disable`, {
            method: 'POST',
            body: JSON.stringify(data),
            mode: "same-origin",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
        }).then(resp => {
            return resp.text()
        }).then( resp_text => {
            let resp_json = JSON.parse(resp_text);
            draw_form(resp_json.Enabled);
        });
    });
});