// pages/my/editact/editact.js
let app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        newTag: '',
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
        tags: [],
        actions: [{
            name: '确定',
            color: '#ed3f14'
        }],
        visible: false,
        destLocation: {},
        originLocation: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // $init(this)
        let that = this;
        this.setData({
            mode: options.mode,
            act_id: options.id
        })
        wx.request({
            url: 'https://jing855.cn/api/public/act/query?act_id=' + that.data.act_id,
            method: 'GET',
            success: function(res) {
                console.log(res);
                let d = res.data
                that.setData({
                    content: d
                });
                if (d.tag !== undefined && d.tag !== null) {
                    let tag = d.tag;
                    let tag_show = [];
                    for (let i = 0; i < tag.length; i++) {
                        tag_show.push({
                            name: tag[i],
                            checked: false,
                            color: 'blue'
                        })
                    }
                    that.setData({
                        tags: tag_show
                    })
                }
                if (d.images !== null && d.images !== undefined) {
                    let base = []
                    for (let i = 0; i < d.images.length; i++) {
                        wx.request({
                            url: d.images[i],
                            method: 'GET',
                            responseType: 'arraybuffer',
                            success: function(res) {
                                base = base.concat(wx.arrayBufferToBase64(res.data))
                                that.setData({
                                    base: base
                                })
                            }
                        })
                    }

                }

                let type = d.type
                //taxi
                if (type === 'taxi')
                    that.setData({
                        title: d.title,
                        end_time: d.end_time,
                        end_time_t: '',
                        depart_time: d.depart_time,
                        depart_time_t: '',
                        origin: d.origin.title,
                        dest: d.destination.title,
                        originLocation: d.origin,
                        destLocation: d.destination,
                        details: d.description,
                        images: d.images,
                        mode: d.type,
                    })

                //order
                if (type === 'order')
                    that.setData({
                        title: d.title,
                        end_time: d.end_time,
                        end_time_t: '',
                        store: d.store,
                        details: d.description,
                        images: d.images,
                        mode: d.type,
                    })

                //takeout
                if (type === 'takeout')
                    that.setData({
                        title: d.title,
                        end_time: d.end_time,
                        end_time_t: '',
                        order_time: d.order_time,
                        order_time_t: '',
                        store: d.store,
                        details: d.description,
                        images: d.images,
                        mode: d.type,
                    })

                //other 
                if (type === 'other')
                    that.setData({
                        title: d.title,
                        end_time: d.end_time,
                        end_time_t: '',
                        activity_time: d.activity_time,
                        activity_time_t: '',
                        details: d.description,
                        images: d.images,
                        mode: d.type,
                    })
            }

        });
    },

    // submit click
    handleClick: function(event) {
        let that = this;
        let date = new Date();
        let mode = that.data.mode;
        let dateString = date.toDateString();
        let tag_str = []
        // if (title === '' || end_time === '' || end_time_t === '' || depart_time === '' || depart_time_t == '') return;
        for (let i = 0; i < that.data.tags.length; i++) {
            tag_str.push(that.data.tags[i].name);
        }
        if (mode === 'taxi') {
            wx.request({
                url: 'https://jing855.cn/api/user/act/modify',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                method: 'POST',
                data: {
                    "act_id": parseInt(that.data.act_id),
                    "type": "taxi",
                    "create_time": dateString,
                    "end_time": that.data.end_time + " " + that.data.end_time_t,
                    "description": that.data.details,
                    "origin": that.data.originLocation,
                    "destination": that.data.destLocation,
                    "depart_time": that.data.depart_time + " " + that.data.depart_time_t,
                    "tag": tag_str,
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
                url: 'https://jing855.cn/api/user/act/modify',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                method: 'POST',
                data: {
                    "act_id": parseInt(that.data.act_id),
                    "type": takeout,
                    "create_time": dateString,
                    "end_time": that.data.end_time + " " + that.data.end_time_t,
                    "description": that.data.details,
                    "store": that.data.store,
                    "order_time": that.data.order_time + " " + that.data.order_time_t,
                    "tag": tag_str,
                    // "images": that.data.images,
                    "images": that.data.base,

                },
                success: function(res) {
                    console.log("naviback")
                    console.log(res)
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                }
            })
        } else if (mode === 'order') {
            wx.request({
                url: 'https://jing855.cn/api/user/act/modify',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                method: 'POST',
                data: {
                    "act_id": parseInt(that.data.act_id),
                    "type": "order",
                    "create_time": dateString,
                    "end_time": that.data.end_time + " " + that.data.end_time_t,
                    "description": that.data.details,
                    "store": that.data.store,
                    "tag": tag_str,
                    // "images": that.data.images,
                    "images": that.data.base,

                },
                success: function(res) {
                    console.log("naviback")
                    console.log(res)
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                }
            })
        } else if (mode === 'other') {
            wx.request({
                url: 'https://jing855.cn/api/user/act/modify',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                method: 'POST',
                data: {
                    "act_id": parseInt(that.data.act_id),
                    "type": "other",
                    "create_time": dateString,
                    "end_time": that.data.end_time + " " + that.data.end_time_t,
                    "description": that.data.details,
                    "activity_time": that.data.activity_time + " " + that.data.activity_time_t,

                    "tag": tag_str,
                    // "images": that.data.images,
                    "images": that.data.base,

                },
                success: function(res) {
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
        let that = this;
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

    //description
    bindTextAreaBlur: function(event) {
        let that = this;
        this.setData({
            details: event.detail.value
        });
        // if (that.data.title !== '') {
        //     wx.request({
        //         url: 'https://jing855.cn/api/user/act/gettag',
        //         method: 'POST',
        //         header: {
        //             "Authorization": "Bearer " + app.globalData.jwt,
        //         },
        //         data: {
        //             "title": that.data.title,
        //             "description": that.data.details
        //         },
        //         success: function (res) {

        //             let tags = res.data.tags;
        //             if (tags === undefined || tags.length === 0) return
        //             let tag_show = []
        //             for (let i = 0; i < tags.length; i++) {
        //                 tag_show.push({
        //                     name: tags[i],
        //                     checked: false,
        //                     color: 'blue'
        //                 })
        //             }
        //             that.setData({
        //                 tags: tag_show
        //             })
        //         }
        //     })
        // }
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
    handleToMap: function(event) {
        wx.navigateTo({
            url: '/pages/map/map',
        })
    },
    handleOriginClick: function() {
        wx.navigateTo({
            url: '/pages/map/map?mode=origin',
        })
    },
    handleDestClick: function() {
        wx.navigateTo({
            url: '/pages/map/map?mode=dest',
        })
    },
    onChange(event) {
        const detail = event.detail;
        this.setData({
            ['tags[' + event.detail.name + '].checked']: detail.checked
        })

    },
    addTag(event) {
        console.log("addtag")
        this.setData({
            visible: true
        });
    },
    handleTagInput(event) {
        this.setData({
            newTag: event.detail.detail.value
        });
    },
    handleModalClick() {
        let that = this
        setTimeout(() => {
            console.log(that.data.newTag)
            wx.request({
                url: 'https://jing855.cn/api/user/act/addtag',
                method: 'POST',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                data: {
                    "tags": [that.data.newTag]
                },
                success: function(res) {
                    console.log(res);
                    that.setData({
                        tags: that.data.tags.concat({
                            name: that.data.newTag,
                            checked: false,
                            color: 'blue'
                        })
                    })
                }
            })
            this.setData({
                visible: false,
            });
        }, 200);
    },
    handleStoreSelect: function() {
        wx.navigateTo({
            url: '/pages/selectstore/selectstore',
        })
    }
})