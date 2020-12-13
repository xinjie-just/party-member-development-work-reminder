//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    noTodoList: false,
    todoList: [],
    selectedId: null,
    userName: ''
  },
  selectTodoItem(e) {
    console.log("evt111", e);
    this.setData({
      selectedId: e.currentTarget.dataset.id
    });
  },
  handleItem() {
    if(!this.data.selectedId) return;
    console.log("selectedId",this.data.selectedId);
  },
  onLoad: function () {
    const storageUserInfo = wx.getStorageSync('userInfo');
    this.setData({
      userName: storageUserInfo.realName || storageUserInfo.nickName
    });
    this.getTodoList();
    
    this.setData({
      todoList: [
        { id: 1, title: 'AA,阶段节点待你确认' },
        { id: 2, title: 'BB,阶段节点待你确认' },
        { id: 3, title: 'CC,阶段节点待你确认' },
        { id: 4, title: 'DD,阶段节点待你确认' },
        { id: 5, title: 'EE,阶段节点待你确认' },
        { id: 6, title: 'FF,阶段节点待你确认' },
        { id: 7, title: 'GG,阶段节点待你确认' },
        { id: 8, title: 'HH,阶段节点待你确认' },
        { id: 9, title: 'II,阶段节点待你确认' }
      ]
    })
  },
  getTodoList() {
    wx.request({
      url: `${app.globalData.hostname}/miniProgram/queryUserToDoBusiness`,
      data: {
        pageNo: 1,
        pageSize: 10
      },
      success(res) {
        const value = res.data;
        console.log("待办事项", value);
        
      },
      fail() {
        wx.showToast({
          title: '待办事项获取失败！',
          icon: "none",
          duration: 2000
        })
      }
    })
  }
})
