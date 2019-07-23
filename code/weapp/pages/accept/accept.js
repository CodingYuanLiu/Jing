// pages/accept/accept.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        usr_id: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            id: options.id,
            usr_id: options.uid
        })
        console.log(this.data);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    handleClick: function () {
        let that = this;
        wx.request({
            url: 'https://jing855.cn/api/user/act/acceptjoin?act_id='+that.data.id+'&user_id='+that.data.usr_id,
            method: 'POST',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            success: function () {
                wx.switchTab({
                    url: '/pages/notify/notify',
                })
            }
        })
    }
})