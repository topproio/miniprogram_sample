const app = getApp();
const empty = function(name, reg, err) {
    if (!(reg.test(name))) {
        app.msg(err);
    }
};

const getValidateProxy=function(target, validators) {
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
module.exports = {
    empty: empty,
    getValidateProxy: getValidateProxy,
};
