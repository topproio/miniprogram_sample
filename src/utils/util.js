const app = getApp();
const empty = function(name, reg, err) {
    if (!(reg.test(name))) {
        app.msg(err);
    }
};

const getValidateProxy = function(target, validators) {
    return new Proxy(target, {
        _validators: validators,
        set(target, prop, value) {
            // if (value === '') {
            //     return target[prop] = false;
            // }
            const validResult = this._validators[prop](value);
            if (validResult.valid) {
                return Reflect.set(target, prop, value);
            } else {
                app.msg(`${validResult.error}`);
                return target[prop] = false;
            }
        }
    });
};
function arrayBufferToHexString(buffer) {
    // let bufferType = Object.prototype.toString.call(buffer);
    // if (buffer !== '[object ArrayBuffer]') {
    //     console.log('no ArrayBuffer');
    //     return;
    // }
    let dataView = new DataView(buffer);

    var hexStr = '';
    for (var i = 0; i < dataView.byteLength; i++) {
        var str = dataView.getUint8(i);
        var hex = (str & 0xff).toString(16);
        hex = (hex.length === 1) ? '0' + hex : hex;
        hexStr += hex;
    }
    return hexStr.toUpperCase();
}
function hexStringToArrayBuffer(str) {
    var buffer = new ArrayBuffer(str.length);
    let dataView = new DataView(buffer);
    let ind = 0;
    for (var i = 0, len = str.length; i < len; i += 2) {
        let code = parseInt(str.substr(i, 2), 16);
        dataView.setUint8(ind, code);
        ind++;
    }
    return buffer;
}
module.exports = {
    empty: empty,
    getValidateProxy: getValidateProxy,
    arrayBufferToHexString: arrayBufferToHexString,
    hexStringToArrayBuffer: hexStringToArrayBuffer,
};
