//import Util from 'modules/util';
import { getDeviceName } from 'react-native-device-info';

let __logBootTime = performance.now();
let __moduleBootTime = null;
export let DEBUG_ENABLED = true;
export let deviceName = '';

getDeviceName().then(name => (deviceName = name));

const devLogger = (cName, method, args) => {
    if(!__DEV__)
        return;

    if (!__moduleBootTime) {
        __moduleBootTime = performance.now();
        console.log('boot took ', (__moduleBootTime - __logBootTime).toFixed(1), 'ms');
    }

    let time = (performance.now() - __moduleBootTime).toFixed(1);
    console[method].apply(null, [''.padEnd(method == 'log' ? 2 : 0), '(', deviceName.padEnd(10), ')', time, cName.toUpperCase(), ...args]);
}

const prodLogger = () => {}
const doLog = __DEV__ ? devLogger : prodLogger;

export function debug(name, ...args){
    if(!DEBUG_ENABLED)
        return;

    doLog(name + ": ", "debug", args);
}

export function log(name, ...args){
    doLog(name + ": ", "log", args);
}

export function error(name, ...args){
    doLog(name + ": ", "error", args);
}

export function warn(name, ...args){
    doLog(name + ": ", "warn", args);
}