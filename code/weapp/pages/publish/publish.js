//logs.js
let app = getApp();
Page({
    data: {
        loged: true,
        navTab: ["通知", "赞与感谢", "关注"],
        currentNavtab: "0",
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
                    "name": "网购",
                    "icon": "../../images/icons/order.png"
                },
                {
                    "idx": 3,
                    "name": "其他",
                    "icon": "../../images/icons/movie.png"
                }
            ]
        }],
        // category: [{
        //     "idx": 0,
        //     "r": [{
        //         "idx": 0,
        //         "name": "外卖",
        //         "icon": "../../images/icons/takeout.png"
        //     },
        //     {
        //         "idx": 1,
        //         "name": "打车",
        //         "icon": "../../images/icons/taxi.png"
        //     },
        //     {
        //         "idx": 2,
        //         "name": "网购",
        //         "icon": "../../images/icons/games.png"
        //     },
        //     {
        //         "idx": 3,
        //         "name": "其他",
        //         "icon": "../../images/icons/movie.png"
        //     }
        //     ]
        // }, {
        //     "idx": 1,
        //     "r": [{
        //         "idx": 4,
        //         "name": "网购",
        //         "icon": "../../images/icons/movie.png"
        //     }, {
        //         "idx": 5,
        //         "name": "会员",
        //         "icon": "../../images/icons/movie.png"
        //     }, {
        //         "idx": 6,
        //         "name": "会员",
        //         "icon": "../../images/icons/movie.png"
        //     }, {
        //         "idx": 7,
        //         "name": "会员",
        //         "icon": "../../images/icons/movie.png"
        //     }]
        // }],
    },
    onLoad: function() {
        let that = this;
        if (app.globalData.userInfo === null) {
            that.setData({
                loged: false
            })
        } else {
            that.setData({
                loged: true
            })
        }
    },
    onShow: function() {
        this.onLoad();
    },
    switchTab: function(e) {
        this.setData({
            currentNavtab: e.currentTarget.dataset.idx
        });
    },
    handleClick: function(e) {
        let idx = e.currentTarget.dataset.idx;
        if (idx === 0)
            wx.navigateTo({
                url: '/pages/newact/newact?mode=takeout',
            })
        else
        if (idx === 1)
            wx.navigateTo({
                url: '/pages/newact/newact?mode=taxi',
            })
        else
        if (idx === 2)
            wx.navigateTo({
                url: '/pages/newact/newact?mode=order',
            })
        else
        if (idx === 3)
            wx.navigateTo({
                url: '/pages/newact/newact?mode=other',
            })

    }
})