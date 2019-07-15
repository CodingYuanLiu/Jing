// pages/my/editact/editact.js
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        content: {},
        title: '',
        end_time: '',
        depart_time: '',
        origin: '',
        dest: '',
        details: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        //调用应用实例的方法获取全局数据
        // app.getUserInfo(function(userInfo){
        //   //更新数据
        //   that.setData({
        //     userInfo:userInfo
        //   })
        // })
        this.setData({
            act_id: options.id
        });
        console.log("id是" + options.id);
        wx.request({
            url: 'https://sebastianj1wzyd.xyz/api/public/act/query?act_id=' + that.data.act_id,
            method: 'GET',
            success: function(res) {
                that.setData({
                    content: res.data
                });
                that.setData({
                    comment_length: res.data.comments.length
                })
            }
        });
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

    handleClick: function(event) {
        let that = this;
        let date = new Date();
        let dateString = date.toDateString();
        wx.request({
            url: 'https://sebastianj1wzyd.xyz/api/user/act/modify',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            method: 'POST',
            data: {
                "act_id": parseInt(that.data.act_id),
                "type": that.data.content.type,
                "create_time": dateString,
                "end_time": that.data.end_time,
                "description": that.data.details,
                "origin": that.data.origin,
                "destination": that.data.dest,
                "depart_time": that.data.depart_time,
                "tag": ["default"]
            },
            success: function() {
                console.log("naviback")
                wx.switchTab({
                    url: '/pages/my/my',
                })
            }
        })
    },

    handleDelete: function() {
        let that = this;
        wx.request({
            url: 'https://sebastianj1wzyd.xyz/api/user/act/delete?act_id=' + that.data.act_id,
            method: 'POST',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            success: function(res) {
                console.log(res);
                wx.navigateBack({})
            }
        })
    },

    handleTitleInput: function(event) {
        this.setData({
            title: event.detail.detail.value
        });
    },
    handleEndTimeInput: function(event) {
        this.setData({
            end_time: event.detail.detail.value
        });
    },
    handleDepartTimeInput: function(event) {
        this.setData({
            depart_time: event.detail.detail.value
        });
    },
    handleOriginInput: function(event) {
        this.setData({
            origin: event.detail.detail.value
        });
    },
    handleDestInput: function(event) {
        this.setData({
            dest: event.detail.detail.value
        });
    },
    bindTextAreaBlur: function(event) {
        this.setData({
            details: event.detail.value
        });
    }

})