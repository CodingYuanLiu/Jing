// pages/userinfo/userinfo.js
var app = getApp()
// const { $Message } = require('../../dist/base/index');
const {
    $Toast
} = require('../../dist/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatar_src: "../../images/icons/timg.jpg",
        user: {},
        gendershow: '女',
        genders: [{
            id: 1,
            name: '女',
        }, {
            id: 2,
            name: '男'
        }, {
            id: 3,
            name: '保密'
        }],
        levelshow: '全部展示',
        levels: [{
            id: 1,
            name: '不可见',
        }, {
            id: 2,
            name: '全部可见'
        }, {
            id: 3,
            name: '好友可见'
        }],
        visible: false,
        error: false,
        button_message: "编辑个人信息",
        editing: false,
        userInfo: {},
        dorm: '',
        major: '',
        gender: 0,
        birthday: '',
        actions: [{
            name: '修改头像',
        }, ],
        images: [],
        base: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function() {
        console.log('onLoad')
        var that = this
        wx.request({
            url: 'https://jing855.cn/api/user/status',
            method: 'GET',
            header: {
                "Authorization": "Bearer " + app.globalData.jwt,
            },
            success: function(res) {
                app.globalData.userid = res.data.id;
                console.log(res);
                console.log(221);
                app.globalData.userInfo = res.data;
                if (app.globalData.userInfo.avatar_url !== "http://image.jing855.cn/") {
                    that.setData({
                        avatar_src: app.globalData.userInfo.avatar_url
                    })
                }
                that.setData({
                    user: app.globalData.userInfo
                });
                that.setData({
                    // phone: that.data.user.phone,
                    // nickname: that.data.user.nickname,
                    gendershow: that.data.genders[that.data.user.gender].name,
                    levelshow: that.data.levels[that.data.user.privacy + 1].name,
                    birthday: that.data.user.birthday,
                    level: that.data.user.privacy + 1
                });
            }
        })
        
       
    },

    handleGenderChange({
        detail = {}
    }) {
        this.setData({
            gendershow: detail.value
        });
        console.log(detail)
        for (let i = 0; i < this.data.genders.length; i++) {
            if (this.data.genders[i].name === detail.value) {
                this.setData({
                    gender: i
                })
                break;
            }
        }
    },

    handleLevelChange({
        detail = {}
    }) {
        this.setData({
            levelshow: detail.value
        });
        console.log(detail)
        for (let i = 0; i < this.data.levels.length; i++) {
            if (this.data.levels[i].name === detail.value) {
                this.setData({
                    level: i
                })
                break;
            }
        }
    },

    handleClick: function() {
        let that = this;
        if (!this.data.editing) {
            this.setData({
                editing: true,
                button_message: "保存"
            });
        } else {
            this.setData({
                editing: false,
                button_message: "编辑个人信息"
            });
            // console.log(that.data);
            wx.request({
                url: 'https://jing855.cn/api/user/info/update',
                method: 'PUT',
                header: {
                    "Authorization": "Bearer " + app.globalData.jwt,
                },
                data: {
                    'phone': that.data.phone,
                    'nickname': that.data.nickname,
                    "signature": that.data.signature,
                    'dormitory': that.data.dorm,
                    'major': that.data.major,
                    'birthday': that.data.birthday,
                    'gender': that.data.gender,
                    'privacy_level': that.data.level - 1
                },
                success: function(res) {
                    if (res.statusCode !== 200) {
                        console.log("error");
                        // todo: 错误提示
                    } else {
                        // app.globalData.userInfo.phone = that.data.phone;
                        // app.globalData.userInfo.nickname = that.data.nickname;
                        // app.globalData.userInfo.signature = that.data.signature;
                        wx.switchTab({
                            url: '/pages/my/my',
                        })
                    }
                }
            })
        }

        // console.log(this.data.editing);
    },

    handlePhoneInput: function(event) {
        console.log(1);
        this.setData({
            phone: event.detail.detail.value
        });
        console.log(this.data);
    },
    handleNickInput: function(event) {
        this.setData({
            nickname: event.detail.detail.value
        })
    },
    handleSignInput: function(event) {
        this.setData({
            signature: event.detail.detail.value
        })
    },
    handleBirthInput: function(event) {
        this.setData({
            birthday: event.detail.detail.value
        })
    },
    handleDormInput: function(event) {
        this.setData({
            dorm: event.detail.detail.value
        })
    },
    handleMajorInput: function(event) {
        this.setData({
            major: event.detail.detail.value
        })
    },
    handleChangeAvatar: function() {
        this.setData({
            visible: true
        });
    },
    handleCancel() {
        this.setData({
            visible: false
        });
    },
    handleClickItem1() {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
                const src = res.tempFilePaths[0]
                wx.redirectTo({
                    url: `../avatar/upload?src=${src}`
                })
            }
        })
        // wx.navigateTo({
        //     url: '/pages/imagecut/index/index',
        // })
    },
    handleClickItem({
        detail
    }) {
        const index = detail.index + 1;
        let that = this;

        console.log('点击了选项' + index)
        wx.chooseImage({
            sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
            sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
            success: res => {
                console.log(res);
                // const images = this.data.images.concat(res.tempFilePaths);
                const base64 = this.data.base.concat(wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64"));
                // 限制最多只能留下1张照片
                // this.data.images = images.length <= 3 ? images : images.slice(0, 3)
                console.log(that.data);
                wx.request({
                    url: 'https://jing855.cn/api/user/avatar/upload',
                    method: 'POST',
                    header: {
                        "Authorization": "Bearer " + app.globalData.jwt,
                        'Content-type': 'text/plain'
                    },
                    data: base64[0],
                    success: function(res) {
                        console.log(res)
                        console.log(10088);
                        console.log(base64[0])
                        that.setData({
                            visible: false
                        });
                        $Toast({
                            content: '成功',
                            type: 'success'
                        });
                    }
                })
            }
        })

    },
    bindDateChange: function(event) {
        this.setData({
            birthday: event.detail.value
        })
    },

})