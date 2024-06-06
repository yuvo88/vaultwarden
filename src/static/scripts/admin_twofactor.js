"use strict";
/* eslint-env es2017, browser */
/* exported BASE_URL, _post */

const QR_SIZE = 87;

function draw_form(enabled) {
    if (enabled) {
        $('#not-enabled-form').hide();
        $('#enabled-form').show();
    } else {
        $('#not-enabled-form').show();
        $('#enabled-form').hide();
    }
}

function fetch_post(url, data) {
    return fetch(url, {
        method: "POST",
        body: data,
        mode: "same-origin",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" }
    }).then(resp => {
        return resp.text()
    })
}

function disable_authenticator() {
    const data = {
        Type: $('#type').val(),
    };
    fetch_post(`${BASE_URL}/admin/two-factor/disable`, JSON.stringify(data)).then( resp_text => {
        let resp_json = JSON.parse(resp_text);
        draw_form(resp_json.Enabled);
    });
}

function enable_authenticator() {
    const data = {
        Key: $('#key').val(),
        Token: $('#token').val(),
    };
    fetch_post(`${BASE_URL}/admin/two-factor/authenticator`, JSON.stringify(data)).then( resp_text => {
        let resp_json = JSON.parse(resp_text);
        draw_form(resp_json.Enabled);
    });
}

function draw_qr() {
    fetch_post(`${BASE_URL}/admin/two-factor/get-authenticator`, "").then( resp_text => {
        let resp_json = JSON.parse(resp_text);
        let key = resp_json.Key;
        draw_form(resp_json.Enabled);
        $('.qr_code').qrcode({"render": "image","size": QR_SIZE,"text": `otpauth://totp/Vaultwarden:admin?secret=${key}&issuer=Vaultwarden`});
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
        enable_authenticator();
        
    });
    $('#enabled-form').on('submit', (event) => {
        event.preventDefault();
        disable_authenticator();
    });
});