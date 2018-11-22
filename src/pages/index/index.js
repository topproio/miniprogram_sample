// index.js
// 获取应用实例
const app = getApp();

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        navInfo: [{
            name: '动画',
            path: '../animate/animate'
        }, {
            name: '自定义音乐播放器',
            path: '../music/music'
        }, {
            name: '地图',
            path: '../map/map'
        }, {
            name: '分享',
            path: '../share/share'
        }, {
            name: '照片',
            path: '../carmera/carmera'
        }, {
            name: '登录',
            path: '../login/login'
        }, {
            name: '蓝牙',
            path: '../bluetooth/bluetooth'
        }]
    },
    navHandler: function(event) {
        var index = event.currentTarget.dataset.index;
        if(index!==3){
            wx.navigateTo({
                url:  this.data.navInfo[event.target.id].path
            });
        }
        
    },
    // 事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        });
    },
    onLoad: function() {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        } else if (this.data.canIUse){

            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                });
            };
        } else {

            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo;
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    });
                }
            });
        }
    },
    getUserInfo: function(e) {
        console.log(e);
        app.globalData.userInfo = e.detail.userInfo;
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
    },
    onShareAppMessage: (res) => {
        let tip='';
        if (res.from === 'button') {
            tip='按钮';
        } else {
            tip='右上角';
        }
        return {
            title: '标题',
            path: '/pages/index/index',
            imageUrl: '/share.jpg',
            success: () => {
                app.msg(tip+'转发成功');
            },
            fail: () => {
                app.msg(tip+'转发失败');
            },
        };
    }
});
