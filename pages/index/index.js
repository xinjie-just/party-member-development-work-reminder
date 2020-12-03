//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    noTodoList: false,
    todoList: []
  },
  selectTodoItem(evt) {
    console.log("evt111", evt);
  },
  onLoad: function () {
    this.setData({
      todoList: ['AA,阶段节点待你确认', 'BB,阶段节点待你确认','CC,阶段节点待你确认','DD,阶段节点待你确认']
    })
  }
})
