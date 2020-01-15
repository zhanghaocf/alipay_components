Component({
  props:{
    color:[],
    coloridx:0,
    isleft:false,
    onSetidx:()=>{}//设置颜色索引
  },
  methods:{
    setidx(e){
      let idx = e.currentTarget.dataset.index
      if(this.props.coloridx !== idx){
        this.props.onSetidx(idx)
      } 
    }
  }
})