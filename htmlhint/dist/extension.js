var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/vscode-jsonrpc/lib/is.js
var require_is = __commonJS({
  "node_modules/vscode-jsonrpc/lib/is.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var toString = Object.prototype.toString;
    function boolean(value) {
      return value === true || value === false;
    }
    exports2.boolean = boolean;
    function string(value) {
      return toString.call(value) === "[object String]";
    }
    exports2.string = string;
    function number(value) {
      return toString.call(value) === "[object Number]";
    }
    exports2.number = number;
    function error(value) {
      return toString.call(value) === "[object Error]";
    }
    exports2.error = error;
    function func(value) {
      return toString.call(value) === "[object Function]";
    }
    exports2.func = func;
    function array(value) {
      return Array.isArray(value);
    }
    exports2.array = array;
    function stringArray(value) {
      return array(value) && value.every(function(elem) {
        return string(elem);
      });
    }
    exports2.stringArray = stringArray;
  }
});

// node_modules/vscode-jsonrpc/lib/messages.js
var require_messages = __commonJS({
  "node_modules/vscode-jsonrpc/lib/messages.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || function() {
      var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
        d.__proto__ = b;
      } || function(d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports2, "__esModule", { value: true });
    var is = require_is();
    var ErrorCodes;
    (function(ErrorCodes2) {
      ErrorCodes2.ParseError = -32700;
      ErrorCodes2.InvalidRequest = -32600;
      ErrorCodes2.MethodNotFound = -32601;
      ErrorCodes2.InvalidParams = -32602;
      ErrorCodes2.InternalError = -32603;
      ErrorCodes2.serverErrorStart = -32099;
      ErrorCodes2.serverErrorEnd = -32e3;
      ErrorCodes2.ServerNotInitialized = -32002;
      ErrorCodes2.UnknownErrorCode = -32001;
      ErrorCodes2.RequestCancelled = -32800;
      ErrorCodes2.MessageWriteError = 1;
      ErrorCodes2.MessageReadError = 2;
    })(ErrorCodes = exports2.ErrorCodes || (exports2.ErrorCodes = {}));
    var ResponseError = (
      /** @class */
      function(_super) {
        __extends(ResponseError2, _super);
        function ResponseError2(code, message, data) {
          var _this = _super.call(this, message) || this;
          _this.code = is.number(code) ? code : ErrorCodes.UnknownErrorCode;
          if (data !== void 0) {
            _this.data = data;
          }
          Object.setPrototypeOf(_this, ResponseError2.prototype);
          return _this;
        }
        ResponseError2.prototype.toJson = function() {
          var result = {
            code: this.code,
            message: this.message
          };
          if (this.data !== void 0) {
            result.data = this.data;
          }
          ;
          return result;
        };
        return ResponseError2;
      }(Error)
    );
    exports2.ResponseError = ResponseError;
    var AbstractMessageType = (
      /** @class */
      function() {
        function AbstractMessageType2(_method, _numberOfParams) {
          this._method = _method;
          this._numberOfParams = _numberOfParams;
        }
        Object.defineProperty(AbstractMessageType2.prototype, "method", {
          get: function() {
            return this._method;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(AbstractMessageType2.prototype, "numberOfParams", {
          get: function() {
            return this._numberOfParams;
          },
          enumerable: true,
          configurable: true
        });
        return AbstractMessageType2;
      }()
    );
    exports2.AbstractMessageType = AbstractMessageType;
    var RequestType0 = (
      /** @class */
      function(_super) {
        __extends(RequestType02, _super);
        function RequestType02(method) {
          var _this = _super.call(this, method, 0) || this;
          _this._ = void 0;
          return _this;
        }
        return RequestType02;
      }(AbstractMessageType)
    );
    exports2.RequestType0 = RequestType0;
    var RequestType = (
      /** @class */
      function(_super) {
        __extends(RequestType10, _super);
        function RequestType10(method) {
          var _this = _super.call(this, method, 1) || this;
          _this._ = void 0;
          return _this;
        }
        return RequestType10;
      }(AbstractMessageType)
    );
    exports2.RequestType = RequestType;
    var RequestType1 = (
      /** @class */
      function(_super) {
        __extends(RequestType12, _super);
        function RequestType12(method) {
          var _this = _super.call(this, method, 1) || this;
          _this._ = void 0;
          return _this;
        }
        return RequestType12;
      }(AbstractMessageType)
    );
    exports2.RequestType1 = RequestType1;
    var RequestType2 = (
      /** @class */
      function(_super) {
        __extends(RequestType22, _super);
        function RequestType22(method) {
          var _this = _super.call(this, method, 2) || this;
          _this._ = void 0;
          return _this;
        }
        return RequestType22;
      }(AbstractMessageType)
    );
    exports2.RequestType2 = RequestType2;
    var RequestType3 = (
      /** @class */
      function(_super) {
        __extends(RequestType32, _super);
        function RequestType32(method) {
          var _this = _super.call(this, method, 3) || this;
          _this._ = void 0;
          return _this;
        }
        return RequestType32;
      }(AbstractMessageType)
    );
    exports2.RequestType3 = RequestType3;
    var RequestType4 = (
      /** @class */
      function(_super) {
        __extends(RequestType42, _super);
        function RequestType42(method) {
          var _this = _super.call(this, method, 4) || this;
          _this._ = void 0;
          return _this;
        }
        return RequestType42;
      }(AbstractMessageType)
    );
    exports2.RequestType4 = RequestType4;
    var RequestType5 = (
      /** @class */
      function(_super) {
        __extends(RequestType52, _super);
        function RequestType52(method) {
          var _this = _super.call(this, method, 5) || this;
          _this._ = void 0;
          return _this;
        }
        return RequestType52;
      }(AbstractMessageType)
    );
    exports2.RequestType5 = RequestType5;
    var RequestType6 = (
      /** @class */
      function(_super) {
        __extends(RequestType62, _super);
        function RequestType62(method) {
          var _this = _super.call(this, method, 6) || this;
          _this._ = void 0;
          return _this;
        }
        return RequestType62;
      }(AbstractMessageType)
    );
    exports2.RequestType6 = RequestType6;
    var RequestType7 = (
      /** @class */
      function(_super) {
        __extends(RequestType72, _super);
        function RequestType72(method) {
          var _this = _super.call(this, method, 7) || this;
          _this._ = void 0;
          return _this;
        }
        return RequestType72;
      }(AbstractMessageType)
    );
    exports2.RequestType7 = RequestType7;
    var RequestType8 = (
      /** @class */
      function(_super) {
        __extends(RequestType82, _super);
        function RequestType82(method) {
          var _this = _super.call(this, method, 8) || this;
          _this._ = void 0;
          return _this;
        }
        return RequestType82;
      }(AbstractMessageType)
    );
    exports2.RequestType8 = RequestType8;
    var RequestType9 = (
      /** @class */
      function(_super) {
        __extends(RequestType92, _super);
        function RequestType92(method) {
          var _this = _super.call(this, method, 9) || this;
          _this._ = void 0;
          return _this;
        }
        return RequestType92;
      }(AbstractMessageType)
    );
    exports2.RequestType9 = RequestType9;
    var NotificationType = (
      /** @class */
      function(_super) {
        __extends(NotificationType10, _super);
        function NotificationType10(method) {
          var _this = _super.call(this, method, 1) || this;
          _this._ = void 0;
          return _this;
        }
        return NotificationType10;
      }(AbstractMessageType)
    );
    exports2.NotificationType = NotificationType;
    var NotificationType0 = (
      /** @class */
      function(_super) {
        __extends(NotificationType02, _super);
        function NotificationType02(method) {
          var _this = _super.call(this, method, 0) || this;
          _this._ = void 0;
          return _this;
        }
        return NotificationType02;
      }(AbstractMessageType)
    );
    exports2.NotificationType0 = NotificationType0;
    var NotificationType1 = (
      /** @class */
      function(_super) {
        __extends(NotificationType12, _super);
        function NotificationType12(method) {
          var _this = _super.call(this, method, 1) || this;
          _this._ = void 0;
          return _this;
        }
        return NotificationType12;
      }(AbstractMessageType)
    );
    exports2.NotificationType1 = NotificationType1;
    var NotificationType2 = (
      /** @class */
      function(_super) {
        __extends(NotificationType22, _super);
        function NotificationType22(method) {
          var _this = _super.call(this, method, 2) || this;
          _this._ = void 0;
          return _this;
        }
        return NotificationType22;
      }(AbstractMessageType)
    );
    exports2.NotificationType2 = NotificationType2;
    var NotificationType3 = (
      /** @class */
      function(_super) {
        __extends(NotificationType32, _super);
        function NotificationType32(method) {
          var _this = _super.call(this, method, 3) || this;
          _this._ = void 0;
          return _this;
        }
        return NotificationType32;
      }(AbstractMessageType)
    );
    exports2.NotificationType3 = NotificationType3;
    var NotificationType4 = (
      /** @class */
      function(_super) {
        __extends(NotificationType42, _super);
        function NotificationType42(method) {
          var _this = _super.call(this, method, 4) || this;
          _this._ = void 0;
          return _this;
        }
        return NotificationType42;
      }(AbstractMessageType)
    );
    exports2.NotificationType4 = NotificationType4;
    var NotificationType5 = (
      /** @class */
      function(_super) {
        __extends(NotificationType52, _super);
        function NotificationType52(method) {
          var _this = _super.call(this, method, 5) || this;
          _this._ = void 0;
          return _this;
        }
        return NotificationType52;
      }(AbstractMessageType)
    );
    exports2.NotificationType5 = NotificationType5;
    var NotificationType6 = (
      /** @class */
      function(_super) {
        __extends(NotificationType62, _super);
        function NotificationType62(method) {
          var _this = _super.call(this, method, 6) || this;
          _this._ = void 0;
          return _this;
        }
        return NotificationType62;
      }(AbstractMessageType)
    );
    exports2.NotificationType6 = NotificationType6;
    var NotificationType7 = (
      /** @class */
      function(_super) {
        __extends(NotificationType72, _super);
        function NotificationType72(method) {
          var _this = _super.call(this, method, 7) || this;
          _this._ = void 0;
          return _this;
        }
        return NotificationType72;
      }(AbstractMessageType)
    );
    exports2.NotificationType7 = NotificationType7;
    var NotificationType8 = (
      /** @class */
      function(_super) {
        __extends(NotificationType82, _super);
        function NotificationType82(method) {
          var _this = _super.call(this, method, 8) || this;
          _this._ = void 0;
          return _this;
        }
        return NotificationType82;
      }(AbstractMessageType)
    );
    exports2.NotificationType8 = NotificationType8;
    var NotificationType9 = (
      /** @class */
      function(_super) {
        __extends(NotificationType92, _super);
        function NotificationType92(method) {
          var _this = _super.call(this, method, 9) || this;
          _this._ = void 0;
          return _this;
        }
        return NotificationType92;
      }(AbstractMessageType)
    );
    exports2.NotificationType9 = NotificationType9;
    function isRequestMessage(message) {
      var candidate = message;
      return candidate && is.string(candidate.method) && (is.string(candidate.id) || is.number(candidate.id));
    }
    exports2.isRequestMessage = isRequestMessage;
    function isNotificationMessage(message) {
      var candidate = message;
      return candidate && is.string(candidate.method) && message.id === void 0;
    }
    exports2.isNotificationMessage = isNotificationMessage;
    function isResponseMessage(message) {
      var candidate = message;
      return candidate && (candidate.result !== void 0 || !!candidate.error) && (is.string(candidate.id) || is.number(candidate.id) || candidate.id === null);
    }
    exports2.isResponseMessage = isResponseMessage;
  }
});

// node_modules/vscode-jsonrpc/lib/events.js
var require_events = __commonJS({
  "node_modules/vscode-jsonrpc/lib/events.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Disposable;
    (function(Disposable2) {
      function create(func) {
        return {
          dispose: func
        };
      }
      Disposable2.create = create;
    })(Disposable = exports2.Disposable || (exports2.Disposable = {}));
    var Event;
    (function(Event2) {
      var _disposable = { dispose: function() {
      } };
      Event2.None = function() {
        return _disposable;
      };
    })(Event = exports2.Event || (exports2.Event = {}));
    var CallbackList = (
      /** @class */
      function() {
        function CallbackList2() {
        }
        CallbackList2.prototype.add = function(callback, context, bucket) {
          var _this = this;
          if (context === void 0) {
            context = null;
          }
          if (!this._callbacks) {
            this._callbacks = [];
            this._contexts = [];
          }
          this._callbacks.push(callback);
          this._contexts.push(context);
          if (Array.isArray(bucket)) {
            bucket.push({ dispose: function() {
              return _this.remove(callback, context);
            } });
          }
        };
        CallbackList2.prototype.remove = function(callback, context) {
          if (context === void 0) {
            context = null;
          }
          if (!this._callbacks) {
            return;
          }
          var foundCallbackWithDifferentContext = false;
          for (var i = 0, len = this._callbacks.length; i < len; i++) {
            if (this._callbacks[i] === callback) {
              if (this._contexts[i] === context) {
                this._callbacks.splice(i, 1);
                this._contexts.splice(i, 1);
                return;
              } else {
                foundCallbackWithDifferentContext = true;
              }
            }
          }
          if (foundCallbackWithDifferentContext) {
            throw new Error("When adding a listener with a context, you should remove it with the same context");
          }
        };
        CallbackList2.prototype.invoke = function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          if (!this._callbacks) {
            return [];
          }
          var ret = [], callbacks = this._callbacks.slice(0), contexts = this._contexts.slice(0);
          for (var i = 0, len = callbacks.length; i < len; i++) {
            try {
              ret.push(callbacks[i].apply(contexts[i], args));
            } catch (e) {
              console.error(e);
            }
          }
          return ret;
        };
        CallbackList2.prototype.isEmpty = function() {
          return !this._callbacks || this._callbacks.length === 0;
        };
        CallbackList2.prototype.dispose = function() {
          this._callbacks = void 0;
          this._contexts = void 0;
        };
        return CallbackList2;
      }()
    );
    var Emitter = (
      /** @class */
      function() {
        function Emitter2(_options) {
          this._options = _options;
        }
        Object.defineProperty(Emitter2.prototype, "event", {
          /**
           * For the public to allow to subscribe
           * to events from this Emitter
           */
          get: function() {
            var _this = this;
            if (!this._event) {
              this._event = function(listener, thisArgs, disposables) {
                if (!_this._callbacks) {
                  _this._callbacks = new CallbackList();
                }
                if (_this._options && _this._options.onFirstListenerAdd && _this._callbacks.isEmpty()) {
                  _this._options.onFirstListenerAdd(_this);
                }
                _this._callbacks.add(listener, thisArgs);
                var result;
                result = {
                  dispose: function() {
                    _this._callbacks.remove(listener, thisArgs);
                    result.dispose = Emitter2._noop;
                    if (_this._options && _this._options.onLastListenerRemove && _this._callbacks.isEmpty()) {
                      _this._options.onLastListenerRemove(_this);
                    }
                  }
                };
                if (Array.isArray(disposables)) {
                  disposables.push(result);
                }
                return result;
              };
            }
            return this._event;
          },
          enumerable: true,
          configurable: true
        });
        Emitter2.prototype.fire = function(event) {
          if (this._callbacks) {
            this._callbacks.invoke.call(this._callbacks, event);
          }
        };
        Emitter2.prototype.dispose = function() {
          if (this._callbacks) {
            this._callbacks.dispose();
            this._callbacks = void 0;
          }
        };
        Emitter2._noop = function() {
        };
        return Emitter2;
      }()
    );
    exports2.Emitter = Emitter;
  }
});

// node_modules/vscode-jsonrpc/lib/messageReader.js
var require_messageReader = __commonJS({
  "node_modules/vscode-jsonrpc/lib/messageReader.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || function() {
      var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
        d.__proto__ = b;
      } || function(d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports2, "__esModule", { value: true });
    var events_1 = require_events();
    var Is = require_is();
    var DefaultSize = 8192;
    var CR = new Buffer("\r", "ascii")[0];
    var LF = new Buffer("\n", "ascii")[0];
    var CRLF = "\r\n";
    var MessageBuffer = (
      /** @class */
      function() {
        function MessageBuffer2(encoding) {
          if (encoding === void 0) {
            encoding = "utf8";
          }
          this.encoding = encoding;
          this.index = 0;
          this.buffer = new Buffer(DefaultSize);
        }
        MessageBuffer2.prototype.append = function(chunk) {
          var toAppend = chunk;
          if (typeof chunk == "string") {
            var str = chunk;
            var bufferLen = Buffer.byteLength(str, this.encoding);
            toAppend = new Buffer(bufferLen);
            toAppend.write(str, 0, bufferLen, this.encoding);
          }
          if (this.buffer.length - this.index >= toAppend.length) {
            toAppend.copy(this.buffer, this.index, 0, toAppend.length);
          } else {
            var newSize = (Math.ceil((this.index + toAppend.length) / DefaultSize) + 1) * DefaultSize;
            if (this.index === 0) {
              this.buffer = new Buffer(newSize);
              toAppend.copy(this.buffer, 0, 0, toAppend.length);
            } else {
              this.buffer = Buffer.concat([this.buffer.slice(0, this.index), toAppend], newSize);
            }
          }
          this.index += toAppend.length;
        };
        MessageBuffer2.prototype.tryReadHeaders = function() {
          var result = void 0;
          var current = 0;
          while (current + 3 < this.index && (this.buffer[current] !== CR || this.buffer[current + 1] !== LF || this.buffer[current + 2] !== CR || this.buffer[current + 3] !== LF)) {
            current++;
          }
          if (current + 3 >= this.index) {
            return result;
          }
          result = /* @__PURE__ */ Object.create(null);
          var headers = this.buffer.toString("ascii", 0, current).split(CRLF);
          headers.forEach(function(header) {
            var index = header.indexOf(":");
            if (index === -1) {
              throw new Error("Message header must separate key and value using :");
            }
            var key = header.substr(0, index);
            var value = header.substr(index + 1).trim();
            result[key] = value;
          });
          var nextStart = current + 4;
          this.buffer = this.buffer.slice(nextStart);
          this.index = this.index - nextStart;
          return result;
        };
        MessageBuffer2.prototype.tryReadContent = function(length) {
          if (this.index < length) {
            return null;
          }
          var result = this.buffer.toString(this.encoding, 0, length);
          var nextStart = length;
          this.buffer.copy(this.buffer, 0, nextStart);
          this.index = this.index - nextStart;
          return result;
        };
        Object.defineProperty(MessageBuffer2.prototype, "numberOfBytes", {
          get: function() {
            return this.index;
          },
          enumerable: true,
          configurable: true
        });
        return MessageBuffer2;
      }()
    );
    var MessageReader;
    (function(MessageReader2) {
      function is(value) {
        var candidate = value;
        return candidate && Is.func(candidate.listen) && Is.func(candidate.dispose) && Is.func(candidate.onError) && Is.func(candidate.onClose) && Is.func(candidate.onPartialMessage);
      }
      MessageReader2.is = is;
    })(MessageReader = exports2.MessageReader || (exports2.MessageReader = {}));
    var AbstractMessageReader = (
      /** @class */
      function() {
        function AbstractMessageReader2() {
          this.errorEmitter = new events_1.Emitter();
          this.closeEmitter = new events_1.Emitter();
          this.partialMessageEmitter = new events_1.Emitter();
        }
        AbstractMessageReader2.prototype.dispose = function() {
          this.errorEmitter.dispose();
          this.closeEmitter.dispose();
        };
        Object.defineProperty(AbstractMessageReader2.prototype, "onError", {
          get: function() {
            return this.errorEmitter.event;
          },
          enumerable: true,
          configurable: true
        });
        AbstractMessageReader2.prototype.fireError = function(error) {
          this.errorEmitter.fire(this.asError(error));
        };
        Object.defineProperty(AbstractMessageReader2.prototype, "onClose", {
          get: function() {
            return this.closeEmitter.event;
          },
          enumerable: true,
          configurable: true
        });
        AbstractMessageReader2.prototype.fireClose = function() {
          this.closeEmitter.fire(void 0);
        };
        Object.defineProperty(AbstractMessageReader2.prototype, "onPartialMessage", {
          get: function() {
            return this.partialMessageEmitter.event;
          },
          enumerable: true,
          configurable: true
        });
        AbstractMessageReader2.prototype.firePartialMessage = function(info) {
          this.partialMessageEmitter.fire(info);
        };
        AbstractMessageReader2.prototype.asError = function(error) {
          if (error instanceof Error) {
            return error;
          } else {
            return new Error("Reader recevied error. Reason: " + (Is.string(error.message) ? error.message : "unknown"));
          }
        };
        return AbstractMessageReader2;
      }()
    );
    exports2.AbstractMessageReader = AbstractMessageReader;
    var StreamMessageReader = (
      /** @class */
      function(_super) {
        __extends(StreamMessageReader2, _super);
        function StreamMessageReader2(readable, encoding) {
          if (encoding === void 0) {
            encoding = "utf8";
          }
          var _this = _super.call(this) || this;
          _this.readable = readable;
          _this.buffer = new MessageBuffer(encoding);
          _this._partialMessageTimeout = 1e4;
          return _this;
        }
        Object.defineProperty(StreamMessageReader2.prototype, "partialMessageTimeout", {
          get: function() {
            return this._partialMessageTimeout;
          },
          set: function(timeout) {
            this._partialMessageTimeout = timeout;
          },
          enumerable: true,
          configurable: true
        });
        StreamMessageReader2.prototype.listen = function(callback) {
          var _this = this;
          this.nextMessageLength = -1;
          this.messageToken = 0;
          this.partialMessageTimer = void 0;
          this.callback = callback;
          this.readable.on("data", function(data) {
            _this.onData(data);
          });
          this.readable.on("error", function(error) {
            return _this.fireError(error);
          });
          this.readable.on("close", function() {
            return _this.fireClose();
          });
        };
        StreamMessageReader2.prototype.onData = function(data) {
          this.buffer.append(data);
          while (true) {
            if (this.nextMessageLength === -1) {
              var headers = this.buffer.tryReadHeaders();
              if (!headers) {
                return;
              }
              var contentLength = headers["Content-Length"];
              if (!contentLength) {
                throw new Error("Header must provide a Content-Length property.");
              }
              var length = parseInt(contentLength);
              if (isNaN(length)) {
                throw new Error("Content-Length value must be a number.");
              }
              this.nextMessageLength = length;
            }
            var msg = this.buffer.tryReadContent(this.nextMessageLength);
            if (msg === null) {
              this.setPartialMessageTimer();
              return;
            }
            this.clearPartialMessageTimer();
            this.nextMessageLength = -1;
            this.messageToken++;
            var json = JSON.parse(msg);
            this.callback(json);
          }
        };
        StreamMessageReader2.prototype.clearPartialMessageTimer = function() {
          if (this.partialMessageTimer) {
            clearTimeout(this.partialMessageTimer);
            this.partialMessageTimer = void 0;
          }
        };
        StreamMessageReader2.prototype.setPartialMessageTimer = function() {
          var _this = this;
          this.clearPartialMessageTimer();
          if (this._partialMessageTimeout <= 0) {
            return;
          }
          this.partialMessageTimer = setTimeout(function(token, timeout) {
            _this.partialMessageTimer = void 0;
            if (token === _this.messageToken) {
              _this.firePartialMessage({ messageToken: token, waitingTime: timeout });
              _this.setPartialMessageTimer();
            }
          }, this._partialMessageTimeout, this.messageToken, this._partialMessageTimeout);
        };
        return StreamMessageReader2;
      }(AbstractMessageReader)
    );
    exports2.StreamMessageReader = StreamMessageReader;
    var IPCMessageReader = (
      /** @class */
      function(_super) {
        __extends(IPCMessageReader2, _super);
        function IPCMessageReader2(process2) {
          var _this = _super.call(this) || this;
          _this.process = process2;
          var eventEmitter = _this.process;
          eventEmitter.on("error", function(error) {
            return _this.fireError(error);
          });
          eventEmitter.on("close", function() {
            return _this.fireClose();
          });
          return _this;
        }
        IPCMessageReader2.prototype.listen = function(callback) {
          this.process.on("message", callback);
        };
        return IPCMessageReader2;
      }(AbstractMessageReader)
    );
    exports2.IPCMessageReader = IPCMessageReader;
    var SocketMessageReader = (
      /** @class */
      function(_super) {
        __extends(SocketMessageReader2, _super);
        function SocketMessageReader2(socket, encoding) {
          if (encoding === void 0) {
            encoding = "utf-8";
          }
          return _super.call(this, socket, encoding) || this;
        }
        return SocketMessageReader2;
      }(StreamMessageReader)
    );
    exports2.SocketMessageReader = SocketMessageReader;
  }
});

// node_modules/vscode-jsonrpc/lib/messageWriter.js
var require_messageWriter = __commonJS({
  "node_modules/vscode-jsonrpc/lib/messageWriter.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || function() {
      var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
        d.__proto__ = b;
      } || function(d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports2, "__esModule", { value: true });
    var events_1 = require_events();
    var Is = require_is();
    var ContentLength = "Content-Length: ";
    var CRLF = "\r\n";
    var MessageWriter;
    (function(MessageWriter2) {
      function is(value) {
        var candidate = value;
        return candidate && Is.func(candidate.dispose) && Is.func(candidate.onClose) && Is.func(candidate.onError) && Is.func(candidate.write);
      }
      MessageWriter2.is = is;
    })(MessageWriter = exports2.MessageWriter || (exports2.MessageWriter = {}));
    var AbstractMessageWriter = (
      /** @class */
      function() {
        function AbstractMessageWriter2() {
          this.errorEmitter = new events_1.Emitter();
          this.closeEmitter = new events_1.Emitter();
        }
        AbstractMessageWriter2.prototype.dispose = function() {
          this.errorEmitter.dispose();
          this.closeEmitter.dispose();
        };
        Object.defineProperty(AbstractMessageWriter2.prototype, "onError", {
          get: function() {
            return this.errorEmitter.event;
          },
          enumerable: true,
          configurable: true
        });
        AbstractMessageWriter2.prototype.fireError = function(error, message, count) {
          this.errorEmitter.fire([this.asError(error), message, count]);
        };
        Object.defineProperty(AbstractMessageWriter2.prototype, "onClose", {
          get: function() {
            return this.closeEmitter.event;
          },
          enumerable: true,
          configurable: true
        });
        AbstractMessageWriter2.prototype.fireClose = function() {
          this.closeEmitter.fire(void 0);
        };
        AbstractMessageWriter2.prototype.asError = function(error) {
          if (error instanceof Error) {
            return error;
          } else {
            return new Error("Writer recevied error. Reason: " + (Is.string(error.message) ? error.message : "unknown"));
          }
        };
        return AbstractMessageWriter2;
      }()
    );
    exports2.AbstractMessageWriter = AbstractMessageWriter;
    var StreamMessageWriter = (
      /** @class */
      function(_super) {
        __extends(StreamMessageWriter2, _super);
        function StreamMessageWriter2(writable, encoding) {
          if (encoding === void 0) {
            encoding = "utf8";
          }
          var _this = _super.call(this) || this;
          _this.writable = writable;
          _this.encoding = encoding;
          _this.errorCount = 0;
          _this.writable.on("error", function(error) {
            return _this.fireError(error);
          });
          _this.writable.on("close", function() {
            return _this.fireClose();
          });
          return _this;
        }
        StreamMessageWriter2.prototype.write = function(msg) {
          var json = JSON.stringify(msg);
          var contentLength = Buffer.byteLength(json, this.encoding);
          var headers = [
            ContentLength,
            contentLength.toString(),
            CRLF,
            CRLF
          ];
          try {
            this.writable.write(headers.join(""), "ascii");
            this.writable.write(json, this.encoding);
            this.errorCount = 0;
          } catch (error) {
            this.errorCount++;
            this.fireError(error, msg, this.errorCount);
          }
        };
        return StreamMessageWriter2;
      }(AbstractMessageWriter)
    );
    exports2.StreamMessageWriter = StreamMessageWriter;
    var IPCMessageWriter = (
      /** @class */
      function(_super) {
        __extends(IPCMessageWriter2, _super);
        function IPCMessageWriter2(process2) {
          var _this = _super.call(this) || this;
          _this.process = process2;
          _this.errorCount = 0;
          _this.queue = [];
          _this.sending = false;
          var eventEmitter = _this.process;
          eventEmitter.on("error", function(error) {
            return _this.fireError(error);
          });
          eventEmitter.on("close", function() {
            return _this.fireClose;
          });
          return _this;
        }
        IPCMessageWriter2.prototype.write = function(msg) {
          if (!this.sending && this.queue.length === 0) {
            this.doWriteMessage(msg);
          } else {
            this.queue.push(msg);
          }
        };
        IPCMessageWriter2.prototype.doWriteMessage = function(msg) {
          var _this = this;
          try {
            if (this.process.send) {
              this.sending = true;
              this.process.send(msg, void 0, void 0, function(error) {
                _this.sending = false;
                if (error) {
                  _this.errorCount++;
                  _this.fireError(error, msg, _this.errorCount);
                } else {
                  _this.errorCount = 0;
                }
                if (_this.queue.length > 0) {
                  _this.doWriteMessage(_this.queue.shift());
                }
              });
            }
          } catch (error) {
            this.errorCount++;
            this.fireError(error, msg, this.errorCount);
          }
        };
        return IPCMessageWriter2;
      }(AbstractMessageWriter)
    );
    exports2.IPCMessageWriter = IPCMessageWriter;
    var SocketMessageWriter = (
      /** @class */
      function(_super) {
        __extends(SocketMessageWriter2, _super);
        function SocketMessageWriter2(socket, encoding) {
          if (encoding === void 0) {
            encoding = "utf8";
          }
          var _this = _super.call(this) || this;
          _this.socket = socket;
          _this.queue = [];
          _this.sending = false;
          _this.encoding = encoding;
          _this.errorCount = 0;
          _this.socket.on("error", function(error) {
            return _this.fireError(error);
          });
          _this.socket.on("close", function() {
            return _this.fireClose();
          });
          return _this;
        }
        SocketMessageWriter2.prototype.write = function(msg) {
          if (!this.sending && this.queue.length === 0) {
            this.doWriteMessage(msg);
          } else {
            this.queue.push(msg);
          }
        };
        SocketMessageWriter2.prototype.doWriteMessage = function(msg) {
          var _this = this;
          var json = JSON.stringify(msg);
          var contentLength = Buffer.byteLength(json, this.encoding);
          var headers = [
            ContentLength,
            contentLength.toString(),
            CRLF,
            CRLF
          ];
          try {
            this.sending = true;
            this.socket.write(headers.join(""), "ascii", function(error) {
              if (error) {
                _this.handleError(error, msg);
              }
              try {
                _this.socket.write(json, _this.encoding, function(error2) {
                  _this.sending = false;
                  if (error2) {
                    _this.handleError(error2, msg);
                  } else {
                    _this.errorCount = 0;
                  }
                  if (_this.queue.length > 0) {
                    _this.doWriteMessage(_this.queue.shift());
                  }
                });
              } catch (error2) {
                _this.handleError(error2, msg);
              }
            });
          } catch (error) {
            this.handleError(error, msg);
          }
        };
        SocketMessageWriter2.prototype.handleError = function(error, msg) {
          this.errorCount++;
          this.fireError(error, msg, this.errorCount);
        };
        return SocketMessageWriter2;
      }(AbstractMessageWriter)
    );
    exports2.SocketMessageWriter = SocketMessageWriter;
  }
});

