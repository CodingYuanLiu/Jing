//index.js

var util = require('../../utils/util.js')
var app = getApp()
Page({
    data: {
        feed: [],
        input: '',
        category: [{
            "idx": 0,
            "r": [{
                    "idx": 0,
                    "name": "外卖",
                    "icon": "../../images/icons/takeout.png"
                },
                {
                    "idx": 1,
                    "name": "打车",
                    "icon": "../../images/icons/taxi.png"
                },
                {
                    "idx": 2,
                    "name": "游戏",
                    "icon": "../../images/icons/games.png"
                },
                {
                    "idx": 3,
                    "name": "电影",
                    "icon": "../../images/icons/movie.png"
                }
            ]
        }, {
            "idx": 1,
            "r": [{
                "idx": 4,
                "name": "网购",
                "icon": "../../images/icons/movie.png"
            }, {
                "idx": 5,
                "name": "会员",
                "icon": "../../images/icons/movie.png"
            }, {
                "idx": 6,
                "name": "会员",
                "icon": "../../images/icons/movie.png"
            }, {
                "idx": 7,
                "name": "会员",
                "icon": "../../images/icons/movie.png"
            }]
        }],
        feed_length: 0,
        navTab: ["推荐", "关注", "我的"],
        currentNavtab: "0"
    },
    //事件处理函数
    onShow: function (){
        this.onLoad();
    },
    onLoad: function() {
        console.log('onLoad')
        var that = this
        that.refresh();
        //调用应用实例的方法获取全局数据
        // this.getData();
    },
    //scroll: function (e) {
    //  console.log("scroll")
    //}

    // bindItemTap: function(event) {
    //     let actid = event.currentTarget.dataset.id
    //     console.log(actid);
    //     console.log(12);
    //     wx.navigateTo({
    //         url: '../answer/answer?id='+actid
    //     })
    // },
    bindQueTap: function (event) {
        let actid = event.currentTarget.dataset.id
        console.log(actid);
        console.log(23);
        wx.navigateTo({
            url: '../answer/answer?id=' + actid
        })
    },
    upper: function () {
        wx.showNavigationBarLoading()
        let that = this;
        // this.refresh();
        console.log("upper");
        console.log(that.data.input);
        console.log(that.data.input);
        let d = [];
        for (let i = 0; i < that.data.feed.length; i++) {
            console.log(that.data.feed[i].title)
            if (that.data.feed[i].title.indexOf(that.data.input) !== -1){
                console.log(111);
                d.push(that.data.feed[i]);
            }
        }
        that.setData({feed: d});
    },
    // lower: function (e) {
    //     wx.showNavigationBarLoading();
    //     var that = this;
    //     setTimeout(function () {
    //         wx.hideNavigationBarLoading();
    //         that.nextLoad();
    //     }, 1000);
    //     console.log("lower")
    // },
    //scroll: function (e) {
    //  console.log("scroll")
    //},

    //网络请求数据, 实现刷新
    // refresh0: function () {
    //     var index_api = '';
    //     util.getData(index_api)
    //         .then(function (data) {
    //             //this.setData({
    //             //
    //             //});
    //             console.log(data);
    //         });
    // },

    //使用本地 fake 数据实现刷新效果
    refresh: function () {
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
    nextLoad: function () {
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

    },
    handleInput: function(event) {
        this.setData({
            input: event.detail.value
        })
    }


})