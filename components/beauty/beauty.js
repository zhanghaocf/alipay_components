const app = getApp()
let config = app.globalData
Component({
  props:{
    showFlag:false,
    onBeautyClose:()=>{},//隐藏美颜弹窗
    meiyanVal:{},
    beautyFlag:true,//默认美颜
    onDoMeiyan:()=>{}, //动态设置美颜参数
    onIsMeiyan:()=>{}, //设置是否美颜
    onCancel:()=>{}, //还原初始美颜参数并关闭弹窗
    onNoneBeauty:()=>{} //点击确定关闭弹窗
  },
  data:{
    idx:0,
    meiyan:[]
  },
  didMount(){
    this.setData({
      meiyan:config.beauty_default
    })
  },
  methods:{
    onShowpop(){
      this.props.onBeautyClose()
    },
    selmei(e){
      let {idx} = e.currentTarget.dataset
      // if(this.data.idx === idx){
      //   return
      // }
      console.log(idx)
      this.setData({
        idx
      })
    },
    meiyanopr(e){
      console.log(e)
      let {name} = e.currentTarget.dataset
      let val = e.detail.value
      let obj = {
        name,
        val
      }
      this.props.onDoMeiyan(obj)
    },
    isBeauty(e){
      let {beauty} = e.currentTarget.dataset
      let bol = beauty === '1'
      if(this.props.beautyFlag === bol){
        return
      }
      this.props.onIsMeiyan(bol)
    },
    //初始化值
    initidx(){
      this.setData({
        idx:0
      })
    },
    onCancel(){
      this.initidx()
      this.props.onCancel()
    },
    onOk(){
      this.initidx()
      this.props.onNoneBeauty()
    }
  }
})