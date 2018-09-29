// animate.js
// 获取应用实例
// const app = getApp();

Page({
    data: {
        animations: ['fadeIn', 'fadeOut', 'bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'swing', 'tada', 'wobble'],
        currClass:'fadeIn animated box',
        animationData: {},
        animation: null,
        animateStract:[],
        loopFlag:true
    },
    onPickerChange: function(v){
        let pickClssName = this.data.animations[v.detail.value];
        this.setData({
            currClass: pickClssName + ' animated box'
        });
    },
    onTap: function(v){
        let t = v.detail.y - v.currentTarget.offsetTop;
        let l = v.detail.x;
        let ani = this.data.animation;
        let stract = this.data.animateStract;
        ani.top(t).left(l).rotateZ(getRandomAng()).step();
        function getRandomAng(){
            return Math.floor(Math.random()*4)*360;
        }
        this.data.animateStract.push({
            ani:ani.export(),
            t:t,
            l:l,
            i:stract.length === 0?1:(stract[stract.length-1].i + 1)
        });
        this.setData({
            animateStract:this.data.animateStract
        });
        this.stractChangeHandler();
    },
    stractChangeHandler: function(){
        if(!this.data.loopFlag){
            return;
        }
        this.data.loopFlag = false;
        let _this = this;
        loopStract();
        function loopStract(){
            if(_this.data.animateStract.length === 0){
                _this.data.loopFlag = true;
                return;
            }else{
                _this.setData({
                    animationData: _this.data.animateStract[0].ani
                });
                setTimeout(function() {
                    _this.data.animateStract.shift();
                    _this.setData({
                        animateStract: _this.data.animateStract,
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
        this.setData({
            animation: ani
        });
        this.setData({
            animationData: ani.export()
        });
    },
    onReady: function(){
        this.init();
    }
});