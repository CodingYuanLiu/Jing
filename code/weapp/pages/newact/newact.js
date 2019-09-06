// pages/newact/newact.js
let app = getApp();
const {
    $Toast
} = require('../../dist/base/index');
import WxValidate from '../../utils/WxValidate.js'

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
        this.setData({
            mode: options.mode
        })
        this.initValidate()
    },
    initValidate() {
        const rules = {
            name: {
                required: true,
                minlength: 2
            },
            phone: {
                required: true,
                tel: true
            }
        }
        const messages = {
            name: {
                required: '请填写姓名',
                minlength: '请输入正确的名称'
            },
            phone: {
                required: '请填写手机号',
                tel: '请填写正确的手机号'
            }
        }
        this.WxValidate = new WxValidate(rules, messages)
    }, 
    //调用验证函数 
    formSubmit: function(e) {
        console.log('form发生了submit事件，携带的数据为：', e.detail.value)
        const params = e.detail.value //校验表单    
        if (!this.WxValidate.checkForm(params)) {
            const error = this.WxValidate.errorList[0]
            this.showModal(error)
            return false
        }
        this.showModal({
            msg: '提交成功'
        })
    },

    // submit click
    handleClick1: function(event) {
        setTimeout(this.handleClick1(event), 300);
    },
    handleClick: function(event) {
        console.log(event)
        let that = this;
        let date = new Date();
        let mode = that.data.mode;
        let dateString = date.toDateString();
        let tag_str = []
        // if (title === '' || end_time === '' || end_time_t === '' || depart_time === '' || depart_time_t == '') return;
        for (let i = 0; i < that.data.tags.length; i++) {
            tag_str.push(that.data.tags[i].name);
        }

        if (parseInt(that.data.max_member) < 2) {
            $Toast({
                content: '至少2人活动才可发布',
                type: 'error'
            });
            return;
        }

        if (mode === 'taxi') {
            let end = new Date(that.data.end_time + " " + that.data.end_time_t);
            let depart = new Date(that.data.depart_time + " " + that.data.depart_time_t);
            let now = new Date();
            if (end <= now || depart <= now) {
                $Toast({
                    content: '截止时间或出发时间不正确',
                    type: 'error'
                });
                return;
            }
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
                    "end_time": (that.data.end_time + " " + that.data.end_time_t).substr(0, 16) + ":00",
                    "description": that.data.details,
                    "origin": that.data.originLocation,
                    "destination": that.data.destLocation,
                    "depart_time": that.data.depart_time + " " + that.data.depart_time_t,
                    "tag": tag_str,
                    "images": that.data.base,
                    "max_member": parseInt(that.data.max_member)
                },
                success: function() {
                    console.log("naviback")
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                }
            })
            wx.request({
                url: 'https://jing855.cn/api/user/act/addbehavior',
                method: 'POST',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                data: {
                    "type": "taxi",
                    "behavior": "publish"
                },
                success: function(res) {
                    console.log(res);
                }
            })
        } else if (mode === 'takeout') {
            let end = new Date(that.data.end_time + " " + that.data.end_time_t);
            let order = new Date(that.data.order_time + " " + that.data.order_time_t);
            let now = new Date();
            if (end <= now || order <= now) {
                $Toast({
                    content: '截止时间或下单时间不正确',
                    type: 'error'
                });
                return;
            }
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
                    "end_time": (that.data.end_time + " " + that.data.end_time_t).substr(0, 16) + ":00",
                    "description": that.data.details,
                    "store": that.data.store,
                    "order_time": that.data.order_time + " " + that.data.order_time_t,
                    "tag": tag_str,
                    "images": that.data.base,
                    "max_member": parseInt(that.data.max_member)
                },
                success: function(res) {
                    console.log("naviback")
                    console.log(res)
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                }
            })
            wx.request({
                url: 'https://jing855.cn/api/user/act/addbehavior',
                method: 'POST',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                data: {
                    "type": "takeout",
                    "behavior": "publish"
                },
                success: function(res) {
                    console.log(res);
                }
            })
        } else if (mode === 'order') {
            let end = new Date(that.data.end_time + " " + that.data.end_time_t);
            let now = new Date();
            if (end <= now) {
                $Toast({
                    content: '截止时间不正确',
                    type: 'error'
                });
                return;
            }
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
                    "end_time": (that.data.end_time + " " + that.data.end_time_t).substr(0, 16) + ":00",
                    "description": that.data.details,
                    "store": that.data.store,
                    "tag": tag_str,
                    "images": that.data.base,
                    "max_member": parseInt(that.data.max_member)
                },
                success: function(res) {
                    console.log("naviback")
                    console.log(res)
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                }
            })
            wx.request({
                url: 'https://jing855.cn/api/user/act/addbehavior',
                method: 'POST',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                data: {
                    "type": "order",
                    "behavior": "publish"
                },
                success: function(res) {
                    console.log(res);
                }
            })
        } else if (mode === 'other') {
            let end = new Date(that.data.end_time + " " + that.data.end_time_t);
            let act = new Date(that.data.activity_time + " " + that.data.activity_time_t);
            let now = new Date();
            if (end <= now || act <= now) {
                $Toast({
                    content: '截止时间或活动时间不正确',
                    type: 'error'
                });
                return;
            }
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
                    "end_time": (that.data.end_time + " " + that.data.end_time_t).substr(0, 16) + ":00",
                    "description": that.data.details,
                    "activity_time": that.data.activity_time + " " + that.data.activity_time_t,
                    "max_member": parseInt(that.data.max_member),
                    "tag": tag_str,
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
            wx.request({
                url: 'https://jing855.cn/api/user/act/addbehavior',
                method: 'POST',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                data: {
                    "type": "other",
                    "behavior": "publish"
                },
                success: function(res) {
                    console.log(res);
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
        if (that.data.title !== '') {
            wx.request({
                url: 'https://jing855.cn/api/user/act/gettag',
                method: 'POST',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                data: {
                    "title": that.data.title,
                    "description": that.data.details
                },
                success: function(res) {

                    let tags = res.data.tags;
                    if (tags === undefined || tags === null || tags.length === 0) return;
                    let tag_show = []
                    for (let i = 0; i < tags.length; i++) {
                        tag_show.push({
                            name: tags[i],
                            checked: false,
                            color: 'blue'
                        })
                    }
                    that.setData({
                        tags: tag_show
                    })
                }
            })
        }
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
            url: '/pages/selectStore/selectStore',
        })
    },
    handleMemberInput: function(event) {
        this.setData({
            max_member: event.detail.detail.value
        })
    }
})