// node_modules/vscode-jsonrpc/lib/cancellation.js
var require_cancellation = __commonJS({
  "node_modules/vscode-jsonrpc/lib/cancellation.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var events_1 = require_events();
    var Is = require_is();
    var CancellationToken;
    (function(CancellationToken2) {
      CancellationToken2.None = Object.freeze({
        isCancellationRequested: false,
        onCancellationRequested: events_1.Event.None
      });
      CancellationToken2.Cancelled = Object.freeze({
        isCancellationRequested: true,
        onCancellationRequested: events_1.Event.None
      });
      function is(value) {
        var candidate = value;
        return candidate && (candidate === CancellationToken2.None || candidate === CancellationToken2.Cancelled || Is.boolean(candidate.isCancellationRequested) && !!candidate.onCancellationRequested);
      }
      CancellationToken2.is = is;
    })(CancellationToken = exports2.CancellationToken || (exports2.CancellationToken = {}));
    var shortcutEvent = Object.freeze(function(callback, context) {
      var handle = setTimeout(callback.bind(context), 0);
      return { dispose: function() {
        clearTimeout(handle);
      } };
    });
    var MutableToken = (
      /** @class */
      function() {
        function MutableToken2() {
          this._isCancelled = false;
        }
        MutableToken2.prototype.cancel = function() {
          if (!this._isCancelled) {
            this._isCancelled = true;
            if (this._emitter) {
              this._emitter.fire(void 0);
              this._emitter = void 0;
            }
          }
        };
        Object.defineProperty(MutableToken2.prototype, "isCancellationRequested", {
          get: function() {
            return this._isCancelled;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(MutableToken2.prototype, "onCancellationRequested", {
          get: function() {
            if (this._isCancelled) {
              return shortcutEvent;
            }
            if (!this._emitter) {
              this._emitter = new events_1.Emitter();
            }
            return this._emitter.event;
          },
          enumerable: true,
          configurable: true
        });
        return MutableToken2;
      }()
    );
    var CancellationTokenSource = (
      /** @class */
      function() {
        function CancellationTokenSource2() {
        }
        Object.defineProperty(CancellationTokenSource2.prototype, "token", {
          get: function() {
            if (!this._token) {
              this._token = new MutableToken();
            }
            return this._token;
          },
          enumerable: true,
          configurable: true
        });
        CancellationTokenSource2.prototype.cancel = function() {
          if (!this._token) {
            this._token = CancellationToken.Cancelled;
          } else {
            this._token.cancel();
          }
        };
        CancellationTokenSource2.prototype.dispose = function() {
          this.cancel();
        };
        return CancellationTokenSource2;
      }()
    );
    exports2.CancellationTokenSource = CancellationTokenSource;
  }
});

// node_modules/vscode-jsonrpc/lib/linkedMap.js
var require_linkedMap = __commonJS({
  "node_modules/vscode-jsonrpc/lib/linkedMap.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Touch;
    (function(Touch2) {
      Touch2.None = 0;
      Touch2.First = 1;
      Touch2.Last = 2;
    })(Touch = exports2.Touch || (exports2.Touch = {}));
    var LinkedMap = (
      /** @class */
      function() {
        function LinkedMap2() {
          this._map = /* @__PURE__ */ new Map();
          this._head = void 0;
          this._tail = void 0;
          this._size = 0;
        }
        LinkedMap2.prototype.clear = function() {
          this._map.clear();
          this._head = void 0;
          this._tail = void 0;
          this._size = 0;
        };
        LinkedMap2.prototype.isEmpty = function() {
          return !this._head && !this._tail;
        };
        Object.defineProperty(LinkedMap2.prototype, "size", {
          get: function() {
            return this._size;
          },
          enumerable: true,
          configurable: true
        });
        LinkedMap2.prototype.has = function(key) {
          return this._map.has(key);
        };
        LinkedMap2.prototype.get = function(key) {
          var item = this._map.get(key);
          if (!item) {
            return void 0;
          }
          return item.value;
        };
        LinkedMap2.prototype.set = function(key, value, touch) {
          if (touch === void 0) {
            touch = Touch.None;
          }
          var item = this._map.get(key);
          if (item) {
            item.value = value;
            if (touch !== Touch.None) {
              this.touch(item, touch);
            }
          } else {
            item = { key, value, next: void 0, previous: void 0 };
            switch (touch) {
              case Touch.None:
                this.addItemLast(item);
                break;
              case Touch.First:
                this.addItemFirst(item);
                break;
              case Touch.Last:
                this.addItemLast(item);
                break;
              default:
                this.addItemLast(item);
                break;
            }
            this._map.set(key, item);
            this._size++;
          }
        };
        LinkedMap2.prototype.delete = function(key) {
          var item = this._map.get(key);
          if (!item) {
            return false;
          }
          this._map.delete(key);
          this.removeItem(item);
          this._size--;
          return true;
        };
        LinkedMap2.prototype.shift = function() {
          if (!this._head && !this._tail) {
            return void 0;
          }
          if (!this._head || !this._tail) {
            throw new Error("Invalid list");
          }
          var item = this._head;
          this._map.delete(item.key);
          this.removeItem(item);
          this._size--;
          return item.value;
        };
        LinkedMap2.prototype.forEach = function(callbackfn, thisArg) {
          var current = this._head;
          while (current) {
            if (thisArg) {
              callbackfn.bind(thisArg)(current.value, current.key, this);
            } else {
              callbackfn(current.value, current.key, this);
            }
            current = current.next;
          }
        };
        LinkedMap2.prototype.forEachReverse = function(callbackfn, thisArg) {
          var current = this._tail;
          while (current) {
            if (thisArg) {
              callbackfn.bind(thisArg)(current.value, current.key, this);
            } else {
              callbackfn(current.value, current.key, this);
            }
            current = current.previous;
          }
        };
        LinkedMap2.prototype.values = function() {
          var result = [];
          var current = this._head;
          while (current) {
            result.push(current.value);
            current = current.next;
          }
          return result;
        };
        LinkedMap2.prototype.keys = function() {
          var result = [];
          var current = this._head;
          while (current) {
            result.push(current.key);
            current = current.next;
          }
          return result;
        };
        LinkedMap2.prototype.addItemFirst = function(item) {
          if (!this._head && !this._tail) {
            this._tail = item;
          } else if (!this._head) {
            throw new Error("Invalid list");
          } else {
            item.next = this._head;
            this._head.previous = item;
          }
          this._head = item;
        };
        LinkedMap2.prototype.addItemLast = function(item) {
          if (!this._head && !this._tail) {
            this._head = item;
          } else if (!this._tail) {
            throw new Error("Invalid list");
          } else {
            item.previous = this._tail;
            this._tail.next = item;
          }
          this._tail = item;
        };
        LinkedMap2.prototype.removeItem = function(item) {
          if (item === this._head && item === this._tail) {
            this._head = void 0;
            this._tail = void 0;
          } else if (item === this._head) {
            this._head = item.next;
          } else if (item === this._tail) {
            this._tail = item.previous;
          } else {
            var next = item.next;
            var previous = item.previous;
            if (!next || !previous) {
              throw new Error("Invalid list");
            }
            next.previous = previous;
            previous.next = next;
          }
        };
        LinkedMap2.prototype.touch = function(item, touch) {
          if (!this._head || !this._tail) {
            throw new Error("Invalid list");
          }
          if (touch !== Touch.First && touch !== Touch.Last) {
            return;
          }
          if (touch === Touch.First) {
            if (item === this._head) {
              return;
            }
            var next = item.next;
            var previous = item.previous;
            if (item === this._tail) {
              previous.next = void 0;
              this._tail = previous;
            } else {
              next.previous = previous;
              previous.next = next;
            }
            item.previous = void 0;
            item.next = this._head;
            this._head.previous = item;
            this._head = item;
          } else if (touch === Touch.Last) {
            if (item === this._tail) {
              return;
            }
            var next = item.next;
            var previous = item.previous;
            if (item === this._head) {
              next.previous = void 0;
              this._head = next;
            } else {
              next.previous = previous;
              previous.next = next;
            }
            item.next = void 0;
            item.previous = this._tail;
            this._tail.next = item;
            this._tail = item;
          }
        };
        return LinkedMap2;
      }()
    );
    exports2.LinkedMap = LinkedMap;
  }
});

// node_modules/vscode-jsonrpc/lib/pipeSupport.js
var require_pipeSupport = __commonJS({
  "node_modules/vscode-jsonrpc/lib/pipeSupport.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path_1 = require("path");
    var os_1 = require("os");
    var crypto_1 = require("crypto");
    var net_1 = require("net");
    var messageReader_1 = require_messageReader();
    var messageWriter_1 = require_messageWriter();
    function generateRandomPipeName() {
      var randomSuffix = crypto_1.randomBytes(21).toString("hex");
      if (process.platform === "win32") {
        return "\\\\.\\pipe\\vscode-jsonrpc-" + randomSuffix + "-sock";
      } else {
        return path_1.join(os_1.tmpdir(), "vscode-" + randomSuffix + ".sock");
      }
    }
    exports2.generateRandomPipeName = generateRandomPipeName;
    function createClientPipeTransport(pipeName, encoding) {
      if (encoding === void 0) {
        encoding = "utf-8";
      }
      var connectResolve;
      var connected = new Promise(function(resolve, _reject) {
        connectResolve = resolve;
      });
      return new Promise(function(resolve, reject) {
        var server = net_1.createServer(function(socket) {
          server.close();
          connectResolve([
            new messageReader_1.SocketMessageReader(socket, encoding),
            new messageWriter_1.SocketMessageWriter(socket, encoding)
          ]);
        });
        server.on("error", reject);
        server.listen(pipeName, function() {
          server.removeListener("error", reject);
          resolve({
            onConnected: function() {
              return connected;
            }
          });
        });
      });
    }
    exports2.createClientPipeTransport = createClientPipeTransport;
    function createServerPipeTransport(pipeName, encoding) {
      if (encoding === void 0) {
        encoding = "utf-8";
      }
      var socket = net_1.createConnection(pipeName);
      return [
        new messageReader_1.SocketMessageReader(socket, encoding),
        new messageWriter_1.SocketMessageWriter(socket, encoding)
      ];
    }
    exports2.createServerPipeTransport = createServerPipeTransport;
  }
});

// node_modules/vscode-jsonrpc/lib/socketSupport.js
var require_socketSupport = __commonJS({
  "node_modules/vscode-jsonrpc/lib/socketSupport.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var net_1 = require("net");
    var messageReader_1 = require_messageReader();
    var messageWriter_1 = require_messageWriter();
    function createClientSocketTransport(port, encoding) {
      if (encoding === void 0) {
        encoding = "utf-8";
      }
      var connectResolve;
      var connected = new Promise(function(resolve, _reject) {
        connectResolve = resolve;
      });
      return new Promise(function(resolve, reject) {
        var server = net_1.createServer(function(socket) {
          server.close();
          connectResolve([
            new messageReader_1.SocketMessageReader(socket, encoding),
            new messageWriter_1.SocketMessageWriter(socket, encoding)
          ]);
        });
        server.on("error", reject);
        server.listen(port, "127.0.0.1", function() {
          server.removeListener("error", reject);
          resolve({
            onConnected: function() {
              return connected;
            }
          });
        });
      });
    }
    exports2.createClientSocketTransport = createClientSocketTransport;
    function createServerSocketTransport(port, encoding) {
      if (encoding === void 0) {
        encoding = "utf-8";
      }
      var socket = net_1.createConnection(port, "127.0.0.1");
      return [
        new messageReader_1.SocketMessageReader(socket, encoding),
        new messageWriter_1.SocketMessageWriter(socket, encoding)
      ];
    }
    exports2.createServerSocketTransport = createServerSocketTransport;
  }
});

// node_modules/vscode-jsonrpc/lib/main.js
var require_main = __commonJS({
  "node_modules/vscode-jsonrpc/lib/main.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || function() {
      var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
        d.__proto__ = b;
      } || function(d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    function __export2(m) {
      for (var p in m) if (!exports2.hasOwnProperty(p)) exports2[p] = m[p];
    }
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Is = require_is();
    var messages_1 = require_messages();
    exports2.RequestType = messages_1.RequestType;
    exports2.RequestType0 = messages_1.RequestType0;
    exports2.RequestType1 = messages_1.RequestType1;
    exports2.RequestType2 = messages_1.RequestType2;
    exports2.RequestType3 = messages_1.RequestType3;
    exports2.RequestType4 = messages_1.RequestType4;
    exports2.RequestType5 = messages_1.RequestType5;
    exports2.RequestType6 = messages_1.RequestType6;
    exports2.RequestType7 = messages_1.RequestType7;
    exports2.RequestType8 = messages_1.RequestType8;
    exports2.RequestType9 = messages_1.RequestType9;
    exports2.ResponseError = messages_1.ResponseError;
    exports2.ErrorCodes = messages_1.ErrorCodes;
    exports2.NotificationType = messages_1.NotificationType;
    exports2.NotificationType0 = messages_1.NotificationType0;
    exports2.NotificationType1 = messages_1.NotificationType1;
    exports2.NotificationType2 = messages_1.NotificationType2;
    exports2.NotificationType3 = messages_1.NotificationType3;
    exports2.NotificationType4 = messages_1.NotificationType4;
    exports2.NotificationType5 = messages_1.NotificationType5;
    exports2.NotificationType6 = messages_1.NotificationType6;
    exports2.NotificationType7 = messages_1.NotificationType7;
    exports2.NotificationType8 = messages_1.NotificationType8;
    exports2.NotificationType9 = messages_1.NotificationType9;
    var messageReader_1 = require_messageReader();
    exports2.MessageReader = messageReader_1.MessageReader;
    exports2.StreamMessageReader = messageReader_1.StreamMessageReader;
    exports2.IPCMessageReader = messageReader_1.IPCMessageReader;
    exports2.SocketMessageReader = messageReader_1.SocketMessageReader;
    var messageWriter_1 = require_messageWriter();
    exports2.MessageWriter = messageWriter_1.MessageWriter;
    exports2.StreamMessageWriter = messageWriter_1.StreamMessageWriter;
    exports2.IPCMessageWriter = messageWriter_1.IPCMessageWriter;
    exports2.SocketMessageWriter = messageWriter_1.SocketMessageWriter;
    var events_1 = require_events();
    exports2.Disposable = events_1.Disposable;
    exports2.Event = events_1.Event;
    exports2.Emitter = events_1.Emitter;
    var cancellation_1 = require_cancellation();
    exports2.CancellationTokenSource = cancellation_1.CancellationTokenSource;
    exports2.CancellationToken = cancellation_1.CancellationToken;
    var linkedMap_1 = require_linkedMap();
    __export2(require_pipeSupport());
    __export2(require_socketSupport());
    var CancelNotification;
    (function(CancelNotification2) {
      CancelNotification2.type = new messages_1.NotificationType("$/cancelRequest");
    })(CancelNotification || (CancelNotification = {}));
    exports2.NullLogger = Object.freeze({
      error: function() {
      },
      warn: function() {
      },
      info: function() {
      },
      log: function() {
      }
    });
    var Trace;
    (function(Trace2) {
      Trace2[Trace2["Off"] = 0] = "Off";
      Trace2[Trace2["Messages"] = 1] = "Messages";
      Trace2[Trace2["Verbose"] = 2] = "Verbose";
    })(Trace = exports2.Trace || (exports2.Trace = {}));
    (function(Trace2) {
      function fromString(value) {
        value = value.toLowerCase();
        switch (value) {
          case "off":
            return Trace2.Off;
          case "messages":
            return Trace2.Messages;
          case "verbose":
            return Trace2.Verbose;
          default:
            return Trace2.Off;
        }
      }
      Trace2.fromString = fromString;
      function toString(value) {
        switch (value) {
          case Trace2.Off:
            return "off";
          case Trace2.Messages:
            return "messages";
          case Trace2.Verbose:
            return "verbose";
          default:
            return "off";
        }
      }
      Trace2.toString = toString;
    })(Trace = exports2.Trace || (exports2.Trace = {}));
    var SetTraceNotification;
    (function(SetTraceNotification2) {
      SetTraceNotification2.type = new messages_1.NotificationType("$/setTraceNotification");
    })(SetTraceNotification = exports2.SetTraceNotification || (exports2.SetTraceNotification = {}));
    var LogTraceNotification;
    (function(LogTraceNotification2) {
      LogTraceNotification2.type = new messages_1.NotificationType("$/logTraceNotification");
    })(LogTraceNotification = exports2.LogTraceNotification || (exports2.LogTraceNotification = {}));
    var ConnectionErrors;
    (function(ConnectionErrors2) {
      ConnectionErrors2[ConnectionErrors2["Closed"] = 1] = "Closed";
      ConnectionErrors2[ConnectionErrors2["Disposed"] = 2] = "Disposed";
      ConnectionErrors2[ConnectionErrors2["AlreadyListening"] = 3] = "AlreadyListening";
    })(ConnectionErrors = exports2.ConnectionErrors || (exports2.ConnectionErrors = {}));
    var ConnectionError = (
      /** @class */
      function(_super) {
        __extends(ConnectionError2, _super);
        function ConnectionError2(code, message) {
          var _this = _super.call(this, message) || this;
          _this.code = code;
          Object.setPrototypeOf(_this, ConnectionError2.prototype);
          return _this;
        }
        return ConnectionError2;
      }(Error)
    );
    exports2.ConnectionError = ConnectionError;
    var ConnectionStrategy;
    (function(ConnectionStrategy2) {
      function is(value) {
        var candidate = value;
        return candidate && Is.func(candidate.cancelUndispatched);
      }
      ConnectionStrategy2.is = is;
    })(ConnectionStrategy = exports2.ConnectionStrategy || (exports2.ConnectionStrategy = {}));
    var ConnectionState;
    (function(ConnectionState2) {
      ConnectionState2[ConnectionState2["New"] = 1] = "New";
      ConnectionState2[ConnectionState2["Listening"] = 2] = "Listening";
      ConnectionState2[ConnectionState2["Closed"] = 3] = "Closed";
      ConnectionState2[ConnectionState2["Disposed"] = 4] = "Disposed";
    })(ConnectionState || (ConnectionState = {}));
    function _createMessageConnection(messageReader, messageWriter, logger, strategy) {
      var sequenceNumber = 0;
      var notificationSquenceNumber = 0;
      var unknownResponseSquenceNumber = 0;
      var version = "2.0";
      var starRequestHandler = void 0;
      var requestHandlers = /* @__PURE__ */ Object.create(null);
      var starNotificationHandler = void 0;
      var notificationHandlers = /* @__PURE__ */ Object.create(null);
      var timer;
      var messageQueue = new linkedMap_1.LinkedMap();
      var responsePromises = /* @__PURE__ */ Object.create(null);
      var requestTokens = /* @__PURE__ */ Object.create(null);
      var trace = Trace.Off;
      var tracer;
      var state = ConnectionState.New;
      var errorEmitter = new events_1.Emitter();
      var closeEmitter = new events_1.Emitter();
      var unhandledNotificationEmitter = new events_1.Emitter();
      var disposeEmitter = new events_1.Emitter();
      function createRequestQueueKey(id) {
        return "req-" + id.toString();
      }
      function createResponseQueueKey(id) {
        if (id === null) {
          return "res-unknown-" + (++unknownResponseSquenceNumber).toString();
        } else {
          return "res-" + id.toString();
        }
      }
      function createNotificationQueueKey() {
        return "not-" + (++notificationSquenceNumber).toString();
      }
      function addMessageToQueue(queue, message) {
        if (messages_1.isRequestMessage(message)) {
          queue.set(createRequestQueueKey(message.id), message);
        } else if (messages_1.isResponseMessage(message)) {
          queue.set(createResponseQueueKey(message.id), message);
        } else {
          queue.set(createNotificationQueueKey(), message);
        }
      }
      function cancelUndispatched(_message) {
        return void 0;
      }
      function isListening() {
        return state === ConnectionState.Listening;
      }
      function isClosed() {
        return state === ConnectionState.Closed;
      }
      function isDisposed() {
        return state === ConnectionState.Disposed;
      }
      function closeHandler() {
        if (state === ConnectionState.New || state === ConnectionState.Listening) {
          state = ConnectionState.Closed;
          closeEmitter.fire(void 0);
        }
      }
      ;
      function readErrorHandler(error) {
        errorEmitter.fire([error, void 0, void 0]);
      }
      function writeErrorHandler(data) {
        errorEmitter.fire(data);
      }
      messageReader.onClose(closeHandler);
      messageReader.onError(readErrorHandler);
      messageWriter.onClose(closeHandler);
      messageWriter.onError(writeErrorHandler);
      function triggerMessageQueue() {
        if (timer || messageQueue.size === 0) {
          return;
        }
        timer = setImmediate(function() {
          timer = void 0;
          processMessageQueue();
        });
      }
      function processMessageQueue() {
        if (messageQueue.size === 0) {
          return;
        }
        var message = messageQueue.shift();
        try {
          if (messages_1.isRequestMessage(message)) {
            handleRequest(message);
          } else if (messages_1.isNotificationMessage(message)) {
            handleNotification(message);
          } else if (messages_1.isResponseMessage(message)) {
            handleResponse(message);
          } else {
            handleInvalidMessage(message);
          }
        } finally {
          triggerMessageQueue();
        }
      }
      var callback = function(message) {
        try {
          if (messages_1.isNotificationMessage(message) && message.method === CancelNotification.type.method) {
            var key = createRequestQueueKey(message.params.id);
            var toCancel = messageQueue.get(key);
            if (messages_1.isRequestMessage(toCancel)) {
              var response = strategy && strategy.cancelUndispatched ? strategy.cancelUndispatched(toCancel, cancelUndispatched) : cancelUndispatched(toCancel);
              if (response && (response.error !== void 0 || response.result !== void 0)) {
                messageQueue.delete(key);
                response.id = toCancel.id;
                traceSendingResponse(response, message.method, Date.now());
                messageWriter.write(response);
                return;
              }
            }
          }
          addMessageToQueue(messageQueue, message);
        } finally {
          triggerMessageQueue();
        }
      };
      function handleRequest(requestMessage) {
        if (isDisposed()) {
          return;
        }
        function reply(resultOrError, method, startTime2) {
          var message = {
            jsonrpc: version,
            id: requestMessage.id
          };
          if (resultOrError instanceof messages_1.ResponseError) {
            message.error = resultOrError.toJson();
          } else {
            message.result = resultOrError === void 0 ? null : resultOrError;
          }
          traceSendingResponse(message, method, startTime2);
          messageWriter.write(message);
        }
        function replyError(error, method, startTime2) {
          var message = {
            jsonrpc: version,
            id: requestMessage.id,
            error: error.toJson()
          };
          traceSendingResponse(message, method, startTime2);
          messageWriter.write(message);
        }
        function replySuccess(result, method, startTime2) {
          if (result === void 0) {
            result = null;
          }
          var message = {
            jsonrpc: version,
            id: requestMessage.id,
            result
          };
          traceSendingResponse(message, method, startTime2);
          messageWriter.write(message);
        }
        traceReceivedRequest(requestMessage);
        var element = requestHandlers[requestMessage.method];
        var type;
        var requestHandler;
        if (element) {
          type = element.type;
          requestHandler = element.handler;
        }
        var startTime = Date.now();
        if (requestHandler || starRequestHandler) {
          var cancellationSource = new cancellation_1.CancellationTokenSource();
          var tokenKey_1 = String(requestMessage.id);
          requestTokens[tokenKey_1] = cancellationSource;
          try {
            var handlerResult = void 0;
            if (requestMessage.params === void 0 || type !== void 0 && type.numberOfParams === 0) {
              handlerResult = requestHandler ? requestHandler(cancellationSource.token) : starRequestHandler(requestMessage.method, cancellationSource.token);
            } else if (Is.array(requestMessage.params) && (type === void 0 || type.numberOfParams > 1)) {
              handlerResult = requestHandler ? requestHandler.apply(void 0, requestMessage.params.concat([cancellationSource.token])) : starRequestHandler.apply(void 0, [requestMessage.method].concat(requestMessage.params, [cancellationSource.token]));
            } else {
              handlerResult = requestHandler ? requestHandler(requestMessage.params, cancellationSource.token) : starRequestHandler(requestMessage.method, requestMessage.params, cancellationSource.token);
            }
            var promise = handlerResult;
            if (!handlerResult) {
              delete requestTokens[tokenKey_1];
              replySuccess(handlerResult, requestMessage.method, startTime);
            } else if (promise.then) {
              promise.then(function(resultOrError) {
                delete requestTokens[tokenKey_1];
                reply(resultOrError, requestMessage.method, startTime);
              }, function(error) {
                delete requestTokens[tokenKey_1];
                if (error instanceof messages_1.ResponseError) {
                  replyError(error, requestMessage.method, startTime);
                } else if (error && Is.string(error.message)) {
                  replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, "Request " + requestMessage.method + " failed with message: " + error.message), requestMessage.method, startTime);
                } else {
                  replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, "Request " + requestMessage.method + " failed unexpectedly without providing any details."), requestMessage.method, startTime);
                }
              });
            } else {
              delete requestTokens[tokenKey_1];
              reply(handlerResult, requestMessage.method, startTime);
            }
          } catch (error) {
            delete requestTokens[tokenKey_1];
            if (error instanceof messages_1.ResponseError) {
              reply(error, requestMessage.method, startTime);
            } else if (error && Is.string(error.message)) {
              replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, "Request " + requestMessage.method + " failed with message: " + error.message), requestMessage.method, startTime);
            } else {
              replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, "Request " + requestMessage.method + " failed unexpectedly without providing any details."), requestMessage.method, startTime);
            }
          }
        } else {
          replyError(new messages_1.ResponseError(messages_1.ErrorCodes.MethodNotFound, "Unhandled method " + requestMessage.method), requestMessage.method, startTime);
        }
      }
      function handleResponse(responseMessage) {
        if (isDisposed()) {
          return;
        }
        if (responseMessage.id === null) {
          if (responseMessage.error) {
            logger.error("Received response message without id: Error is: \n" + JSON.stringify(responseMessage.error, void 0, 4));
          } else {
            logger.error("Received response message without id. No further error information provided.");
          }
        } else {
          var key = String(responseMessage.id);
          var responsePromise = responsePromises[key];
          traceReceivedResponse(responseMessage, responsePromise);
          if (responsePromise) {
            delete responsePromises[key];
            try {
              if (responseMessage.error) {
                var error = responseMessage.error;
                responsePromise.reject(new messages_1.ResponseError(error.code, error.message, error.data));
              } else if (responseMessage.result !== void 0) {
                responsePromise.resolve(responseMessage.result);
              } else {
                throw new Error("Should never happen.");
              }
            } catch (error2) {
              if (error2.message) {
                logger.error("Response handler '" + responsePromise.method + "' failed with message: " + error2.message);
              } else {
                logger.error("Response handler '" + responsePromise.method + "' failed unexpectedly.");
              }
            }
          }
        }
      }
      function handleNotification(message) {
        if (isDisposed()) {
          return;
        }
        var type = void 0;
        var notificationHandler;
        if (message.method === CancelNotification.type.method) {
          notificationHandler = function(params) {
            var id = params.id;
            var source = requestTokens[String(id)];
            if (source) {
              source.cancel();
            }
          };
        } else {
          var element = notificationHandlers[message.method];
          if (element) {
            notificationHandler = element.handler;
            type = element.type;
          }
        }
        if (notificationHandler || starNotificationHandler) {
          try {
            traceReceivedNotification(message);
            if (message.params === void 0 || type !== void 0 && type.numberOfParams === 0) {
              notificationHandler ? notificationHandler() : starNotificationHandler(message.method);
            } else if (Is.array(message.params) && (type === void 0 || type.numberOfParams > 1)) {
              notificationHandler ? notificationHandler.apply(void 0, message.params) : starNotificationHandler.apply(void 0, [message.method].concat(message.params));
            } else {
              notificationHandler ? notificationHandler(message.params) : starNotificationHandler(message.method, message.params);
            }
          } catch (error) {
            if (error.message) {
              logger.error("Notification handler '" + message.method + "' failed with message: " + error.message);
            } else {
              logger.error("Notification handler '" + message.method + "' failed unexpectedly.");
            }
          }
        } else {
          unhandledNotificationEmitter.fire(message);
        }
      }
      function handleInvalidMessage(message) {
        if (!message) {
          logger.error("Received empty message.");
          return;
        }
        logger.error("Received message which is neither a response nor a notification message:\n" + JSON.stringify(message, null, 4));
        var responseMessage = message;
        if (Is.string(responseMessage.id) || Is.number(responseMessage.id)) {
          var key = String(responseMessage.id);
          var responseHandler = responsePromises[key];
          if (responseHandler) {
            responseHandler.reject(new Error("The received response has neither a result nor an error property."));
          }
        }
      }
      function traceSendingRequest(message) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        var data = void 0;
        if (trace === Trace.Verbose && message.params) {
          data = "Params: " + JSON.stringify(message.params, null, 4) + "\n\n";
        }
        tracer.log("Sending request '" + message.method + " - (" + message.id + ")'.", data);
      }
      function traceSendNotification(message) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        var data = void 0;
        if (trace === Trace.Verbose) {
          if (message.params) {
            data = "Params: " + JSON.stringify(message.params, null, 4) + "\n\n";
          } else {
            data = "No parameters provided.\n\n";
          }
        }
        tracer.log("Sending notification '" + message.method + "'.", data);
      }
      function traceSendingResponse(message, method, startTime) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        var data = void 0;
        if (trace === Trace.Verbose) {
          if (message.error && message.error.data) {
            data = "Error data: " + JSON.stringify(message.error.data, null, 4) + "\n\n";
          } else {
            if (message.result) {
              data = "Result: " + JSON.stringify(message.result, null, 4) + "\n\n";
            } else if (message.error === void 0) {
              data = "No result returned.\n\n";
            }
          }
        }
        tracer.log("Sending response '" + method + " - (" + message.id + ")'. Processing request took " + (Date.now() - startTime) + "ms", data);
      }
      function traceReceivedRequest(message) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        var data = void 0;
        if (trace === Trace.Verbose && message.params) {
          data = "Params: " + JSON.stringify(message.params, null, 4) + "\n\n";
        }
        tracer.log("Received request '" + message.method + " - (" + message.id + ")'.", data);
      }
      function traceReceivedNotification(message) {
        if (trace === Trace.Off || !tracer || message.method === LogTraceNotification.type.method) {
          return;
        }
        var data = void 0;
        if (trace === Trace.Verbose) {
          if (message.params) {
            data = "Params: " + JSON.stringify(message.params, null, 4) + "\n\n";
          } else {
            data = "No parameters provided.\n\n";
          }
        }
        tracer.log("Received notification '" + message.method + "'.", data);
      }
      function traceReceivedResponse(message, responsePromise) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        var data = void 0;
        if (trace === Trace.Verbose) {
          if (message.error && message.error.data) {
            data = "Error data: " + JSON.stringify(message.error.data, null, 4) + "\n\n";
          } else {
            if (message.result) {
              data = "Result: " + JSON.stringify(message.result, null, 4) + "\n\n";
            } else if (message.error === void 0) {
              data = "No result returned.\n\n";
            }
          }
        }
        if (responsePromise) {
          var error = message.error ? " Request failed: " + message.error.message + " (" + message.error.code + ")." : "";
          tracer.log("Received response '" + responsePromise.method + " - (" + message.id + ")' in " + (Date.now() - responsePromise.timerStart) + "ms." + error, data);
        } else {
          tracer.log("Received response " + message.id + " without active response promise.", data);
        }
      }
      function throwIfClosedOrDisposed() {
        if (isClosed()) {
          throw new ConnectionError(ConnectionErrors.Closed, "Connection is closed.");
        }
        if (isDisposed()) {
          throw new ConnectionError(ConnectionErrors.Disposed, "Connection is disposed.");
        }
      }
      function throwIfListening() {
        if (isListening()) {
          throw new ConnectionError(ConnectionErrors.AlreadyListening, "Connection is already listening");
        }
      }
      function throwIfNotListening() {
        if (!isListening()) {
          throw new Error("Call listen() first.");
        }
      }
      function undefinedToNull(param) {
        if (param === void 0) {
          return null;
        } else {
          return param;
        }
      }
      function computeMessageParams(type, params) {
        var result;
        var numberOfParams = type.numberOfParams;
        switch (numberOfParams) {
          case 0:
            result = null;
            break;
          case 1:
            result = undefinedToNull(params[0]);
            break;
          default:
            result = [];
            for (var i = 0; i < params.length && i < numberOfParams; i++) {
              result.push(undefinedToNull(params[i]));
            }
            if (params.length < numberOfParams) {
              for (var i = params.length; i < numberOfParams; i++) {
                result.push(null);
              }
            }
            break;
        }
        return result;
      }
      var connection = {
        sendNotification: function(type) {
          var params = [];
          for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
          }
          throwIfClosedOrDisposed();
          var method;
          var messageParams;
          if (Is.string(type)) {
            method = type;
            switch (params.length) {
              case 0:
                messageParams = null;
                break;
              case 1:
                messageParams = params[0];
                break;
              default:
                messageParams = params;
                break;
            }
          } else {
            method = type.method;
            messageParams = computeMessageParams(type, params);
          }
          var notificationMessage = {
            jsonrpc: version,
            method,
            params: messageParams
          };
          traceSendNotification(notificationMessage);
          messageWriter.write(notificationMessage);
        },
        onNotification: function(type, handler) {
          throwIfClosedOrDisposed();
          if (Is.func(type)) {
            starNotificationHandler = type;
          } else if (handler) {
            if (Is.string(type)) {
              notificationHandlers[type] = { type: void 0, handler };
            } else {
              notificationHandlers[type.method] = { type, handler };
            }
          }
        },
        sendRequest: function(type) {
          var params = [];
          for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
          }
          throwIfClosedOrDisposed();
          throwIfNotListening();
          var method;
          var messageParams;
          var token = void 0;
          if (Is.string(type)) {
            method = type;
            switch (params.length) {
              case 0:
                messageParams = null;
                break;
              case 1:
                if (cancellation_1.CancellationToken.is(params[0])) {
                  messageParams = null;
                  token = params[0];
                } else {
                  messageParams = undefinedToNull(params[0]);
                }
                break;
              default:
                var last = params.length - 1;
                if (cancellation_1.CancellationToken.is(params[last])) {
                  token = params[last];
                  if (params.length === 2) {
                    messageParams = undefinedToNull(params[0]);
                  } else {
                    messageParams = params.slice(0, last).map(function(value) {
                      return undefinedToNull(value);
                    });
                  }
                } else {
                  messageParams = params.map(function(value) {
                    return undefinedToNull(value);
                  });
                }
                break;
            }
          } else {
            method = type.method;
            messageParams = computeMessageParams(type, params);
            var numberOfParams = type.numberOfParams;
            token = cancellation_1.CancellationToken.is(params[numberOfParams]) ? params[numberOfParams] : void 0;
          }
          var id = sequenceNumber++;
          var result = new Promise(function(resolve, reject) {
            var requestMessage = {
              jsonrpc: version,
              id,
              method,
              params: messageParams
            };
            var responsePromise = { method, timerStart: Date.now(), resolve, reject };
            traceSendingRequest(requestMessage);
            try {
              messageWriter.write(requestMessage);
            } catch (e) {
              responsePromise.reject(new messages_1.ResponseError(messages_1.ErrorCodes.MessageWriteError, e.message ? e.message : "Unknown reason"));
              responsePromise = null;
            }
            if (responsePromise) {
              responsePromises[String(id)] = responsePromise;
            }
          });
          if (token) {
            token.onCancellationRequested(function() {
              connection.sendNotification(CancelNotification.type, { id });
            });
          }
          return result;
        },
        onRequest: function(type, handler) {
          throwIfClosedOrDisposed();
          if (Is.func(type)) {
            starRequestHandler = type;
          } else if (handler) {
            if (Is.string(type)) {
              requestHandlers[type] = { type: void 0, handler };
            } else {
              requestHandlers[type.method] = { type, handler };
            }
          }
        },
        trace: function(_value, _tracer, sendNotification) {
          if (sendNotification === void 0) {
            sendNotification = false;
          }
          trace = _value;
          if (trace === Trace.Off) {
            tracer = void 0;
          } else {
            tracer = _tracer;
          }
          if (sendNotification && !isClosed() && !isDisposed()) {
            connection.sendNotification(SetTraceNotification.type, { value: Trace.toString(_value) });
          }
        },
        onError: errorEmitter.event,
        onClose: closeEmitter.event,
        onUnhandledNotification: unhandledNotificationEmitter.event,
        onDispose: disposeEmitter.event,
        dispose: function() {
          if (isDisposed()) {
            return;
          }
          state = ConnectionState.Disposed;
          disposeEmitter.fire(void 0);
          var error = new Error("Connection got disposed.");
          Object.keys(responsePromises).forEach(function(key) {
            responsePromises[key].reject(error);
          });
          responsePromises = /* @__PURE__ */ Object.create(null);
          requestTokens = /* @__PURE__ */ Object.create(null);
          messageQueue = new linkedMap_1.LinkedMap();
          if (Is.func(messageWriter.dispose)) {
            messageWriter.dispose();
          }
          if (Is.func(messageReader.dispose)) {
            messageReader.dispose();
          }
        },
        listen: function() {
          throwIfClosedOrDisposed();
          throwIfListening();
          state = ConnectionState.Listening;
          messageReader.listen(callback);
        },
        inspect: function() {
          console.log("inspect");
        }
      };
      connection.onNotification(LogTraceNotification.type, function(params) {
        if (trace === Trace.Off || !tracer) {
          return;
        }
        tracer.log(params.message, trace === Trace.Verbose ? params.verbose : void 0);
      });
      return connection;
    }
    function isMessageReader(value) {
      return value.listen !== void 0 && value.read === void 0;
    }
    function isMessageWriter(value) {
      return value.write !== void 0 && value.end === void 0;
    }
    function createMessageConnection(input, output, logger, strategy) {
      if (!logger) {
        logger = exports2.NullLogger;
      }
      var reader = isMessageReader(input) ? input : new messageReader_1.StreamMessageReader(input);
      var writer = isMessageWriter(output) ? output : new messageWriter_1.StreamMessageWriter(output);
      return _createMessageConnection(reader, writer, logger, strategy);
    }
    exports2.createMessageConnection = createMessageConnection;
  }
});

