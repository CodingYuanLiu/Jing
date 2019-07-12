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
        feed: [{
            "act_id": 2,
            "create_time": "2019-1-1",
            "depart_time": "2019-7-31 12:30",
            "description": "sima windows",
            "destination": "HongQiao Airport",
            "end_time": "2019-1-2",
            "origin": "sjtu",
            "tag": [
                "cao",
                "ni",
                "ma"
            ],
            "title": "Pin taxi to airport",
            "type": "taxi"
        }],
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
            url: 'https://sebastianj1wzyd.xyz/api/public/act/findall',
            method: 'GET',
            success: function (res) {
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
            url: 'https://sebastianj1wzyd.xyz/api/public/act/findall',
            method: 'GET',
            success: function (res) {
                next_data = res.data;
                that.setData({
                    feed: this.data.feed.concat(next_data),
                    feed_length: this.data.feed_length + next_data.length
                });
            }
        })

    }
});