Page({
  data:{
    showFlag:true,
    list:[],
    list1:[]
  },
  ya(){
    let {list} = this.data
    list.push(0)
    console.time("ya")
    this.setData({
      list
    },()=>{
      console.timeEnd("ya")
    })
  },
  ya1(){
    let {list} = this.data
    console.time("ya1")
    this.setData({
      "list1[1001]":0
    },()=>{
      console.timeEnd("ya1")
    })
  },
  onLoad(query) {
    let {list,list1}=this.data
    list=this.la1000(list)
    list1=this.la1000(list1)
    console.log(list.length)
    // this.setData({
    //   list,
    //   list1
    // })
  },
  la1000(arr){
    for(let i=0;i<1000;i++){
      arr.push(i)
    }
    return arr
  },
  open(){
    this.setData({
      showFlag:true
    })
  },
  onShowpop(){
    console.log(22)
    this.setData({
      showFlag:false
    })
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
});
