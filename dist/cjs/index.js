"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keycat = void 0;
var Deferred_1 = require("./Deferred");
var Blockchain_1 = require("./Blockchain");
var Validator_1 = __importDefault(require("./Validator"));
var window_1 = require("./utils/window");
var Keycat = /** @class */ (function () {
    function Keycat(config) {
        this.config = config;
        this.sign = this.signTransaction;
        this.validateBlockchain(config.blockchain);
        this._account = config.account;
    }
    Keycat.prototype.validateBlockchain = function (blockchain) {
        var e_1, _a;
        var chainName = blockchain.name, plugin = blockchain.plugin;
        var names = Object.keys(Validator_1.default);
        try {
            for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                var name_1 = names_1_1.value;
                var validator = new Validator_1.default[name_1]();
                var isValid = validator.isAcceptable(blockchain);
                if (isValid)
                    return;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (names_1_1 && !names_1_1.done && (_a = names_1.return)) _a.call(names_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Using custom name which is not in the list of preset. Check plugin exists.
        if (!chainName || !plugin) {
            throw new Error("Unknown configuration for 'blockchain' property.");
        }
        // tslint:disable-next-line
        console.warn("You are using custom name. We hope you understand what you are doing. We recommend using a preset name.");
    };
    Keycat.prototype.spawnWindow = function (url, secure) {
        var _this = this;
        if (secure === void 0) { secure = false; }
        if (secure && !this._account) {
            throw new Error("You must chain \"account\" method first. e.g) keycat.account(accountName).transact(...) ");
        }
        var deferred = new Deferred_1.Deferred();
        this.win = window_1.openWindow(url, this.config.ux);
        var timer = setInterval(function () {
            if (!_this.win || _this.win.closed) {
                clearInterval(timer);
                deferred.reject('closed');
            }
        }, 500);
        window.onmessage = function (_a) {
            var data = _a.data;
            var ____keycat = data.____keycat;
            if (!____keycat)
                return;
            _this.sendResponse(data, deferred);
        };
        return deferred.promise;
    };
    Keycat.prototype.sendResponse = function (message, deferred) {
        var type = message.type, payload = message.payload;
        if (type === 'close') {
            deferred.reject('closed');
        }
        else {
            var data = payload.data, error = payload.error;
            if (error)
                deferred.reject(error);
            if (data)
                deferred.resolve(data);
        }
        this.win && this.win.close();
        this.win = null;
    };
    Keycat.prototype.makeUrlData = function (args) {
        var stringifiedArgs = JSON.stringify(args);
        var binaryStringifiedArgs = window_1.toBinary(stringifiedArgs);
        var intermediate = btoa(binaryStringifiedArgs);
        var encodedComponent = encodeURIComponent(intermediate);
        return {
            blockchain: Blockchain_1.appendPlugin(this.config.blockchain),
            account: this._account,
            args: encodedComponent,
        };
    };
    Object.defineProperty(Keycat.prototype, "keycatOrigin", {
        get: function () {
            var _a = this.config.blockchain, origin = _a.origin, name = _a.name;
            var telosOrigin;
            if (name === 'telos') {
                telosOrigin = 'https://sign.telos.net';
            }
            else if (name === 'telos-testnet') {
                telosOrigin = 'https://sign-dev.telos.net';
            }
            else {
                throw new Error("Unknown network " + name);
            }
            var url = new URL(origin || telosOrigin);
            return url.origin;
        },
        enumerable: false,
        configurable: true
    });
    Keycat.prototype.account = function (accountName) {
        this._account = accountName;
        return this;
    };
    Keycat.prototype.signin = function () {
        var url = window_1.makeWindowUrl(this.keycatOrigin, '/signin', this.makeUrlData());
        return this.spawnWindow(url);
    };
    Keycat.prototype.transact = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var url = window_1.makeWindowUrl(this.keycatOrigin, '/transact', this.makeUrlData(args));
        return this.spawnWindow(url, true);
    };
    Keycat.prototype.signArbitraryData = function (data) {
        var url = window_1.makeWindowUrl(this.keycatOrigin, '/sign-arbitrary-data', this.makeUrlData([data]));
        return this.spawnWindow(url, true);
    };
    Keycat.prototype.signTransaction = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var url = window_1.makeWindowUrl(this.keycatOrigin, '/sign-transaction', this.makeUrlData(args));
        return this.spawnWindow(url, true);
    };
    return Keycat;
}());
exports.Keycat = Keycat;
var KeycatTelos = /** @class */ (function (_super) {
    __extends(KeycatTelos, _super);
    function KeycatTelos(nodes, origin) {
        return _super.call(this, {
            blockchain: {
                name: 'telos',
                origin: origin,
                nodes: nodes,
            },
        }) || this;
    }
    return KeycatTelos;
}(Keycat));
var KeycatTelosTestnet = /** @class */ (function (_super) {
    __extends(KeycatTelosTestnet, _super);
    function KeycatTelosTestnet(nodes, origin) {
        return _super.call(this, {
            blockchain: {
                name: 'telos-testnet',
                origin: origin,
                nodes: nodes,
            },
        }) || this;
    }
    return KeycatTelosTestnet;
}(Keycat));
Keycat.Telos = KeycatTelos;
Keycat.TelosTestnet = KeycatTelosTestnet;
