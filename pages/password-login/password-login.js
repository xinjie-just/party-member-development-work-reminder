// pages/password-login/password-login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: '',
    showClearPasswordBtn: false,
    isPasswordWaring: false,
    phone: '',
    showClearPhoneBtn: false,
    isPhoneWaring: false
  },

  onInput(evt) {
    const {value} = evt.detail;
    const {name} = evt.currentTarget.dataset;
    if (name === 'password') {
      this.setData({
        name: value,
        isPasswordWaring: !value.trim(),
        showClearPasswordBtn: !!value.length,
      })
    }
    if (name === 'phone') {
      this.setData({
        phone: value,
        isPhoneWaring: !value.trim(),
        showClearPhoneBtn: !!value.length,
      })
    }
    
  },

  onClear(evt) {
    const {name} = evt.currentTarget.dataset;
    if (name === 'password') {
      this.setData({
        name: '',
        isPasswordWaring: true,
        showClearPasswordBtn: false
      })
    }
    if (name === 'phone') {
      this.setData({
        phone: '',
        isPhoneWaring: true,
        showClearPhoneBtn: false
      })
    }
  },

  onConfirm() {
    this.setData({
      isPasswordWaring: !this.data.password.length,
      isPhoneWaring: !this.data.phone.length,
    });
    const valid = !(isPasswordWaring || isPhoneWaring);

  },

  submit() {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