// node_modules/vscode-languageserver-types/lib/main.js
var require_main2 = __commonJS({
  "node_modules/vscode-languageserver-types/lib/main.js"(exports2, module2) {
    (function(factory) {
      if (typeof module2 === "object" && typeof module2.exports === "object") {
        var v = factory(require, exports2);
        if (v !== void 0) module2.exports = v;
      } else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
      }
    })(function(require2, exports3) {
      "use strict";
      Object.defineProperty(exports3, "__esModule", { value: true });
      var Position;
      (function(Position2) {
        function create(line, character) {
          return { line, character };
        }
        Position2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.number(candidate.line) && Is.number(candidate.character);
        }
        Position2.is = is;
      })(Position = exports3.Position || (exports3.Position = {}));
      var Range;
      (function(Range2) {
        function create(one, two, three, four) {
          if (Is.number(one) && Is.number(two) && Is.number(three) && Is.number(four)) {
            return { start: Position.create(one, two), end: Position.create(three, four) };
          } else if (Position.is(one) && Position.is(two)) {
            return { start: one, end: two };
          } else {
            throw new Error("Range#create called with invalid arguments[" + one + ", " + two + ", " + three + ", " + four + "]");
          }
        }
        Range2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Position.is(candidate.start) && Position.is(candidate.end);
        }
        Range2.is = is;
      })(Range = exports3.Range || (exports3.Range = {}));
      var Location;
      (function(Location2) {
        function create(uri, range) {
          return { uri, range };
        }
        Location2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Range.is(candidate.range) && (Is.string(candidate.uri) || Is.undefined(candidate.uri));
        }
        Location2.is = is;
      })(Location = exports3.Location || (exports3.Location = {}));
      var DiagnosticSeverity;
      (function(DiagnosticSeverity2) {
        DiagnosticSeverity2.Error = 1;
        DiagnosticSeverity2.Warning = 2;
        DiagnosticSeverity2.Information = 3;
        DiagnosticSeverity2.Hint = 4;
      })(DiagnosticSeverity = exports3.DiagnosticSeverity || (exports3.DiagnosticSeverity = {}));
      var Diagnostic;
      (function(Diagnostic2) {
        function create(range, message, severity, code, source) {
          var result = { range, message };
          if (Is.defined(severity)) {
            result.severity = severity;
          }
          if (Is.defined(code)) {
            result.code = code;
          }
          if (Is.defined(source)) {
            result.source = source;
          }
          return result;
        }
        Diagnostic2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Range.is(candidate.range) && Is.string(candidate.message) && (Is.number(candidate.severity) || Is.undefined(candidate.severity)) && (Is.number(candidate.code) || Is.string(candidate.code) || Is.undefined(candidate.code)) && (Is.string(candidate.source) || Is.undefined(candidate.source));
        }
        Diagnostic2.is = is;
      })(Diagnostic = exports3.Diagnostic || (exports3.Diagnostic = {}));
      var Command;
      (function(Command2) {
        function create(title, command) {
          var args = [];
          for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
          }
          var result = { title, command };
          if (Is.defined(args) && args.length > 0) {
            result.arguments = args;
          }
          return result;
        }
        Command2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.title) && Is.string(candidate.title);
        }
        Command2.is = is;
      })(Command = exports3.Command || (exports3.Command = {}));
      var TextEdit;
      (function(TextEdit2) {
        function replace(range, newText) {
          return { range, newText };
        }
        TextEdit2.replace = replace;
        function insert(position, newText) {
          return { range: { start: position, end: position }, newText };
        }
        TextEdit2.insert = insert;
        function del(range) {
          return { range, newText: "" };
        }
        TextEdit2.del = del;
      })(TextEdit = exports3.TextEdit || (exports3.TextEdit = {}));
      var TextDocumentEdit;
      (function(TextDocumentEdit2) {
        function create(textDocument, edits) {
          return { textDocument, edits };
        }
        TextDocumentEdit2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && VersionedTextDocumentIdentifier.is(candidate.textDocument) && Array.isArray(candidate.edits);
        }
        TextDocumentEdit2.is = is;
      })(TextDocumentEdit = exports3.TextDocumentEdit || (exports3.TextDocumentEdit = {}));
      var TextEditChangeImpl = (
        /** @class */
        function() {
          function TextEditChangeImpl2(edits) {
            this.edits = edits;
          }
          TextEditChangeImpl2.prototype.insert = function(position, newText) {
            this.edits.push(TextEdit.insert(position, newText));
          };
          TextEditChangeImpl2.prototype.replace = function(range, newText) {
            this.edits.push(TextEdit.replace(range, newText));
          };
          TextEditChangeImpl2.prototype.delete = function(range) {
            this.edits.push(TextEdit.del(range));
          };
          TextEditChangeImpl2.prototype.add = function(edit) {
            this.edits.push(edit);
          };
          TextEditChangeImpl2.prototype.all = function() {
            return this.edits;
          };
          TextEditChangeImpl2.prototype.clear = function() {
            this.edits.splice(0, this.edits.length);
          };
          return TextEditChangeImpl2;
        }()
      );
      var WorkspaceChange = (
        /** @class */
        function() {
          function WorkspaceChange2(workspaceEdit) {
            var _this = this;
            this._textEditChanges = /* @__PURE__ */ Object.create(null);
            if (workspaceEdit) {
              this._workspaceEdit = workspaceEdit;
              if (workspaceEdit.documentChanges) {
                workspaceEdit.documentChanges.forEach(function(textDocumentEdit) {
                  var textEditChange = new TextEditChangeImpl(textDocumentEdit.edits);
                  _this._textEditChanges[textDocumentEdit.textDocument.uri] = textEditChange;
                });
              } else if (workspaceEdit.changes) {
                Object.keys(workspaceEdit.changes).forEach(function(key) {
                  var textEditChange = new TextEditChangeImpl(workspaceEdit.changes[key]);
                  _this._textEditChanges[key] = textEditChange;
                });
              }
            }
          }
          Object.defineProperty(WorkspaceChange2.prototype, "edit", {
            /**
             * Returns the underlying [WorkspaceEdit](#WorkspaceEdit) literal
             * use to be returned from a workspace edit operation like rename.
             */
            get: function() {
              return this._workspaceEdit;
            },
            enumerable: true,
            configurable: true
          });
          WorkspaceChange2.prototype.getTextEditChange = function(key) {
            if (VersionedTextDocumentIdentifier.is(key)) {
              if (!this._workspaceEdit) {
                this._workspaceEdit = {
                  documentChanges: []
                };
              }
              if (!this._workspaceEdit.documentChanges) {
                throw new Error("Workspace edit is not configured for versioned document changes.");
              }
              var textDocument = key;
              var result = this._textEditChanges[textDocument.uri];
              if (!result) {
                var edits = [];
                var textDocumentEdit = {
                  textDocument,
                  edits
                };
                this._workspaceEdit.documentChanges.push(textDocumentEdit);
                result = new TextEditChangeImpl(edits);
                this._textEditChanges[textDocument.uri] = result;
              }
              return result;
            } else {
              if (!this._workspaceEdit) {
                this._workspaceEdit = {
                  changes: /* @__PURE__ */ Object.create(null)
                };
              }
              if (!this._workspaceEdit.changes) {
                throw new Error("Workspace edit is not configured for normal text edit changes.");
              }
              var result = this._textEditChanges[key];
              if (!result) {
                var edits = [];
                this._workspaceEdit.changes[key] = edits;
                result = new TextEditChangeImpl(edits);
                this._textEditChanges[key] = result;
              }
              return result;
            }
          };
          return WorkspaceChange2;
        }()
      );
      exports3.WorkspaceChange = WorkspaceChange;
      var TextDocumentIdentifier;
      (function(TextDocumentIdentifier2) {
        function create(uri) {
          return { uri };
        }
        TextDocumentIdentifier2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.uri);
        }
        TextDocumentIdentifier2.is = is;
      })(TextDocumentIdentifier = exports3.TextDocumentIdentifier || (exports3.TextDocumentIdentifier = {}));
      var VersionedTextDocumentIdentifier;
      (function(VersionedTextDocumentIdentifier2) {
        function create(uri, version) {
          return { uri, version };
        }
        VersionedTextDocumentIdentifier2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.uri) && Is.number(candidate.version);
        }
        VersionedTextDocumentIdentifier2.is = is;
      })(VersionedTextDocumentIdentifier = exports3.VersionedTextDocumentIdentifier || (exports3.VersionedTextDocumentIdentifier = {}));
      var TextDocumentItem;
      (function(TextDocumentItem2) {
        function create(uri, languageId, version, text) {
          return { uri, languageId, version, text };
        }
        TextDocumentItem2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.uri) && Is.string(candidate.languageId) && Is.number(candidate.version) && Is.string(candidate.text);
        }
        TextDocumentItem2.is = is;
      })(TextDocumentItem = exports3.TextDocumentItem || (exports3.TextDocumentItem = {}));
      var CompletionItemKind;
      (function(CompletionItemKind2) {
        CompletionItemKind2.Text = 1;
        CompletionItemKind2.Method = 2;
        CompletionItemKind2.Function = 3;
        CompletionItemKind2.Constructor = 4;
        CompletionItemKind2.Field = 5;
        CompletionItemKind2.Variable = 6;
        CompletionItemKind2.Class = 7;
        CompletionItemKind2.Interface = 8;
        CompletionItemKind2.Module = 9;
        CompletionItemKind2.Property = 10;
        CompletionItemKind2.Unit = 11;
        CompletionItemKind2.Value = 12;
        CompletionItemKind2.Enum = 13;
        CompletionItemKind2.Keyword = 14;
        CompletionItemKind2.Snippet = 15;
        CompletionItemKind2.Color = 16;
        CompletionItemKind2.File = 17;
        CompletionItemKind2.Reference = 18;
      })(CompletionItemKind = exports3.CompletionItemKind || (exports3.CompletionItemKind = {}));
      var InsertTextFormat;
      (function(InsertTextFormat2) {
        InsertTextFormat2.PlainText = 1;
        InsertTextFormat2.Snippet = 2;
      })(InsertTextFormat = exports3.InsertTextFormat || (exports3.InsertTextFormat = {}));
      var CompletionItem;
      (function(CompletionItem2) {
        function create(label) {
          return { label };
        }
        CompletionItem2.create = create;
      })(CompletionItem = exports3.CompletionItem || (exports3.CompletionItem = {}));
      var CompletionList;
      (function(CompletionList2) {
        function create(items, isIncomplete) {
          return { items: items ? items : [], isIncomplete: !!isIncomplete };
        }
        CompletionList2.create = create;
      })(CompletionList = exports3.CompletionList || (exports3.CompletionList = {}));
      var MarkedString;
      (function(MarkedString2) {
        function fromPlainText(plainText) {
          return plainText.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
        }
        MarkedString2.fromPlainText = fromPlainText;
      })(MarkedString = exports3.MarkedString || (exports3.MarkedString = {}));
      var ParameterInformation;
      (function(ParameterInformation2) {
        function create(label, documentation) {
          return documentation ? { label, documentation } : { label };
        }
        ParameterInformation2.create = create;
        ;
      })(ParameterInformation = exports3.ParameterInformation || (exports3.ParameterInformation = {}));
      var SignatureInformation;
      (function(SignatureInformation2) {
        function create(label, documentation) {
          var parameters = [];
          for (var _i = 2; _i < arguments.length; _i++) {
            parameters[_i - 2] = arguments[_i];
          }
          var result = { label };
          if (Is.defined(documentation)) {
            result.documentation = documentation;
          }
          if (Is.defined(parameters)) {
            result.parameters = parameters;
          } else {
            result.parameters = [];
          }
          return result;
        }
        SignatureInformation2.create = create;
      })(SignatureInformation = exports3.SignatureInformation || (exports3.SignatureInformation = {}));
      var DocumentHighlightKind;
      (function(DocumentHighlightKind2) {
        DocumentHighlightKind2.Text = 1;
        DocumentHighlightKind2.Read = 2;
        DocumentHighlightKind2.Write = 3;
      })(DocumentHighlightKind = exports3.DocumentHighlightKind || (exports3.DocumentHighlightKind = {}));
      var DocumentHighlight;
      (function(DocumentHighlight2) {
        function create(range, kind) {
          var result = { range };
          if (Is.number(kind)) {
            result.kind = kind;
          }
          return result;
        }
        DocumentHighlight2.create = create;
      })(DocumentHighlight = exports3.DocumentHighlight || (exports3.DocumentHighlight = {}));
      var SymbolKind;
      (function(SymbolKind2) {
        SymbolKind2.File = 1;
        SymbolKind2.Module = 2;
        SymbolKind2.Namespace = 3;
        SymbolKind2.Package = 4;
        SymbolKind2.Class = 5;
        SymbolKind2.Method = 6;
        SymbolKind2.Property = 7;
        SymbolKind2.Field = 8;
        SymbolKind2.Constructor = 9;
        SymbolKind2.Enum = 10;
        SymbolKind2.Interface = 11;
        SymbolKind2.Function = 12;
        SymbolKind2.Variable = 13;
        SymbolKind2.Constant = 14;
        SymbolKind2.String = 15;
        SymbolKind2.Number = 16;
        SymbolKind2.Boolean = 17;
        SymbolKind2.Array = 18;
      })(SymbolKind = exports3.SymbolKind || (exports3.SymbolKind = {}));
      var SymbolInformation;
      (function(SymbolInformation2) {
        function create(name, kind, range, uri, containerName) {
          var result = {
            name,
            kind,
            location: { uri, range }
          };
          if (containerName) {
            result.containerName = containerName;
          }
          return result;
        }
        SymbolInformation2.create = create;
      })(SymbolInformation = exports3.SymbolInformation || (exports3.SymbolInformation = {}));
      var CodeActionContext;
      (function(CodeActionContext2) {
        function create(diagnostics) {
          return { diagnostics };
        }
        CodeActionContext2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.typedArray(candidate.diagnostics, Diagnostic.is);
        }
        CodeActionContext2.is = is;
      })(CodeActionContext = exports3.CodeActionContext || (exports3.CodeActionContext = {}));
      var CodeLens;
      (function(CodeLens2) {
        function create(range, data) {
          var result = { range };
          if (Is.defined(data))
            result.data = data;
          return result;
        }
        CodeLens2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.command) || Command.is(candidate.command));
        }
        CodeLens2.is = is;
      })(CodeLens = exports3.CodeLens || (exports3.CodeLens = {}));
      var FormattingOptions;
      (function(FormattingOptions2) {
        function create(tabSize, insertSpaces) {
          return { tabSize, insertSpaces };
        }
        FormattingOptions2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.number(candidate.tabSize) && Is.boolean(candidate.insertSpaces);
        }
        FormattingOptions2.is = is;
      })(FormattingOptions = exports3.FormattingOptions || (exports3.FormattingOptions = {}));
      var DocumentLink = (
        /** @class */
        /* @__PURE__ */ function() {
          function DocumentLink2() {
          }
          return DocumentLink2;
        }()
      );
      exports3.DocumentLink = DocumentLink;
      (function(DocumentLink2) {
        function create(range, target) {
          return { range, target };
        }
        DocumentLink2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.target) || Is.string(candidate.target));
        }
        DocumentLink2.is = is;
      })(DocumentLink = exports3.DocumentLink || (exports3.DocumentLink = {}));
      exports3.DocumentLink = DocumentLink;
      exports3.EOL = ["\n", "\r\n", "\r"];
      var TextDocument;
      (function(TextDocument2) {
        function create(uri, languageId, version, content) {
          return new FullTextDocument(uri, languageId, version, content);
        }
        TextDocument2.create = create;
        function is(value) {
          var candidate = value;
          return Is.defined(candidate) && Is.string(candidate.uri) && (Is.undefined(candidate.languageId) || Is.string(candidate.languageId)) && Is.number(candidate.lineCount) && Is.func(candidate.getText) && Is.func(candidate.positionAt) && Is.func(candidate.offsetAt) ? true : false;
        }
        TextDocument2.is = is;
      })(TextDocument = exports3.TextDocument || (exports3.TextDocument = {}));
      var TextDocumentSaveReason;
      (function(TextDocumentSaveReason2) {
        TextDocumentSaveReason2.Manual = 1;
        TextDocumentSaveReason2.AfterDelay = 2;
        TextDocumentSaveReason2.FocusOut = 3;
      })(TextDocumentSaveReason = exports3.TextDocumentSaveReason || (exports3.TextDocumentSaveReason = {}));
      var FullTextDocument = (
        /** @class */
        function() {
          function FullTextDocument2(uri, languageId, version, content) {
            this._uri = uri;
            this._languageId = languageId;
            this._version = version;
            this._content = content;
            this._lineOffsets = null;
          }
          Object.defineProperty(FullTextDocument2.prototype, "uri", {
            get: function() {
              return this._uri;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(FullTextDocument2.prototype, "languageId", {
            get: function() {
              return this._languageId;
            },
            enumerable: true,
            configurable: true
          });
          Object.defineProperty(FullTextDocument2.prototype, "version", {
            get: function() {
              return this._version;
            },
            enumerable: true,
            configurable: true
          });
          FullTextDocument2.prototype.getText = function() {
            return this._content;
          };
          FullTextDocument2.prototype.update = function(event, version) {
            this._content = event.text;
            this._version = version;
            this._lineOffsets = null;
          };
          FullTextDocument2.prototype.getLineOffsets = function() {
            if (this._lineOffsets === null) {
              var lineOffsets = [];
              var text = this._content;
              var isLineStart = true;
              for (var i = 0; i < text.length; i++) {
                if (isLineStart) {
                  lineOffsets.push(i);
                  isLineStart = false;
                }
                var ch = text.charAt(i);
                isLineStart = ch === "\r" || ch === "\n";
                if (ch === "\r" && i + 1 < text.length && text.charAt(i + 1) === "\n") {
                  i++;
                }
              }
              if (isLineStart && text.length > 0) {
                lineOffsets.push(text.length);
              }
              this._lineOffsets = lineOffsets;
            }
            return this._lineOffsets;
          };
          FullTextDocument2.prototype.positionAt = function(offset) {
            offset = Math.max(Math.min(offset, this._content.length), 0);
            var lineOffsets = this.getLineOffsets();
            var low = 0, high = lineOffsets.length;
            if (high === 0) {
              return Position.create(0, offset);
            }
            while (low < high) {
              var mid = Math.floor((low + high) / 2);
              if (lineOffsets[mid] > offset) {
                high = mid;
              } else {
                low = mid + 1;
              }
            }
            var line = low - 1;
            return Position.create(line, offset - lineOffsets[line]);
          };
          FullTextDocument2.prototype.offsetAt = function(position) {
            var lineOffsets = this.getLineOffsets();
            if (position.line >= lineOffsets.length) {
              return this._content.length;
            } else if (position.line < 0) {
              return 0;
            }
            var lineOffset = lineOffsets[position.line];
            var nextLineOffset = position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : this._content.length;
            return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
          };
          Object.defineProperty(FullTextDocument2.prototype, "lineCount", {
            get: function() {
              return this.getLineOffsets().length;
            },
            enumerable: true,
            configurable: true
          });
          return FullTextDocument2;
        }()
      );
      var Is;
      (function(Is2) {
        var toString = Object.prototype.toString;
        function defined(value) {
          return typeof value !== "undefined";
        }
        Is2.defined = defined;
        function undefined2(value) {
          return typeof value === "undefined";
        }
        Is2.undefined = undefined2;
        function boolean(value) {
          return value === true || value === false;
        }
        Is2.boolean = boolean;
        function string(value) {
          return toString.call(value) === "[object String]";
        }
        Is2.string = string;
        function number(value) {
          return toString.call(value) === "[object Number]";
        }
        Is2.number = number;
        function func(value) {
          return toString.call(value) === "[object Function]";
        }
        Is2.func = func;
        function typedArray(value, check) {
          return Array.isArray(value) && value.every(check);
        }
        Is2.typedArray = typedArray;
      })(Is || (Is = {}));
    });
  }
});

