Component({
  props:{
    showFlag:false,
    onCloseSs:()=>{}//关闭弹窗
  },
  methods:{
    closeSs(){
      this.props.onCloseSs()
    }
  }
})