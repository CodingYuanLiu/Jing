//discovery.js
const { $Toast } = require('../../dist/base/index');
Page({
    data: {
        navTab: ["推荐", "关注", "我的"],
        currentNavtab: "0",
        indicatorDots: false,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        feed: null,
        feed_length: 0,
        typemap: {},
        size: 5,
        index: 0
    },
    onLoad: function() {
        console.log('onLoad')
        var that = this
        //调用应用实例的方法获取全局数据
        this.refresh();
    },
    switchTab: function(e) {
        this.setData({
            currentNavtab: e.currentTarget.dataset.idx
        });

        wx.showNavigationBarLoading()
        this.refresh();
        console.log("upper");
        setTimeout(function () {
            wx.hideNavigationBarLoading();
            // wx.stopPullDownRefresh();
        }, 2000);
    },

    // bindItemTap: function(event) {
    //     let actid = event.currentTarget.dataset.id
    //     console.log(actid);
    //     console.log(12);
    //     wx.navigateTo({
    //         url: '../answer/answer?id='+actid
    //     })
    // },
    bindQueTap: function(event) {
        let actid = event.currentTarget.dataset.id
        console.log(actid);
        console.log(23);
        wx.navigateTo({
            url: '../answer/answer?id=' + actid
        })
    },
    // upper: function() {
    //     wx.showNavigationBarLoading()
    //     this.refresh();
    //     console.log("upper");
    //     setTimeout(function() {
    //         wx.hideNavigationBarLoading();
    //         // wx.stopPullDownRefresh();
    //     }, 2000);
    // },
    lower: function(e) {
        wx.showNavigationBarLoading();
        var that = this;
        setTimeout(function() {
            wx.hideNavigationBarLoading();
            // that.nextLoad();
        }, 1000);
        that.nextLoad();
        console.log("lower")
    },
    //scroll: function (e) {
    //  console.log("scroll")
    //},

    refresh: function() {
        console.log("loaddata");
        let that = this;
        var feed_data = null;
        that.setData({
            index: 0
        })
        wx.request({
            url: 'https://jing855.cn/api/public/act/findall?index=' + that.data.index + '&size=' + that.data.size,
            method: 'GET',
            success: function(res) {
                console.log(res);
                feed_data = res.data;
                that.setData({
                    feed: feed_data,
                    feed_length: feed_data.length,
                    index: that.data.index + 1
                });

            }
        })

    },

    nextLoad: function() {
        console.log("continueload");
        var next_data = null;
        let that = this;
        wx.request({
            url: 'https://jing855.cn/api/public/act/findall?index=' + that.data.index + '&size=' + that.data.size,
            method: 'GET',
            success: function(res) {
                if (res.statusCode !== 200) {
                    wx.mess
                    console.log("gua le");
                    $Toast({
                        content: '没有更多了'
                    });
                    return;
                } else {
                    console.log(res);
                    next_data = res.data;
                    that.setData({
                        feed: that.data.feed.concat(next_data),
                        feed_length: that.data.feed_length + next_data.length,
                        index: that.data.index + 1
                    });
                    
                }

            }
        })

    },
    bindNew: function() {
        this.nextLoad();
    }
});