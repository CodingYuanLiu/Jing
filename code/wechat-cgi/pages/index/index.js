//discovery.js
var util = require('../../utils/util.js')
Page({
    data: {
        navTab: ["推荐", "关注", "我的"],
        currentNavtab: "0",
        imgUrls: [
            '../../images/24213.jpg',
            '../../images/24280.jpg',
            '../../images/1444983318907-_DSC1826.jpg'
        ],
        indicatorDots: false,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        feed: [],
        feed_length: 0
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
            url: '../answer/answer?id='+actid
        })
    },
    upper: function() {
        wx.showNavigationBarLoading()
        this.refresh();
        console.log("upper");
        setTimeout(function() {
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
        }, 2000);
    },
    lower: function(e) {
        wx.showNavigationBarLoading();
        var that = this;
        setTimeout(function() {
            wx.hideNavigationBarLoading();
            that.nextLoad();
        }, 1000);
        console.log("lower")
    },
    //scroll: function (e) {
    //  console.log("scroll")
    //},

    //网络请求数据, 实现刷新
    refresh0: function() {
        var index_api = '';
        util.getData(index_api)
            .then(function(data) {
                //this.setData({
                //
                //});
                console.log(data);
            });
    },

    //使用本地 fake 数据实现刷新效果
    refresh: function() {
        var feed = util.getDiscovery();
        console.log("loaddata");
        let that = this;
        var feed_data = null;
        wx.request({
            url: 'https://jing855.cn/api/public/act/findall',
            method: 'GET',
            success: function (res) {
                console.log(res);
                feed_data = res.data;
                that.setData({
                    feed: feed_data,
                    feed_length: feed_data.length
                });
            }
        })
        
    },

    //使用本地 fake 数据实现继续加载效果
    nextLoad: function() {
        var next = util.discoveryNext();
        console.log("continueload");
        var next_data = null;
        let that = this;
        wx.request({
            url: 'https://jing855.cn/api/public/act/findall',
            method: 'GET',
            success: function (res) {
                console.log(res);
                next_data = res.data;
                that.setData({
                    feed: that.data.feed.concat(next_data),
                    feed_length: that.data.feed_length + next_data.length
                });
            }
        })

    }
});