// node_modules/vscode-languageserver-protocol/lib/utils/is.js
var require_is2 = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/utils/is.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var toString = Object.prototype.toString;
    function boolean(value) {
      return value === true || value === false;
    }
    exports2.boolean = boolean;
    function string(value) {
      return toString.call(value) === "[object String]";
    }
    exports2.string = string;
    function number(value) {
      return toString.call(value) === "[object Number]";
    }
    exports2.number = number;
    function error(value) {
      return toString.call(value) === "[object Error]";
    }
    exports2.error = error;
    function func(value) {
      return toString.call(value) === "[object Function]";
    }
    exports2.func = func;
    function array(value) {
      return Array.isArray(value);
    }
    exports2.array = array;
    function stringArray(value) {
      return array(value) && value.every((elem) => string(elem));
    }
    exports2.stringArray = stringArray;
    function typedArray(value, check) {
      return Array.isArray(value) && value.every(check);
    }
    exports2.typedArray = typedArray;
    function thenable(value) {
      return value && func(value.then);
    }
    exports2.thenable = thenable;
  }
});

// node_modules/vscode-languageserver-protocol/lib/protocol.js
var require_protocol = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/protocol.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Is = require_is2();
    var vscode_jsonrpc_1 = require_main();
    var DocumentFilter;
    (function(DocumentFilter2) {
      function is(value) {
        let candidate = value;
        return Is.string(candidate.language) || Is.string(candidate.scheme) || Is.string(candidate.pattern);
      }
      DocumentFilter2.is = is;
    })(DocumentFilter = exports2.DocumentFilter || (exports2.DocumentFilter = {}));
    var RegistrationRequest;
    (function(RegistrationRequest2) {
      RegistrationRequest2.type = new vscode_jsonrpc_1.RequestType("client/registerCapability");
    })(RegistrationRequest = exports2.RegistrationRequest || (exports2.RegistrationRequest = {}));
    var UnregistrationRequest;
    (function(UnregistrationRequest2) {
      UnregistrationRequest2.type = new vscode_jsonrpc_1.RequestType("client/unregisterCapability");
    })(UnregistrationRequest = exports2.UnregistrationRequest || (exports2.UnregistrationRequest = {}));
    var TextDocumentSyncKind;
    (function(TextDocumentSyncKind2) {
      TextDocumentSyncKind2.None = 0;
      TextDocumentSyncKind2.Full = 1;
      TextDocumentSyncKind2.Incremental = 2;
    })(TextDocumentSyncKind = exports2.TextDocumentSyncKind || (exports2.TextDocumentSyncKind = {}));
    var InitializeRequest;
    (function(InitializeRequest2) {
      InitializeRequest2.type = new vscode_jsonrpc_1.RequestType("initialize");
    })(InitializeRequest = exports2.InitializeRequest || (exports2.InitializeRequest = {}));
    var InitializeError;
    (function(InitializeError2) {
      InitializeError2.unknownProtocolVersion = 1;
    })(InitializeError = exports2.InitializeError || (exports2.InitializeError = {}));
    var InitializedNotification;
    (function(InitializedNotification2) {
      InitializedNotification2.type = new vscode_jsonrpc_1.NotificationType("initialized");
    })(InitializedNotification = exports2.InitializedNotification || (exports2.InitializedNotification = {}));
    var ShutdownRequest;
    (function(ShutdownRequest2) {
      ShutdownRequest2.type = new vscode_jsonrpc_1.RequestType0("shutdown");
    })(ShutdownRequest = exports2.ShutdownRequest || (exports2.ShutdownRequest = {}));
    var ExitNotification;
    (function(ExitNotification2) {
      ExitNotification2.type = new vscode_jsonrpc_1.NotificationType0("exit");
    })(ExitNotification = exports2.ExitNotification || (exports2.ExitNotification = {}));
    var DidChangeConfigurationNotification;
    (function(DidChangeConfigurationNotification2) {
      DidChangeConfigurationNotification2.type = new vscode_jsonrpc_1.NotificationType("workspace/didChangeConfiguration");
    })(DidChangeConfigurationNotification = exports2.DidChangeConfigurationNotification || (exports2.DidChangeConfigurationNotification = {}));
    var MessageType;
    (function(MessageType2) {
      MessageType2.Error = 1;
      MessageType2.Warning = 2;
      MessageType2.Info = 3;
      MessageType2.Log = 4;
    })(MessageType = exports2.MessageType || (exports2.MessageType = {}));
    var ShowMessageNotification;
    (function(ShowMessageNotification2) {
      ShowMessageNotification2.type = new vscode_jsonrpc_1.NotificationType("window/showMessage");
    })(ShowMessageNotification = exports2.ShowMessageNotification || (exports2.ShowMessageNotification = {}));
    var ShowMessageRequest;
    (function(ShowMessageRequest2) {
      ShowMessageRequest2.type = new vscode_jsonrpc_1.RequestType("window/showMessageRequest");
    })(ShowMessageRequest = exports2.ShowMessageRequest || (exports2.ShowMessageRequest = {}));
    var LogMessageNotification;
    (function(LogMessageNotification2) {
      LogMessageNotification2.type = new vscode_jsonrpc_1.NotificationType("window/logMessage");
    })(LogMessageNotification = exports2.LogMessageNotification || (exports2.LogMessageNotification = {}));
    var TelemetryEventNotification;
    (function(TelemetryEventNotification2) {
      TelemetryEventNotification2.type = new vscode_jsonrpc_1.NotificationType("telemetry/event");
    })(TelemetryEventNotification = exports2.TelemetryEventNotification || (exports2.TelemetryEventNotification = {}));
    var DidOpenTextDocumentNotification;
    (function(DidOpenTextDocumentNotification2) {
      DidOpenTextDocumentNotification2.type = new vscode_jsonrpc_1.NotificationType("textDocument/didOpen");
    })(DidOpenTextDocumentNotification = exports2.DidOpenTextDocumentNotification || (exports2.DidOpenTextDocumentNotification = {}));
    var DidChangeTextDocumentNotification;
    (function(DidChangeTextDocumentNotification2) {
      DidChangeTextDocumentNotification2.type = new vscode_jsonrpc_1.NotificationType("textDocument/didChange");
    })(DidChangeTextDocumentNotification = exports2.DidChangeTextDocumentNotification || (exports2.DidChangeTextDocumentNotification = {}));
    var DidCloseTextDocumentNotification;
    (function(DidCloseTextDocumentNotification2) {
      DidCloseTextDocumentNotification2.type = new vscode_jsonrpc_1.NotificationType("textDocument/didClose");
    })(DidCloseTextDocumentNotification = exports2.DidCloseTextDocumentNotification || (exports2.DidCloseTextDocumentNotification = {}));
    var DidSaveTextDocumentNotification;
    (function(DidSaveTextDocumentNotification2) {
      DidSaveTextDocumentNotification2.type = new vscode_jsonrpc_1.NotificationType("textDocument/didSave");
    })(DidSaveTextDocumentNotification = exports2.DidSaveTextDocumentNotification || (exports2.DidSaveTextDocumentNotification = {}));
    var WillSaveTextDocumentNotification;
    (function(WillSaveTextDocumentNotification2) {
      WillSaveTextDocumentNotification2.type = new vscode_jsonrpc_1.NotificationType("textDocument/willSave");
    })(WillSaveTextDocumentNotification = exports2.WillSaveTextDocumentNotification || (exports2.WillSaveTextDocumentNotification = {}));
    var WillSaveTextDocumentWaitUntilRequest;
    (function(WillSaveTextDocumentWaitUntilRequest2) {
      WillSaveTextDocumentWaitUntilRequest2.type = new vscode_jsonrpc_1.RequestType("textDocument/willSaveWaitUntil");
    })(WillSaveTextDocumentWaitUntilRequest = exports2.WillSaveTextDocumentWaitUntilRequest || (exports2.WillSaveTextDocumentWaitUntilRequest = {}));
    var DidChangeWatchedFilesNotification;
    (function(DidChangeWatchedFilesNotification2) {
      DidChangeWatchedFilesNotification2.type = new vscode_jsonrpc_1.NotificationType("workspace/didChangeWatchedFiles");
    })(DidChangeWatchedFilesNotification = exports2.DidChangeWatchedFilesNotification || (exports2.DidChangeWatchedFilesNotification = {}));
    var FileChangeType;
    (function(FileChangeType2) {
      FileChangeType2.Created = 1;
      FileChangeType2.Changed = 2;
      FileChangeType2.Deleted = 3;
    })(FileChangeType = exports2.FileChangeType || (exports2.FileChangeType = {}));
    var WatchKind;
    (function(WatchKind2) {
      WatchKind2.Create = 1;
      WatchKind2.Change = 2;
      WatchKind2.Delete = 4;
    })(WatchKind = exports2.WatchKind || (exports2.WatchKind = {}));
    var PublishDiagnosticsNotification;
    (function(PublishDiagnosticsNotification2) {
      PublishDiagnosticsNotification2.type = new vscode_jsonrpc_1.NotificationType("textDocument/publishDiagnostics");
    })(PublishDiagnosticsNotification = exports2.PublishDiagnosticsNotification || (exports2.PublishDiagnosticsNotification = {}));
    var CompletionRequest;
    (function(CompletionRequest2) {
      CompletionRequest2.type = new vscode_jsonrpc_1.RequestType("textDocument/completion");
    })(CompletionRequest = exports2.CompletionRequest || (exports2.CompletionRequest = {}));
    var CompletionResolveRequest;
    (function(CompletionResolveRequest2) {
      CompletionResolveRequest2.type = new vscode_jsonrpc_1.RequestType("completionItem/resolve");
    })(CompletionResolveRequest = exports2.CompletionResolveRequest || (exports2.CompletionResolveRequest = {}));
    var HoverRequest;
    (function(HoverRequest2) {
      HoverRequest2.type = new vscode_jsonrpc_1.RequestType("textDocument/hover");
    })(HoverRequest = exports2.HoverRequest || (exports2.HoverRequest = {}));
    var SignatureHelpRequest;
    (function(SignatureHelpRequest2) {
      SignatureHelpRequest2.type = new vscode_jsonrpc_1.RequestType("textDocument/signatureHelp");
    })(SignatureHelpRequest = exports2.SignatureHelpRequest || (exports2.SignatureHelpRequest = {}));
    var DefinitionRequest;
    (function(DefinitionRequest2) {
      DefinitionRequest2.type = new vscode_jsonrpc_1.RequestType("textDocument/definition");
    })(DefinitionRequest = exports2.DefinitionRequest || (exports2.DefinitionRequest = {}));
    var ReferencesRequest;
    (function(ReferencesRequest2) {
      ReferencesRequest2.type = new vscode_jsonrpc_1.RequestType("textDocument/references");
    })(ReferencesRequest = exports2.ReferencesRequest || (exports2.ReferencesRequest = {}));
    var DocumentHighlightRequest;
    (function(DocumentHighlightRequest2) {
      DocumentHighlightRequest2.type = new vscode_jsonrpc_1.RequestType("textDocument/documentHighlight");
    })(DocumentHighlightRequest = exports2.DocumentHighlightRequest || (exports2.DocumentHighlightRequest = {}));
    var DocumentSymbolRequest;
    (function(DocumentSymbolRequest2) {
      DocumentSymbolRequest2.type = new vscode_jsonrpc_1.RequestType("textDocument/documentSymbol");
    })(DocumentSymbolRequest = exports2.DocumentSymbolRequest || (exports2.DocumentSymbolRequest = {}));
    var WorkspaceSymbolRequest;
    (function(WorkspaceSymbolRequest2) {
      WorkspaceSymbolRequest2.type = new vscode_jsonrpc_1.RequestType("workspace/symbol");
    })(WorkspaceSymbolRequest = exports2.WorkspaceSymbolRequest || (exports2.WorkspaceSymbolRequest = {}));
    var CodeActionRequest;
    (function(CodeActionRequest2) {
      CodeActionRequest2.type = new vscode_jsonrpc_1.RequestType("textDocument/codeAction");
    })(CodeActionRequest = exports2.CodeActionRequest || (exports2.CodeActionRequest = {}));
    var CodeLensRequest;
    (function(CodeLensRequest2) {
      CodeLensRequest2.type = new vscode_jsonrpc_1.RequestType("textDocument/codeLens");
    })(CodeLensRequest = exports2.CodeLensRequest || (exports2.CodeLensRequest = {}));
    var CodeLensResolveRequest;
    (function(CodeLensResolveRequest2) {
      CodeLensResolveRequest2.type = new vscode_jsonrpc_1.RequestType("codeLens/resolve");
    })(CodeLensResolveRequest = exports2.CodeLensResolveRequest || (exports2.CodeLensResolveRequest = {}));
    var DocumentFormattingRequest;
    (function(DocumentFormattingRequest2) {
      DocumentFormattingRequest2.type = new vscode_jsonrpc_1.RequestType("textDocument/formatting");
    })(DocumentFormattingRequest = exports2.DocumentFormattingRequest || (exports2.DocumentFormattingRequest = {}));
    var DocumentRangeFormattingRequest;
    (function(DocumentRangeFormattingRequest2) {
      DocumentRangeFormattingRequest2.type = new vscode_jsonrpc_1.RequestType("textDocument/rangeFormatting");
    })(DocumentRangeFormattingRequest = exports2.DocumentRangeFormattingRequest || (exports2.DocumentRangeFormattingRequest = {}));
    var DocumentOnTypeFormattingRequest;
    (function(DocumentOnTypeFormattingRequest2) {
      DocumentOnTypeFormattingRequest2.type = new vscode_jsonrpc_1.RequestType("textDocument/onTypeFormatting");
    })(DocumentOnTypeFormattingRequest = exports2.DocumentOnTypeFormattingRequest || (exports2.DocumentOnTypeFormattingRequest = {}));
    var RenameRequest;
    (function(RenameRequest2) {
      RenameRequest2.type = new vscode_jsonrpc_1.RequestType("textDocument/rename");
    })(RenameRequest = exports2.RenameRequest || (exports2.RenameRequest = {}));
    var DocumentLinkRequest;
    (function(DocumentLinkRequest2) {
      DocumentLinkRequest2.type = new vscode_jsonrpc_1.RequestType("textDocument/documentLink");
    })(DocumentLinkRequest = exports2.DocumentLinkRequest || (exports2.DocumentLinkRequest = {}));
    var DocumentLinkResolveRequest;
    (function(DocumentLinkResolveRequest2) {
      DocumentLinkResolveRequest2.type = new vscode_jsonrpc_1.RequestType("documentLink/resolve");
    })(DocumentLinkResolveRequest = exports2.DocumentLinkResolveRequest || (exports2.DocumentLinkResolveRequest = {}));
    var ExecuteCommandRequest;
    (function(ExecuteCommandRequest2) {
      ExecuteCommandRequest2.type = new vscode_jsonrpc_1.RequestType("workspace/executeCommand");
    })(ExecuteCommandRequest = exports2.ExecuteCommandRequest || (exports2.ExecuteCommandRequest = {}));
    var ApplyWorkspaceEditRequest;
    (function(ApplyWorkspaceEditRequest2) {
      ApplyWorkspaceEditRequest2.type = new vscode_jsonrpc_1.RequestType("workspace/applyEdit");
    })(ApplyWorkspaceEditRequest = exports2.ApplyWorkspaceEditRequest || (exports2.ApplyWorkspaceEditRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/protocol.configuration.proposed.js
var require_protocol_configuration_proposed = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/protocol.configuration.proposed.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var vscode_jsonrpc_1 = require_main();
    var ConfigurationRequest;
    (function(ConfigurationRequest2) {
      ConfigurationRequest2.type = new vscode_jsonrpc_1.RequestType("workspace/configuration");
    })(ConfigurationRequest = exports2.ConfigurationRequest || (exports2.ConfigurationRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/protocol.workspaceFolders.proposed.js
var require_protocol_workspaceFolders_proposed = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/protocol.workspaceFolders.proposed.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var vscode_jsonrpc_1 = require_main();
    var WorkspaceFoldersRequest;
    (function(WorkspaceFoldersRequest2) {
      WorkspaceFoldersRequest2.type = new vscode_jsonrpc_1.RequestType0("workspace/workspaceFolders");
    })(WorkspaceFoldersRequest = exports2.WorkspaceFoldersRequest || (exports2.WorkspaceFoldersRequest = {}));
    var DidChangeWorkspaceFoldersNotification;
    (function(DidChangeWorkspaceFoldersNotification2) {
      DidChangeWorkspaceFoldersNotification2.type = new vscode_jsonrpc_1.NotificationType("workspace/didChangeWorkspaceFolders");
    })(DidChangeWorkspaceFoldersNotification = exports2.DidChangeWorkspaceFoldersNotification || (exports2.DidChangeWorkspaceFoldersNotification = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/protocol.colorProvider.proposed.js
var require_protocol_colorProvider_proposed = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/protocol.colorProvider.proposed.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var vscode_jsonrpc_1 = require_main();
    var DocumentColorRequest;
    (function(DocumentColorRequest2) {
      DocumentColorRequest2.type = new vscode_jsonrpc_1.RequestType("textDocument/documentColor");
    })(DocumentColorRequest = exports2.DocumentColorRequest || (exports2.DocumentColorRequest = {}));
    var ColorPresentationRequest;
    (function(ColorPresentationRequest2) {
      ColorPresentationRequest2.type = new vscode_jsonrpc_1.RequestType("textDocument/colorPresentation");
    })(ColorPresentationRequest = exports2.ColorPresentationRequest || (exports2.ColorPresentationRequest = {}));
  }
});

// node_modules/vscode-languageserver-protocol/lib/main.js
var require_main3 = __commonJS({
  "node_modules/vscode-languageserver-protocol/lib/main.js"(exports2) {
    "use strict";
    function __export2(m) {
      for (var p in m) if (!exports2.hasOwnProperty(p)) exports2[p] = m[p];
    }
    Object.defineProperty(exports2, "__esModule", { value: true });
    var vscode_jsonrpc_1 = require_main();
    exports2.ErrorCodes = vscode_jsonrpc_1.ErrorCodes;
    exports2.ResponseError = vscode_jsonrpc_1.ResponseError;
    exports2.CancellationToken = vscode_jsonrpc_1.CancellationToken;
    exports2.CancellationTokenSource = vscode_jsonrpc_1.CancellationTokenSource;
    exports2.Disposable = vscode_jsonrpc_1.Disposable;
    exports2.Event = vscode_jsonrpc_1.Event;
    exports2.Emitter = vscode_jsonrpc_1.Emitter;
    exports2.Trace = vscode_jsonrpc_1.Trace;
    exports2.SetTraceNotification = vscode_jsonrpc_1.SetTraceNotification;
    exports2.LogTraceNotification = vscode_jsonrpc_1.LogTraceNotification;
    exports2.RequestType = vscode_jsonrpc_1.RequestType;
    exports2.RequestType0 = vscode_jsonrpc_1.RequestType0;
    exports2.NotificationType = vscode_jsonrpc_1.NotificationType;
    exports2.NotificationType0 = vscode_jsonrpc_1.NotificationType0;
    exports2.MessageReader = vscode_jsonrpc_1.MessageReader;
    exports2.MessageWriter = vscode_jsonrpc_1.MessageWriter;
    exports2.ConnectionStrategy = vscode_jsonrpc_1.ConnectionStrategy;
    exports2.StreamMessageReader = vscode_jsonrpc_1.StreamMessageReader;
    exports2.StreamMessageWriter = vscode_jsonrpc_1.StreamMessageWriter;
    exports2.IPCMessageReader = vscode_jsonrpc_1.IPCMessageReader;
    exports2.IPCMessageWriter = vscode_jsonrpc_1.IPCMessageWriter;
    exports2.createClientPipeTransport = vscode_jsonrpc_1.createClientPipeTransport;
    exports2.createServerPipeTransport = vscode_jsonrpc_1.createServerPipeTransport;
    exports2.generateRandomPipeName = vscode_jsonrpc_1.generateRandomPipeName;
    exports2.createClientSocketTransport = vscode_jsonrpc_1.createClientSocketTransport;
    exports2.createServerSocketTransport = vscode_jsonrpc_1.createServerSocketTransport;
    __export2(require_main2());
    __export2(require_protocol());
    var config = require_protocol_configuration_proposed();
    var folders = require_protocol_workspaceFolders_proposed();
    var color = require_protocol_colorProvider_proposed();
    var Proposed;
    (function(Proposed2) {
      let ConfigurationRequest;
      (function(ConfigurationRequest2) {
        ConfigurationRequest2.type = config.ConfigurationRequest.type;
      })(ConfigurationRequest = Proposed2.ConfigurationRequest || (Proposed2.ConfigurationRequest = {}));
      ;
      let WorkspaceFoldersRequest;
      (function(WorkspaceFoldersRequest2) {
        WorkspaceFoldersRequest2.type = folders.WorkspaceFoldersRequest.type;
      })(WorkspaceFoldersRequest = Proposed2.WorkspaceFoldersRequest || (Proposed2.WorkspaceFoldersRequest = {}));
      let DidChangeWorkspaceFoldersNotification;
      (function(DidChangeWorkspaceFoldersNotification2) {
        DidChangeWorkspaceFoldersNotification2.type = folders.DidChangeWorkspaceFoldersNotification.type;
      })(DidChangeWorkspaceFoldersNotification = Proposed2.DidChangeWorkspaceFoldersNotification || (Proposed2.DidChangeWorkspaceFoldersNotification = {}));
      Proposed2.DocumentColorRequest = color.DocumentColorRequest;
      Proposed2.ColorPresentationRequest = color.ColorPresentationRequest;
    })(Proposed = exports2.Proposed || (exports2.Proposed = {}));
    function createProtocolConnection(reader, writer, logger, strategy) {
      return vscode_jsonrpc_1.createMessageConnection(reader, writer, logger, strategy);
    }
    exports2.createProtocolConnection = createProtocolConnection;
  }
});

// node_modules/vscode-languageclient/lib/utils/is.js
var require_is3 = __commonJS({
  "node_modules/vscode-languageclient/lib/utils/is.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var toString = Object.prototype.toString;
    function boolean(value) {
      return value === true || value === false;
    }
    exports2.boolean = boolean;
    function string(value) {
      return toString.call(value) === "[object String]";
    }
    exports2.string = string;
    function number(value) {
      return toString.call(value) === "[object Number]";
    }
    exports2.number = number;
    function error(value) {
      return toString.call(value) === "[object Error]";
    }
    exports2.error = error;
    function func(value) {
      return toString.call(value) === "[object Function]";
    }
    exports2.func = func;
    function array(value) {
      return Array.isArray(value);
    }
    exports2.array = array;
    function stringArray(value) {
      return array(value) && value.every((elem) => string(elem));
    }
    exports2.stringArray = stringArray;
    function typedArray(value, check) {
      return Array.isArray(value) && value.every(check);
    }
    exports2.typedArray = typedArray;
    function thenable(value) {
      return value && func(value.then);
    }
    exports2.thenable = thenable;
  }
});

// node_modules/vscode-languageclient/lib/protocolCompletionItem.js
var require_protocolCompletionItem = __commonJS({
  "node_modules/vscode-languageclient/lib/protocolCompletionItem.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var code = require("vscode");
    var ProtocolCompletionItem = class extends code.CompletionItem {
      constructor(label) {
        super(label);
      }
    };
    exports2.default = ProtocolCompletionItem;
  }
});

// node_modules/vscode-languageclient/lib/protocolCodeLens.js
var require_protocolCodeLens = __commonJS({
  "node_modules/vscode-languageclient/lib/protocolCodeLens.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var code = require("vscode");
    var ProtocolCodeLens = class extends code.CodeLens {
      constructor(range) {
        super(range);
      }
    };
    exports2.default = ProtocolCodeLens;
  }
});

