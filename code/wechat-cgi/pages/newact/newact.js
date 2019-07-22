// pages/newact/newact.js
let app = getApp();
// import {
//     $init,
//     $digest
// } from '../../utils/util.js'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '',
        end_time: '',
        end_time_t: '',
        depart_time: '',
        depart_time_t: '',
        order_time: '',
        order_time_t: '',
        activity_time: '',
        activity_time_t: '',
        origin: '',
        dest: '',
        store: '',
        details: '',
        images: [],
        base: [],
        mode: 'taxi',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // $init(this)
        this.setData({
            mode: options.mode
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    handleClick: function(event) {
        let that = this;
        let date = new Date();
        let mode = that.data.mode;
        let dateString = date.toDateString();
        // if (title === '' || end_time === '' || end_time_t === '' || depart_time === '' || depart_time_t == '') return;
        if (mode === 'taxo') {
            wx.request({
                url: 'https://jing855.cn/api/user/act/publish',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                method: 'POST',
                data: {
                    "title": that.data.title,
                    "type": "taxi",
                    "create_time": dateString,
                    "end_time": that.data.end_time + " " + that.data.end_time_t,
                    "description": that.data.details,
                    "origin": that.data.origin,
                    "destination": that.data.dest,
                    "depart_time": that.data.depart_time + " " + that.data.depart_time_t,
                    "tag": ["default"],
                    "images": that.data.base,
                },
                success: function() {
                    console.log("naviback")
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                }
            })
        } else if (mode === 'takeout') {
            wx.request({
                url: 'https://jing855.cn/api/user/act/publish',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                method: 'POST',
                data: {
                    "title": that.data.title,
                    "type": "takeout",
                    "create_time": dateString,
                    "end_time": that.data.end_time + " " + that.data.end_time_t,
                    "description": that.data.details,
                    "store": that.data.store,
                    "order_time": that.data.order_time + " " + that.data.order_time_t,
                    "tag": ["default"],
                    "images": that.data.base,
                },
                success: function (res) {
                    console.log("naviback")
                    console.log(res)
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                }
            })
        } else if (mode === 'order') {
            wx.request({
                url: 'https://jing855.cn/api/user/act/publish',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                method: 'POST',
                data: {
                    "title": that.data.title,
                    "type": "order",
                    "create_time": dateString,
                    "end_time": that.data.end_time + " " + that.data.end_time_t,
                    "description": that.data.details,
                    "store": that.data.store,
                    "tag": ["default"],
                    "images": that.data.base,
                },
                success: function (res) {
                    console.log("naviback")
                    console.log(res)
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                }
            })
        } else if (mode === 'other') {
            wx.request({
                url: 'https://jing855.cn/api/user/act/publish',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                method: 'POST',
                data: {
                    "title": that.data.title,
                    "type": "other",
                    "create_time": dateString,
                    "end_time": that.data.end_time + " " + that.data.end_time_t,
                    "description": that.data.details,
                    "activity_time": that.data.activity_time + " " + that.data.activity_time_t,

                    "tag": ["default"],
                    "images": that.data.base,
                },
                success: function (res) {
                    console.log("naviback")
                    console.log(res)
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                }
            })
        }
    },
    chooseImage(e) {
        let that =this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
            sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
            success: res => {
                console.log(res);
                const images = this.data.images.concat(res.tempFilePaths);
                const base64 = this.data.base.concat(wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64"));
                // 限制最多只能留下3张照片
                // this.data.images = images.length <= 3 ? images : images.slice(0, 3)
                this.setData({
                    images: images.length <= 3 ? images : images.slice(0, 3)
                })
                this.setData({
                    base: base64.length <= 3 ? base64 : base64.slice(0, 3)
                })
                console.log(that.data);
            }
        })
    },
    removeImage(e) {
        const idx = e.target.dataset.idx
        let that = this;
        this.setData({
            images: that.data.images.slice(idx, 1),
            base: that.data.base.slice(idx, 1)
        })
    },

    handleImagePreview(e) {
        const idx = e.target.dataset.idx
        const images = this.data.images
        wx.previewImage({
            current: images[idx], //当前预览的图片
            urls: images, //所有要预览的图片
        })
    },
    handleTitleInput: function(event) {
        this.setData({
            title: event.detail.detail.value
        });
    },
    handleStoreInput: function(event) {
        this.setData({
            store: event.detail.detail.value
        });
    },
    // handleEndTimeInput: function(event) {
    //     this.setData({
    //         end_time: event.detail.detail.value
    //     });
    // },
    // handleDepartTimeInput: function(event) {
    //     this.setData({
    //         depart_time: event.detail.detail.value
    //     });
    // },



    //description
    bindTextAreaBlur: function(event) {
        this.setData({
            details: event.detail.value
        });
    },

    //end time
    bindEDateChange: function(event) {
        this.setData({
            end_time: event.detail.value
        })
    },
    bindETimeChange: function(event) {
        this.setData({
            end_time_t: event.detail.value
        })
    },

    //taxi
    bindSDateChange: function(event) {
        this.setData({
            depart_time: event.detail.value
        })
    },
    bindSTimeChange: function(event) {
        this.setData({
            depart_time_t: event.detail.value
        })
    },
    handleOriginInput: function(event) {
        this.setData({
            origin: event.detail.detail.value
        });
    },
    handleDestInput: function(event) {
        this.setData({
            dest: event.detail.detail.value
        });
    },

    //takeout
    bindODateChange: function(event) {
        this.setData({
            order_time: event.detail.value
        })
    },
    bindOTimeChange: function(event) {
        this.setData({
            order_time_t: event.detail.value
        })
    },

    //other
    bindADateChange: function(event) {
        this.setData({
            activity_time: event.detail.value
        })
    },
    bindATimeChange: function(event) {
        this.setData({
            activity_time_t: event.detail.value
        })
    },

})