// animate.js
// 获取应用实例
// const app = getApp();

Page({
    data: {
        animations: ['fadeIn', 'fadeOut', 'bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'swing', 'tada', 'wobble'],
        currClass:'fadeIn animated box',
        animationData: {},
        animateQueue:[],
    },
    loopFlag: true,
    animation: null,
    onPickerChange: function(v){
        let pickClssName = this.data.animations[v.detail.value];
        this.setData({
            currClass: pickClssName + ' animated box'
        });
    },
    onTap: function(v){
        let t = v.detail.y - v.currentTarget.offsetTop;
        let l = v.detail.x;
        let ani = this.animation;
        let stract = this.data.animateQueue;
        ani.top(t).left(l).rotateZ(getRandomAng()).step();
        this.data.animateQueue.push({
            ani:ani.export(),
            t:t,
            l:l,
            i:stract.length === 0?1:(stract[stract.length-1].i + 1)
        });
        this.setData({
            animateQueue:this.data.animateQueue
        });
        this.stractChangeHandler();
        function getRandomAng(){
            return Math.floor(Math.random()*4)*360;
        }
    },
    stractChangeHandler: function(){
        if(!this.loopFlag){
            return;
        }
        this.loopFlag = false;
        let _this = this;
        loopStract();
        function loopStract(){
            if(_this.data.animateQueue.length === 0){
                _this.loopFlag = true;
                return;
            }else{
                _this.setData({
                    animationData: _this.data.animateQueue[0].ani
                });
                setTimeout(function() {
                    _this.data.animateQueue.shift();
                    _this.setData({
                        animateQueue: _this.data.animateQueue,
                    });
                    loopStract();
                }, 1000);
            }
        }
    },
    init: function(){
        let ani = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease'
        });
        ani.top(0).left(0).step();
        this.animation = ani;
        this.setData({
            animationData: ani.export()
        });
    },
    onReady: function(){
        this.init();
    }
});