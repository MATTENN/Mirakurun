"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fatal = exports.error = exports.warn = exports.info = exports.debug = exports.event = exports.maxLogHistory = exports.logLevel = exports.LogLevel = void 0;
const events_1 = require("events");
const util = require("util");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["FATAL"] = -1] = "FATAL";
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
exports.logLevel = LogLevel.INFO;
exports.maxLogHistory = 1000;
let offsetStr;
let offsetMS = 0;
if (/ GMT\+\d{4} /.test(new Date().toString()) === true) {
    const date = new Date();
    offsetStr = date.toString().match(/ GMT(\+\d{4}) /)[1];
    offsetStr = offsetStr.slice(0, 3) + ":" + offsetStr.slice(3, 5);
    offsetMS = date.getTimezoneOffset() * 60 * 1000;
}
class LogEvent extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.logs = [];
    }
    emit(ev, level, log) {
        if (exports.logLevel < level) {
            return;
        }
        this.logs.push(log);
        if (this.logs.length > exports.maxLogHistory) {
            this.logs.shift();
        }
        switch (level) {
            case LogLevel.DEBUG:
                console.log(log);
                break;
            case LogLevel.INFO:
                console.info(log);
                break;
            case LogLevel.WARN:
                console.warn(log);
                break;
            case LogLevel.ERROR:
            case LogLevel.FATAL:
                console.error(log);
                break;
        }
        return super.emit(ev, log);
    }
    debug(...msgs) {
        this.emit("data", LogLevel.DEBUG, getLogString.call(null, "debug", arguments));
    }
    info(...msgs) {
        this.emit("data", LogLevel.INFO, getLogString.call(null, "info", arguments));
    }
    warn(...msgs) {
        this.emit("data", LogLevel.WARN, getLogString.call(null, "warn", arguments));
    }
    error(...msgs) {
        this.emit("data", LogLevel.ERROR, getLogString.call(null, "error", arguments));
    }
    fatal(...msgs) {
        this.emit("data", LogLevel.FATAL, getLogString.call(null, "fatal", arguments));
    }
    write(line) {
        this.emit("data", LogLevel.INFO, getLogString("info", [line.slice(0, -1)]));
    }
}
exports.event = new LogEvent();
function getLogString(lvstr, msgs) {
    let isoStr;
    if (offsetStr) {
        isoStr = new Date(Date.now() - offsetMS).toISOString();
        isoStr = isoStr.slice(0, -1) + offsetStr;
    }
    else {
        isoStr = new Date().toISOString();
    }
    return isoStr + " " + lvstr + ": " + util.format.apply(null, msgs);
}
const debug = (...msgs) => exports.event.debug(...msgs);
exports.debug = debug;
const info = (...msgs) => exports.event.info(...msgs);
exports.info = info;
const warn = (...msgs) => exports.event.warn(...msgs);
exports.warn = warn;
const error = (...msgs) => exports.event.error(...msgs);
exports.error = error;
const fatal = (...msgs) => exports.event.fatal(...msgs);
exports.fatal = fatal;
//# sourceMappingURL=log.js.map