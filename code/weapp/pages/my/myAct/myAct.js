let app = getApp();
const {
    $Toast
} = require('../../../dist/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        acts: [],
        no_content: false,
        current: 'tab1',
        acts_p: [],
        no_content_p: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // console.log(1)
        let that = this;
        // console.log(1)
        wx.request({
            url: 'https://jing855.cn/api/user/act/myact',
            method: 'GET',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            success: function(res) {
                if (res.data.acts === null) {
                    that.setData({
                        no_content: true
                    });
                }
                console.log(res);
                that.setData({
                    acts: res.data.acts
                })
            },
            fail: function(res) {
                console.log(res)
            }
        })
        wx.request({
            url: 'https://jing855.cn/api/user/act/manageact',
            method: 'GET',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            success: function (res) {
                if (res.data.acts === null) {
                    that.setData({
                        no_content_p: true
                    });
                }
                console.log(res);
                that.setData({
                    acts_p: res.data.acts
                })
            }
        })
    },
    handleChange({
        detail
    }) {
        this.setData({
            current: detail.key
        });
    },
    bindQueTap: function(event) {
        let actid = event.currentTarget.dataset.id
        console.log(actid);
        console.log(23);
        wx.navigateTo({
            url: '/pages/answer/answer?id=' + actid
        })
    },
    handleFeedback: function(e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/feedback/feedbackact/feedbackact?id=' + id,
        })
    },
    handleQuit: function(e) {
        this.setData({
            visible: true,
            quit_id: e.currentTarget.dataset.id
        });
    },
    handleConfirmQuit: function(e) {
        let id = this.data.quit_id
        let that = this;
        wx.request({
            url: 'https://jing855.cn/api/user/act/quit?act_id=' + id,
            method: 'POST',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            success: function(res) {
                console.log(res);
                $Toast({
                    content: '成功',
                    type: 'success'
                });
                that.onLoad()
            },
            fail: function(res) {
                console.log(res)
                $Toast({
                    content: '失败',
                    type: 'warning'
                });
            }
        })
        that.setData({
            visible: false
        })
    },
    handleCancelQuit: function() {
        this.setData({
            visible: false
        })
    },
    handleSuccess() {
        $Toast({
            content: '成功的提示',
            type: 'success'
        });
    },
    handleModify: function (event) {
        let actid = event.currentTarget.dataset.id
        let mode = event.currentTarget.dataset.mode
        console.log(actid);
        console.log(23);
        wx.navigateTo({
            url: '/pages/my/editact/editact?id=' + actid + '&mode=' + mode
        })
    },
    handleParticipants: function (event) {
        let actid = event.currentTarget.dataset.id
        console.log(actid);
        console.log(23);
        wx.navigateTo({
            url: '/pages/answer/participants/participants?act_id=' + actid
        })
    }
})