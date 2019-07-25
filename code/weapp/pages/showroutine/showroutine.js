// pages/showroutine/showroutine.js
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');

// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: 'QBLBZ-MR7WF-CP7JH-JH64F-YTGST-RQB6J' // 必填
});
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imagesrc: '',
        origin: '',
        dest: '',
        latitude: 0,
        longitude: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            origin: options.ori,
            dest: options.dest,
            longitude: options.longitude,
            latitude: options.latitude
        })
        this.formSubmit(1);
        var mks = []
        mks.push({ // 获取返回结果，放到mks数组中
            title: "起点",
            latitude: parseFloat((options.ori.split(','))[0]),
            longitude: parseFloat((options.ori.split(','))[1]),
            iconPath: "../../images/icons/origin.png", //图标路径
            width: 40,
            height: 40
        })
        mks.push({ // 获取返回结果，放到mks数组中
            title: "终点",
            latitude: parseFloat((options.dest.split(','))[0]),
            longitude: parseFloat((options.dest.split(','))[1]),
            iconPath: "../../images/icons/dest.png", //图标路径
            width: 40,
            height: 40
        })
        this.setData({
            markers: mks
        })
    },

    formSubmit(e) {
        var _this = this;
        // this.setData({
        //     startLocation: e.detail.value.start,
        //     destLocation: e.detail.value.dest
        // })
        //调用距离计算接口
        qqmapsdk.direction({
            mode: 'driving', //可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
            //from参数不填默认当前地址
            from: this.data.origin,
            to: this.data.dest,
            success: function(res) {
                console.log(res);
                var ret = res;
                _this.setData({
                    fee: ret.result.routes[0].taxi_fare.fare,
                })
                var coors = ret.result.routes[0].polyline,
                    pl = [];
                //坐标解压（返回的点串坐标，通过前向差分进行压缩）
                var kr = 1000000;
                for (var i = 2; i < coors.length; i++) {
                    coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
                }
                //将解压后的坐标放入点串数组pl中
                for (var i = 0; i < coors.length; i += 2) {
                    pl.push({
                        latitude: coors[i],
                        longitude: coors[i + 1]
                    })
                }
                console.log(pl)
                //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
                _this.setData({
                    polyline: [{
                        points: pl,
                        color: '#0092ff',
                        width: 7
                    }]
                })
            },
            fail: function(error) {
                console.error(error);
            },
            complete: function(res) {
                console.log(res);
            }
        });
    },
    getImage: function() {
        let points = this.data.polyline[0].points;
        let src = "https://apis.map.qq.com/ws/staticmap/v2/?";
        src += "zoom=11&size=600*600&maptype=roadmap";
        src += "&key=QBLBZ-MR7WF-CP7JH-JH64F-YTGST-RQB6J";
        src += "&markers=size:large|color:0xFFCCFF|label:起|" + points[0].latitude + "," + points[0].longitude;
        src += "&markers=size:large|color:0xFFCCFF|label:终|" + points[points.length - 1].latitude + "," + points[points.length - 1].longitude;
        src += "&center=" + (points[0].latitude + points[points.length - 1].latitude) / 2 + "," + (points[0].longitude + points[points.length - 1].longitude) / 2;
        let path = "&path=color:0xff000000|weight:3"
        for (let i = 0; i < points.length; i += 2) {
            path += "|" + points[i].latitude + "," + points[i].longitude;
        }
        src += path;
        console.log(src);
        this.setData({
            imagesrc: src
        })
    }
})