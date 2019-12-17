let app = getApp();
let config = app.globalData;
Component({
  props: {
    preventscroll:false,
    showFlag: false,
    onShowpop:(bol)=>{
      console.log("默认方法显示隐藏弹窗")
    },
    mask:true//可不可以透过黑框点击下面元素，true为不可以
  },
  data: {
  }, // 私有数据，可用于模版渲染
  methods: {
    closeFlag() {
      this.props.mask && this.props.onShowpop(false)
    },
    rf() {
      return false
    }
  }
});