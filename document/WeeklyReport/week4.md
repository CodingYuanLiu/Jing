# Week 4
## 荆家振
* 小程序加功能：地图地点选择、路线预测和展示、关注、活动状态展示
* 修改qiniu api并使其运行于kubernetes，从而修复删除图片bug
* 修改jenkins和tags.go从而使得tag推荐成功运行于kubernetes
* 性能测试
## 柳清源
* 完成记录用户行为功能
* 完成根据用户行为生成用户画像的功能
* 完成使用协同过滤算法提供推荐活动的功能
* 完成活动状态的管理功能，添加活动过期的状态。
* 完成对活动人数管理的设置。
## 戴方越
* 添加用户隐私管理的功能
* 优化了错误处理的功能
* 使用xmpp完成了群聊功能
## 赵胜龙
### 本周实现的功能
* 聊天xmpp初步建立，实现了客户端和服务端的直连，可以进行实时通讯
* 发布界面、活动界面完善、优化，支持了图片上传、删除等
* 重构了Redux　API，使用异步中间件，Redux-thunk，更好的将异步API和view分离，使得可维护行更高
### 本周碰到的问题:
* 界面实现缓慢，过于注重细节，而导致界面不够完善，下一步先将细节的权重降低，考虑应用后端的API，实现界面原型的基础上优化界面
* xmpp协议内容过多，很难几天时间就作出xmpp的的成品，需要一步一步的尝试