// node_modules/vscode-languageclient/lib/codeConverter.js
var require_codeConverter = __commonJS({
  "node_modules/vscode-languageclient/lib/codeConverter.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var code = require("vscode");
    var proto = require_main3();
    var is = require_is3();
    var protocolCompletionItem_1 = require_protocolCompletionItem();
    var protocolCodeLens_1 = require_protocolCodeLens();
    function createConverter(uriConverter) {
      const nullConverter = (value) => value.toString();
      const _uriConverter = uriConverter || nullConverter;
      function asUri(value) {
        return _uriConverter(value);
      }
      function asTextDocumentIdentifier(textDocument) {
        return {
          uri: _uriConverter(textDocument.uri)
        };
      }
      function asVersionedTextDocumentIdentifier(textDocument) {
        return {
          uri: _uriConverter(textDocument.uri),
          version: textDocument.version
        };
      }
      function asOpenTextDocumentParams(textDocument) {
        return {
          textDocument: {
            uri: _uriConverter(textDocument.uri),
            languageId: textDocument.languageId,
            version: textDocument.version,
            text: textDocument.getText()
          }
        };
      }
      function isTextDocumentChangeEvent(value) {
        let candidate = value;
        return !!candidate.document && !!candidate.contentChanges;
      }
      function isTextDocument(value) {
        let candidate = value;
        return !!candidate.uri && !!candidate.version;
      }
      function asChangeTextDocumentParams(arg) {
        if (isTextDocument(arg)) {
          let result = {
            textDocument: {
              uri: _uriConverter(arg.uri),
              version: arg.version
            },
            contentChanges: [{ text: arg.getText() }]
          };
          return result;
        } else if (isTextDocumentChangeEvent(arg)) {
          let document = arg.document;
          let result = {
            textDocument: {
              uri: _uriConverter(document.uri),
              version: document.version
            },
            contentChanges: arg.contentChanges.map((change) => {
              let range = change.range;
              return {
                range: {
                  start: { line: range.start.line, character: range.start.character },
                  end: { line: range.end.line, character: range.end.character }
                },
                rangeLength: change.rangeLength,
                text: change.text
              };
            })
          };
          return result;
        } else {
          throw Error("Unsupported text document change parameter");
        }
      }
      function asCloseTextDocumentParams(textDocument) {
        return {
          textDocument: asTextDocumentIdentifier(textDocument)
        };
      }
      function asSaveTextDocumentParams(textDocument, includeContent = false) {
        let result = {
          textDocument: asVersionedTextDocumentIdentifier(textDocument)
        };
        if (includeContent) {
          result.text = textDocument.getText();
        }
        return result;
      }
      function asTextDocumentSaveReason(reason) {
        switch (reason) {
          case code.TextDocumentSaveReason.Manual:
            return proto.TextDocumentSaveReason.Manual;
          case code.TextDocumentSaveReason.AfterDelay:
            return proto.TextDocumentSaveReason.AfterDelay;
          case code.TextDocumentSaveReason.FocusOut:
            return proto.TextDocumentSaveReason.FocusOut;
        }
        return proto.TextDocumentSaveReason.Manual;
      }
      function asWillSaveTextDocumentParams(event) {
        return {
          textDocument: asTextDocumentIdentifier(event.document),
          reason: asTextDocumentSaveReason(event.reason)
        };
      }
      function asTextDocumentPositionParams(textDocument, position) {
        return {
          textDocument: asTextDocumentIdentifier(textDocument),
          position: asWorkerPosition(position)
        };
      }
      function asWorkerPosition(position) {
        return { line: position.line, character: position.character };
      }
      function asPosition(value) {
        if (value === void 0) {
          return void 0;
        } else if (value === null) {
          return null;
        }
        return { line: value.line, character: value.character };
      }
      function asRange(value) {
        if (value === void 0 || value === null) {
          return value;
        }
        return { start: asPosition(value.start), end: asPosition(value.end) };
      }
      function asDiagnosticSeverity(value) {
        switch (value) {
          case code.DiagnosticSeverity.Error:
            return proto.DiagnosticSeverity.Error;
          case code.DiagnosticSeverity.Warning:
            return proto.DiagnosticSeverity.Warning;
          case code.DiagnosticSeverity.Information:
            return proto.DiagnosticSeverity.Information;
          case code.DiagnosticSeverity.Hint:
            return proto.DiagnosticSeverity.Hint;
        }
      }
      function asDiagnostic(item) {
        let result = proto.Diagnostic.create(asRange(item.range), item.message);
        if (item.severity) {
          result.severity = asDiagnosticSeverity(item.severity);
        }
        if (is.number(item.code) || is.string(item.code)) {
          result.code = item.code;
        }
        if (item.source) {
          result.source = item.source;
        }
        return result;
      }
      function asDiagnostics(items) {
        if (items === void 0 || items === null) {
          return items;
        }
        return items.map(asDiagnostic);
      }
      function asCompletionItem(item) {
        let result = { label: item.label };
        if (item.detail) {
          result.detail = item.detail;
        }
        if (item.documentation) {
          result.documentation = item.documentation;
        }
        if (item.filterText) {
          result.filterText = item.filterText;
        }
        fillPrimaryInsertText(result, item);
        if (is.number(item.kind)) {
          if (code.CompletionItemKind.Text <= item.kind && item.kind <= code.CompletionItemKind.Reference) {
            result.kind = item.kind + 1;
          } else {
            result.kind = proto.CompletionItemKind.Text;
          }
        }
        if (item.sortText) {
          result.sortText = item.sortText;
        }
        if (item.additionalTextEdits) {
          result.additionalTextEdits = asTextEdits(item.additionalTextEdits);
        }
        if (item.commitCharacters) {
          result.commitCharacters = item.commitCharacters.slice();
        }
        if (item.command) {
          result.command = asCommand(item.command);
        }
        if (item instanceof protocolCompletionItem_1.default && item.data) {
          result.data = item.data;
        }
        return result;
      }
      function fillPrimaryInsertText(target, source) {
        let format = proto.InsertTextFormat.PlainText;
        let text;
        let range = void 0;
        if (source.textEdit) {
          text = source.textEdit.newText;
          range = asRange(source.textEdit.range);
        } else if (source.insertText instanceof code.SnippetString) {
          format = proto.InsertTextFormat.Snippet;
          text = source.insertText.value;
        } else {
          text = source.insertText;
        }
        if (source.range) {
          range = asRange(source.range);
        }
        target.insertTextFormat = format;
        if (source.fromEdit && text && range) {
          target.textEdit = { newText: text, range };
        } else {
          target.insertText = text;
        }
      }
      function asTextEdit(edit) {
        return { range: asRange(edit.range), newText: edit.newText };
      }
      function asTextEdits(edits) {
        if (edits === void 0 || edits === null) {
          return edits;
        }
        return edits.map(asTextEdit);
      }
      function asReferenceParams(textDocument, position, options) {
        return {
          textDocument: asTextDocumentIdentifier(textDocument),
          position: asWorkerPosition(position),
          context: { includeDeclaration: options.includeDeclaration }
        };
      }
      function asCodeActionContext(context) {
        if (context === void 0 || context === null) {
          return context;
        }
        return proto.CodeActionContext.create(asDiagnostics(context.diagnostics));
      }
      function asCommand(item) {
        let result = proto.Command.create(item.title, item.command);
        if (item.arguments) {
          result.arguments = item.arguments;
        }
        return result;
      }
      function asCodeLens(item) {
        let result = proto.CodeLens.create(asRange(item.range));
        if (item.command) {
          result.command = asCommand(item.command);
        }
        if (item instanceof protocolCodeLens_1.default) {
          if (item.data) {
            result.data = item.data;
          }
          ;
        }
        return result;
      }
      function asFormattingOptions(item) {
        return { tabSize: item.tabSize, insertSpaces: item.insertSpaces };
      }
      function asDocumentSymbolParams(textDocument) {
        return {
          textDocument: asTextDocumentIdentifier(textDocument)
        };
      }
      function asCodeLensParams(textDocument) {
        return {
          textDocument: asTextDocumentIdentifier(textDocument)
        };
      }
      function asDocumentLink(item) {
        let result = proto.DocumentLink.create(asRange(item.range));
        if (item.target) {
          result.target = asUri(item.target);
        }
        return result;
      }
      function asDocumentLinkParams(textDocument) {
        return {
          textDocument: asTextDocumentIdentifier(textDocument)
        };
      }
      return {
        asUri,
        asTextDocumentIdentifier,
        asOpenTextDocumentParams,
        asChangeTextDocumentParams,
        asCloseTextDocumentParams,
        asSaveTextDocumentParams,
        asWillSaveTextDocumentParams,
        asTextDocumentPositionParams,
        asWorkerPosition,
        asRange,
        asPosition,
        asDiagnosticSeverity,
        asDiagnostic,
        asDiagnostics,
        asCompletionItem,
        asTextEdit,
        asReferenceParams,
        asCodeActionContext,
        asCommand,
        asCodeLens,
        asFormattingOptions,
        asDocumentSymbolParams,
        asCodeLensParams,
        asDocumentLink,
        asDocumentLinkParams
      };
    }
    exports2.createConverter = createConverter;
  }
});

// node_modules/vscode-languageclient/lib/protocolConverter.js
var require_protocolConverter = __commonJS({
  "node_modules/vscode-languageclient/lib/protocolConverter.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var code = require("vscode");
    var ls = require_main3();
    var is = require_is3();
    var protocolCompletionItem_1 = require_protocolCompletionItem();
    var protocolCodeLens_1 = require_protocolCodeLens();
    function createConverter(uriConverter) {
      const nullConverter = (value) => code.Uri.parse(value);
      const _uriConverter = uriConverter || nullConverter;
      function asUri(value) {
        return _uriConverter(value);
      }
      function asDiagnostics(diagnostics) {
        return diagnostics.map(asDiagnostic);
      }
      function asDiagnostic(diagnostic) {
        let result = new code.Diagnostic(asRange(diagnostic.range), diagnostic.message, asDiagnosticSeverity(diagnostic.severity));
        if (is.number(diagnostic.code) || is.string(diagnostic.code)) {
          result.code = diagnostic.code;
        }
        if (diagnostic.source) {
          result.source = diagnostic.source;
        }
        return result;
      }
      function asPosition(value) {
        if (!value) {
          return void 0;
        }
        return new code.Position(value.line, value.character);
      }
      function asRange(value) {
        if (!value) {
          return void 0;
        }
        return new code.Range(asPosition(value.start), asPosition(value.end));
      }
      function asDiagnosticSeverity(value) {
        if (value === void 0 || value === null) {
          return code.DiagnosticSeverity.Error;
        }
        switch (value) {
          case ls.DiagnosticSeverity.Error:
            return code.DiagnosticSeverity.Error;
          case ls.DiagnosticSeverity.Warning:
            return code.DiagnosticSeverity.Warning;
          case ls.DiagnosticSeverity.Information:
            return code.DiagnosticSeverity.Information;
          case ls.DiagnosticSeverity.Hint:
            return code.DiagnosticSeverity.Hint;
        }
        return code.DiagnosticSeverity.Error;
      }
      function asHover(hover) {
        if (!hover) {
          return void 0;
        }
        return new code.Hover(hover.contents, asRange(hover.range));
      }
      function asCompletionResult(result) {
        if (!result) {
          return void 0;
        }
        if (Array.isArray(result)) {
          let items = result;
          return items.map(asCompletionItem);
        }
        let list = result;
        return new code.CompletionList(list.items.map(asCompletionItem), list.isIncomplete);
      }
      function asCompletionItem(item) {
        let result = new protocolCompletionItem_1.default(item.label);
        if (item.detail) {
          result.detail = item.detail;
        }
        if (item.documentation) {
          result.documentation = item.documentation;
        }
        ;
        if (item.filterText) {
          result.filterText = item.filterText;
        }
        let insertText = asCompletionInsertText(item);
        if (insertText) {
          result.insertText = insertText.text;
          result.range = insertText.range;
          result.fromEdit = insertText.fromEdit;
        }
        if (is.number(item.kind) && item.kind > 0) {
          result.kind = item.kind - 1;
        }
        if (item.sortText) {
          result.sortText = item.sortText;
        }
        if (item.additionalTextEdits) {
          result.additionalTextEdits = asTextEdits(item.additionalTextEdits);
        }
        if (is.stringArray(item.commitCharacters)) {
          result.commitCharacters = item.commitCharacters.slice();
        }
        if (item.command) {
          result.command = asCommand(item.command);
        }
        if (item.data !== void 0 && item.data !== null) {
          result.data = item.data;
        }
        return result;
      }
      function asCompletionInsertText(item) {
        if (item.textEdit) {
          if (item.insertTextFormat === ls.InsertTextFormat.Snippet) {
            return { text: new code.SnippetString(item.textEdit.newText), range: asRange(item.textEdit.range), fromEdit: true };
          } else {
            return { text: item.textEdit.newText, range: asRange(item.textEdit.range), fromEdit: true };
          }
        } else if (item.insertText) {
          if (item.insertTextFormat === ls.InsertTextFormat.Snippet) {
            return { text: new code.SnippetString(item.insertText), fromEdit: false };
          } else {
            return { text: item.insertText, fromEdit: false };
          }
        } else {
          return void 0;
        }
      }
      function asTextEdit(edit) {
        if (!edit) {
          return void 0;
        }
        return new code.TextEdit(asRange(edit.range), edit.newText);
      }
      function asTextEdits(items) {
        if (!items) {
          return void 0;
        }
        return items.map(asTextEdit);
      }
      function asSignatureHelp(item) {
        if (!item) {
          return void 0;
        }
        let result = new code.SignatureHelp();
        if (is.number(item.activeSignature)) {
          result.activeSignature = item.activeSignature;
        } else {
          result.activeSignature = 0;
        }
        if (is.number(item.activeParameter)) {
          result.activeParameter = item.activeParameter;
        } else {
          result.activeParameter = 0;
        }
        if (item.signatures) {
          result.signatures = asSignatureInformations(item.signatures);
        }
        return result;
      }
      function asSignatureInformations(items) {
        return items.map(asSignatureInformation);
      }
      function asSignatureInformation(item) {
        let result = new code.SignatureInformation(item.label);
        if (item.documentation) {
          result.documentation = item.documentation;
        }
        if (item.parameters) {
          result.parameters = asParameterInformations(item.parameters);
        }
        return result;
      }
      function asParameterInformations(item) {
        return item.map(asParameterInformation);
      }
      function asParameterInformation(item) {
        let result = new code.ParameterInformation(item.label);
        if (item.documentation) {
          result.documentation = item.documentation;
        }
        ;
        return result;
      }
      function asDefinitionResult(item) {
        if (!item) {
          return void 0;
        }
        if (is.array(item)) {
          return item.map((location) => asLocation(location));
        } else {
          return asLocation(item);
        }
      }
      function asLocation(item) {
        if (!item) {
          return void 0;
        }
        return new code.Location(_uriConverter(item.uri), asRange(item.range));
      }
      function asReferences(values) {
        if (!values) {
          return void 0;
        }
        return values.map((location) => asLocation(location));
      }
      function asDocumentHighlights(values) {
        if (!values) {
          return void 0;
        }
        return values.map(asDocumentHighlight);
      }
      function asDocumentHighlight(item) {
        let result = new code.DocumentHighlight(asRange(item.range));
        if (is.number(item.kind)) {
          result.kind = asDocumentHighlightKind(item.kind);
        }
        return result;
      }
      function asDocumentHighlightKind(item) {
        switch (item) {
          case ls.DocumentHighlightKind.Text:
            return code.DocumentHighlightKind.Text;
          case ls.DocumentHighlightKind.Read:
            return code.DocumentHighlightKind.Read;
          case ls.DocumentHighlightKind.Write:
            return code.DocumentHighlightKind.Write;
        }
        return code.DocumentHighlightKind.Text;
      }
      function asSymbolInformations(values, uri) {
        if (!values) {
          return void 0;
        }
        return values.map((information) => asSymbolInformation(information, uri));
      }
      function asSymbolInformation(item, uri) {
        let result = new code.SymbolInformation(item.name, item.kind - 1, asRange(item.location.range), item.location.uri ? _uriConverter(item.location.uri) : uri);
        if (item.containerName) {
          result.containerName = item.containerName;
        }
        return result;
      }
      function asCommand(item) {
        let result = { title: item.title, command: item.command };
        if (item.arguments) {
          result.arguments = item.arguments;
        }
        return result;
      }
      function asCommands(items) {
        if (!items) {
          return void 0;
        }
        return items.map(asCommand);
      }
      function asCodeLens(item) {
        if (!item) {
          return void 0;
        }
        let result = new protocolCodeLens_1.default(asRange(item.range));
        if (item.command) {
          result.command = asCommand(item.command);
        }
        if (item.data !== void 0 && item.data !== null) {
          result.data = item.data;
        }
        return result;
      }
      function asCodeLenses(items) {
        if (!items) {
          return void 0;
        }
        return items.map((codeLens) => asCodeLens(codeLens));
      }
      function asWorkspaceEdit(item) {
        if (!item) {
          return void 0;
        }
        let result = new code.WorkspaceEdit();
        if (item.documentChanges) {
          item.documentChanges.forEach((change) => {
            result.set(_uriConverter(change.textDocument.uri), asTextEdits(change.edits));
          });
        } else if (item.changes) {
          Object.keys(item.changes).forEach((key) => {
            result.set(_uriConverter(key), asTextEdits(item.changes[key]));
          });
        }
        return result;
      }
      function asDocumentLink(item) {
        let range = asRange(item.range);
        let target = item.target ? asUri(item.target) : void 0;
        return new code.DocumentLink(range, target);
      }
      function asDocumentLinks(items) {
        if (!items) {
          return void 0;
        }
        return items.map(asDocumentLink);
      }
      return {
        asUri,
        asDiagnostics,
        asDiagnostic,
        asRange,
        asPosition,
        asDiagnosticSeverity,
        asHover,
        asCompletionResult,
        asCompletionItem,
        asTextEdit,
        asTextEdits,
        asSignatureHelp,
        asSignatureInformations,
        asSignatureInformation,
        asParameterInformations,
        asParameterInformation,
        asDefinitionResult,
        asLocation,
        asReferences,
        asDocumentHighlights,
        asDocumentHighlight,
        asDocumentHighlightKind,
        asSymbolInformations,
        asSymbolInformation,
        asCommand,
        asCommands,
        asCodeLens,
        asCodeLenses,
        asWorkspaceEdit,
        asDocumentLink,
        asDocumentLinks
      };
    }
    exports2.createConverter = createConverter;
  }
});

// node_modules/vscode-languageclient/lib/utils/async.js
var require_async = __commonJS({
  "node_modules/vscode-languageclient/lib/utils/async.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Delayer = class {
      constructor(defaultDelay) {
        this.defaultDelay = defaultDelay;
        this.timeout = void 0;
        this.completionPromise = void 0;
        this.onSuccess = void 0;
        this.task = void 0;
      }
      trigger(task, delay = this.defaultDelay) {
        this.task = task;
        if (delay >= 0) {
          this.cancelTimeout();
        }
        if (!this.completionPromise) {
          this.completionPromise = new Promise((resolve) => {
            this.onSuccess = resolve;
          }).then(() => {
            this.completionPromise = void 0;
            this.onSuccess = void 0;
            var result = this.task();
            this.task = void 0;
            return result;
          });
        }
        if (delay >= 0 || this.timeout === void 0) {
          this.timeout = setTimeout(() => {
            this.timeout = void 0;
            this.onSuccess(void 0);
          }, delay >= 0 ? delay : this.defaultDelay);
        }
        return this.completionPromise;
      }
      forceDelivery() {
        if (!this.completionPromise) {
          return void 0;
        }
        this.cancelTimeout();
        let result = this.task();
        this.completionPromise = void 0;
        this.onSuccess = void 0;
        this.task = void 0;
        return result;
      }
      isTriggered() {
        return this.timeout !== void 0;
      }
      cancel() {
        this.cancelTimeout();
        this.completionPromise = void 0;
      }
      cancelTimeout() {
        if (this.timeout !== void 0) {
          clearTimeout(this.timeout);
          this.timeout = void 0;
        }
      }
    };
    exports2.Delayer = Delayer;
  }
});

// node_modules/vscode-languageclient/lib/utils/uuid.js
var require_uuid = __commonJS({
  "node_modules/vscode-languageclient/lib/utils/uuid.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var ValueUUID = class {
      constructor(_value) {
        this._value = _value;
      }
      asHex() {
        return this._value;
      }
      equals(other) {
        return this.asHex() === other.asHex();
      }
    };
    var V4UUID = class _V4UUID extends ValueUUID {
      constructor() {
        super([
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          "-",
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          "-",
          "4",
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          "-",
          _V4UUID._oneOf(_V4UUID._timeHighBits),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          "-",
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex(),
          _V4UUID._randomHex()
        ].join(""));
      }
      static _oneOf(array) {
        return array[Math.floor(array.length * Math.random())];
      }
      static _randomHex() {
        return _V4UUID._oneOf(_V4UUID._chars);
      }
    };
    V4UUID._chars = ["0", "1", "2", "3", "4", "5", "6", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    V4UUID._timeHighBits = ["8", "9", "a", "b"];
    exports2.empty = new ValueUUID("00000000-0000-0000-0000-000000000000");
    function v4() {
      return new V4UUID();
    }
    exports2.v4 = v4;
    var _UUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    function isUUID(value) {
      return _UUIDPattern.test(value);
    }
    exports2.isUUID = isUUID;
    function parse(value) {
      if (!isUUID(value)) {
        throw new Error("invalid uuid");
      }
      return new ValueUUID(value);
    }
    exports2.parse = parse;
    function generateUuid() {
      return v4().asHex();
    }
    exports2.generateUuid = generateUuid;
  }
});

