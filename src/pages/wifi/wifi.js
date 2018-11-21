
var dataList = [];
const app = getApp();
const util = require('../../utils/util.js');
Page({
    getBlueTooth() {
        const that = this;
        // 初始化蓝牙模块

        wx.openBluetoothAdapter({
            success() {
                // 开始搜寻附近的蓝牙设备

                wx.startBluetoothDevicesDiscovery({
                    success() {
                        // 获取蓝牙设备列表
                        wx.getBluetoothDevices({
                            success: res => {
                                console.warn(res);
                                // that.setData({
                                //     dataList: res.devices.filter(that.filterName),
                                // });
                            },
                            fail: err => {
                                console.error(err);
                            }
                        });
                    },
                    fail: err => {
                        console.error(err);
                    }
                });

                // 监听搜索到的蓝牙设备
                wx.onBluetoothDeviceFound(function(devices) {
                    devices.devices.forEach(element => {
                        if (element.name !== '') {
                            dataList.connected = false;
                            dataList.push(element);
                            
                            // 关闭搜索
                            wx.stopBluetoothDevicesDiscovery();
                        }
                    });
                    that.setData({
                        dataList: dataList,
                    });
                });
            },
            fail: err => {
                console.error(err);
            }
        });
    },
    filterName(event) {
        return event.name !== '';
    },
    createConnect(e) {
        const that = this;
        let index = e.currentTarget.dataset.index;
        let id = e.currentTarget.dataset.deviceid;
        let deviceId = util.arrayBufferToHexString(this.data.dataList[index].advertisData);
        console.log(deviceId);
        app.loading('连接蓝牙中');
        wx.createBLEConnection({
            deviceId: id,
            success() {
                that.data.dataList[index].connected = true;
                that.setData({
                    dataList: that.data.dataList
                });
                wx.getBLEDeviceServices({
                    deviceId: id,
                    success: res => {
                        console.warn(res);
                    },
                    fail: err => {
                        console.error(err);
                    }
                });
                app.msg('连接成功');
            },
            fail: err => {
                console.error(err);
                app.msg('连接失败');
            }
        });
    },
    closeConnect(e) {
        const that = this;
        let index = e.currentTarget.dataset.index;
        let id = e.currentTarget.dataset.deviceid;
        let deviceId = util.arrayBufferToHexString(this.data.dataList[index].advertisData);
        console.log(deviceId);
        wx.closeBLEConnection({
            deviceId: id,
            success: res => {
                console.warn(res);
                that.data.dataList[index].connected = false;
                that.setData({
                    dataList: that.data.dataList
                });
                app.msg('成功断开');
            },
            fail: err => {
                console.error(err);
            }
        });
    },
});
