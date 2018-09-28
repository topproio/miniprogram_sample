// animate.js
// 获取应用实例
// const app = getApp();

Page({
    data: {
        array: ['fadeIn', 'fadeOut', 'bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'swing', 'tada', 'wobble'],
        currClass:'fadeIn animated box',
        animationData: {},
        animation: null,
        animateStract:[],
        flag:true
    },
    bindPickerChange: function(v){
        let name = this.data.array[v.detail.value];
        this.setData({
            currClass: name + ' animated box'
        });
    },
    tapHandler: function(v){
        let t = v.detail.y - v.currentTarget.offsetTop;
        let l = v.detail.x;
        let _this = this;
        let ani = this.data.animation;
        ani.top(t).left(l).rotateZ(getRandomAng()).step();
        function getRandomAng (){
            return Math.floor(Math.random()*4)*360;
        }
        this.data.animateStract.push({
            ani:ani.export(),
            t:t,
            l:l,
            i:_this.data.animateStract.length === 0?1:(_this.data.animateStract[_this.data.animateStract.length-1].i + 1)
        });
        this.setData({
            animateStract:this.data.animateStract
        });
        this.stractHandler();
    },
    stractHandler: function(){
        if(!this.data.flag){
            return;
        }
        this.data.flag = false;
        let _this = this;
        loopStract();
        function loopStract (){
            if(_this.data.animateStract.length === 0){
                _this.data.flag = true;
                return;
            }else{
                let _pre = JSON.parse(JSON.stringify(_this.data.animateStract)).shift();
                _this.setData({
                    animationData: _pre.ani
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
    init: function (){
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
    onReady: function (){
        this.init();
    }
});