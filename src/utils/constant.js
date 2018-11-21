const reg = {
    notEmpty: /^[\s\S]*.*[^\s][\s\S]*$/,
    phoneReg: /^1[34578]\d{9}$/,
};
const validators = {
    username(value) {
        let re = reg.notEmpty;
        return {
            valid: re.test(value),
            error: '用户名不为空',
        };
    },
    password(value) {
        return {
            valid: value.length >= 6,
            error: '密码应大于6位',
        };
    },
    sex(value) {
        let re = reg.notEmpty;
        return {
            valid: re.test(value),
            error: '性别不为空',
        };
    }
};
module.exports = {
    reg: reg,
    validators: validators,
};