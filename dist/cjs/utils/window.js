"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBinary = exports.fromBinary = exports.makeWindowUrl = exports.openWindow = void 0;
function openWindow(url, mode) {
    if (mode === 'page') {
        return window.open(url, '_blank');
    }
    var w = 480;
    var h = 720;
    var y = window.top.outerHeight / 2 + window.top.screenY - h / 2;
    var x = window.top.outerWidth / 2 + window.top.screenX - w / 2;
    var features = ["width=" + w, "height=" + h, "top=" + y, "left=" + x].join(',');
    return window.open(url, 'Keycat', features);
}
exports.openWindow = openWindow;
function makeWindowUrl(origin, path, data) {
    var url = new URL(origin + path);
    var searchParams = new URLSearchParams();
    searchParams.set('blockchain', JSON.stringify(data.blockchain));
    searchParams.set('client', location.origin);
    if (data.account) {
        searchParams.set('account', data.account);
    }
    if (data.args) {
        searchParams.set('payload', data.args);
    }
    url.search = searchParams.toString();
    return url.href;
}
exports.makeWindowUrl = makeWindowUrl;
exports.fromBinary = function (binary) {
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < bytes.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return String.fromCharCode.apply(String, __spread(new Uint16Array(bytes.buffer)));
};
exports.toBinary = function (str) {
    var codeUnits = new Uint16Array(str.length);
    for (var i = 0; i < codeUnits.length; i++) {
        codeUnits[i] = str.charCodeAt(i);
    }
    return String.fromCharCode.apply(String, __spread(new Uint8Array(codeUnits.buffer)));
};
