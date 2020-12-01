(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.keycatjs = {}));
}(this, (function (exports) { 'use strict';

    var Deferred = /** @class */ (function () {
        function Deferred() {
            var _this = this;
            this.resolve = null;
            this.reject = null;
            this.promise = new Promise(function (res, rej) {
                _this.resolve = res;
                _this.reject = rej;
            });
        }
        return Deferred;
    }());

    var __assign = (undefined && undefined.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    var __values = (undefined && undefined.__values) || function(o) {
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
    var eos = ['telos', 'telos-testnet'];
    var Blockchain = {
        eos: eos,
    };
    var appendPlugin = function (blockchain) {
        var e_1, _a;
        var keys = Object.keys(Blockchain);
        try {
            for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                var key = keys_1_1.value;
                var nameSet = Blockchain[key];
                if (nameSet.find(function (n) { return n === blockchain.name; })) {
                    return __assign(__assign({}, blockchain), { plugin: key });
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var plugin = blockchain.plugin;
        if (!plugin) {
            throw new Error("Cannot find 'plugin' property for your custom 'blockchain' configuration.");
        }
        return blockchain;
    };

    var throwValidationError = function (_a) {
        var name = _a.name, property = _a.property, blockchain = _a.blockchain;
        throw new Error("Property '" + property + "' in 'blockchain' is required. This error occurred because '" + name + "' should follow initialization rules of '" + blockchain + "' configuration.");
    };
    var EosValidator = /** @class */ (function () {
        function EosValidator() {
        }
        EosValidator.prototype.isAcceptable = function (_a) {
            var name = _a.name, nodes = _a.nodes, urlOrigin = _a.urlOrigin;
            if (!Blockchain.eos.find(function (preset) { return name === preset; }))
                return false;
            if (!nodes) {
                throwValidationError({ name: name, property: 'nodes', blockchain: 'eos' });
            }
            return true;
        };
        return EosValidator;
    }());
    var validators = {
        eos: EosValidator,
    };

    var __read = (undefined && undefined.__read) || function (o, n) {
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
    var __spread = (undefined && undefined.__spread) || function () {
        for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
        return ar;
    };
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
    var fromBinary = function (binary) {
        var bytes = new Uint8Array(binary.length);
        for (var i = 0; i < bytes.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        // @ts-ignore
        return String.fromCharCode.apply(String, __spread(new Uint16Array(bytes.buffer)));
    };
    var toBinary = function (str) {
        var codeUnits = new Uint16Array(str.length);
        for (var i = 0; i < codeUnits.length; i++) {
            codeUnits[i] = str.charCodeAt(i);
        }
        // @ts-ignore
        return String.fromCharCode.apply(String, __spread(new Uint8Array(codeUnits.buffer)));
    };

    var __extends = (undefined && undefined.__extends) || (function () {
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
    var __values$1 = (undefined && undefined.__values) || function(o) {
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
            var names = Object.keys(validators);
            try {
                for (var names_1 = __values$1(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                    var name_1 = names_1_1.value;
                    var validator = new validators[name_1]();
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
            var deferred = new Deferred();
            this.win = openWindow(url, this.config.ux);
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
            var binaryStringifiedArgs = toBinary(stringifiedArgs);
            var intermediate = btoa(binaryStringifiedArgs);
            var uriComponent = fromBinary(intermediate);
            var encodedComponent = encodeURIComponent(uriComponent);
            return {
                blockchain: appendPlugin(this.config.blockchain),
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
            var url = makeWindowUrl(this.keycatOrigin, '/signin', this.makeUrlData());
            return this.spawnWindow(url);
        };
        Keycat.prototype.transact = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var url = makeWindowUrl(this.keycatOrigin, '/transact', this.makeUrlData(args));
            return this.spawnWindow(url, true);
        };
        Keycat.prototype.signArbitraryData = function (data) {
            var url = makeWindowUrl(this.keycatOrigin, '/sign-arbitrary-data', this.makeUrlData([data]));
            return this.spawnWindow(url, true);
        };
        Keycat.prototype.signTransaction = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var url = makeWindowUrl(this.keycatOrigin, '/sign-transaction', this.makeUrlData(args));
            return this.spawnWindow(url, true);
        };
        return Keycat;
    }());
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

    exports.Keycat = Keycat;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=keycatjs.development.js.map
