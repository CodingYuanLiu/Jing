//index.js
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
                "type": "takeout",
                "icon": "../../images/icons/takeout.png"
            },
            {
                "idx": 1,
                "name": "打车",
                "type": "taxi",
                "icon": "../../images/icons/taxi.png"
            },
            {
                "idx": 2,
                "name": "网购",
                "type": "order",
                "icon": "../../images/icons/order.png"
            },
            {
                "idx": 3,
                "name": "其他",
                "type": "other",
                "icon": "../../images/icons/movie.png"
            }
            ]
        }],
        feed_length: 0,
        navTab: ["推荐", "关注", "我的"],
        currentNavtab: "0",
        placeholder_k: "搜索"
    },
    //事件处理函数
    onShow: function() {
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
    bindQueTap: function(event) {
        let actid = event.currentTarget.dataset.id
        console.log(actid);
        console.log(23);
        wx.navigateTo({
            url: '../answer/answer?id=' + actid
        })
    },
    upper: function() {
        wx.showNavigationBarLoading()
        let that = this;
        // this.refresh();
        console.log("upper");
        console.log(that.data.input);
        console.log(that.data.input);
        let d = [];
        for (let i = 0; i < that.data.feed.length; i++) {
            console.log(that.data.feed[i].title)
            if (that.data.feed[i].title.indexOf(that.data.input) !== -1) {
                console.log(111);
                d.push(that.data.feed[i]);
            }
        }
        that.setData({
            feed: d
        });
    },

    //使用本地 fake 数据实现刷新效果
    refresh: function() {
        console.log("loaddata");
        let that = this;
        var feed_data = null;
        wx.request({
            url: 'https://jing855.cn/api/public/act/findall',
            method: 'GET',
            success: function(res) {
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
        console.log("continueload");
        var next_data = null;
        let that = this;
        wx.request({
            url: 'https://jing855.cn/api/public/act/findall',
            method: 'GET',
            success: function(res) {
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
    },
    bindChangeKind: function(event) {
        let that = this
        let idx = event.currentTarget.dataset.idx;
        let name = '';
        let type = '';
        for (let i = 0; i < this.data.category[0].r.length; i++) {
            if (this.data.category[0].r[i].idx === idx) {
                name = this.data.category[0].r[i].name
                type = this.data.category[0].r[i].type
                this.setData({
                    placeholder_k: "搜索 " + name
                })
                break;
            }
        }
        wx.request({
            url: 'https://jing855.cn/api/public/act/findbytype?type='+type,
            method:'GET',
            // header: {
            //     "Authorization": "Bearer " + app.globalData.jwt,
            // },
            success: function(res) {
                console.log(res);
                let feed_data = res.data;
                that.setData({
                    feed: feed_data,
                    // feed_length: feed_data.length
                });
            }
        })
    }


})