// pages/answer/participants/participants.js
let app= getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let id = options.act_id;
        wx.request({
            url: 'https://jing855.cn/api/public/act/getactivitymember?act_id='+id,
            method: 'GET',
            success: function(res) {
                that.setData({
                    users: res.data
                })
            }
        })
    },
    handleToShowInfo: function (event) {
        let id = event.currentTarget.dataset.id;
        console.log(id);
        wx.navigateTo({
            url: '/pages/showUserinfo/showUserinfo?id=' + id,
        })
    },
   
})