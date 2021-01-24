const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    password: '',
    phone: '',
    phoneValid: false,
    passwordValid: false,
    submitLoading: false,
    timer: null,
    passwordVisible: false,
  },

  passwordIconVisible() {
    this.setData({
      passwordVisible: !this.data.passwordVisible,
    });
  },

  onInput(evt) {
    const { value } = evt.detail;
    const { name } = evt.currentTarget.dataset;
    const PHONE_REG_EXP = /^1\d{10}$/;
    let result = false;
    if (name === 'phone') {
      result = PHONE_REG_EXP.test(value);
      // if (result) {
      //   this.setData({
      //     phoneValid: true,
      //     phone: value
      //   });
      // } else {
      //   this.setData({
      //     phoneValid: false
      //   });
      // }
      this.setData({
        phoneValid: result,
        phone: value,
      });
    }
    if (name === 'password') {
      this.setData({
        passwordValid: !!value,
      });
      if (this.data.passwordValid) {
        this.setData({
          password: value,
        });
      }
    }
  },

  submit() {
    const phoneValid = this.data.phoneValid;
    const passwordValid = this.data.passwordValid;
    if (!this.data.phone) {
      wx.showToast({
        title: '手机号必填',
        icon: 'none',
      });
    } else if (!phoneValid) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
      });
    } else if (!passwordValid) {
      wx.showToast({
        title: '密码必填',
        icon: 'none',
      });
    } else {
      clearTimeout(this.data.timer);
      const timer = setTimeout(() => {
        this.setData({
          submitLoading: true,
        });
      }, 1000);
      this.setData({
        timer,
      });

      let that = this;
      wx.request({
        url: `${app.globalData.hostname}/user/phoneLogin`,
        data: {
          phone: this.data.phone,
          password: this.data.password,
        },
        method: 'POST',
        header: {
          accessSide: 'weixin',
          Authorization: wx.getStorageSync('token'),
        },
        success(value) {
          const info = value.data;
          if (info.code === 200) {
            wx.setStorageSync('userOtherInfo', info.data.user);
            wx.setStorageSync('userInfo', info.data.user);
            wx.setStorageSync('token', info.data.token);
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/index/index',
              });
            }, 500);
          } else {
            wx.showToast({
              title: '登录失败' + info.message,
              icon: 'none',
              duration: 2000,
            });
          }
        },
        fail(res) {
          wx.showToast({
            title: '登录失败！' + res.error,
            icon: 'none',
            duration: 2000,
          });
        },
        complete() {
          that.setData({
            submitLoading: false,
          });
        },
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    clearTimeout(this.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    clearTimeout(this.data.timer);
  },
});
