const config = getApp().globalData;
Component({
  props: {
    showFlag:false,
    color:[],
    onControlColor:()=>{},
    coloridx:0,
    onSetidx:()=>{}//设置颜色索引给父级
  },
  data:{},
  methods:{
    onShowpop(){
      this.props.onControlColor()
    },
    onSetidx(idx){
      this.props.onSetidx(idx)
    },
    onCancel(){
      this.props.onSetidx(0)//初始化默认颜色
      this.props.onControlColor()
    },
    onOk(){
      this.props.onControlColor()
    }
  }
});