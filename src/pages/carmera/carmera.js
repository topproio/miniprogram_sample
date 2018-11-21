Page({
    data : {
        showStart: true,
        photoPath: '',
        thumbPath: '',
        videoPath: '',
        imagesList: [],
    },
    takePhoto() {
        let CameraContext=wx.createCameraContext();
        let that=this;
        CameraContext.takePhoto({
            quality: 'high', 
            success: function(res){
                that.setData({
                    photoPath: res.tempImagePath,
                });
            }, 
        });
    },
    startVideo() {
        let CameraContext=wx.createCameraContext();
        let that=this;
        CameraContext.startRecord({
            timeoutCallback: false,
            success: function(){
                that.setData({
                    showStart: false, 
                });
            },
        });
    },
    endVideo() {
        let CameraContext=wx.createCameraContext();
        let that=this;
        CameraContext.stopRecord({
            timeoutCallback: false,
            success: function(res){
                that.setData({
                    showStart: false, 
                    thumbPath: res.tempThumbPath,
                    videoPath: res.tempVideoPath,
                });
            },
        });
    },
    getImages() {
        let that=this;
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                if(that.data.imagesList.length>0){
                    res.tempFiles.forEach(element => {
                        that.data.imagesList.push(element);
                    });
                }else{
                    that.data.imagesList=res.tempFiles;
                }
                that.setData({
                    imagesList: that.data.imagesList,
                });
            }
        });
    },
    deleteImg(event) {
        let that=this;
        wx.showModal({
            title: '提示',
            content: '是否删除此图片',
            success(res) {
                if (res.confirm) {
                    let index=event.currentTarget.dataset.index;
                    let imagesList=that.data.imagesList;
                    imagesList.splice(index, 1);
                    that.setData({
                        imagesList: imagesList,
                    });
                }
            }
        });
    },
    previewImg(event) {
        let index=event.currentTarget.dataset.index;
        let imagesList=this.data.imagesList;
        let imagesArr=[];
        imagesList.forEach(element => {
            imagesArr.push(element.path);
        });
        wx.previewImage({
            current: imagesList[index], 
            urls: imagesArr, 
        });
    }
});
