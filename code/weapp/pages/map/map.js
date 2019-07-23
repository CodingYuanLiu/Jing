var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
// 实例化API核心类
Page({
    data: {
        latitude: 0,
        longitude: 0,
        backfill: '',
        markers: [],
        show_sug: false,
        lock: false
    },
    onLoad: function(options) {
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: 'QBLBZ-MR7WF-CP7JH-JH64F-YTGST-RQB6J'
        });
        let that = this;
        that.setData({
            mode: options.mode
        })
        wx.getLocation({
            type: 'gcj02',
            success: function(res) {
                // console.log(res);
                var latitude = res.latitude
                var longitude = res.longitude
                //弹框
                that.setData({
                    latitude: latitude,
                    longitude: longitude
                })
            }
        })
    },
    backfill: function(e) {
        var id = e.currentTarget.id;
        for (var i = 0; i < this.data.suggestion.length; i++) {
            if (i == id) {
                this.setData({
                    backfill: this.data.suggestion[i].title
                });
            }
        }
    },

    //触发关键词输入提示事件
    getsuggest: function(e) {
        var that = this;
        if (that.data.lock) {
            return
        } else {
            that.setData({
                lock: true
            });
            setTimeout(function() {
                that.setData({
                    lock: false
                });
            }, 500)
        }
        that.setData({
            show_sug: true
        });
        //调用关键词提示接口
        qqmapsdk.getSuggestion({
            //获取输入框值并设置keyword参数
            keyword: e.detail.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
            //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
            policy: 1,
            success: function(res) { //搜索成功后的回调
                console.log(res);
                var sug = [];
                for (var i = 0; i < res.data.length; i++) {
                    sug.push({ // 获取返回结果，放到sug数组中
                        title: res.data[i].title,
                        id: res.data[i].id,
                        addr: res.data[i].address,
                        city: res.data[i].city,
                        district: res.data[i].district,
                        latitude: res.data[i].location.lat,
                        longitude: res.data[i].location.lng
                    });
                }
                that.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
                    suggestion: sug
                });
            },
            fail: function(error) {
                console.error(error);
            },
            complete: function(res) {
                console.log(res);
            }
        });
    },
    handleClick: function(event) {
        console.log(event.currentTarget.dataset.poi);
        let poi = event.currentTarget.dataset.poi;
        this.setData({
            longitude: poi.longitude,
            latitude: poi.latitude
        })
        var mks = []
        mks.push({ // 获取返回结果，放到mks数组中
            title: poi.title,
            id: poi.id,
            latitude: poi.latitude,
            longitude: poi.longitude,
            iconPath: "../../images/icons/map-marker.png", //图标路径
            width: 40,
            height: 40
        })
        this.setData({
            markers: mks
        })
        this.setData({
            show_sug: false
        });
        this.backfill(event);
    },
    handleConfirm: function() {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];

        //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
        if (this.data.mode === 'origin') {
            prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
                origin: this.data.backfill
            })
        } else {
            prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
                dest: this.data.backfill
            })
        }
        wx.navigateBack({})
    }
})