// node_modules/vscode-languageclient/lib/client.js
var require_client = __commonJS({
  "node_modules/vscode-languageclient/lib/client.js"(exports2) {
    "use strict";
    function __export2(m) {
      for (var p in m) if (!exports2.hasOwnProperty(p)) exports2[p] = m[p];
    }
    Object.defineProperty(exports2, "__esModule", { value: true });
    var vscode_1 = require("vscode");
    var vscode_languageserver_protocol_1 = require_main3();
    var c2p = require_codeConverter();
    var p2c = require_protocolConverter();
    var Is = require_is3();
    var async_1 = require_async();
    var UUID = require_uuid();
    __export2(require_main3());
    var ConsoleLogger = class {
      error(message) {
        console.error(message);
      }
      warn(message) {
        console.warn(message);
      }
      info(message) {
        console.info(message);
      }
      log(message) {
        console.log(message);
      }
    };
    function createConnection(input, output, errorHandler, closeHandler) {
      let logger = new ConsoleLogger();
      let connection = vscode_languageserver_protocol_1.createProtocolConnection(input, output, logger);
      connection.onError((data) => {
        errorHandler(data[0], data[1], data[2]);
      });
      connection.onClose(closeHandler);
      let result = {
        listen: () => connection.listen(),
        sendRequest: (type, ...params) => connection.sendRequest(Is.string(type) ? type : type.method, ...params),
        onRequest: (type, handler) => connection.onRequest(Is.string(type) ? type : type.method, handler),
        sendNotification: (type, params) => connection.sendNotification(Is.string(type) ? type : type.method, params),
        onNotification: (type, handler) => connection.onNotification(Is.string(type) ? type : type.method, handler),
        trace: (value, tracer, sendNotification = false) => connection.trace(value, tracer, sendNotification),
        initialize: (params) => connection.sendRequest(vscode_languageserver_protocol_1.InitializeRequest.type, params),
        shutdown: () => connection.sendRequest(vscode_languageserver_protocol_1.ShutdownRequest.type, void 0),
        exit: () => connection.sendNotification(vscode_languageserver_protocol_1.ExitNotification.type),
        onLogMessage: (handler) => connection.onNotification(vscode_languageserver_protocol_1.LogMessageNotification.type, handler),
        onShowMessage: (handler) => connection.onNotification(vscode_languageserver_protocol_1.ShowMessageNotification.type, handler),
        onTelemetry: (handler) => connection.onNotification(vscode_languageserver_protocol_1.TelemetryEventNotification.type, handler),
        didChangeConfiguration: (params) => connection.sendNotification(vscode_languageserver_protocol_1.DidChangeConfigurationNotification.type, params),
        didChangeWatchedFiles: (params) => connection.sendNotification(vscode_languageserver_protocol_1.DidChangeWatchedFilesNotification.type, params),
        didOpenTextDocument: (params) => connection.sendNotification(vscode_languageserver_protocol_1.DidOpenTextDocumentNotification.type, params),
        didChangeTextDocument: (params) => connection.sendNotification(vscode_languageserver_protocol_1.DidChangeTextDocumentNotification.type, params),
        didCloseTextDocument: (params) => connection.sendNotification(vscode_languageserver_protocol_1.DidCloseTextDocumentNotification.type, params),
        didSaveTextDocument: (params) => connection.sendNotification(vscode_languageserver_protocol_1.DidSaveTextDocumentNotification.type, params),
        onDiagnostics: (handler) => connection.onNotification(vscode_languageserver_protocol_1.PublishDiagnosticsNotification.type, handler),
        dispose: () => connection.dispose()
      };
      return result;
    }
    var TransportKind2;
    (function(TransportKind3) {
      TransportKind3[TransportKind3["stdio"] = 0] = "stdio";
      TransportKind3[TransportKind3["ipc"] = 1] = "ipc";
      TransportKind3[TransportKind3["pipe"] = 2] = "pipe";
    })(TransportKind2 = exports2.TransportKind || (exports2.TransportKind = {}));
    var ErrorAction;
    (function(ErrorAction2) {
      ErrorAction2[ErrorAction2["Continue"] = 1] = "Continue";
      ErrorAction2[ErrorAction2["Shutdown"] = 2] = "Shutdown";
    })(ErrorAction = exports2.ErrorAction || (exports2.ErrorAction = {}));
    var CloseAction;
    (function(CloseAction2) {
      CloseAction2[CloseAction2["DoNotRestart"] = 1] = "DoNotRestart";
      CloseAction2[CloseAction2["Restart"] = 2] = "Restart";
    })(CloseAction = exports2.CloseAction || (exports2.CloseAction = {}));
    var DefaultErrorHandler = class {
      constructor(name) {
        this.name = name;
        this.restarts = [];
      }
      error(_error, _message, count) {
        if (count && count <= 3) {
          return ErrorAction.Continue;
        }
        return ErrorAction.Shutdown;
      }
      closed() {
        this.restarts.push(Date.now());
        if (this.restarts.length < 5) {
          return CloseAction.Restart;
        } else {
          let diff = this.restarts[this.restarts.length - 1] - this.restarts[0];
          if (diff <= 3 * 60 * 1e3) {
            vscode_1.window.showErrorMessage(`The ${this.name} server crashed 5 times in the last 3 minutes. The server will not be restarted.`);
            return CloseAction.DoNotRestart;
          } else {
            this.restarts.shift();
            return CloseAction.Restart;
          }
        }
      }
    };
    var RevealOutputChannelOn;
    (function(RevealOutputChannelOn2) {
      RevealOutputChannelOn2[RevealOutputChannelOn2["Info"] = 1] = "Info";
      RevealOutputChannelOn2[RevealOutputChannelOn2["Warn"] = 2] = "Warn";
      RevealOutputChannelOn2[RevealOutputChannelOn2["Error"] = 3] = "Error";
      RevealOutputChannelOn2[RevealOutputChannelOn2["Never"] = 4] = "Never";
    })(RevealOutputChannelOn = exports2.RevealOutputChannelOn || (exports2.RevealOutputChannelOn = {}));
    var State;
    (function(State2) {
      State2[State2["Stopped"] = 1] = "Stopped";
      State2[State2["Running"] = 2] = "Running";
    })(State = exports2.State || (exports2.State = {}));
    var ClientState;
    (function(ClientState2) {
      ClientState2[ClientState2["Initial"] = 0] = "Initial";
      ClientState2[ClientState2["Starting"] = 1] = "Starting";
      ClientState2[ClientState2["StartFailed"] = 2] = "StartFailed";
      ClientState2[ClientState2["Running"] = 3] = "Running";
      ClientState2[ClientState2["Stopping"] = 4] = "Stopping";
      ClientState2[ClientState2["Stopped"] = 5] = "Stopped";
    })(ClientState || (ClientState = {}));
    var DynamicFeature;
    (function(DynamicFeature2) {
      function is(value) {
        let candidate = value;
        return candidate && Is.func(candidate.register) && Is.func(candidate.unregister) && Is.func(candidate.dispose) && candidate.messages !== void 0;
      }
      DynamicFeature2.is = is;
    })(DynamicFeature || (DynamicFeature = {}));
    function ensure(target, key) {
      if (target[key] === void 0) {
        target[key] = {};
      }
      return target[key];
    }
    var DocumentNotifiactions = class {
      constructor(_client, _event, _type, _middleware, _createParams, _selectorFilter) {
        this._client = _client;
        this._event = _event;
        this._type = _type;
        this._middleware = _middleware;
        this._createParams = _createParams;
        this._selectorFilter = _selectorFilter;
        this._selectors = /* @__PURE__ */ new Map();
      }
      static textDocumentFilter(selectors, textDocument) {
        for (const selector of selectors) {
          if (vscode_1.languages.match(selector, textDocument)) {
            return true;
          }
        }
        return false;
      }
      register(_message, data) {
        if (!data.registerOptions.documentSelector) {
          return;
        }
        if (!this._listener) {
          this._listener = this._event(this.callback, this);
        }
        this._selectors.set(data.id, data.registerOptions.documentSelector);
      }
      callback(data) {
        if (!this._selectorFilter || this._selectorFilter(this._selectors.values(), data)) {
          if (this._middleware) {
            this._middleware(data, (data2) => this._client.sendNotification(this._type, this._createParams(data2)));
          } else {
            this._client.sendNotification(this._type, this._createParams(data));
          }
          this.notificationSent(data);
        }
      }
      notificationSent(_data) {
      }
      unregister(id) {
        this._selectors.delete(id);
        if (this._selectors.size === 0 && this._listener) {
          this._listener.dispose();
          this._listener = void 0;
        }
      }
      dispose() {
        if (this._listener) {
          this._listener.dispose();
        }
      }
    };
    var DidOpenTextDocumentFeature = class extends DocumentNotifiactions {
      constructor(client, _syncedDocuments) {
        super(client, vscode_1.workspace.onDidOpenTextDocument, vscode_languageserver_protocol_1.DidOpenTextDocumentNotification.type, client.clientOptions.middleware.didOpen, (textDocument) => client.code2ProtocolConverter.asOpenTextDocumentParams(textDocument), DocumentNotifiactions.textDocumentFilter);
        this._syncedDocuments = _syncedDocuments;
      }
      get messages() {
        return vscode_languageserver_protocol_1.DidOpenTextDocumentNotification.type;
      }
      fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, "textDocument"), "synchronization").dynamicRegistration = true;
      }
      initialize(capabilities, documentSelector) {
        let textDocumentSyncOptions = capabilities.resolvedTextDocumentSync;
        if (documentSelector && textDocumentSyncOptions && textDocumentSyncOptions.openClose) {
          this.register(this.messages, { id: UUID.generateUuid(), registerOptions: { documentSelector } });
        }
      }
      register(message, data) {
        super.register(message, data);
        if (!data.registerOptions.documentSelector) {
          return;
        }
        let documentSelector = data.registerOptions.documentSelector;
        vscode_1.workspace.textDocuments.forEach((textDocument) => {
          let uri = textDocument.uri.toString();
          if (this._syncedDocuments.has(uri)) {
            return;
          }
          if (vscode_1.languages.match(documentSelector, textDocument)) {
            let middleware = this._client.clientOptions.middleware;
            let didOpen = (textDocument2) => {
              this._client.sendNotification(this._type, this._createParams(textDocument2));
            };
            if (middleware.didOpen) {
              middleware.didOpen(textDocument, didOpen);
            } else {
              didOpen(textDocument);
            }
            this._syncedDocuments.set(uri, textDocument);
          }
        });
      }
      notificationSent(textDocument) {
        super.notificationSent(textDocument);
        this._syncedDocuments.set(textDocument.uri.toString(), textDocument);
      }
    };
    var DidCloseTextDocumentFeature = class extends DocumentNotifiactions {
      constructor(client, _syncedDocuments) {
        super(client, vscode_1.workspace.onDidCloseTextDocument, vscode_languageserver_protocol_1.DidCloseTextDocumentNotification.type, client.clientOptions.middleware.didClose, (textDocument) => client.code2ProtocolConverter.asCloseTextDocumentParams(textDocument), DocumentNotifiactions.textDocumentFilter);
        this._syncedDocuments = _syncedDocuments;
      }
      get messages() {
        return vscode_languageserver_protocol_1.DidCloseTextDocumentNotification.type;
      }
      fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, "textDocument"), "synchronization").dynamicRegistration = true;
      }
      initialize(capabilities, documentSelector) {
        let textDocumentSyncOptions = capabilities.resolvedTextDocumentSync;
        if (documentSelector && textDocumentSyncOptions && textDocumentSyncOptions.openClose) {
          this.register(this.messages, { id: UUID.generateUuid(), registerOptions: { documentSelector } });
        }
      }
      notificationSent(textDocument) {
        super.notificationSent(textDocument);
        this._syncedDocuments.delete(textDocument.uri.toString());
      }
      unregister(id) {
        let selector = this._selectors.get(id);
        super.unregister(id);
        let selectors = this._selectors.values();
        this._syncedDocuments.forEach((textDocument) => {
          if (vscode_1.languages.match(selector, textDocument) && !this._selectorFilter(selectors, textDocument)) {
            let middleware = this._client.clientOptions.middleware;
            let didClose = (textDocument2) => {
              this._client.sendNotification(this._type, this._createParams(textDocument2));
            };
            this._syncedDocuments.delete(textDocument.uri.toString());
            if (middleware.didClose) {
              middleware.didClose(textDocument, didClose);
            } else {
              didClose(textDocument);
            }
          }
        });
      }
    };
    var DidChangeTextDocumentFeature = class {
      constructor(_client) {
        this._client = _client;
        this._changeData = /* @__PURE__ */ new Map();
        this._forcingDelivery = false;
      }
      get messages() {
        return vscode_languageserver_protocol_1.DidChangeTextDocumentNotification.type;
      }
      fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, "textDocument"), "synchronization").dynamicRegistration = true;
      }
      initialize(capabilities, documentSelector) {
        let textDocumentSyncOptions = capabilities.resolvedTextDocumentSync;
        if (documentSelector && textDocumentSyncOptions && textDocumentSyncOptions.change !== void 0 && textDocumentSyncOptions.change !== vscode_languageserver_protocol_1.TextDocumentSyncKind.None) {
          this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: Object.assign({}, { documentSelector }, { syncKind: textDocumentSyncOptions.change })
          });
        }
      }
      register(_message, data) {
        if (!data.registerOptions.documentSelector) {
          return;
        }
        if (!this._listener) {
          this._listener = vscode_1.workspace.onDidChangeTextDocument(this.callback, this);
        }
        this._changeData.set(data.id, {
          documentSelector: data.registerOptions.documentSelector,
          syncKind: data.registerOptions.syncKind
        });
      }
      callback(event) {
        for (const changeData of this._changeData.values()) {
          if (vscode_1.languages.match(changeData.documentSelector, event.document)) {
            let middleware = this._client.clientOptions.middleware;
            if (changeData.syncKind === vscode_languageserver_protocol_1.TextDocumentSyncKind.Incremental) {
              let params = this._client.code2ProtocolConverter.asChangeTextDocumentParams(event);
              if (middleware.didChange) {
                middleware.didChange(event, () => this._client.sendNotification(vscode_languageserver_protocol_1.DidChangeTextDocumentNotification.type, params));
              } else {
                this._client.sendNotification(vscode_languageserver_protocol_1.DidChangeTextDocumentNotification.type, params);
              }
            } else if (changeData.syncKind === vscode_languageserver_protocol_1.TextDocumentSyncKind.Full) {
              let didChange = (event2) => {
                if (this._changeDelayer) {
                  if (this._changeDelayer.uri !== event2.document.uri.toString()) {
                    this.forceDelivery();
                    this._changeDelayer.uri = event2.document.uri.toString();
                  }
                  this._changeDelayer.delayer.trigger(() => {
                    this._client.sendNotification(vscode_languageserver_protocol_1.DidChangeTextDocumentNotification.type, this._client.code2ProtocolConverter.asChangeTextDocumentParams(event2.document));
                  });
                } else {
                  this._changeDelayer = {
                    uri: event2.document.uri.toString(),
                    delayer: new async_1.Delayer(200)
                  };
                  this._changeDelayer.delayer.trigger(() => {
                    this._client.sendNotification(vscode_languageserver_protocol_1.DidChangeTextDocumentNotification.type, this._client.code2ProtocolConverter.asChangeTextDocumentParams(event2.document));
                  }, -1);
                }
              };
              if (middleware.didChange) {
                middleware.didChange(event, didChange);
              } else {
                didChange(event);
              }
            }
          }
        }
      }
      unregister(id) {
        this._changeData.delete(id);
        if (this._changeData.size === 0 && this._listener) {
          this._listener.dispose();
          this._listener = void 0;
        }
      }
      dispose() {
        if (this._listener) {
          this._listener.dispose();
          this._listener = void 0;
        }
      }
      forceDelivery() {
        if (this._forcingDelivery || !this._changeDelayer) {
          return;
        }
        try {
          this._forcingDelivery = true;
          this._changeDelayer.delayer.forceDelivery();
        } finally {
          this._forcingDelivery = false;
        }
      }
    };
    var WillSaveFeature = class extends DocumentNotifiactions {
      constructor(client) {
        super(client, vscode_1.workspace.onWillSaveTextDocument, vscode_languageserver_protocol_1.WillSaveTextDocumentNotification.type, client.clientOptions.middleware.willSave, (willSaveEvent) => client.code2ProtocolConverter.asWillSaveTextDocumentParams(willSaveEvent), (selectors, willSaveEvent) => DocumentNotifiactions.textDocumentFilter(selectors, willSaveEvent.document));
      }
      get messages() {
        return vscode_languageserver_protocol_1.WillSaveTextDocumentNotification.type;
      }
      fillClientCapabilities(capabilities) {
        let value = ensure(ensure(capabilities, "textDocument"), "synchronization");
        value.willSave = true;
      }
      initialize(capabilities, documentSelector) {
        let textDocumentSyncOptions = capabilities.resolvedTextDocumentSync;
        if (documentSelector && textDocumentSyncOptions && textDocumentSyncOptions.willSave) {
          this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: { documentSelector }
          });
        }
      }
    };
    var WillSaveWaitUntilFeature = class {
      constructor(_client) {
        this._client = _client;
        this._selectors = /* @__PURE__ */ new Map();
      }
      get messages() {
        return vscode_languageserver_protocol_1.WillSaveTextDocumentWaitUntilRequest.type;
      }
      fillClientCapabilities(capabilities) {
        let value = ensure(ensure(capabilities, "textDocument"), "synchronization");
        value.willSaveWaitUntil = true;
      }
      initialize(capabilities, documentSelector) {
        let textDocumentSyncOptions = capabilities.resolvedTextDocumentSync;
        if (documentSelector && textDocumentSyncOptions && textDocumentSyncOptions.willSaveWaitUntil) {
          this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: { documentSelector }
          });
        }
      }
      register(_message, data) {
        if (!data.registerOptions.documentSelector) {
          return;
        }
        if (!this._listener) {
          this._listener = vscode_1.workspace.onWillSaveTextDocument(this.callback, this);
        }
        this._selectors.set(data.id, data.registerOptions.documentSelector);
      }
      callback(event) {
        if (DocumentNotifiactions.textDocumentFilter(this._selectors.values(), event.document)) {
          let middleware = this._client.clientOptions.middleware;
          let willSaveWaitUntil = (event2) => {
            return this._client.sendRequest(vscode_languageserver_protocol_1.WillSaveTextDocumentWaitUntilRequest.type, this._client.code2ProtocolConverter.asWillSaveTextDocumentParams(event2)).then((edits) => {
              return this._client.protocol2CodeConverter.asTextEdits(edits);
            });
          };
          event.waitUntil(middleware.willSaveWaitUntil ? middleware.willSaveWaitUntil(event, willSaveWaitUntil) : willSaveWaitUntil(event));
        }
      }
      unregister(id) {
        this._selectors.delete(id);
        if (this._selectors.size === 0 && this._listener) {
          this._listener.dispose();
          this._listener = void 0;
        }
      }
      dispose() {
        if (this._listener) {
          this._listener.dispose();
          this._listener = void 0;
        }
      }
    };
    var DidSaveTextDocumentFeature = class extends DocumentNotifiactions {
      constructor(client) {
        super(client, vscode_1.workspace.onDidSaveTextDocument, vscode_languageserver_protocol_1.DidSaveTextDocumentNotification.type, client.clientOptions.middleware.didSave, (textDocument) => client.code2ProtocolConverter.asSaveTextDocumentParams(textDocument, this._includeText), DocumentNotifiactions.textDocumentFilter);
      }
      get messages() {
        return vscode_languageserver_protocol_1.DidSaveTextDocumentNotification.type;
      }
      fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, "textDocument"), "synchronization").didSave = true;
      }
      initialize(capabilities, documentSelector) {
        let textDocumentSyncOptions = capabilities.resolvedTextDocumentSync;
        if (documentSelector && textDocumentSyncOptions && textDocumentSyncOptions.save) {
          this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: Object.assign({}, { documentSelector }, { includeText: !!textDocumentSyncOptions.save.includeText })
          });
        }
      }
      register(method, data) {
        this._includeText = !!data.registerOptions.includeText;
        super.register(method, data);
      }
    };
    var FileSystemWatcherFeature = class {
      constructor(_client, _notifyFileEvent) {
        this._client = _client;
        this._notifyFileEvent = _notifyFileEvent;
        this._watchers = /* @__PURE__ */ new Map();
      }
      get messages() {
        return vscode_languageserver_protocol_1.DidChangeWatchedFilesNotification.type;
      }
      fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, "workspace"), "didChangeWatchedFiles").dynamicRegistration = true;
      }
      initialize(_capabilities, _documentSelector) {
      }
      register(_method, data) {
        if (!Array.isArray(data.registerOptions.watchers)) {
          return;
        }
        let disposeables = [];
        for (let watcher of data.registerOptions.watchers) {
          if (!Is.string(watcher.globPattern)) {
            continue;
          }
          let watchCreate = true, watchChange = true, watchDelete = true;
          if (watcher.kind !== void 0 && watcher.kind !== null) {
            watchCreate = (watcher.kind & vscode_languageserver_protocol_1.WatchKind.Create) !== 0;
            watchChange = (watcher.kind & vscode_languageserver_protocol_1.WatchKind.Change) != 0;
            watchDelete = (watcher.kind & vscode_languageserver_protocol_1.WatchKind.Delete) != 0;
          }
          let fileSystemWatcher = vscode_1.workspace.createFileSystemWatcher(watcher.globPattern, !watchCreate, !watchChange, !watchDelete);
          this.hookListeners(fileSystemWatcher, watchCreate, watchChange, watchDelete);
          disposeables.push(fileSystemWatcher);
        }
        this._watchers.set(data.id, disposeables);
      }
      registerRaw(id, fileSystemWatchers) {
        let disposeables = [];
        for (let fileSystemWatcher of fileSystemWatchers) {
          this.hookListeners(fileSystemWatcher, true, true, true, disposeables);
        }
        this._watchers.set(id, disposeables);
      }
      hookListeners(fileSystemWatcher, watchCreate, watchChange, watchDelete, listeners) {
        if (watchCreate) {
          fileSystemWatcher.onDidCreate((resource) => this._notifyFileEvent({
            uri: this._client.code2ProtocolConverter.asUri(resource),
            type: vscode_languageserver_protocol_1.FileChangeType.Created
          }), null, listeners);
        }
        if (watchChange) {
          fileSystemWatcher.onDidChange((resource) => this._notifyFileEvent({
            uri: this._client.code2ProtocolConverter.asUri(resource),
            type: vscode_languageserver_protocol_1.FileChangeType.Changed
          }), null, listeners);
        }
        if (watchDelete) {
          fileSystemWatcher.onDidDelete((resource) => this._notifyFileEvent({
            uri: this._client.code2ProtocolConverter.asUri(resource),
            type: vscode_languageserver_protocol_1.FileChangeType.Deleted
          }), null, listeners);
        }
      }
      unregister(id) {
        let disposeables = this._watchers.get(id);
        if (disposeables) {
          for (let disposable of disposeables) {
            disposable.dispose();
          }
        }
      }
      dispose() {
        this._watchers.forEach((disposeables) => {
          for (let disposable of disposeables) {
            disposable.dispose();
          }
        });
      }
    };
    var TextDocumentFeature = class {
      constructor(_client, _message) {
        this._client = _client;
        this._message = _message;
        this._providers = /* @__PURE__ */ new Map();
      }
      get messages() {
        return this._message;
      }
      register(message, data) {
        if (message.method !== this.messages.method) {
          throw new Error(`Register called on wron feature. Requested ${message.method} but reached feature ${this.messages.method}`);
        }
        if (!data.registerOptions.documentSelector) {
          return;
        }
        let provider = this.registerLanguageProvider(data.registerOptions);
        if (provider) {
          this._providers.set(data.id, provider);
        }
      }
      unregister(id) {
        let provider = this._providers.get(id);
        if (provider) {
          provider.dispose();
        }
      }
      dispose() {
        this._providers.forEach((value) => {
          value.dispose();
        });
      }
    };
    var WorkspaceFeature = class {
      constructor(_client, _message) {
        this._client = _client;
        this._message = _message;
        this._providers = /* @__PURE__ */ new Map();
      }
      get messages() {
        return this._message;
      }
      register(message, data) {
        if (message.method !== this.messages.method) {
          throw new Error(`Register called on wron feature. Requested ${message.method} but reached feature ${this.messages.method}`);
        }
        let provider = this.registerLanguageProvider(data.registerOptions);
        if (provider) {
          this._providers.set(data.id, provider);
        }
      }
      unregister(id) {
        let provider = this._providers.get(id);
        if (provider) {
          provider.dispose();
        }
      }
      dispose() {
        this._providers.forEach((value) => {
          value.dispose();
        });
      }
    };
    var CompletionItemFeature = class extends TextDocumentFeature {
      constructor(client) {
        super(client, vscode_languageserver_protocol_1.CompletionRequest.type);
      }
      fillClientCapabilities(capabilites) {
        let completion = ensure(ensure(capabilites, "textDocument"), "completion");
        completion.dynamicRegistration = true;
        completion.completionItem = { snippetSupport: true, commitCharactersSupport: true };
      }
      initialize(capabilities, documentSelector) {
        if (!capabilities.completionProvider || !documentSelector) {
          return;
        }
        this.register(this.messages, {
          id: UUID.generateUuid(),
          registerOptions: Object.assign({}, { documentSelector }, capabilities.completionProvider)
        });
      }
      registerLanguageProvider(options) {
        let triggerCharacters = options.triggerCharacters || [];
        let client = this._client;
        let provideCompletionItems = (document, position, token) => {
          return client.sendRequest(vscode_languageserver_protocol_1.CompletionRequest.type, client.code2ProtocolConverter.asTextDocumentPositionParams(document, position), token).then(client.protocol2CodeConverter.asCompletionResult, (error) => {
            client.logFailedRequest(vscode_languageserver_protocol_1.CompletionRequest.type, error);
            return Promise.resolve([]);
          });
        };
        let resolveCompletionItem = (item, token) => {
          return client.sendRequest(vscode_languageserver_protocol_1.CompletionResolveRequest.type, client.code2ProtocolConverter.asCompletionItem(item), token).then(client.protocol2CodeConverter.asCompletionItem, (error) => {
            client.logFailedRequest(vscode_languageserver_protocol_1.CompletionResolveRequest.type, error);
            return Promise.resolve(item);
          });
        };
        let middleware = this._client.clientOptions.middleware;
        return vscode_1.languages.registerCompletionItemProvider(options.documentSelector, {
          provideCompletionItems: (document, position, token) => {
            return middleware.provideCompletionItem ? middleware.provideCompletionItem(document, position, token, provideCompletionItems) : provideCompletionItems(document, position, token);
          },
          resolveCompletionItem: options.resolveProvider ? (item, token) => {
            return middleware.resolveCompletionItem ? middleware.resolveCompletionItem(item, token, resolveCompletionItem) : resolveCompletionItem(item, token);
          } : void 0
        }, ...triggerCharacters);
      }
    };
    var HoverFeature = class extends TextDocumentFeature {
      constructor(client) {
        super(client, vscode_languageserver_protocol_1.HoverRequest.type);
      }
      fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, "textDocument"), "hover").dynamicRegistration = true;
      }
      initialize(capabilities, documentSelector) {
        if (!capabilities.hoverProvider || !documentSelector) {
          return;
        }
        this.register(this.messages, {
          id: UUID.generateUuid(),
          registerOptions: Object.assign({}, { documentSelector })
        });
      }
      registerLanguageProvider(options) {
        let client = this._client;
        let provideHover = (document, position, token) => {
          return client.sendRequest(vscode_languageserver_protocol_1.HoverRequest.type, client.code2ProtocolConverter.asTextDocumentPositionParams(document, position), token).then(client.protocol2CodeConverter.asHover, (error) => {
            client.logFailedRequest(vscode_languageserver_protocol_1.HoverRequest.type, error);
            return Promise.resolve(null);
          });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerHoverProvider(options.documentSelector, {
          provideHover: (document, position, token) => {
            return middleware.provideHover ? middleware.provideHover(document, position, token, provideHover) : provideHover(document, position, token);
          }
        });
      }
    };
    var SignatureHelpFeature = class extends TextDocumentFeature {
      constructor(client) {
        super(client, vscode_languageserver_protocol_1.SignatureHelpRequest.type);
      }
      fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, "textDocument"), "signatureHelp").dynamicRegistration = true;
      }
      initialize(capabilities, documentSelector) {
        if (!capabilities.signatureHelpProvider || !documentSelector) {
          return;
        }
        this.register(this.messages, {
          id: UUID.generateUuid(),
          registerOptions: Object.assign({}, { documentSelector }, capabilities.signatureHelpProvider)
        });
      }
      registerLanguageProvider(options) {
        let client = this._client;
        let providerSignatureHelp = (document, position, token) => {
          return client.sendRequest(vscode_languageserver_protocol_1.SignatureHelpRequest.type, client.code2ProtocolConverter.asTextDocumentPositionParams(document, position), token).then(client.protocol2CodeConverter.asSignatureHelp, (error) => {
            client.logFailedRequest(vscode_languageserver_protocol_1.SignatureHelpRequest.type, error);
            return Promise.resolve(null);
          });
        };
        let middleware = client.clientOptions.middleware;
        let triggerCharacters = options.triggerCharacters || [];
        return vscode_1.languages.registerSignatureHelpProvider(options.documentSelector, {
          provideSignatureHelp: (document, position, token) => {
            return middleware.provideSignatureHelp ? middleware.provideSignatureHelp(document, position, token, providerSignatureHelp) : providerSignatureHelp(document, position, token);
          }
        }, ...triggerCharacters);
      }
    };
    var DefinitionFeature = class extends TextDocumentFeature {
      constructor(client) {
        super(client, vscode_languageserver_protocol_1.DefinitionRequest.type);
      }
      fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, "textDocument"), "definition").dynamicRegistration = true;
      }
      initialize(capabilities, documentSelector) {
        if (!capabilities.definitionProvider || !documentSelector) {
          return;
        }
        this.register(this.messages, {
          id: UUID.generateUuid(),
          registerOptions: Object.assign({}, { documentSelector })
        });
      }
      registerLanguageProvider(options) {
        let client = this._client;
        let provideDefinition = (document, position, token) => {
          return client.sendRequest(vscode_languageserver_protocol_1.DefinitionRequest.type, client.code2ProtocolConverter.asTextDocumentPositionParams(document, position), token).then(client.protocol2CodeConverter.asDefinitionResult, (error) => {
            client.logFailedRequest(vscode_languageserver_protocol_1.DefinitionRequest.type, error);
            return Promise.resolve(null);
          });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerDefinitionProvider(options.documentSelector, {
          provideDefinition: (document, position, token) => {
            return middleware.provideDefinition ? middleware.provideDefinition(document, position, token, provideDefinition) : provideDefinition(document, position, token);
          }
        });
      }
    };
    var ReferencesFeature = class extends TextDocumentFeature {
      constructor(client) {
        super(client, vscode_languageserver_protocol_1.ReferencesRequest.type);
      }
      fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, "textDocument"), "references").dynamicRegistration = true;
      }
      initialize(capabilities, documentSelector) {
        if (!capabilities.referencesProvider || !documentSelector) {
          return;
        }
        this.register(this.messages, {
          id: UUID.generateUuid(),
          registerOptions: Object.assign({}, { documentSelector })
        });
      }
      registerLanguageProvider(options) {
        let client = this._client;
        let providerReferences = (document, position, options2, token) => {
          return client.sendRequest(vscode_languageserver_protocol_1.ReferencesRequest.type, client.code2ProtocolConverter.asReferenceParams(document, position, options2), token).then(client.protocol2CodeConverter.asReferences, (error) => {
            client.logFailedRequest(vscode_languageserver_protocol_1.ReferencesRequest.type, error);
            return Promise.resolve([]);
          });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerReferenceProvider(options.documentSelector, {
          provideReferences: (document, position, options2, token) => {
            return middleware.provideReferences ? middleware.provideReferences(document, position, options2, token, providerReferences) : providerReferences(document, position, options2, token);
          }
        });
      }
    };
    var DocumentHighlightFeature = class extends TextDocumentFeature {
      constructor(client) {
        super(client, vscode_languageserver_protocol_1.DocumentHighlightRequest.type);
      }
      fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, "textDocument"), "documentHighlight").dynamicRegistration = true;
      }
      initialize(capabilities, documentSelector) {
        if (!capabilities.documentHighlightProvider || !documentSelector) {
          return;
        }
        this.register(this.messages, {
          id: UUID.generateUuid(),
          registerOptions: Object.assign({}, { documentSelector })
        });
      }
      registerLanguageProvider(options) {
        let client = this._client;
        let provideDocumentHighlights = (document, position, token) => {
          return client.sendRequest(vscode_languageserver_protocol_1.DocumentHighlightRequest.type, client.code2ProtocolConverter.asTextDocumentPositionParams(document, position), token).then(client.protocol2CodeConverter.asDocumentHighlights, (error) => {
            client.logFailedRequest(vscode_languageserver_protocol_1.DocumentHighlightRequest.type, error);
            return Promise.resolve([]);
          });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerDocumentHighlightProvider(options.documentSelector, {
          provideDocumentHighlights: (document, position, token) => {
            return middleware.provideDocumentHighlights ? middleware.provideDocumentHighlights(document, position, token, provideDocumentHighlights) : provideDocumentHighlights(document, position, token);
          }
        });
      }
    };
    var DocumentSymbolFeature = class extends TextDocumentFeature {
      constructor(client) {
        super(client, vscode_languageserver_protocol_1.DocumentSymbolRequest.type);
      }
      fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, "textDocument"), "documentSymbol").dynamicRegistration = true;
      }
      initialize(capabilities, documentSelector) {
        if (!capabilities.documentSymbolProvider || !documentSelector) {
          return;
        }
        this.register(this.messages, {
          id: UUID.generateUuid(),
          registerOptions: Object.assign({}, { documentSelector })
        });
      }
      registerLanguageProvider(options) {
        let client = this._client;
        let provideDocumentSymbols = (document, token) => {
          return client.sendRequest(vscode_languageserver_protocol_1.DocumentSymbolRequest.type, client.code2ProtocolConverter.asDocumentSymbolParams(document), token).then(client.protocol2CodeConverter.asSymbolInformations, (error) => {
            client.logFailedRequest(vscode_languageserver_protocol_1.DocumentSymbolRequest.type, error);
            return Promise.resolve([]);
          });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerDocumentSymbolProvider(options.documentSelector, {
          provideDocumentSymbols: (document, token) => {
            return middleware.provideDocumentSymbols ? middleware.provideDocumentSymbols(document, token, provideDocumentSymbols) : provideDocumentSymbols(document, token);
          }
        });
      }
    };
    var WorkspaceSymbolFeature = class extends WorkspaceFeature {
      constructor(client) {
        super(client, vscode_languageserver_protocol_1.WorkspaceSymbolRequest.type);
      }
      fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, "workspace"), "symbol").dynamicRegistration = true;
      }
      initialize(capabilities) {
        if (!capabilities.workspaceSymbolProvider) {
          return;
        }
        this.register(this.messages, {
          id: UUID.generateUuid(),
          registerOptions: void 0
        });
      }
      registerLanguageProvider(_options) {
        let client = this._client;
        let provideWorkspaceSymbols = (query, token) => {
          return client.sendRequest(vscode_languageserver_protocol_1.WorkspaceSymbolRequest.type, { query }, token).then(client.protocol2CodeConverter.asSymbolInformations, (error) => {
            client.logFailedRequest(vscode_languageserver_protocol_1.WorkspaceSymbolRequest.type, error);
            return Promise.resolve([]);
          });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerWorkspaceSymbolProvider({
          provideWorkspaceSymbols: (query, token) => {
            return middleware.provideWorkspaceSymbols ? middleware.provideWorkspaceSymbols(query, token, provideWorkspaceSymbols) : provideWorkspaceSymbols(query, token);
          }
        });
      }
    };
    var CodeActionFeature = class extends TextDocumentFeature {
      constructor(client) {
        super(client, vscode_languageserver_protocol_1.CodeActionRequest.type);
      }
      fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, "textDocument"), "codeAction").dynamicRegistration = true;
      }
      initialize(capabilities, documentSelector) {
        if (!capabilities.codeActionProvider || !documentSelector) {
          return;
        }
        this.register(this.messages, {
          id: UUID.generateUuid(),
          registerOptions: Object.assign({}, { documentSelector })
        });
      }
      registerLanguageProvider(options) {
        let client = this._client;
        let provideCodeActions = (document, range, context, token) => {
          let params = {
            textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
            range: client.code2ProtocolConverter.asRange(range),
            context: client.code2ProtocolConverter.asCodeActionContext(context)
          };
          return client.sendRequest(vscode_languageserver_protocol_1.CodeActionRequest.type, params, token).then(client.protocol2CodeConverter.asCommands, (error) => {
            client.logFailedRequest(vscode_languageserver_protocol_1.CodeActionRequest.type, error);
            return Promise.resolve([]);
          });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerCodeActionsProvider(options.documentSelector, {
          provideCodeActions: (document, range, context, token) => {
            return middleware.provideCodeActions ? middleware.provideCodeActions(document, range, context, token, provideCodeActions) : provideCodeActions(document, range, context, token);
          }
        });
      }
    };
    var CodeLensFeature = class extends TextDocumentFeature {
      constructor(client) {
        super(client, vscode_languageserver_protocol_1.CodeLensRequest.type);
      }
      fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, "textDocument"), "codeLens").dynamicRegistration = true;
      }
      initialize(capabilities, documentSelector) {
        if (!capabilities.codeLensProvider || !documentSelector) {
          return;
        }
        this.register(this.messages, {
          id: UUID.generateUuid(),
          registerOptions: Object.assign({}, { documentSelector }, capabilities.codeLensProvider)
        });
      }
      registerLanguageProvider(options) {
        let client = this._client;
        let provideCodeLenses = (document, token) => {
          return client.sendRequest(vscode_languageserver_protocol_1.CodeLensRequest.type, client.code2ProtocolConverter.asCodeLensParams(document), token).then(client.protocol2CodeConverter.asCodeLenses, (error) => {
            client.logFailedRequest(vscode_languageserver_protocol_1.CodeLensRequest.type, error);
            return Promise.resolve([]);
          });
        };
        let resolveCodeLens = (codeLens, token) => {
          return client.sendRequest(vscode_languageserver_protocol_1.CodeLensResolveRequest.type, client.code2ProtocolConverter.asCodeLens(codeLens), token).then(client.protocol2CodeConverter.asCodeLens, (error) => {
            client.logFailedRequest(vscode_languageserver_protocol_1.CodeLensResolveRequest.type, error);
            return codeLens;
          });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerCodeLensProvider(options.documentSelector, {
          provideCodeLenses: (document, token) => {
            return middleware.provideCodeLenses ? middleware.provideCodeLenses(document, token, provideCodeLenses) : provideCodeLenses(document, token);
          },
          resolveCodeLens: options.resolveProvider ? (codeLens, token) => {
            return middleware.resolveCodeLens ? middleware.resolveCodeLens(codeLens, token, resolveCodeLens) : resolveCodeLens(codeLens, token);
          } : void 0
        });
      }
    };
    var DocumentFormattingFeature = class extends TextDocumentFeature {
      constructor(client) {
        super(client, vscode_languageserver_protocol_1.DocumentFormattingRequest.type);
      }
      fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, "textDocument"), "formatting").dynamicRegistration = true;
      }
      initialize(capabilities, documentSelector) {
        if (!capabilities.documentFormattingProvider || !documentSelector) {
          return;
        }
        this.register(this.messages, {
          id: UUID.generateUuid(),
          registerOptions: Object.assign({}, { documentSelector })
        });
      }
      registerLanguageProvider(options) {
        let client = this._client;
        let provideDocumentFormattingEdits = (document, options2, token) => {
          let params = {
            textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
            options: client.code2ProtocolConverter.asFormattingOptions(options2)
          };
          return client.sendRequest(vscode_languageserver_protocol_1.DocumentFormattingRequest.type, params, token).then(client.protocol2CodeConverter.asTextEdits, (error) => {
            client.logFailedRequest(vscode_languageserver_protocol_1.DocumentFormattingRequest.type, error);
            return Promise.resolve([]);
          });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerDocumentFormattingEditProvider(options.documentSelector, {
          provideDocumentFormattingEdits: (document, options2, token) => {
            return middleware.provideDocumentFormattingEdits ? middleware.provideDocumentFormattingEdits(document, options2, token, provideDocumentFormattingEdits) : provideDocumentFormattingEdits(document, options2, token);
          }
        });
      }
    };
    var DocumentRangeFormattingFeature = class extends TextDocumentFeature {
      constructor(client) {
        super(client, vscode_languageserver_protocol_1.DocumentRangeFormattingRequest.type);
      }
      fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, "textDocument"), "rangeFormatting").dynamicRegistration = true;
      }
      initialize(capabilities, documentSelector) {
        if (!capabilities.documentRangeFormattingProvider || !documentSelector) {
          return;
        }
        this.register(this.messages, {
          id: UUID.generateUuid(),
          registerOptions: Object.assign({}, { documentSelector })
        });
      }
      registerLanguageProvider(options) {
        let client = this._client;
        let provideDocumentRangeFormattingEdits = (document, range, options2, token) => {
          let params = {
            textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
            range: client.code2ProtocolConverter.asRange(range),
            options: client.code2ProtocolConverter.asFormattingOptions(options2)
          };
          return client.sendRequest(vscode_languageserver_protocol_1.DocumentRangeFormattingRequest.type, params, token).then(client.protocol2CodeConverter.asTextEdits, (error) => {
            client.logFailedRequest(vscode_languageserver_protocol_1.DocumentRangeFormattingRequest.type, error);
            return Promise.resolve([]);
          });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerDocumentRangeFormattingEditProvider(options.documentSelector, {
          provideDocumentRangeFormattingEdits: (document, range, options2, token) => {
            return middleware.provideDocumentRangeFormattingEdits ? middleware.provideDocumentRangeFormattingEdits(document, range, options2, token, provideDocumentRangeFormattingEdits) : provideDocumentRangeFormattingEdits(document, range, options2, token);
          }
        });
      }
    };
    var DocumentOnTypeFormattingFeature = class extends TextDocumentFeature {
      constructor(client) {
        super(client, vscode_languageserver_protocol_1.DocumentOnTypeFormattingRequest.type);
      }
      fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, "textDocument"), "onTypeFormatting").dynamicRegistration = true;
      }
      initialize(capabilities, documentSelector) {
        if (!capabilities.documentOnTypeFormattingProvider || !documentSelector) {
          return;
        }
        this.register(this.messages, {
          id: UUID.generateUuid(),
          registerOptions: Object.assign({}, { documentSelector }, capabilities.documentOnTypeFormattingProvider)
        });
      }
      registerLanguageProvider(options) {
        let client = this._client;
        let moreTriggerCharacter = options.moreTriggerCharacter || [];
        let provideOnTypeFormattingEdits = (document, position, ch, options2, token) => {
          let params = {
            textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
            position: client.code2ProtocolConverter.asPosition(position),
            ch,
            options: client.code2ProtocolConverter.asFormattingOptions(options2)
          };
          return client.sendRequest(vscode_languageserver_protocol_1.DocumentOnTypeFormattingRequest.type, params, token).then(client.protocol2CodeConverter.asTextEdits, (error) => {
            client.logFailedRequest(vscode_languageserver_protocol_1.DocumentOnTypeFormattingRequest.type, error);
            return Promise.resolve([]);
          });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerOnTypeFormattingEditProvider(options.documentSelector, {
          provideOnTypeFormattingEdits: (document, position, ch, options2, token) => {
            return middleware.provideOnTypeFormattingEdits ? middleware.provideOnTypeFormattingEdits(document, position, ch, options2, token, provideOnTypeFormattingEdits) : provideOnTypeFormattingEdits(document, position, ch, options2, token);
          }
        }, options.firstTriggerCharacter, ...moreTriggerCharacter);
      }
    };
    var RenameFeature = class extends TextDocumentFeature {
      constructor(client) {
        super(client, vscode_languageserver_protocol_1.RenameRequest.type);
      }
      fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, "textDocument"), "rename").dynamicRegistration = true;
      }
      initialize(capabilities, documentSelector) {
        if (!capabilities.renameProvider || !documentSelector) {
          return;
        }
        this.register(this.messages, {
          id: UUID.generateUuid(),
          registerOptions: Object.assign({}, { documentSelector })
        });
      }
      registerLanguageProvider(options) {
        let client = this._client;
        let provideRenameEdits = (document, position, newName, token) => {
          let params = {
            textDocument: client.code2ProtocolConverter.asTextDocumentIdentifier(document),
            position: client.code2ProtocolConverter.asPosition(position),
            newName
          };
          return client.sendRequest(vscode_languageserver_protocol_1.RenameRequest.type, params, token).then(client.protocol2CodeConverter.asWorkspaceEdit, (error) => {
            client.logFailedRequest(vscode_languageserver_protocol_1.RenameRequest.type, error);
            Promise.reject(new Error(error.message));
          });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerRenameProvider(options.documentSelector, {
          provideRenameEdits: (document, position, newName, token) => {
            return middleware.provideRenameEdits ? middleware.provideRenameEdits(document, position, newName, token, provideRenameEdits) : provideRenameEdits(document, position, newName, token);
          }
        });
      }
    };
    var DocumentLinkFeature = class extends TextDocumentFeature {
      constructor(client) {
        super(client, vscode_languageserver_protocol_1.DocumentLinkRequest.type);
      }
      fillClientCapabilities(capabilites) {
        ensure(ensure(capabilites, "textDocument"), "documentLink").dynamicRegistration = true;
      }
      initialize(capabilities, documentSelector) {
        if (!capabilities.documentLinkProvider || !documentSelector) {
          return;
        }
        this.register(this.messages, {
          id: UUID.generateUuid(),
          registerOptions: Object.assign({}, { documentSelector }, capabilities.documentLinkProvider)
        });
      }
      registerLanguageProvider(options) {
        let client = this._client;
        let provideDocumentLinks = (document, token) => {
          return client.sendRequest(vscode_languageserver_protocol_1.DocumentLinkRequest.type, client.code2ProtocolConverter.asDocumentLinkParams(document), token).then(client.protocol2CodeConverter.asDocumentLinks, (error) => {
            client.logFailedRequest(vscode_languageserver_protocol_1.DocumentLinkRequest.type, error);
            Promise.resolve(new Error(error.message));
          });
        };
        let resolveDocumentLink = (link, token) => {
          return client.sendRequest(vscode_languageserver_protocol_1.DocumentLinkResolveRequest.type, client.code2ProtocolConverter.asDocumentLink(link), token).then(client.protocol2CodeConverter.asDocumentLink, (error) => {
            client.logFailedRequest(vscode_languageserver_protocol_1.DocumentLinkResolveRequest.type, error);
            Promise.resolve(new Error(error.message));
          });
        };
        let middleware = client.clientOptions.middleware;
        return vscode_1.languages.registerDocumentLinkProvider(options.documentSelector, {
          provideDocumentLinks: (document, token) => {
            return middleware.provideDocumentLinks ? middleware.provideDocumentLinks(document, token, provideDocumentLinks) : provideDocumentLinks(document, token);
          },
          resolveDocumentLink: options.resolveProvider ? (link, token) => {
            return middleware.resolveDocumentLink ? middleware.resolveDocumentLink(link, token, resolveDocumentLink) : resolveDocumentLink(link, token);
          } : void 0
        });
      }
    };
    var ConfigurationFeature = class {
      constructor(_client) {
        this._client = _client;
        this._listeners = /* @__PURE__ */ new Map();
      }
      get messages() {
        return vscode_languageserver_protocol_1.DidChangeConfigurationNotification.type;
      }
      fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, "workspace"), "didChangeConfiguration").dynamicRegistration = true;
      }
      initialize() {
        let section = this._client.clientOptions.synchronize.configurationSection;
        if (section !== void 0) {
          this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: {
              section
            }
          });
        }
      }
      register(_message, data) {
        let disposable = vscode_1.workspace.onDidChangeConfiguration(() => {
          this.onDidChangeConfiguration(data.registerOptions.section);
        });
        this._listeners.set(data.id, disposable);
        if (data.registerOptions.section !== void 0) {
          this.onDidChangeConfiguration(data.registerOptions.section);
        }
      }
      unregister(id) {
        let disposable = this._listeners.get(id);
        if (disposable) {
          this._listeners.delete(id);
          disposable.dispose();
        }
      }
      dispose() {
        for (let disposable of this._listeners.values()) {
          disposable.dispose();
        }
      }
      onDidChangeConfiguration(configurationSection) {
        let sections;
        if (Is.string(configurationSection)) {
          sections = [configurationSection];
        } else {
          sections = configurationSection;
        }
        let didChangeConfiguration = (sections2) => {
          if (sections2 === void 0) {
            this._client.sendNotification(vscode_languageserver_protocol_1.DidChangeConfigurationNotification.type, { settings: null });
            return;
          }
          this._client.sendNotification(vscode_languageserver_protocol_1.DidChangeConfigurationNotification.type, { settings: this.extractSettingsInformation(sections2) });
        };
        let middleware = this.getMiddleware();
        middleware ? middleware(sections, didChangeConfiguration) : didChangeConfiguration(sections);
      }
      extractSettingsInformation(keys) {
        function ensurePath(config, path2) {
          let current = config;
          for (let i = 0; i < path2.length - 1; i++) {
            let obj = current[path2[i]];
            if (!obj) {
              obj = /* @__PURE__ */ Object.create(null);
              current[path2[i]] = obj;
            }
            current = obj;
          }
          return current;
        }
        let resource = this._client.clientOptions.workspaceFolder ? this._client.clientOptions.workspaceFolder.uri : void 0;
        let result = /* @__PURE__ */ Object.create(null);
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          let index = key.indexOf(".");
          let config = null;
          if (index >= 0) {
            config = vscode_1.workspace.getConfiguration(key.substr(0, index), resource).get(key.substr(index + 1));
          } else {
            config = vscode_1.workspace.getConfiguration(key, resource);
          }
          if (config) {
            let path2 = keys[i].split(".");
            ensurePath(result, path2)[path2[path2.length - 1]] = config;
          }
        }
        return result;
      }
      getMiddleware() {
        let middleware = this._client.clientOptions.middleware;
        if (middleware.workspace && middleware.workspace.didChangeConfiguration) {
          return middleware.workspace.didChangeConfiguration;
        } else {
          return void 0;
        }
      }
    };
    var ExecuteCommandFeature = class {
      constructor(_client) {
        this._client = _client;
        this._commands = /* @__PURE__ */ new Map();
      }
      get messages() {
        return vscode_languageserver_protocol_1.ExecuteCommandRequest.type;
      }
      fillClientCapabilities(capabilities) {
        ensure(ensure(capabilities, "workspace"), "executeCommand").dynamicRegistration = true;
      }
      initialize(capabilities) {
        if (!capabilities.executeCommandProvider) {
          return;
        }
        this.register(this.messages, {
          id: UUID.generateUuid(),
          registerOptions: Object.assign({}, capabilities.executeCommandProvider)
        });
      }
      register(_message, data) {
        let client = this._client;
        if (data.registerOptions.commands) {
          let disposeables = [];
          for (const command of data.registerOptions.commands) {
            disposeables.push(vscode_1.commands.registerCommand(command, (...args) => {
              let params = {
                command,
                arguments: args
              };
              client.sendRequest(vscode_languageserver_protocol_1.ExecuteCommandRequest.type, params).then(void 0, (error) => {
                client.logFailedRequest(vscode_languageserver_protocol_1.ExecuteCommandRequest.type, error);
              });
            }));
          }
          this._commands.set(data.id, disposeables);
        }
      }
      unregister(id) {
        let disposeables = this._commands.get(id);
        if (disposeables) {
          disposeables.forEach((disposable) => disposable.dispose());
        }
      }
      dispose() {
        this._commands.forEach((value) => {
          value.forEach((disposable) => disposable.dispose());
        });
      }
    };
    var MessageTransports;
    (function(MessageTransports2) {
      function is(value) {
        let candidate = value;
        return candidate && vscode_languageserver_protocol_1.MessageReader.is(value.reader) && vscode_languageserver_protocol_1.MessageWriter.is(value.writer);
      }
      MessageTransports2.is = is;
    })(MessageTransports = exports2.MessageTransports || (exports2.MessageTransports = {}));
    var BaseLanguageClient = class {
      constructor(id, name, clientOptions) {
        this._features = [];
        this._method2Message = /* @__PURE__ */ new Map();
        this._dynamicFeatures = /* @__PURE__ */ new Map();
        this._id = id;
        this._name = name;
        clientOptions = clientOptions || {};
        this._clientOptions = {
          documentSelector: clientOptions.documentSelector || [],
          synchronize: clientOptions.synchronize || {},
          diagnosticCollectionName: clientOptions.diagnosticCollectionName,
          outputChannelName: clientOptions.outputChannelName || this._name,
          revealOutputChannelOn: clientOptions.revealOutputChannelOn || RevealOutputChannelOn.Error,
          stdioEncoding: clientOptions.stdioEncoding || "utf8",
          initializationOptions: clientOptions.initializationOptions,
          initializationFailedHandler: clientOptions.initializationFailedHandler,
          errorHandler: clientOptions.errorHandler || new DefaultErrorHandler(this._name),
          middleware: clientOptions.middleware || {},
          uriConverters: clientOptions.uriConverters,
          workspaceFolder: clientOptions.workspaceFolder
        };
        this._clientOptions.synchronize = this._clientOptions.synchronize || {};
        this.state = ClientState.Initial;
        this._connectionPromise = void 0;
        this._resolvedConnection = void 0;
        this._initializeResult = void 0;
        if (clientOptions.outputChannel) {
          this._outputChannel = clientOptions.outputChannel;
          this._disposeOutputChannel = false;
        } else {
          this._outputChannel = void 0;
          this._disposeOutputChannel = true;
        }
        this._listeners = void 0;
        this._providers = void 0;
        this._diagnostics = void 0;
        this._fileEvents = [];
        this._fileEventDelayer = new async_1.Delayer(250);
        this._onReady = new Promise((resolve, reject) => {
          this._onReadyCallbacks = { resolve, reject };
        });
        this._telemetryEmitter = new vscode_languageserver_protocol_1.Emitter();
        this._stateChangeEmitter = new vscode_languageserver_protocol_1.Emitter();
        this._tracer = {
          log: (message, data) => {
            this.logTrace(message, data);
          }
        };
        this._c2p = c2p.createConverter(clientOptions.uriConverters ? clientOptions.uriConverters.code2Protocol : void 0);
        this._p2c = p2c.createConverter(clientOptions.uriConverters ? clientOptions.uriConverters.protocol2Code : void 0);
        this.registerBuiltinFeatures();
      }
      get state() {
        return this._state;
      }
      set state(value) {
        let oldState = this.getPublicState();
        this._state = value;
        let newState = this.getPublicState();
        if (newState !== oldState) {
          this._stateChangeEmitter.fire({ oldState, newState });
        }
      }
      getPublicState() {
        if (this.state === ClientState.Running) {
          return State.Running;
        } else {
          return State.Stopped;
        }
      }
      get initializeResult() {
        return this._initializeResult;
      }
      sendRequest(type, ...params) {
        if (!this.isConnectionActive()) {
          throw new Error("Language client is not ready yet");
        }
        this.forceDocumentSync();
        try {
          return this._resolvedConnection.sendRequest(type, ...params);
        } catch (error) {
          this.error(`Sending request ${Is.string(type) ? type : type.method} failed.`, error);
          throw error;
        }
      }
      onRequest(type, handler) {
        if (!this.isConnectionActive()) {
          throw new Error("Language client is not ready yet");
        }
        try {
          this._resolvedConnection.onRequest(type, handler);
        } catch (error) {
          this.error(`Registering request handler ${Is.string(type) ? type : type.method} failed.`, error);
          throw error;
        }
      }
      sendNotification(type, params) {
        if (!this.isConnectionActive()) {
          throw new Error("Language client is not ready yet");
        }
        this.forceDocumentSync();
        try {
          this._resolvedConnection.sendNotification(type, params);
        } catch (error) {
          this.error(`Sending notification ${Is.string(type) ? type : type.method} failed.`, error);
          throw error;
        }
      }
      onNotification(type, handler) {
        if (!this.isConnectionActive()) {
          throw new Error("Language client is not ready yet");
        }
        try {
          this._resolvedConnection.onNotification(type, handler);
        } catch (error) {
          this.error(`Registering notification handler ${Is.string(type) ? type : type.method} failed.`, error);
          throw error;
        }
      }
      get clientOptions() {
        return this._clientOptions;
      }
      get protocol2CodeConverter() {
        return this._p2c;
      }
      get code2ProtocolConverter() {
        return this._c2p;
      }
      get onTelemetry() {
        return this._telemetryEmitter.event;
      }
      get onDidChangeState() {
        return this._stateChangeEmitter.event;
      }
      get outputChannel() {
        if (!this._outputChannel) {
          this._outputChannel = vscode_1.window.createOutputChannel(this._clientOptions.outputChannelName ? this._clientOptions.outputChannelName : this._name);
        }
        return this._outputChannel;
      }
      get diagnostics() {
        return this._diagnostics;
      }
      createDefaultErrorHandler() {
        return new DefaultErrorHandler(this._name);
      }
      set trace(value) {
        this._trace = value;
        this.onReady().then(() => {
          this.resolveConnection().then((connection) => {
            connection.trace(value, this._tracer);
          });
        }, () => {
        });
      }
      data2String(data) {
        if (data instanceof vscode_languageserver_protocol_1.ResponseError) {
          const responseError = data;
          return `  Message: ${responseError.message}
  Code: ${responseError.code} ${responseError.data ? "\n" + responseError.data.toString() : ""}`;
        }
        if (data instanceof Error) {
          if (Is.string(data.stack)) {
            return data.stack;
          }
          return data.message;
        }
        if (Is.string(data)) {
          return data;
        }
        return data.toString();
      }
      info(message, data) {
        this.outputChannel.appendLine(`[Info  - ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}] ${message}`);
        if (data) {
          this.outputChannel.appendLine(this.data2String(data));
        }
        if (this._clientOptions.revealOutputChannelOn <= RevealOutputChannelOn.Info) {
          this.outputChannel.show(true);
        }
      }
      warn(message, data) {
        this.outputChannel.appendLine(`[Warn  - ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}] ${message}`);
        if (data) {
          this.outputChannel.appendLine(this.data2String(data));
        }
        if (this._clientOptions.revealOutputChannelOn <= RevealOutputChannelOn.Warn) {
          this.outputChannel.show(true);
        }
      }
      error(message, data) {
        this.outputChannel.appendLine(`[Error - ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}] ${message}`);
        if (data) {
          this.outputChannel.appendLine(this.data2String(data));
        }
        if (this._clientOptions.revealOutputChannelOn <= RevealOutputChannelOn.Error) {
          this.outputChannel.show(true);
        }
      }
      logTrace(message, data) {
        this.outputChannel.appendLine(`[Trace - ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}] ${message}`);
        if (data) {
          this.outputChannel.appendLine(this.data2String(data));
        }
      }
      needsStart() {
        return this.state === ClientState.Initial || this.state === ClientState.Stopping || this.state === ClientState.Stopped;
      }
      needsStop() {
        return this.state === ClientState.Starting || this.state === ClientState.Running;
      }
      onReady() {
        return this._onReady;
      }
      isConnectionActive() {
        return this.state === ClientState.Running && !!this._resolvedConnection;
      }
      start() {
        this._listeners = [];
        this._providers = [];
        if (!this._diagnostics) {
          this._diagnostics = this._clientOptions.diagnosticCollectionName ? vscode_1.languages.createDiagnosticCollection(this._clientOptions.diagnosticCollectionName) : vscode_1.languages.createDiagnosticCollection();
        }
        this.state = ClientState.Starting;
        this.resolveConnection().then((connection) => {
          connection.onLogMessage((message) => {
            switch (message.type) {
              case vscode_languageserver_protocol_1.MessageType.Error:
                this.error(message.message);
                break;
              case vscode_languageserver_protocol_1.MessageType.Warning:
                this.warn(message.message);
                break;
              case vscode_languageserver_protocol_1.MessageType.Info:
                this.info(message.message);
                break;
              default:
                this.outputChannel.appendLine(message.message);
            }
          });
          connection.onShowMessage((message) => {
            switch (message.type) {
              case vscode_languageserver_protocol_1.MessageType.Error:
                vscode_1.window.showErrorMessage(message.message);
                break;
              case vscode_languageserver_protocol_1.MessageType.Warning:
                vscode_1.window.showWarningMessage(message.message);
                break;
              case vscode_languageserver_protocol_1.MessageType.Info:
                vscode_1.window.showInformationMessage(message.message);
                break;
              default:
                vscode_1.window.showInformationMessage(message.message);
            }
          });
          connection.onRequest(vscode_languageserver_protocol_1.ShowMessageRequest.type, (params) => {
            let messageFunc;
            switch (params.type) {
              case vscode_languageserver_protocol_1.MessageType.Error:
                messageFunc = vscode_1.window.showErrorMessage;
                break;
              case vscode_languageserver_protocol_1.MessageType.Warning:
                messageFunc = vscode_1.window.showWarningMessage;
                break;
              case vscode_languageserver_protocol_1.MessageType.Info:
                messageFunc = vscode_1.window.showInformationMessage;
                break;
              default:
                messageFunc = vscode_1.window.showInformationMessage;
            }
            let actions = params.actions || [];
            return messageFunc(params.message, ...actions);
          });
          connection.onTelemetry((data) => {
            this._telemetryEmitter.fire(data);
          });
          connection.listen();
          this.initialize(connection).then(void 0, () => {
          });
        }, (error) => {
          this.state = ClientState.StartFailed;
          this._onReadyCallbacks.reject(error);
          this.error("Starting client failed", error);
          vscode_1.window.showErrorMessage(`Couldn't start client ${this._name}`);
        });
        return new vscode_1.Disposable(() => {
          if (this.needsStop()) {
            this.stop();
          }
        });
      }
      resolveConnection() {
        if (!this._connectionPromise) {
          this._connectionPromise = this.createConnection();
        }
        return this._connectionPromise;
      }
      initialize(connection) {
        this.refreshTrace(connection, false);
        let initOption = this._clientOptions.initializationOptions;
        let rootPath = this._clientOptions.workspaceFolder ? this._clientOptions.workspaceFolder.uri.fsPath : vscode_1.workspace.rootPath;
        let initParams = {
          processId: process.pid,
          rootPath: rootPath ? rootPath : null,
          rootUri: rootPath ? this._c2p.asUri(vscode_1.Uri.file(rootPath)) : null,
          capabilities: this.computeClientCapabilities(),
          initializationOptions: Is.func(initOption) ? initOption() : initOption,
          trace: vscode_languageserver_protocol_1.Trace.toString(this._trace)
        };
        this.fillInitializeParams(initParams);
        return connection.initialize(initParams).then((result) => {
          this._resolvedConnection = connection;
          this._initializeResult = result;
          this.state = ClientState.Running;
          let textDocumentSyncOptions = void 0;
          if (Is.number(result.capabilities.textDocumentSync) && result.capabilities.textDocumentSync !== vscode_languageserver_protocol_1.TextDocumentSyncKind.None) {
            textDocumentSyncOptions = {
              openClose: true,
              change: result.capabilities.textDocumentSync,
              save: {
                includeText: false
              }
            };
          } else if (result.capabilities.textDocumentSync !== void 0 && result.capabilities.textDocumentSync !== null) {
            textDocumentSyncOptions = result.capabilities.textDocumentSync;
          }
          this._capabilities = Object.assign({}, result.capabilities, { resolvedTextDocumentSync: textDocumentSyncOptions });
          connection.onDiagnostics((params) => this.handleDiagnostics(params));
          connection.onRequest(vscode_languageserver_protocol_1.RegistrationRequest.type, (params) => this.handleRegistrationRequest(params));
          connection.onRequest("client/registerFeature", (params) => this.handleRegistrationRequest(params));
          connection.onRequest(vscode_languageserver_protocol_1.UnregistrationRequest.type, (params) => this.handleUnregistrationRequest(params));
          connection.onRequest("client/unregisterFeature", (params) => this.handleUnregistrationRequest(params));
          connection.onRequest(vscode_languageserver_protocol_1.ApplyWorkspaceEditRequest.type, (params) => this.handleApplyWorkspaceEdit(params));
          connection.sendNotification(vscode_languageserver_protocol_1.InitializedNotification.type, {});
          this.hookFileEvents(connection);
          this.hookConfigurationChanged(connection);
          this.initializeFeatures(connection);
          this._onReadyCallbacks.resolve();
          return result;
        }, (error) => {
          if (this._clientOptions.initializationFailedHandler) {
            if (this._clientOptions.initializationFailedHandler(error)) {
              this.initialize(connection);
            } else {
              this.stop();
              this._onReadyCallbacks.reject(error);
            }
          } else if (error instanceof vscode_languageserver_protocol_1.ResponseError && error.data && error.data.retry) {
            vscode_1.window.showErrorMessage(error.message, { title: "Retry", id: "retry" }).then((item) => {
              if (item && item.id === "retry") {
                this.initialize(connection);
              } else {
                this.stop();
                this._onReadyCallbacks.reject(error);
              }
            });
          } else {
            if (error && error.message) {
              vscode_1.window.showErrorMessage(error.message);
            }
            this.error("Server initialization failed.", error);
            this.stop();
            this._onReadyCallbacks.reject(error);
          }
        });
      }
      stop() {
        this._initializeResult = void 0;
        if (!this._connectionPromise) {
          this.state = ClientState.Stopped;
          return Promise.resolve();
        }
        this.state = ClientState.Stopping;
        this.cleanUp();
        return this.resolveConnection().then((connection) => {
          return connection.shutdown().then(() => {
            connection.exit();
            connection.dispose();
            this.state = ClientState.Stopped;
            this._connectionPromise = void 0;
            this._resolvedConnection = void 0;
            if (this._outputChannel) {
              this._outputChannel.clear();
            }
          });
        });
      }
      cleanUp(restart = false) {
        if (this._listeners) {
          this._listeners.forEach((listener) => listener.dispose());
          this._listeners = void 0;
        }
        if (this._providers) {
          this._providers.forEach((provider) => provider.dispose());
          this._providers = void 0;
        }
        for (let handler of this._dynamicFeatures.values()) {
          handler.dispose();
        }
        if (this._outputChannel && this._disposeOutputChannel) {
          this._outputChannel.dispose();
        }
        if (!restart && this._diagnostics) {
          this._diagnostics.dispose();
          this._diagnostics = void 0;
        }
      }
      notifyFileEvent(event) {
        this._fileEvents.push(event);
        this._fileEventDelayer.trigger(() => {
          this.onReady().then(() => {
            this.resolveConnection().then((connection) => {
              if (this.isConnectionActive()) {
                connection.didChangeWatchedFiles({ changes: this._fileEvents });
              }
              this._fileEvents = [];
            });
          }, (error) => {
            this.error(`Notify file events failed.`, error);
          });
        });
      }
      forceDocumentSync() {
        this._dynamicFeatures.get(vscode_languageserver_protocol_1.DidChangeTextDocumentNotification.type.method).forceDelivery();
      }
      handleDiagnostics(params) {
        if (!this._diagnostics) {
          return;
        }
        let uri = this._p2c.asUri(params.uri);
        let diagnostics = this._p2c.asDiagnostics(params.diagnostics);
        this._diagnostics.set(uri, diagnostics);
      }
      createConnection() {
        let errorHandler = (error, message, count) => {
          this.handleConnectionError(error, message, count);
        };
        let closeHandler = () => {
          this.handleConnectionClosed();
        };
        return this.createMessageTransports(this._clientOptions.stdioEncoding || "utf8").then((transports) => {
          return createConnection(transports.reader, transports.writer, errorHandler, closeHandler);
        });
      }
      handleConnectionClosed() {
        if (this.state === ClientState.Stopping || this.state === ClientState.Stopped) {
          return;
        }
        if (this._resolvedConnection) {
          this._resolvedConnection.dispose();
        }
        this._connectionPromise = void 0;
        this._resolvedConnection = void 0;
        let action = this._clientOptions.errorHandler.closed();
        if (action === CloseAction.DoNotRestart) {
          this.error("Connection to server got closed. Server will not be restarted.");
          this.state = ClientState.Stopped;
          this.cleanUp(false);
        } else if (action === CloseAction.Restart) {
          this.info("Connection to server got closed. Server will restart.");
          this.cleanUp(true);
          this.state = ClientState.Initial;
          this.start();
        }
      }
      handleConnectionError(error, message, count) {
        let action = this._clientOptions.errorHandler.error(error, message, count);
        if (action === ErrorAction.Shutdown) {
          this.error("Connection to server is erroring. Shutting down server.");
          this.stop();
        }
      }
      hookConfigurationChanged(connection) {
        vscode_1.workspace.onDidChangeConfiguration(() => {
          this.refreshTrace(connection, true);
        });
      }
      refreshTrace(connection, sendNotification = false) {
        let config = vscode_1.workspace.getConfiguration(this._id);
        let trace = vscode_languageserver_protocol_1.Trace.Off;
        if (config) {
          trace = vscode_languageserver_protocol_1.Trace.fromString(config.get("trace.server", "off"));
        }
        this._trace = trace;
        connection.trace(this._trace, this._tracer, sendNotification);
      }
      hookFileEvents(_connection) {
        let fileEvents = this._clientOptions.synchronize.fileEvents;
        if (!fileEvents) {
          return;
        }
        let watchers;
        if (Is.array(fileEvents)) {
          watchers = fileEvents;
        } else {
          watchers = [fileEvents];
        }
        if (!watchers) {
          return;
        }
        this._dynamicFeatures.get(vscode_languageserver_protocol_1.DidChangeWatchedFilesNotification.type.method).registerRaw(UUID.generateUuid(), watchers);
      }
      registerFeatures(features) {
        for (let feature of features) {
          this.registerFeature(feature);
        }
      }
      registerFeature(feature) {
        this._features.push(feature);
        if (DynamicFeature.is(feature)) {
          let messages = feature.messages;
          if (Array.isArray(messages)) {
            for (let message of messages) {
              this._method2Message.set(message.method, message);
              this._dynamicFeatures.set(message.method, feature);
            }
          } else {
            this._method2Message.set(messages.method, messages);
            this._dynamicFeatures.set(messages.method, feature);
          }
        }
      }
      registerBuiltinFeatures() {
        const syncedDocuments = /* @__PURE__ */ new Map();
        this.registerFeature(new ConfigurationFeature(this));
        this.registerFeature(new DidOpenTextDocumentFeature(this, syncedDocuments));
        this.registerFeature(new DidChangeTextDocumentFeature(this));
        this.registerFeature(new WillSaveFeature(this));
        this.registerFeature(new WillSaveWaitUntilFeature(this));
        this.registerFeature(new DidSaveTextDocumentFeature(this));
        this.registerFeature(new DidCloseTextDocumentFeature(this, syncedDocuments));
        this.registerFeature(new FileSystemWatcherFeature(this, (event) => this.notifyFileEvent(event)));
        this.registerFeature(new CompletionItemFeature(this));
        this.registerFeature(new HoverFeature(this));
        this.registerFeature(new SignatureHelpFeature(this));
        this.registerFeature(new DefinitionFeature(this));
        this.registerFeature(new ReferencesFeature(this));
        this.registerFeature(new DocumentHighlightFeature(this));
        this.registerFeature(new DocumentSymbolFeature(this));
        this.registerFeature(new WorkspaceSymbolFeature(this));
        this.registerFeature(new CodeActionFeature(this));
        this.registerFeature(new CodeLensFeature(this));
        this.registerFeature(new DocumentFormattingFeature(this));
        this.registerFeature(new DocumentRangeFormattingFeature(this));
        this.registerFeature(new DocumentOnTypeFormattingFeature(this));
        this.registerFeature(new RenameFeature(this));
        this.registerFeature(new DocumentLinkFeature(this));
        this.registerFeature(new ExecuteCommandFeature(this));
      }
      fillInitializeParams(params) {
        for (let feature of this._features) {
          if (Is.func(feature.fillInitializeParams)) {
            feature.fillInitializeParams(params);
          }
        }
      }
      computeClientCapabilities() {
        let result = {};
        ensure(result, "workspace").applyEdit = true;
        for (let feature of this._features) {
          feature.fillClientCapabilities(result);
        }
        return result;
      }
      initializeFeatures(_connection) {
        let documentSelector = this._clientOptions.documentSelector;
        for (let feature of this._features) {
          feature.initialize(this._capabilities, documentSelector);
        }
      }
      handleRegistrationRequest(params) {
        return new Promise((resolve, reject) => {
          for (let registration of params.registrations) {
            const feature = this._dynamicFeatures.get(registration.method);
            if (!feature) {
              reject(new Error(`No feature implementation for ${registration.method} found. Registration failed.`));
              return;
            }
            const options = registration.registerOptions || {};
            options.documentSelector = options.documentSelector || this._clientOptions.documentSelector;
            const data = {
              id: registration.id,
              registerOptions: options
            };
            feature.register(this._method2Message.get(registration.method), data);
          }
          resolve();
        });
      }
      handleUnregistrationRequest(params) {
        return new Promise((resolve, reject) => {
          for (let unregistration of params.unregisterations) {
            const feature = this._dynamicFeatures.get(unregistration.method);
            if (!feature) {
              reject(new Error(`No feature implementation for ${unregistration.method} found. Unregistration failed.`));
              return;
            }
            feature.unregister(unregistration.id);
          }
          ;
          resolve();
        });
      }
      handleApplyWorkspaceEdit(params) {
        let workspaceEdit = params.edit;
        let openTextDocuments = /* @__PURE__ */ new Map();
        vscode_1.workspace.textDocuments.forEach((document) => openTextDocuments.set(document.uri.toString(), document));
        let versionMismatch = false;
        if (workspaceEdit.documentChanges) {
          for (const change of workspaceEdit.documentChanges) {
            if (change.textDocument.version && change.textDocument.version >= 0) {
              let textDocument = openTextDocuments.get(change.textDocument.uri);
              if (textDocument && textDocument.version !== change.textDocument.version) {
                versionMismatch = true;
                break;
              }
            }
          }
        }
        if (versionMismatch) {
          return Promise.resolve({ applied: false });
        }
        return vscode_1.workspace.applyEdit(this._p2c.asWorkspaceEdit(params.edit)).then((value) => {
          return { applied: value };
        });
      }
      logFailedRequest(type, error) {
        if (error instanceof vscode_languageserver_protocol_1.ResponseError && error.code === vscode_languageserver_protocol_1.ErrorCodes.RequestCancelled) {
          return;
        }
        this.error(`Request ${type.method} failed.`, error);
      }
    };
    exports2.BaseLanguageClient = BaseLanguageClient;
  }
});

