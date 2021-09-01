const { LOG_LEVEL = 3 } = process.env

let logLevel = parseInt(LOG_LEVEL);
if (typeof logLevel !== 'number' || (logLevel > 5 || logLevel < 0)) {
    console.log('invalid value for LOG_LEVEL provided.. falling back to a LOG_LEVEL value of 3')
    logLevel = 3
}

module.exports = {
    trace: (...args) => logLevel <= 0 && console.log(`[TRACE] `, ...args),
    debug: (...args) => logLevel <= 1 && console.log(`[DEBUG] `, ...args),
    info: (...args) => logLevel <= 2 && console.log(`[INFO] `, ...args),
    warn: (...args) => logLevel <= 3 && console.log(`[WARN] `, ...args),
    error: (...args) => logLevel <= 4 && console.log(`[ERROR] `, ...args),
    critical: (...args) => logLevel <= 5 && console.log(`[CRITICAL] `, ...args),
}