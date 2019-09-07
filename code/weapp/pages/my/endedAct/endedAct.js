let app = getApp();
const { $Toast } = require('../../../dist/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        acts: [],
        no_content: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(1)
        let that = this;
        // console.log(1)
        wx.request({
            url: 'https://jing855.cn/api/user/act/myact',
            method: 'GET',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            success: function (res) {
                // let list = [];
                // for ()
               
                console.log(res);
                let all = res.data.acts;
                let current = [];
                // let date = new Date();
                for (let i = 0; i < all.length; i++) {
                 
                    if (all[i].status === 2) {
                        current.push(all[i]);
                    }
                }
                if (current.length === 0) {
                    that.setData({
                        no_content: true
                    });
                }
                that.setData({
                    acts: current
                })
            },
            fail: function (res) {
                console.log(res)
            }
        })
    },

    bindQueTap: function (event) {
        let actid = event.currentTarget.dataset.id
        console.log(actid);
        console.log(23);
        wx.navigateTo({
            url: '/pages/answer/answer?id=' + actid
        })
    },
    handleFeedback: function (e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/feedback/feedbackact/feedbackact?id=' + id,
        })
    },
    handleQuit: function (e) {
        this.setData({
            visible: true,
            quit_id: e.currentTarget.dataset.id
        });
    },
    handleConfirmQuit: function (e) {
        let id = this.data.quit_id
        let that = this;
        wx.request({
            url: 'https://jing855.cn/api/user/act/quit?act_id=' + id,
            method: 'POST',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            success: function (res) {
                console.log(res);
                $Toast({
                    content: '成功',
                    type: 'success'
                });
                that.onLoad()
            },
            fail: function (res) {
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
    handleCancelQuit: function () {
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
})