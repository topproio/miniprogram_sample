const app = getApp();
var isEmpty_g = 0;
Page({
    data: {
        items: ['爱好1', '爱好2', '爱好3'],
        hoblestr: '',
    },
    formSubmit(event) {
        isEmpty_g = 0;
        let userName=event.detail.value.userName;
        let passWord=event.detail.value.passWord;
        let sex=event.detail.value.sex;
        let hobby=event.detail.value.hobby;
        if(hobby.length>0){
            this.setData({
                hoblestr: hobby.join(','),
            });
        }else{
            this.setData({
                hoblestr: '',
            });
        }
        let emptyArr = [{
            name : `${userName}`,
            text : '请输入用户名',
            isEmpty : true
        }, {
            name : `${passWord}`,
            text : '请输入密码',
            isEmpty : true
        }, {
            name : `${sex}`,
            text : '请选择性别',
            isEmpty : true
        }];
        this.empty(emptyArr);
        emptyArr.forEach(element => {
            if(element.isEmpty){
                isEmpty_g = 1;
            }
        });
        if(isEmpty_g === 0){
            let datas={
                hoblestr: this.data.hoblestr,
                userName: userName,
                passWord: passWord,
                sex: sex,
            };
            console.error('提交成功', datas);
            app.msg('提交成功');
        }        
    },
    empty(emptyArr) {
        emptyArr.reverse().forEach(element => {
            if(element.name === ''){
                app.msg(element.text);
            }else{
                element.isEmpty = false;
            }
        });
    },
});
