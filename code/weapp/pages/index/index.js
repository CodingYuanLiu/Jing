//discovery.js
const {
    $Toast
} = require('../../dist/base/index');
let app = getApp()
Page({
    data: {
        navTab: ["全部", "推荐", "关注"],
        currentNavtab: "0",
        indicatorDots: false,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        feed: null,
        feed_length: 0,
        typemap: {},
        size: 5,
        index: 0,
        myacts: [],
        log: false,
        status_show: ["","[人满]","[已过期]"]
    },
    onLoad: function() {
        console.log('onLoad')
        var that = this
        //调用应用实例的方法获取全局数据
        this.refresh();
    },
    onShow: function() {
        if (app.globalData.userInfo === null) {
            this.setData({
                feed_sugg: [],
                myacts: [],
                log: false
            })
        } else {
            this.setData({
                log: true
            })
        }
    },
    switchTab: function(e) {
        this.setData({
            currentNavtab: e.currentTarget.dataset.idx
        });

        wx.showNavigationBarLoading()
        this.refresh();
        console.log("upper");
        setTimeout(function() {
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
                feed_data = res.data.acts;
                that.setData({
                    feed: feed_data,
                    feed_length: feed_data.length,
                    index: that.data.index + 1
                });

            }
        })
        if (app.globalData.userInfo !== null) {
            that.setData({
                log: true
            })
            wx.request({
                url: 'https://jing855.cn/api/user/act/recommendact',
                method: 'GET',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt
                },
                success: function(res) {
                    console.log(res);
                    feed_data = res.data.acts;
                    if (feed_data !== null)
                        that.setData({
                            feed_sugg: feed_data,
                        });

                }
            })
            that.setData({
                myacts: []
            })
            let following = app.globalData.following;
            for (let i =0; i < following.length; i++) {
                wx.request({
                    url: 'https://jing855.cn/api/public/act/findbyuser?id='+following[i].id,
                    method: 'GET',
                    // header: {
                    //     "Authorization": "Bearer " + app.globalData.jwt,
                    // }
                    success: function(res) {
                        if (res.data !== null)
                            that.setData({
                                myacts: that.data.myacts.concat(res.data.acts)
                            })
                    }
                })
            }
            // wx.request({
            //     url: 'https://jing855.cn/api/user/act/myact',
            //     method: 'GET',
            //     header: {
            //         "Authorization": "Bearer " + app.globalData.jwt,
            //     },
            //     success: function(res) {
            //         console.log(res);
            //         if (feed_data !== null)
            //             that.setData({
            //                 myacts: that.data.myacts.concat(res.data)
            //             })
            //     }
            // })
            // wx.request({
            //     url: 'https://jing855.cn/api/user/act/manageact',
            //     method: 'GET',
            //     header: {
            //         "Authorization": "Bearer " + app.globalData.jwt,
            //     },
            //     success: function(res) {
            //         console.log(res);
            //         that.setData({
            //             myacts: that.data.myacts.concat(res.data)
            //         })
            //     }
            // })
        }
    },

    nextLoad: function() {
        if (this.data.currentNavtab !== "0" && this.data.currentNavtab !== 0) return;
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
                    next_data = res.data.acts;
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