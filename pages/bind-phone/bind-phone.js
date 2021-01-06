// pages/bind-phone/bind-phone.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    phone: '',
    phoneValid: false,
    usernameValid: false,
    valid: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let username = '';
    if (app.globalData.userInfo) {
      username = app.globalData.userInfo.nickName;
    } else if (wx.getStorageSync('userInfo')) {
      username = wx.getStorageSync('userInfo').nickName;
    }
    this.setData({
      username
    });
  },

  onInput(evt) {
    const {value} = evt.detail;
    const {id} = evt.currentTarget;
    const PHONE_REG_EXP = /^1\d{10}$/;
    let result = false;
    if (id === 'phone') {
      result = PHONE_REG_EXP.test(value);
      if (result) {
        this.setData({
          phoneValid: true,
          phone: value
        });
      } else {
        this.setData({
          phoneValid: false
        });
      }
    }
    if (this.data.username) {
      this.setData({
        usernameValid: true,
      });
      this.setData({
        username: value,
      });
    } else {
      if (id === 'username') {
        this.setData({
          usernameValid: !!value,
        });
        if (this.data.usernameValid) {
          this.setData({
            username: value,
          });
        }
      }
    }

    const phoneValid = this.data.phoneValid;
    const usernameValid = this.data.usernameValid;
    this.setData({
      valid: phoneValid && usernameValid
    })
  },

  bindPhone() {
    if (!this.data.phoneValid) {
      wx.showToast({
        title: '手机号格式不对',
        icon: "none"
      });
    } else if (!this.data.usernameValid) {
      wx.showToast({
        title: '姓名不能为空',
        icon: "none"
      });
    } else {
      const openid = wx.getStorageSync('openid');
      wx.request({
        url: `${app.globalData.hostname}/user/weiXinLoginBindPhone`,
        method: "POST",
        data: {
          openid,
          phone: this.data.phone,
          realName: this.data.username
        },
        header: {
          accessSide: "weixin",
          Authorization: wx.getStorageSync("token")
        },
        success(res) {
          const info = res.data;
          if (info.code === 200) {
            wx.showToast({
              title: "绑定成功",
              duration: 2000,
              icon: "success"
            });
            const userInfoStorage = wx.getStorageSync('userInfo');
            const userInfoApp = app.globalData.userInfo;
            const bindRes = info.data;
            const userInfobindRes = {
              userId: bindRes.idUser,
              phone: bindRes.phoneNum,
              realName: bindRes.realName,
              startTime: bindRes.startTime,
              lastLoginTime: bindRes.lastLoginTime,
              dataState: bindRes.dataState, // 0 锁定, 1 正常状态, 2 已经假删除
              roleId: bindRes.idRole
            };
            wx.setStorageSync("userInfo", {
              ...userInfoStorage,
              ...userInfobindRes
            });
            app.globalData.userInfo = {
              ...userInfoApp,
              ...userInfobindRes
            }
            setTimeout(() => {
              wx.switchTab({
                url: '../index/index',
              });
            }, 2000);
          } else if (info.code === 401) {
            wx.showToast({
              title: '登录已过期或未登录',
              duration: 2000,
              icon: "none"
            });
            wx.redirectTo({
              url: '../wechat-login/wechat-login',
            })
          } else {
            wx.showToast({
              title: innfo.message,
              duration: 2000,
              icon: "none"
            });
          }
        },
        fail(res) {
          wx.showToast({
            title: "手机号绑定失败！" + res.error,
            icon: "none",
            duration: 2000
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
