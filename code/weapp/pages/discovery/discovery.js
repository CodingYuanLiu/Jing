//index.js
var app = getApp()
Page({
    data: {
        feed: [],
        input: '',
        curButton: -1,
        oldFeed: [],
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
    // upper: function() {
    //     wx.showNavigationBarLoading()
    //     let that = this;
    //     // this.refresh();
    //     console.log("upper");
    //     console.log(that.data.input);
    //     console.log(that.data.input);
    //     let d = [];
    //     for (let i = 0; i < that.data.feed.length; i++) {
    //         console.log(that.data.feed[i].title)
    //         if (that.data.feed[i].title.indexOf(that.data.input) !== -1) {
    //             console.log(111);
    //             d.push(that.data.feed[i]);
    //         }
    //     }
    //     that.setData({
    //         feed: d
    //     });
    // },

    refresh: function() {
        console.log("loaddata");
        let that = this;
        var feed_data = null;
        wx.request({
            url: 'https://jing855.cn/api/public/act/findall',
            method: 'GET',
            success: function(res) {
                console.log(res);
                feed_data = res.data.acts;
                that.setData({
                    feed: feed_data,
                    feed_length: feed_data.length,
                    oldFeed: feed_data
                });
            }
        })

    },

    nextLoad: function() {
        console.log("continueload");
        var next_data = null;
        let that = this;
        wx.request({
            url: 'https://jing855.cn/api/public/act/findall',
            method: 'GET',
            success: function(res) {
                console.log(res);
                next_data = res.data.acts;
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
        that.setData({
            curButton: idx
        });
        let name = '';
        let type = '';
        if (idx >= 0) {
            for (let i = 0; i < this.data.category[0].r.length; i++) {
                if (this.data.category[0].r[i].idx === idx) {
                    name = this.data.category[0].r[i].name
                    type = this.data.category[0].r[i].type
                    this.setData({
                        placeholder_k: "从"+that.data.input+"搜索中筛选： " + name + "分类结果"
                    })
                    let newFeed = [];
                    // let feed = that.data.oldFeed
                    for (let k = 0; k < that.data.oldFeed.length; k++) {
                        if (that.data.oldFeed[k].type === type) {
                            newFeed.push(that.data.oldFeed[k])
                        }
                    }
                    that.setData({
                        feed: newFeed,
                    })
                    break;
                }
            }
        } else {
            // this.refresh();
            this.setData({
                placeholder_k: ""
            })
            that.setData({
                feed: that.data.oldFeed,
            })
        }

        // wx.request({
        //     url: 'https://jing855.cn/api/public/act/findbytype?type=' + type,
        //     method: 'GET',
        //     // header: {
        //     //     "Authorization": "Bearer " + app.globalData.jwt,
        //     // },
        //     success: function(res) {
        //         console.log(res);
        //         let feed_data = res.data.acts;
        //         that.setData({
        //             feed: feed_data,
        //             // feed_length: feed_data.length
        //         });
        //     }
        // })
        if (app.globalData.userInfo !== null) {
            wx.request({
                url: 'https://jing855.cn/api/user/act/addbehavior',
                method: 'POST',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                data: {
                    "type": type,
                    "behavior": "search"
                },
                success: function(res) {
                    console.log(res);
                }
            })
        }
    },
    handleSearch: function() {
        let that = this;
        wx.request({
            url: 'https://jing855.cn/api/public/act/search?key=' + that.data.input,
            method: 'GET',
            success: function(res) {
                that.setData({
                    feed: res.data.acts,
                    oldFeed: res.data.acts,
                    input: ''
                    // oldFed: res.data
                })
            }
        })
    }

})