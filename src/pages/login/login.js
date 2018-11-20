const app=getApp();
const util = require('../../utils/util.js');
const constant = require('../../utils/constant.js');


Page({
    data: {
        items: ['爱好1', '爱好2', '爱好3'],
    },
    formSubmit(event) {
        let userName = event.detail.value.userName;
        let passWord = event.detail.value.passWord;
        let sex = event.detail.value.sex;
        let hobby = event.detail.value.hobby;
        let hoblestr = hobby.length > 0 ? hobby.join(',') : '';
        const userForm = {
            username: '',
            password: '',
            sex: '',
        };
        const userFormProxy = util.getValidateProxy(userForm, constant.validators);
        userFormProxy.username = `${userName}`;
        userFormProxy.password = `${passWord}`;
        userFormProxy.sex = `${sex}`;
        app.msg('提交成功');
        let datas={
            hoblestr: hoblestr,
            userName: userName,
            passWord: passWord,
            sex: sex,
        };
        console.error('提交成功', datas); 
    }
    
});
