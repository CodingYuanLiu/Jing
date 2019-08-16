// pages/my/mypublish/mypublish.js
let app = getApp();
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
    onLoad: function(options) {
        let that = this;
        wx.request({
            url: 'https://jing855.cn/api/user/act/manageact',
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
            }
        })
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
        let that = this;
        wx.request({
            url: 'https://jing855.cn/api/user/act/manageact',
            method: 'GET',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            success: function(res) {
                console.log(res);
                that.setData({
                    acts: res.data.acts
                })
            }
        })
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
    bindQueTap: function(event) {
        let actid = event.currentTarget.dataset.id
        let mode = event.currentTarget.dataset.mode
        console.log(actid);
        console.log(23);
        wx.navigateTo({
            url: '/pages/answer/answer?id=' + actid
        })
    },
    handleModify: function(event) {
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