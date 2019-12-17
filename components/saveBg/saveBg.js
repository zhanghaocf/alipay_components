Component({
  props:{
    showFlag:false,
    onCloseColorBg:()=>{},
    color:[],
    coloridx:0,
    basicprice:0,
    multiprice:0,
    onPay:()=>{} //点击支付按钮
  },
  data:{
    allbg:true
  },
  methods:{
    onShowpop(){
      this.props.onCloseColorBg()
    },
    allone(){
      let {allbg} = this.data
      let bol = !allbg
      this.setData({
        allbg:bol
      })
    },
    cut(){
      let {allbg} = this.data
      this.props.onPay(allbg)
    }
  }
})