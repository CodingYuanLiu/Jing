// pages/selectstore/selectstore.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        backfill: '',
        suggestion: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    backfill: function(e) {
        var id = e.currentTarget.id;
        for (var i = 0; i < this.data.suggestion.length; i++) {
            if (i == id) {
                this.setData({
                    backfill: this.data.suggestion[i].name,
                });
            }
        }
    },
    getsuggest: function(e) {
        var that = this;
        // get suggext
        console.log(e.detail.detail.value);
        wx.request({
            url: 'https://jing855.cn/api/public/takeout/searchshop?key=' + e.detail.detail.value,
            method: 'GET',
            success: function(res) {
                console.log(res)
                that.setData({
                    suggestion: res.data
                })
            }
        })

        that.setData({
            show_sug: true
        });
        //调用关键词提示接口
    },
    handleClick: function(event) {
        console.log(event.currentTarget.dataset.poi);
        this.setData({
            show_sug: false
        });
        this.backfill(event);
        this.handleConfirm();
    },
    handleConfirm: function() {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];

        //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
        prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
            store: this.data.backfill,
        })
        wx.navigateBack({})
    }
})