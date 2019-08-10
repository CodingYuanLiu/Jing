//logs.js
let app = getApp();
const {
    $Message
} = require('../../dist/base/index');

Page({
    data: {
        focus: false,
        inputValue: '',
        aid: 0,
        uid: 0,
        loged: true,
        applicant: [],
        notify_length: 0,
        // navTab: ["通知"],
        // currentNavtab: "0",
        visible: false,
    },
    bindButtonTap: function() {
        this.setData({
            focus: Date.now()
        })
    },
    bindKeyInput: function(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    bindReplaceInput: function(e) {
        var value = e.detail.value
        var pos = e.detail.cursor
        if (pos != -1) {
            //光标在中间
            var left = e.detail.value.slice(0, pos)
            //计算光标的位置
            pos = left.replace(/11/g, '2').length
        }

        //直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
        return {
            value: value.replace(/11/g, '2'),
            cursor: pos
        }

        //或者直接返回字符串,光标在最后边
        //return value.replace(/11/g,'2'),
    },
    bindHideKeyboard: function(e) {
        if (e.detail.value === '123') {
            //收起键盘
            wx.hideKeyboard()
        }
    },
    switchTab: function(e) {
        this.setData({
            currentNavtab: e.currentTarget.dataset.idx
        });
    },
    handleToAccept: function(event) {
        let aid = event.currentTarget.dataset.aid;
        let uid = event.currentTarget.dataset.uid;
        let nick = event.currentTarget.dataset.nick;
        // wx.navigateTo({
        //     url: '/pages/accept/accept?id='+aid + '&uid='+uid,
        // })
        this.setData({
            aid: aid,
            uid: uid
        });
        this.setData({
            message: "是否接受" + nick + "的请求？"
        })
        this.setData({
            visible: true
        });
    },
    handleOk: function() {
        let that = this;
        wx.request({
            url: 'https://jing855.cn/api/user/act/acceptjoin?act_id=' + that.data.aid + '&user_id=' + that.data.uid,
            method: 'POST',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            success: function() {
                // wx.switchTab({
                //     url: '/pages/notify/notify',
                // })
                that.onShow();
            }
        })
        this.setData({
            visible: false
        });

    },
    handleCancel: function() {
        this.setData({
            visible: false
        });

    },
    onLoad: function(res) {
        let that = this;
        if (app.globalData.userInfo === null) {
            that.setData({
                loged: false
            })
        } else {
            that.setData({
                loged: true
            })
            wx.request({
                url: 'https://jing855.cn/api/user/act/getjoinapp',
                method: 'GET',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                success: function (res) {
                    if (res.data === null) {
                        that.setData({
                            applicant: [],
                            notify_length: 0
                        });
                        return;
                    }
                    console.log(1);
                    console.log(res);
                    console.log(2);
                    let applicant = res.data;
                    that.setData({
                        notify_length: applicant.length,
                        applicant: applicant
                    })
                }
            })
        }

    },
    onShow: function() {
        this.onLoad();
    }
})