let sha = require('../../utils/sha.js');
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        username: "",
        nickname: "",
        phone: "",
        password: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    handleClick: function() {
        let that = this;
        wx.login({
            success: res => {
                // ------ 获取凭证 ------
                var code = res.code;
                console.log(res);

                if (code) {
                    console.log('获取用户登录凭证：' + code);
                    //------ 发送凭证 ------
                    wx.request({
                        url: 'https://sebastianj1wzyd.xyz/api/public/login/wx',
                        data: {
                            code: code
                        },
                        method: 'POST',
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function(res) {
                            console.log(res);
                            if (res.statusCode === 301) {
                                app.globalData.qrcode = "data:image/png;base64," + res.data;
                                wx.navigateTo({
                                    url: '/pages/scan/scan',
                                })
                            } else if (res.data.status === 22) {
                                app.globalData.jwt = res.data.jwt;
                                console.log(app.globalData.jwt);
                                wx.request({
                                    url: 'https://sebastianj1wzyd.xyz/api/public/status',
                                    method: 'GET',
                                    header: {
                                        "Authorization": "Bearer " + res.data.jwt,
                                    },
                                    success: function(res) {
                                        app.globalData.userid = res.data.id;
                                        wx.request({
                                            url: 'https://sebastianj1wzyd.xyz/api/user/info/update',
                                            method: 'PUT',
                                            header: {
                                                "Authorization": "Bearer " + app.globalData.jwt,
                                            },
                                            data: {
                                                "id": app.globalData.userid,
                                                "nickname": that.data.nickname,
                                                "phone": that.data.phone,
                                                "signature": ""
                                            },
                                            success: function(res) {
                                                console.log(99999);
                                                wx.switchTab({
                                                    url: '/pages/my/my',
                                                })
                                            }
                                        })
                                    }
                                })

                            } else if (res.data.status === 0) {

                            } else {
                                console.log("bug occor")
                            }
                        },
                    })
                } else {
                    console.log('获取用户登录失败：' + res.errMsg);
                }
            }
        })
    },
    handleUsernameInput: function(event) {
        this.setData({
            username: event.detail.detail.value
        });
    },

    handlePwdInput: function(event) {
        this.setData({
            password: event.detail.detail.value
        });
    },
    handleNickInput: function(event) {
        this.setData({
            nickname: event.detail.detail.value
        });
    },

    handlePhoneInput: function(event) {
        this.setData({
            phone: event.detail.detail.value
        });
    }
})