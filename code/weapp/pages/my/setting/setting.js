// pages/my/setting/setting.js
const { $Message } = require('../../../dist/base/index');
Page({


    /**
     * 页面的初始数据
     */
    data: {
        visible: false,
        actions: [{
                name: '取消'
            },
            {
                name: '删除',
                color: '#ed3f14',
                loading: false
            }
        ]
    },

    handleConfirm: function() {
        this.setData({
            visible: true
        })
    },

    handleClick({
        detail
    }) {
        if (detail.index === 0) {
            this.setData({
                visible: false
            });
        } else {
            const action = [...this.data.actions];
            action[1].loading = true;
            this.handleClear()
            this.setData({
                actions: action
            });

            setTimeout(() => {
                action[1].loading = false;
                this.setData({
                    visible: false,
                    actions: action
                });
                $Message({
                    content: '删除成功！',
                    type: 'success'
                });
            }, 2000);
        }
    },

    handleClear: function() {
        wx.setStorage({
            key: 'history',
            data: [],
            success: function(res) {
                console.log(res)
            }
        })
    }
})