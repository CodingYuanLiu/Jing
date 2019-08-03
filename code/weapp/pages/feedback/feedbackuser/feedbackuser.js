// pages/feedback/feedbackuser/feedbackuser.js
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        starIndexC: 5,
        starIndexH: 5,
        starIndexP: 5,
        detailC: '',
        detailP: '',
        detailH: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            id: options.id,
            act_id: options.act_id
        })
    },

    onChangeH: function(e) {
        const index = e.detail.index;
        this.setData({
            starIndexH: index
        })
    },
    onChangeP: function(e) {
        const index = e.detail.index;
        this.setData({
            starIndexP: index
        })
    },
    onChangeC: function(e) {
        const index = e.detail.index;
        this.setData({
            starIndexC: index
        })
    },
    handleSubmit: function() {
        setTimeout(this.handleSubmit1, 200)
    },
    handleSubmit1: function() {
        let that = this
        let date = new Date()
        let dateString = date.toString() + ":00";
        console.log(date)
        // let array = this.data.participants
        wx.request({
            url: 'https://jing855.cn/api/user/feedback/publish',
            method: 'POST',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            data: {
                "time": dateString,
                "act_id": parseInt(that.data.act_id),
                "receiver_id": parseInt(that.data.id),
                "communication": that.data.starIndexC,
                "communication_desc": that.data.detailC,
                "punctuality": that.data.starIndexP,
                "punctuality_desc": that.data.detailP,
                "honesty": that.data.starIndexH,
                "honesty_desc": that.data.detailH,
                "fb_images": []
            }
        })

    },
    bindTextAreaBlurC: function(event) {
        let that = this;
        this.setData({
            detailC: event.detail.value
        });
    },
    bindTextAreaBlurP: function(event) {
        let that = this;
        this.setData({
            detailP: event.detail.value
        });
    },
    bindTextAreaBlurH: function(event) {
        let that = this;
        this.setData({
            detailH: event.detail.value
        });
    }
})