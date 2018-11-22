
var dataList = [];
var characteristic = [];
const app = getApp();
const util = require('../../utils/util.js');
const uuids = require('../../utils/uuid.js');
Page({
    data: {
        uuids: uuids.uuids,
        deviceid: '',
        deviceName: '',
        characteristic: [],
    },
    getBlueTooth() {
        const that = this;
        // 初始化蓝牙模块
        wx.openBluetoothAdapter({
            success() {
                // 开始搜寻附近的蓝牙设备
                wx.startBluetoothDevicesDiscovery({
                    success: re => {
                        // 获取蓝牙设备列表
                        console.warn('蓝牙设备列表', re);
                        app.loading('设备检索中...');
                        wx.getBluetoothDevices({
                            success: res => {
                                console.warn(res.devices);
                                wx.hideLoading();
                            },
                            fail: err => {
                                console.error(err);
                            }
                        });
                    },
                    fail: err => {
                        that.mistake(err);
                    }
                });
                that.found();
            },
            fail: err => {
                that.mistake(err);
            }
        });
    },
    found() {
        const that = this;
        // 监听搜索到的蓝牙设备
        wx.onBluetoothDeviceFound(function(devices) {
            devices.devices.forEach(element => {
                if (element.name !== '') {
                    dataList.connected = false;
                    dataList.push(element);
                }
            });
            that.setData({
                dataList: dataList,
            });
            // 关闭搜索
            wx.stopBluetoothDevicesDiscovery();
        });
    },
    filterName(event) {
        return event.name !== '';
    },
    createConnect(e) {
        const that = this;
        let id = e.currentTarget.dataset.deviceid;
        let name = e.currentTarget.dataset.name;
        wx.openBluetoothAdapter({
            success() {
                app.loading('连接蓝牙中');
                characteristic = [];
                wx.createBLEConnection({
                    deviceId: id,
                    success() {
                        that.setData({
                            deviceid: id,
                            deviceName: name,
                        });
                        // 获取蓝牙所有service服务
                        wx.getBLEDeviceServices({
                            deviceId: id,
                            success: res => {
                                console.warn(res);
                                // 获取蓝牙设备某个服务中的所有characteristic特征值
                                that.oprateData(res, id);
                            },
                            fail: err => {
                                that.mistake(err);
                            }
                        });
                        app.msg('连接成功');
                    },
                    fail: err => {
                        that.mistake(err);
                    }
                });
            }
        });
    },
    oprateData(res, id) {
        let that = this;
        let promises = res.services.map(function(element) {
            return new Promise(function(resolve) {
                wx.getBLEDeviceCharacteristics({
                    deviceId: id,
                    serviceId: element.uuid,
                    success: re => {
                        re.characteristics.forEach(elem => {
                            elem.deviceid = id;
                            elem.serviceid = element.uuid.toLowerCase();
                            elem.read = elem.properties.read;
                            elem.indicate = elem.properties.indicate;
                            elem.notify = elem.properties.notify;
                            elem.write = elem.properties.write;
                            elem.uuid = elem.uuid.toLowerCase();
                        });
                        characteristic = characteristic.concat(re.characteristics);
                        resolve(characteristic);
                    }
                });
            });
        });
        Promise.all(promises).then(function() {
            that.setData({
                characteristic: characteristic,
            });
            console.log(characteristic);
        });
    },
    getInfo(event) {
        const that = this;
        let read = event.currentTarget.dataset.read;
        let uuid = event.currentTarget.dataset.uuid;
        let deviceid = event.currentTarget.dataset.deviceid;
        let serviceid = event.currentTarget.dataset.serviceid;
        let argument = event.currentTarget.dataset.argument;
        if (read) {
            wx.notifyBLECharacteristicValueChange({
                deviceId: deviceid,
                serviceId: serviceid,
                characteristicId: uuid,
                state: true,
                success(re) {
                    console.warn('re', re);
                    // 读取低功耗蓝牙设备的特征值的二进制数据值
                    wx.readBLECharacteristicValue({
                        deviceId: deviceid,
                        serviceId: serviceid,
                        characteristicId: uuid,
                        success() {
                            console.warn(deviceid);
                            wx.onBLECharacteristicValueChange(function(re) {
                                console.log(util.arrayBufferToHexString(re.value));
                                if(argument === 'name'){
                                    that.setData({
                                        name: util.arrayBufferToHexString(re.value),
                                    });
                                }
                                if(argument === 'battery'){
                                    that.setData({
                                        battery: util.arrayBufferToHexString(re.value),
                                    });
                                }
                            });
                        },
                        fail: err => {
                            that.mistake(err);
                        }
                    });
                },
                fail: err => {
                    that.mistake(err);
                }
            });
        }else{
            app.msg('不支持读取操作');
        }
    },
    setInfo(event){
        const that = this;
        let write = event.currentTarget.dataset.write;
        let uuid = event.currentTarget.dataset.uuid;
        let deviceid = event.currentTarget.dataset.deviceid;
        let serviceid = event.currentTarget.dataset.serviceid;
        let argument = event.currentTarget.dataset.argument;
        let newName = '';
        if (write) {
            wx.notifyBLECharacteristicValueChange({
                deviceId: deviceid,
                serviceId: serviceid,
                characteristicId: uuid,
                state: true,
                success(re) {
                    console.warn('re', re);
                    // 读取低功耗蓝牙设备的特征值的二进制数据值
                    if(argument === 'name'){
                        newName = '大安';
                    }
                    wx.writeBLECharacteristicValue({
                        deviceId: deviceid,
                        serviceId: serviceid,
                        characteristicId: uuid,
                        value: util.hexStringToArrayBuffer(newName),
                        success(re) {
                            console.warn('成功写入数据', re);
                        },
                        fail: err => {
                            that.mistake(err);
                        }
                    });
                    
                },
                fail: err => {
                    that.mistake(err);
                }
            });
        }else{
            app.msg('不支持修改操作');
        }
    },
    closeConnect(e) {
        const that = this;
        let id = e.currentTarget.dataset.deviceid;
        wx.closeBLEConnection({
            deviceId: id,
            success: res => {
                console.warn(res);
                let closeData = {
                    characteristic: [],
                    deviceid: '',
                    deviceName: '',
                };
                that.setData(closeData);
                wx.closeBluetoothAdapter({});
                app.msg('成功断开');
            },
            fail: err => {
                that.mistake(err);
            }
        });
    },
    watch() {
        wx.onBLEConnectionStateChange(function(res) {
            // 该方法回调中可以用于处理连接意外断开等异常情况
            if (!res.connected) {
                let closeData = {
                    characteristic: [],
                    deviceid: '',
                    deviceName: '',
                };
                this.setData(closeData);
                app.msg('链接已断开');
                wx.closeBluetoothAdapter({});
            }
        });
    },
    // 监听错误代码
    mistake(err) {
        let errcode = [{
            code: 10000,
            msg: '未初始化适配器',
        }, {
            code: 10001,
            msg: '请检查蓝牙是否打开',
        }, {
            code: 10002,
            msg: '未找到指定设备',
        }, {
            code: 10003,
            msg: '连接失败',
        }, {
            code: 10004,
            msg: '未找到指定服务',
        }, {
            code: 10005,
            msg: '未找到指定特征值',
        }, {
            code: 10006,
            msg: '连接已断开',
        }, {
            code: 10007,
            msg: '该特征值不支持操作',
        }, {
            code: 10008,
            msg: '其他异常',
        }, {
            code: 10009,
            msg: '系统版本过低',
        }];
        console.error(err);
        errcode.forEach(element => {
            if (err.errCode === element.code) {
                app.msg(element.msg);
            }
        });
    }
});