// node_modules/vscode-languageclient/lib/utils/electron.js
var require_electron = __commonJS({
  "node_modules/vscode-languageclient/lib/utils/electron.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path2 = require("path");
    var os = require("os");
    var net = require("net");
    var cp = require("child_process");
    function makeRandomHexString(length) {
      let chars = ["0", "1", "2", "3", "4", "5", "6", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
      let result = "";
      for (let i = 0; i < length; i++) {
        let idx = Math.floor(chars.length * Math.random());
        result += chars[idx];
      }
      return result;
    }
    function generatePipeName() {
      var randomName = "vscode-" + makeRandomHexString(40);
      if (process.platform === "win32") {
        return "\\\\.\\pipe\\" + randomName + "-sock";
      }
      return path2.join(os.tmpdir(), randomName + ".sock");
    }
    function generatePatchedEnv(env, stdInPipeName, stdOutPipeName) {
      var newEnv = {};
      for (var key in env) {
        newEnv[key] = env[key];
      }
      newEnv["STDIN_PIPE_NAME"] = stdInPipeName;
      newEnv["STDOUT_PIPE_NAME"] = stdOutPipeName;
      newEnv["ATOM_SHELL_INTERNAL_RUN_AS_NODE"] = "1";
      newEnv["ELECTRON_RUN_AS_NODE"] = "1";
      return newEnv;
    }
    function fork(modulePath, args, options, callback) {
      var callbackCalled = false;
      var resolve = (result) => {
        if (callbackCalled) {
          return;
        }
        callbackCalled = true;
        callback(void 0, result);
      };
      var reject = (err) => {
        if (callbackCalled) {
          return;
        }
        callbackCalled = true;
        callback(err, void 0);
      };
      var stdInPipeName = generatePipeName();
      var stdOutPipeName = generatePipeName();
      var newEnv = generatePatchedEnv(options.env || process.env, stdInPipeName, stdOutPipeName);
      var childProcess;
      var server = net.createServer((stream) => {
        stream.once("data", (_chunk) => {
          childProcess.stdin = net.connect(stdInPipeName);
          childProcess.stdout = stream;
          resolve(childProcess);
        });
      });
      server.listen(stdOutPipeName);
      var serverClosed = false;
      var closeServer = () => {
        if (serverClosed) {
          return;
        }
        serverClosed = true;
        server.close();
      };
      let bootstrapperPath = path2.join(__dirname, "electronForkStart");
      childProcess = cp.fork(bootstrapperPath, [modulePath].concat(args), {
        silent: true,
        cwd: options.cwd,
        env: newEnv,
        execArgv: options.execArgv
      });
      childProcess.once("error", (err) => {
        closeServer();
        reject(err);
      });
      childProcess.once("exit", (err) => {
        closeServer();
        reject(err);
      });
    }
    exports2.fork = fork;
  }
});

