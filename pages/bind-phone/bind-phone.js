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
    valid: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let username = '';
    if (app.globalData.userInfo) {
      username = app.globalData.userInfo.nickName;
      this.setData({
        username,
        usernameValid: !!username,
      });
    }
  },

  onInput(evt) {
    const { value } = evt.detail;
    const { name } = evt.currentTarget.dataset;
    const PHONE_REG_EXP = /^1\d{10}$/;
    let result = false;
    if (name === 'phone') {
      result = PHONE_REG_EXP.test(value);
      if (result) {
        this.setData({
          phoneValid: true,
          phone: value,
        });
      } else {
        this.setData({
          phoneValid: false,
        });
      }
    } else {
      if (name === 'username') {
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
      valid: phoneValid && usernameValid,
    });
  },

  bindPhone() {
    if (!this.data.phoneValid) {
      wx.showToast({
        title: '手机号格式不对',
        icon: 'none',
      });
    } else if (!this.data.usernameValid) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
      });
    } else {
      // 先通过手机号查询用户信息
      this.queryUserByPhoneNum();
    }
  },

  // 通过手机号查询用户信息
  queryUserByPhoneNum() {
    let that = this;
    wx.request({
      url: `${app.globalData.hostname}/user/queryUserByPhoneNum`,
      data: {
        phoneNum: this.data.phone,
      },
      header: {
        accessSide: 'weixin',
        Authorization: wx.getStorageSync('token'),
      },
      success(value) {
        const info = value.data;
        if (info.code === 200) {
          if (info.data) {
            if (info.data.phoneNum) {
              wx.setStorageSync('userOtherInfo', info.data);
            }
            if (info.data.openId) {
              wx.setStorageSync('openid', info.data.openId);
            } else if (info.data.openid) {
              wx.setStorageSync('openid', info.data.openid);
            }
            // 去验证手机号密码，验证成功就调接口去绑定，不跳绑定手机号页面，跳首页
            wx.navigateTo({
              url: `../validation-password/validation-password?phoneNum=${that.data.phone}`,
            });
          } else {
            that.toBind();
          }
        } else if (info.code === 401) {
          wx.showToast({
            title: '登录已过期或未登录',
            duration: 2000,
            icon: 'none',
          });
          setTimeout(() => {
            wx.redirectTo({
              url: '../wechat-login/wechat-login',
            });
          }, 2000);
        }
      },
      fail(res) {
        wx.showToast({
          title: res.error,
          icon: 'none',
          duration: 2000,
        });
      },
    });
  },

  toBind() {
    const openid = wx.getStorageSync('openid');
    wx.request({
      url: `${app.globalData.hostname}/user/weiXinLoginBindPhone`,
      method: 'POST',
      data: {
        openid,
        phone: this.data.phone,
        realName: this.data.username,
      },
      header: {
        accessSide: 'weixin',
        Authorization: wx.getStorageSync('token'),
      },
      success(res) {
        const info = res.data;
        if (info.code === 200) {
          wx.showToast({
            title: '绑定成功',
            duration: 2000,
            icon: 'success',
          });
          if (info.data.token) {
            wx.setStorageSync('token', info.data.token);
          }
          const userInfoStorage = wx.getStorageSync('userInfo');
          const userInfoApp = app.globalData.userInfo;
          const bindRes = info.data.user;
          const userInfobindRes = {
            idUser: bindRes.idUser,
            phoneNum: bindRes.phoneNum,
            realName: bindRes.realName,
            startTime: bindRes.startTime,
            lastLoginTime: bindRes.lastLoginTime,
            dataState: bindRes.dataState, // 0 锁定, 1 正常状态, 2 已经假删除
            idRole: bindRes.idRole,
          };
          wx.setStorageSync('userInfo', {
            ...userInfoStorage,
            ...userInfobindRes,
          });
          app.globalData.userInfo = {
            ...userInfoApp,
            ...userInfobindRes,
          };
          setTimeout(() => {
            wx.switchTab({
              url: '../index/index',
            });
          }, 2000);
        } else if (info.code === 401) {
          wx.showToast({
            title: '登录已过期或未登录',
            duration: 2000,
            icon: 'none',
          });
          setTimeout(() => {
            wx.redirectTo({
              url: '../wechat-login/wechat-login',
            });
          }, 2000);
        } else {
          wx.showToast({
            title: info.message || '手机号绑定失败！',
            duration: 2000,
            icon: 'none',
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: '手机号绑定失败！' + res.error,
          icon: 'none',
          duration: 2000,
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
