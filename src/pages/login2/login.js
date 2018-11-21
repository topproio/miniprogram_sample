const app=getApp();

Page({
    data: {
        items: ['爱好1', '爱好2', '爱好3'],
        hoblestr: '',
    },
    formSubmit(event) {
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
        if(userName===''){
            app.msg('用户名不为空');
            return;
        }
        if(passWord===''){
            app.msg('密码不为空');
            return;
        }
        if(sex===''){
            app.msg('请选择性别');
            return;
        }
        let datas={
            hoblestr: this.data.hoblestr,
            userName: userName,
            passWord: passWord,
            sex: sex,
        };
        console.error(datas);
    }
});
