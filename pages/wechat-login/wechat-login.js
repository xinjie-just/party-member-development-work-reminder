// pages/wechat-login.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
      this.storageUserInfo();
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        this.storageUserInfo();
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
          this.storageUserInfo();
        }
      })
    }
  },
  // 存储用户信息并跳转
  storageUserInfo() {
    wx.setStorageSync('userInfo', {
      ...app.globalData.userInfo
    });
    setTimeout(() => {
      wx.redirectTo({
        url: '../bind-phone/bind-phone',
      });
    }, 2000);
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    wx.setStorageSync('userInfo', {
      ...app.globalData.userInfo
    });
    this.setData({
      userInfo: e.detail.userInfo,
      // hasUserInfo: true
    });
    wx.login({
      success(data) {
        console.log("code", data.code);
        if (data.code) {
          // 发起网络请求
          wx.request({
            url: `${app.globalData.hostname}/user/weiXinLogin`,
            data: {
              code: data.code
            },
            success(value) {
              const data = value.data;
              if (data.code === 200) {
                wx.setStorageSync("openid", data.data.openid);
                wx.setStorageSync("sessionKey", data.data.sessionKey);
                wx.showToast({
                  title: '身份信息获取成功',
                  icon: "none",
                  duration: 2000
                });
                setTimeout(() => {
                  wx.redirectTo({
                    url: '../bind-phone/bind-phone',
                  });
                }, 2000);
              } else {
                wx.showToast({
                  title: `${value.data.message}`,
                  icon: "none",
                  duration: 2000
                });
              }
            },
            fail() {
              wx.showToast({
                title: '微信登录失败！',
                icon: "none",
                duration: 2000
              });
            }
          })
        } else {
          wx.showToast({
            title: '登录失败！' + res.errMsg,
            icon: "none",
            duration: 3000
          });
        }
      }
    })
  }
})