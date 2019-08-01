// pages/feedback/feedbackact/feedbackact.js
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        starIndexC: 4,
        participants: [],
        starIndexC: [],
        starIndexH: [],
        starIndexP: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let act_id = options.id
        let that = this;
        that.setData({
            act_id: act_id
        })
        wx.request({
            url: 'https://jing855.cn/api/public/act/getactivitymember?act_id=' + act_id,
            method: 'GET',
            success: function(res) {
                let starIndex1 = []
                let starIndex2 = []
                let starIndex3 = []
                let list = []
                let i = 0;
                let j = 0;
                while (i < res.data.length) {
                    if (res.data[i].user_id !== app.globalData.userInfo.id) {
                        res.data[i].id = j;
                        list.push(res.data[i])
                        starIndex1.push(5);
                        starIndex2.push(5);
                        starIndex3.push(5);
                        i++;
                        j++;
                    } else {
                        i++
                    }
                }
                that.setData({
                    participants: list,
                    starIndexC: starIndex1,
                    starIndexH: starIndex2,
                    starIndexP: starIndex3
                })
                console.log(res)
            }
        })
    },
    onChangeC: function(e) {
        const index = e.detail.index;
        const id = e.currentTarget.dataset.id;
        let newStarIndexC = this.data.starIndexC;
        newStarIndexC[id] = index
        this.setData({
            starIndexC: newStarIndexC
        })
    },
    onChangeP: function(e) {
        const index = e.detail.index;
        const id = e.currentTarget.dataset.id;
        let newStarIndexP = this.data.starIndexP;
        newStarIndexP[id] = index
        this.setData({
            starIndexP: newStarIndexP
        })
    },
    onChangeH: function(e) {
        const index = e.detail.index;
        const id = e.currentTarget.dataset.id;
        let newStarIndexH = this.data.starIndexH;
        newStarIndexH[id] = index
        this.setData({
            starIndexH: newStarIndexH
        })
    },
    handleSubmit: function() {
        let that = this
        let date = new Date()
        let dateString = date.toString() + ":00";
        console.log(date)
        let array = this.data.participants
        for (let i = 0; i < array.length; i++) {
            wx.request({
                url: 'https://jing855.cn/api/user/feedback/publish',
                method: 'POST',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                data: {
                    "time": dateString,
                    "act_id": parseInt(that.data.act_id),
                    "receiver_id": parseInt(array[i].user_id),
                    "communication": that.data.starIndexC[i],
                    "communication_desc": "",
                    "punctuality": that.data.starIndexP[i],
                    "punctuality_desc": "",
                    "honesty": that.data.starIndexH[i],
                    "honesty_desc": "",
                    "fb_images": []
                }
            })
        }
    }
})