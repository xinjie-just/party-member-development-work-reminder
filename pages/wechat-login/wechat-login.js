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
    const openid = wx.getStorageSync('openid');
    if (openid) {
      this.queryUser(openid);
    }
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
    // wx.redirectTo({
    //   url: '../bind-phone/bind-phone',
    // });
  },
  getUserInfo: function(e) {
    wx.clearStorageSync();
    app.globalData.userInfo = e.detail.userInfo;
    wx.setStorageSync('userInfo', {
      ...app.globalData.userInfo
    });
    this.setData({
      userInfo: e.detail.userInfo,
      // hasUserInfo: true
    });
    let that = this;
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
            header: {
              accessSide: "weixin"
            },
            success(value) {
              const info = value.data;
              if (info.code === 200) {
                wx.setStorageSync("openid", info.data.openid);
                wx.setStorageSync("sessionKey", info.data.sessionKey);
                if (info.data.token) {
                  wx.setStorageSync('token', info.data.token);
                }
                wx.showToast({
                  title: '身份信息获取成功',
                  icon: "none",
                  duration: 2000
                });
                if (info.data.user) {
                  // 绑定过了
                  wx.setStorageSync("userOtherInfo", info.data.user);
                  setTimeout(() => {
                    wx.switchTab({
                      url: '../index/index',
                    });
                  }, 2000);
                } else {
                  // 没绑定过，去绑定页面
                  wx.redirectTo({
                    url: '../bind-phone/bind-phone',
                  });
                }
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
  },

  // 通过微信openid查询用户信息，如果查询到有用户，就证明绑定过手机号了
  queryUser(openId) {
    let that = this;
    wx.request({
      url: `${app.globalData.hostname}/miniProgram/queryUserByOpenId`,
      data: {
        openId
      },
      header: {
        accessSide: "weixin",
        Authorization: wx.getStorageSync("token")
      },
      success(value) {
        const info = value.data;
        if (info.code === 200) {
          if (info.data) {
            // 绑定过手机号了
            wx.setStorageSync("userOtherInfo", info.data);
            wx.switchTab({
              url: '../index/index',
            })
          } else {
              wx.redirectTo({
                url: '../bind-phone/bind-phone',
              });
          }
        } else if (info.code === 401) {
          wx.showToast({
            title: '登录已过期或未登录',
            duration: 2000,
            icon: "none"
          });
          setTimeout(() => {
            wx.redirectTo({
              url: './wechat-login',
            })
          }, 2000);
        }
      },
      fail(res) {
        wx.showToast({
          title: res.error,
          icon: "none",
          duration: 2000
        })
      }
    })
  },

  // 手机号密码登录
  phonePasswordLogin() {
    wx.navigateTo({
      url: '../password-login/password-login',
    });
  }
})