// node_modules/vscode-languageclient/lib/utils/processes.js
var require_processes = __commonJS({
  "node_modules/vscode-languageclient/lib/utils/processes.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var cp = require("child_process");
    var path_1 = require("path");
    var isWindows = process.platform === "win32";
    var isMacintosh = process.platform === "darwin";
    var isLinux = process.platform === "linux";
    function terminate(process2, cwd) {
      if (isWindows) {
        try {
          let options = {
            stdio: ["pipe", "pipe", "ignore"]
          };
          if (cwd) {
            options.cwd = cwd;
          }
          cp.execFileSync("taskkill", ["/T", "/F", "/PID", process2.pid.toString()], options);
          return true;
        } catch (err) {
          return false;
        }
      } else if (isLinux || isMacintosh) {
        try {
          var cmd = path_1.join(__dirname, "terminateProcess.sh");
          var result = cp.spawnSync(cmd, [process2.pid.toString()]);
          return result.error ? false : true;
        } catch (err) {
          return false;
        }
      } else {
        process2.kill("SIGKILL");
        return true;
      }
    }
    exports2.terminate = terminate;
  }
});

// node_modules/vscode-languageclient/lib/configuration.proposed.js
var require_configuration_proposed = __commonJS({
  "node_modules/vscode-languageclient/lib/configuration.proposed.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var vscode_1 = require("vscode");
    var vscode_languageserver_protocol_1 = require_main3();
    var ConfigurationFeature = class {
      constructor(_client) {
        this._client = _client;
      }
      fillClientCapabilities(capabilities) {
        capabilities.workspace = capabilities.workspace || {};
        let configCapabilities = capabilities;
        configCapabilities.workspace.configuration = true;
      }
      initialize() {
        let client = this._client;
        client.onRequest(vscode_languageserver_protocol_1.Proposed.ConfigurationRequest.type, (params, token) => {
          let configuration = (params2) => {
            let result = [];
            for (let item of params2.items) {
              let resource = item.scopeUri !== void 0 && item.scopeUri !== null ? this._client.protocol2CodeConverter.asUri(item.scopeUri) : void 0;
              result.push(this.getConfiguration(resource, item.section !== null ? item.section : void 0));
            }
            return result;
          };
          let middleware = this.getConfigurationMiddleware();
          return middleware.configuration ? middleware.configuration(params, token, configuration) : configuration(params, token);
        });
      }
      getConfiguration(resource, section) {
        let result = null;
        if (section) {
          let index = section.lastIndexOf(".");
          if (index === -1) {
            result = vscode_1.workspace.getConfiguration(void 0, resource).get(section);
          } else {
            let config = vscode_1.workspace.getConfiguration(section.substr(0, index));
            if (config) {
              result = config.get(section.substr(index + 1));
            }
          }
        } else {
          let config = vscode_1.workspace.getConfiguration(void 0, resource);
          result = {};
          for (let key of Object.keys(config)) {
            if (config.has(key)) {
              result[key] = config.get(key);
            }
          }
        }
        if (!result) {
          return null;
        }
        return result;
      }
      getConfigurationMiddleware() {
        let middleware = this._client.clientOptions.middleware;
        return middleware && middleware.workspace ? middleware.workspace : {};
      }
    };
    exports2.ConfigurationFeature = ConfigurationFeature;
  }
});

// node_modules/vscode-languageclient/lib/workspaceFolders.proposed.js
var require_workspaceFolders_proposed = __commonJS({
  "node_modules/vscode-languageclient/lib/workspaceFolders.proposed.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var vscode_1 = require("vscode");
    var vscode_languageserver_protocol_1 = require_main3();
    var WorkspaceFoldersFeature = class {
      constructor(_client) {
        this._client = _client;
        this._listeners = /* @__PURE__ */ new Map();
      }
      get messages() {
        return vscode_languageserver_protocol_1.Proposed.DidChangeWorkspaceFoldersNotification.type;
      }
      fillInitializeParams(params) {
        let proposedParams = params;
        let folders = vscode_1.workspace.workspaceFolders;
        if (folders === void 0) {
          proposedParams.workspaceFolders = null;
        } else {
          proposedParams.workspaceFolders = folders.map((folder) => this.asProtocol(folder));
        }
      }
      fillClientCapabilities(capabilities) {
        capabilities.workspace = capabilities.workspace || {};
        let workspaceCapabilities = capabilities;
        workspaceCapabilities.workspace.workspaceFolders = true;
      }
      initialize() {
        let client = this._client;
        client.onRequest(vscode_languageserver_protocol_1.Proposed.WorkspaceFoldersRequest.type, (token) => {
          let workspaceFolders = () => {
            let folders = vscode_1.workspace.workspaceFolders;
            if (folders === void 0) {
              return null;
            }
            let result = folders.map((folder) => {
              return this.asProtocol(folder);
            });
            return result;
          };
          let middleware = this.getWorkspaceFolderMiddleware();
          return middleware.workspaceFolders ? middleware.workspaceFolders(token, workspaceFolders) : workspaceFolders(token);
        });
      }
      register(_message, data) {
        let id = data.id;
        let disposable = vscode_1.workspace.onDidChangeWorkspaceFolders((event) => {
          let didChangeWorkspaceFolders = (event2) => {
            let params = {
              event: {
                added: event2.added.map((folder) => this.asProtocol(folder)),
                removed: event2.removed.map((folder) => this.asProtocol(folder))
              }
            };
            this._client.sendNotification(vscode_languageserver_protocol_1.Proposed.DidChangeWorkspaceFoldersNotification.type, params);
          };
          let middleware = this.getWorkspaceFolderMiddleware();
          middleware.didChangeWorkspaceFolders ? middleware.didChangeWorkspaceFolders(event, didChangeWorkspaceFolders) : didChangeWorkspaceFolders(event);
        });
        this._listeners.set(id, disposable);
      }
      unregister(id) {
        let disposable = this._listeners.get(id);
        if (disposable === void 0) {
          return;
        }
        this._listeners.delete(id);
        disposable.dispose();
      }
      dispose() {
        for (let disposable of this._listeners.values()) {
          disposable.dispose();
        }
        this._listeners.clear();
      }
      asProtocol(workspaceFolder) {
        if (workspaceFolder === void 0) {
          return null;
        }
        return { uri: this._client.code2ProtocolConverter.asUri(workspaceFolder.uri), name: workspaceFolder.name };
      }
      getWorkspaceFolderMiddleware() {
        let middleware = this._client.clientOptions.middleware;
        return middleware && middleware.workspace ? middleware.workspace : {};
      }
    };
    exports2.WorkspaceFoldersFeature = WorkspaceFoldersFeature;
  }
});

// node_modules/vscode-languageclient/lib/main.js
var require_main4 = __commonJS({
  "node_modules/vscode-languageclient/lib/main.js"(exports2) {
    "use strict";
    function __export2(m) {
      for (var p in m) if (!exports2.hasOwnProperty(p)) exports2[p] = m[p];
    }
    Object.defineProperty(exports2, "__esModule", { value: true });
    var cp = require("child_process");
    var client_1 = require_client();
    var vscode_1 = require("vscode");
    var vscode_languageserver_protocol_1 = require_main3();
    var Is = require_is3();
    var electron = require_electron();
    var processes_1 = require_processes();
    __export2(require_client());
    var TransportKind2;
    (function(TransportKind3) {
      TransportKind3[TransportKind3["stdio"] = 0] = "stdio";
      TransportKind3[TransportKind3["ipc"] = 1] = "ipc";
      TransportKind3[TransportKind3["pipe"] = 2] = "pipe";
      TransportKind3[TransportKind3["socket"] = 3] = "socket";
    })(TransportKind2 = exports2.TransportKind || (exports2.TransportKind = {}));
    var Transport;
    (function(Transport2) {
      function isSocket(value) {
        let candidate = value;
        return candidate && candidate.kind === TransportKind2.socket && Is.number(candidate.port);
      }
      Transport2.isSocket = isSocket;
    })(Transport || (Transport = {}));
    var StreamInfo;
    (function(StreamInfo2) {
      function is(value) {
        let candidate = value;
        return candidate && candidate.writer !== void 0 && candidate.reader !== void 0;
      }
      StreamInfo2.is = is;
    })(StreamInfo || (StreamInfo = {}));
    var ChildProcessInfo;
    (function(ChildProcessInfo2) {
      function is(value) {
        let candidate = value;
        return candidate && candidate.process !== void 0 && typeof candidate.detached === "boolean";
      }
      ChildProcessInfo2.is = is;
    })(ChildProcessInfo || (ChildProcessInfo = {}));
    var LanguageClient2 = class extends client_1.BaseLanguageClient {
      constructor(arg1, arg2, arg3, arg4, arg5) {
        let id;
        let name;
        let serverOptions;
        let clientOptions;
        let forceDebug;
        if (Is.string(arg2)) {
          id = arg1;
          name = arg2;
          serverOptions = arg3;
          clientOptions = arg4;
          forceDebug = !!arg5;
        } else {
          id = arg1.toLowerCase();
          name = arg1;
          serverOptions = arg2;
          clientOptions = arg3;
          forceDebug = arg4;
        }
        if (forceDebug === void 0) {
          forceDebug = false;
        }
        super(id, name, clientOptions);
        this._serverOptions = serverOptions;
        this._forceDebug = forceDebug;
      }
      stop() {
        return super.stop().then(() => {
          if (this._serverProcess) {
            let toCheck = this._serverProcess;
            this._serverProcess = void 0;
            if (this._isDetached === void 0 || !this._isDetached) {
              this.checkProcessDied(toCheck);
            }
            this._isDetached = void 0;
          }
        });
      }
      checkProcessDied(childProcess) {
        if (!childProcess) {
          return;
        }
        setTimeout(() => {
          try {
            process.kill(childProcess.pid, 0);
            processes_1.terminate(childProcess);
          } catch (error) {
          }
        }, 2e3);
      }
      handleConnectionClosed() {
        this._serverProcess = void 0;
        super.handleConnectionClosed();
      }
      createMessageTransports(encoding) {
        let rootPath = this.clientOptions.workspaceFolder ? this.clientOptions.workspaceFolder.uri.fsPath : vscode_1.workspace.rootPath;
        function getEnvironment(env) {
          if (!env) {
            return process.env;
          }
          let result = /* @__PURE__ */ Object.create(null);
          Object.keys(process.env).forEach((key) => result[key] = process.env[key]);
          Object.keys(env).forEach((key) => result[key] = env[key]);
          return result;
        }
        function startedInDebugMode() {
          let args = process.execArgv;
          if (args) {
            return args.some((arg) => /^--debug=?/.test(arg) || /^--debug-brk=?/.test(arg) || /^--inspect=?/.test(arg) || /^--inspect-brk=?/.test(arg));
          }
          ;
          return false;
        }
        let server = this._serverOptions;
        if (Is.func(server)) {
          return server().then((result) => {
            if (client_1.MessageTransports.is(result)) {
              this._isDetached = !!result.detached;
              return result;
            } else if (StreamInfo.is(result)) {
              this._isDetached = !!result.detached;
              return { reader: new vscode_languageserver_protocol_1.StreamMessageReader(result.reader), writer: new vscode_languageserver_protocol_1.StreamMessageWriter(result.writer) };
            } else {
              let cp2;
              if (ChildProcessInfo.is(result)) {
                cp2 = result.process;
                this._isDetached = result.detached;
              } else {
                cp2 = result;
                this._isDetached = false;
              }
              cp2.stderr.on("data", (data) => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
              return { reader: new vscode_languageserver_protocol_1.StreamMessageReader(cp2.stdout), writer: new vscode_languageserver_protocol_1.StreamMessageWriter(cp2.stdin) };
            }
          });
        }
        let json;
        let runDebug = server;
        if (runDebug.run || runDebug.debug) {
          if (typeof v8debug === "object" || this._forceDebug || startedInDebugMode()) {
            json = runDebug.debug;
          } else {
            json = runDebug.run;
          }
        } else {
          json = server;
        }
        if (json.module) {
          let node = json;
          let transport = node.transport || TransportKind2.stdio;
          if (node.runtime) {
            let args = [];
            let options = node.options || /* @__PURE__ */ Object.create(null);
            if (options.execArgv) {
              options.execArgv.forEach((element) => args.push(element));
            }
            args.push(node.module);
            if (node.args) {
              node.args.forEach((element) => args.push(element));
            }
            let execOptions = /* @__PURE__ */ Object.create(null);
            execOptions.cwd = options.cwd || rootPath;
            execOptions.env = getEnvironment(options.env);
            let pipeName = void 0;
            if (transport === TransportKind2.ipc) {
              execOptions.stdio = [null, null, null, "ipc"];
              args.push("--node-ipc");
            } else if (transport === TransportKind2.stdio) {
              args.push("--stdio");
            } else if (transport === TransportKind2.pipe) {
              pipeName = vscode_languageserver_protocol_1.generateRandomPipeName();
              args.push(`--pipe=${pipeName}`);
            } else if (Transport.isSocket(transport)) {
              args.push(`--socket=${transport.port}`);
            }
            args.push(`--clientProcessId=${process.pid.toString()}`);
            if (transport === TransportKind2.ipc || transport === TransportKind2.stdio) {
              let serverProcess = cp.spawn(node.runtime, args, execOptions);
              if (!serverProcess || !serverProcess.pid) {
                return Promise.reject(`Launching server using runtime ${node.runtime} failed.`);
              }
              this._serverProcess = serverProcess;
              serverProcess.stderr.on("data", (data) => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
              if (transport === TransportKind2.ipc) {
                serverProcess.stdout.on("data", (data) => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                return Promise.resolve({ reader: new vscode_languageserver_protocol_1.IPCMessageReader(serverProcess), writer: new vscode_languageserver_protocol_1.IPCMessageWriter(serverProcess) });
              } else {
                return Promise.resolve({ reader: new vscode_languageserver_protocol_1.StreamMessageReader(serverProcess.stdout), writer: new vscode_languageserver_protocol_1.StreamMessageWriter(serverProcess.stdin) });
              }
            } else if (transport == TransportKind2.pipe) {
              return vscode_languageserver_protocol_1.createClientPipeTransport(pipeName).then((transport2) => {
                let process2 = cp.spawn(node.runtime, args, execOptions);
                if (!process2 || !process2.pid) {
                  return Promise.reject(`Launching server using runtime ${node.runtime} failed.`);
                }
                this._serverProcess = process2;
                process2.stderr.on("data", (data) => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                process2.stdout.on("data", (data) => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                return transport2.onConnected().then((protocol) => {
                  return { reader: protocol[0], writer: protocol[1] };
                });
              });
            } else if (Transport.isSocket(transport)) {
              return vscode_languageserver_protocol_1.createClientSocketTransport(transport.port).then((transport2) => {
                let process2 = cp.spawn(node.runtime, args, execOptions);
                if (!process2 || !process2.pid) {
                  return Promise.reject(`Launching server using runtime ${node.runtime} failed.`);
                }
                this._serverProcess = process2;
                process2.stderr.on("data", (data) => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                process2.stdout.on("data", (data) => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                return transport2.onConnected().then((protocol) => {
                  return { reader: protocol[0], writer: protocol[1] };
                });
              });
            }
          } else {
            let pipeName = void 0;
            return new Promise((resolve, reject) => {
              let args = node.args && node.args.slice() || [];
              if (transport === TransportKind2.ipc) {
                args.push("--node-ipc");
              } else if (transport === TransportKind2.stdio) {
                args.push("--stdio");
              } else if (transport === TransportKind2.pipe) {
                pipeName = vscode_languageserver_protocol_1.generateRandomPipeName();
                args.push(`--pipe=${pipeName}`);
              } else if (Transport.isSocket(transport)) {
                args.push(`--socket=${transport.port}`);
              }
              args.push(`--clientProcessId=${process.pid.toString()}`);
              let options = node.options || /* @__PURE__ */ Object.create(null);
              options.execArgv = options.execArgv || [];
              options.cwd = options.cwd || rootPath;
              if (transport === TransportKind2.ipc || transport === TransportKind2.stdio) {
                electron.fork(node.module, args || [], options, (error, serverProcess) => {
                  if (error || !serverProcess) {
                    reject(error);
                  } else {
                    this._serverProcess = serverProcess;
                    serverProcess.stderr.on("data", (data) => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                    if (transport === TransportKind2.ipc) {
                      serverProcess.stdout.on("data", (data) => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                      resolve({ reader: new vscode_languageserver_protocol_1.IPCMessageReader(this._serverProcess), writer: new vscode_languageserver_protocol_1.IPCMessageWriter(this._serverProcess) });
                    } else {
                      resolve({ reader: new vscode_languageserver_protocol_1.StreamMessageReader(serverProcess.stdout), writer: new vscode_languageserver_protocol_1.StreamMessageWriter(serverProcess.stdin) });
                    }
                  }
                });
              } else if (transport === TransportKind2.pipe) {
                vscode_languageserver_protocol_1.createClientPipeTransport(pipeName).then((transport2) => {
                  electron.fork(node.module, args || [], options, (error, cp2) => {
                    if (error || !cp2) {
                      reject(error);
                    } else {
                      this._serverProcess = cp2;
                      cp2.stderr.on("data", (data) => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                      cp2.stdout.on("data", (data) => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                      transport2.onConnected().then((protocol) => {
                        resolve({ reader: protocol[0], writer: protocol[1] });
                      });
                    }
                  });
                });
              } else if (Transport.isSocket(transport)) {
                vscode_languageserver_protocol_1.createClientSocketTransport(transport.port).then((transport2) => {
                  electron.fork(node.module, args || [], options, (error, cp2) => {
                    if (error || !cp2) {
                      reject(error);
                    } else {
                      this._serverProcess = cp2;
                      cp2.stderr.on("data", (data) => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                      cp2.stdout.on("data", (data) => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
                      transport2.onConnected().then((protocol) => {
                        resolve({ reader: protocol[0], writer: protocol[1] });
                      });
                    }
                  });
                });
              }
            });
          }
        } else if (json.command) {
          let command = json;
          let args = command.args || [];
          let options = command.options || {};
          options.cwd = options.cwd || rootPath;
          let serverProcess = cp.spawn(command.command, args, options);
          if (!serverProcess || !serverProcess.pid) {
            return Promise.reject(`Launching server using command ${command.command} failed.`);
          }
          serverProcess.stderr.on("data", (data) => this.outputChannel.append(Is.string(data) ? data : data.toString(encoding)));
          this._serverProcess = serverProcess;
          this._isDetached = !!options.detached;
          return Promise.resolve({ reader: new vscode_languageserver_protocol_1.StreamMessageReader(serverProcess.stdout), writer: new vscode_languageserver_protocol_1.StreamMessageWriter(serverProcess.stdin) });
        }
        return Promise.reject(new Error(`Unsupported server configuration ` + JSON.stringify(server, null, 4)));
      }
      registerProposedFeatures() {
        this.registerFeatures(ProposedFeatures.createAll(this));
      }
    };
    exports2.LanguageClient = LanguageClient2;
    var SettingMonitor = class {
      constructor(_client, _setting) {
        this._client = _client;
        this._setting = _setting;
        this._listeners = [];
      }
      start() {
        vscode_1.workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, this._listeners);
        this.onDidChangeConfiguration();
        return new vscode_1.Disposable(() => {
          if (this._client.needsStop()) {
            this._client.stop();
          }
        });
      }
      onDidChangeConfiguration() {
        let index = this._setting.indexOf(".");
        let primary = index >= 0 ? this._setting.substr(0, index) : this._setting;
        let rest = index >= 0 ? this._setting.substr(index + 1) : void 0;
        let enabled = rest ? vscode_1.workspace.getConfiguration(primary).get(rest, false) : vscode_1.workspace.getConfiguration(primary);
        if (enabled && this._client.needsStart()) {
          this._client.start();
        } else if (!enabled && this._client.needsStop()) {
          this._client.stop();
        }
      }
    };
    exports2.SettingMonitor = SettingMonitor;
    var config = require_configuration_proposed();
    var folders = require_workspaceFolders_proposed();
    var ProposedFeatures;
    (function(ProposedFeatures2) {
      ProposedFeatures2.ConfigurationFeature = config.ConfigurationFeature;
      ProposedFeatures2.WorkspaceFoldersFeature = folders.WorkspaceFoldersFeature;
      function createAll(client) {
        let result = [];
        result.push(new ProposedFeatures2.WorkspaceFoldersFeature(client));
        result.push(new ProposedFeatures2.ConfigurationFeature(client));
        return result;
      }
      ProposedFeatures2.createAll = createAll;
    })(ProposedFeatures = exports2.ProposedFeatures || (exports2.ProposedFeatures = {}));
  }
});

// htmlhint/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate
});
module.exports = __toCommonJS(extension_exports);
var path = __toESM(require("path"));
var import_vscode = require("vscode");
var import_vscode_languageclient = __toESM(require_main4());
function activate(context) {
  let serverModulePath = path.join(__dirname, "..", "server", "server.js");
  let debugOptions = {
    execArgv: ["--nolazy", "--inspect=6010"],
    cwd: process.cwd()
  };
  let serverOptions = {
    run: { module: serverModulePath, transport: import_vscode_languageclient.TransportKind.ipc },
    debug: {
      module: serverModulePath,
      transport: import_vscode_languageclient.TransportKind.ipc,
      options: debugOptions
    }
  };
  let config = import_vscode.workspace.getConfiguration("htmlhint");
  let languages = config.get("documentSelector");
  let documentSelector = languages.map((language) => ({
    language,
    scheme: "file"
  }));
  let clientOptions = {
    documentSelector,
    diagnosticCollectionName: "htmlhint",
    synchronize: {
      configurationSection: "htmlhint",
      fileEvents: import_vscode.workspace.createFileSystemWatcher("**/.htmlhintrc")
    }
  };
  let client = new import_vscode_languageclient.LanguageClient(
    "HTML-hint",
    serverOptions,
    clientOptions
  );
  let disposable = client.start();
  context.subscriptions.push(disposable);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate
});
//# sourceMappingURL=extension.js.map
