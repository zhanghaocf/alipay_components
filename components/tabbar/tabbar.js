const config = getApp().globalData;
import {cloasePop,eleorder,printorder} from "/templates/order/order.js"
Component({
  props: {
    activeIndex: 0,
    selectedcolor:'#333333',
    color: '#A5B2CD',
    backgroundColor: "#ffffff",
    needPb35:false,
    list: []
  },
  data:{
    showFlag:false
  },
  methods:{
    onShowpop(bol){
      this.setData({
        showFlag:bol
      })
    },
    cloasePop(){
      cloasePop.call(this)
    },
    eleorder(){
      eleorder.call(this)
      cloasePop.call(this)
    },
    printorder(){
      printorder.call(this)
    },
    selFn(e) {
      let dt = e.currentTarget.dataset;
      let index = Number(dt.index);
      if(this.props.activeIndex === index){
        return;
      }
      let path = dt.path;
      if(path){
        my.reLaunch({ 
          url: path // 页面路径。如果页面不为 tabbar 页面则路径后可以带参数。参数规则如下：路径与参数之间使用
        });
      }else{
        console.log("订单弹窗")
        this.setData({
          showFlag:true
        })
      }
    },
  }
});