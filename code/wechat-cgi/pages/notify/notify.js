//logs.js
var util = require('../../utils/util.js')
// Page({
//  data: {
//    logs: []
//  },
//  onLoad: function () {
//    this.setData({
//      logs: (wx.getStorageSync('logs') || []).map(function (log) {
//        return util.formatTime(new Date(log))
//      })
//    })
//  }
// })

Page({
    data: {
        focus: false,
        inputValue: '',
        navTab: ["通知", "私信", "群聊"],
        currentNavtab: "0",
        notify: {
            unread: 0,
            length: 2,
            content: [{
                avatar: "../../images/icon1.jpeg",
                nickname: "Rabecca",
                title: "发送了加入活动请求",
                content: "保证不鸽！ 求通过！",
            }, {
                avatar: "../../images/icon9.jpeg",
                nickname: "Coccc",
                title: "发送了加入活动请求",
                content: "不鸽！给通过！快点！",
            }]
        },
        message: {
            unread: 0,
            length: 2,
            content: [
                {
                    avatar: "../../images/icon8.jpg",
                    nickname: "Alex",
                    lasttime: "1 月前",
                    lasttext: "你好呀！",
                },
                {
                    avatar: "../../images/icon9.jpeg",
                    nickname: "Nicks",
                    lasttime: "2 天前",
                    lasttext: "在吗！",
                }
            ]
        },  
        groupchat: {
            unread: 0,
            length: 4,
            content: [
                {
                    avatar: "../../images/icon1.jpeg",
                    title: "肯德基拼单",
                    lasttime: "1 月前",
                    lasttext: "你好呀！",
                    last_nick: "Rebecca"
                },
                {
                    avatar: "../../images/icon9.jpeg",
                    title: "7月7日去机场",
                    lasttime: "2 天前",
                    lasttext: "我觉得可以",
                    last_nick: "Nicks"
                },
                {
                    avatar: "../../images/icon8.jpg",
                    title: "周日约球",
                    lasttime: "1 月前",
                    lasttext: "你好呀！",
                    last_nick: "Jeck"

                },
                {
                    avatar: "../../images/icon9.jpeg",
                    title: "拼单Nike 500 减 200",
                    lasttime: "2 天前",
                    lasttext: "我觉得这个不错",
                    last_nick: "Bob"

                }
            ]
        }
    },
    bindButtonTap: function() {
        this.setData({
            focus: Date.now()
        })
    },
    bindKeyInput: function(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    bindReplaceInput: function(e) {
        var value = e.detail.value
        var pos = e.detail.cursor
        if (pos != -1) {
            //光标在中间
            var left = e.detail.value.slice(0, pos)
            //计算光标的位置
            pos = left.replace(/11/g, '2').length
        }

        //直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
        return {
            value: value.replace(/11/g, '2'),
            cursor: pos
        }

        //或者直接返回字符串,光标在最后边
        //return value.replace(/11/g,'2'),
    },
    bindHideKeyboard: function(e) {
        if (e.detail.value === '123') {
            //收起键盘
            wx.hideKeyboard()
        }
    },
    switchTab: function(e) {
        this.setData({
            currentNavtab: e.currentTarget.dataset.idx
        });
    }
})