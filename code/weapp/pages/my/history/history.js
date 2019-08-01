// pages/my/history/history.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        wx.getStorage({
            key: 'history',
            success: function(res) {
                let ids = Array.from(new Set(res.data))
                // let ids = res.data
                that.setData({
                    act_id: ids
                })
                let feed = []
                for (let i = 0; i < ids.length; i++) {
                    wx.request({
                        url: 'https://jing855.cn/api/public/act/query?act_id=' + ids[i],
                        method: 'GET',
                        success: function(res) {
                            feed.push(res.data)
                            that.setData({
                                feed: feed
                            })
                        }
                    })
                }
            },
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
})