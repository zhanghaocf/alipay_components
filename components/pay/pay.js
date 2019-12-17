const app = getApp()
let config = app.globalData
import {createOrder,getpay} from "/utils/model.js";
import {savephone} from "/utils/api.js";//为了不统一处理异常
import {saveAllimg} from "/utils/utils.js";
Component({
  props:{
    paytype:'ele',
    showFlag:false,
    onClosePay:()=>{},//关闭弹窗
    imgurl:'',
    specName:'',
    canprint:true,
    chooseColor:[],
    price:{},
    allColor:[],
    chooseKey:'',
    onChooseAll:()=>{}, //选所有背景
    onChooseClose:()=>{}, //选正装
    onLoadingTxt:()=>{} //是否显示loading
  },
  data:{
    selVal:5, //1为基础价个2为换正装价格3为基础加换正装价格4为多背景价格5为基础加多背景价格7为基础加正装加多背景价格
    coloridx:0,
    orderid:''
  },
  didMount(){
    let val = +this.data.selVal
    let {coloridx} = config.makePhotoInfo
    let obj = {
      coloridx
    }
    if(this.props.chooseColor.length===1){
      val-=4
    }
    if(this.props.chooseKey){
      val+=2
    }
    obj.selVal=val
    this.setData(obj)
  },
  methods:{
    onClose(){
      this.props.onClosePay()
    },
    needAll(bol){
      //选择多背景操作
      this.props.onChooseAll(bol)
    },
    needClose(bol){
      if(!config.makePhotoInfo.clothes_path){
        my.confirm({
          title:'您还未选择正装模板哦',
          content:'您未选择正装模版，快去为自己换一套精致的正装吧~',
          confirmButtonText:'去换装',
          success: (res) => {
            if(res.confirm){
              config.event.emit("openclose")
              my.navigateBack({});
            }
          },
        });
        return true
      }
      this.props.onChooseClose(bol)
    },
    valopr(val,bol){
      //bol为true时选中false为取消选中
      let res= true
      if(val === 4){
        //选了多背景
        res=this.needAll(bol)
      }else if(val === 2){
        //选了换装
        res=this.needClose(bol)
      }
      return res
    },
    buy(e){
      let {val} = e.currentTarget.dataset
      let selVal = this.data.selVal
      val = +val
      let bijiao = selVal&val
      let isprevent= false;
      if(bijiao === val){
        //取消选中
        selVal-=val
        isprevent=this.valopr(val,false)
      }else{
        //选中
        selVal+=val
        isprevent=this.valopr(val,true)
      }
      console.log(isprevent)
      if(isprevent){
        return
      }
      this.setData({
        selVal
      })
    },
    tradePay(tradeNO){
      return new Promise((resolve,reject)=>{
        my.tradePay({
          // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
          tradeNO,
          success: (res) => {
            let {resultCode} = res
            if(resultCode==='9000'){
              resolve(res)
            }else if(resultCode!=="8000"){
              reject("支付失败")
            }
          },
          fail: (err) => {
            reject("支付失败")
          }
        });
      })
    },
    anzhuoAction(){
      this.props.onLoadingTxt("保存图片中")
      savephone(this.data.orderid).then(res=>{
        console.log(res)
        let {final_pic_name,print_pic_name} = res.result
        return saveAllimg([...final_pic_name,...print_pic_name])
      }).then(res=>{
        this.props.onLoadingTxt("")
        my.alert({
          title:'保存成功',
          content:'图片已保存进您的系统相册中',
          buttonText: '前往详情',
          success:()=>{
            this.iosAction()
          }
        })
      }).catch(err=>{
        this.props.onLoadingTxt("")
        console.log(err)
      })
    },
    iosAction(){
      //跳转订单详情页
      my.navigateTo({
        url:'/pages/orderdetail/orderdetail?orderid='+this.data.orderid
      });
    },
    elepay(){
      let sys = my.getSystemInfoSync();
      let modeAction={
        "true":()=>{
          this.iosAction()
        },
        "false":()=>{
          this.anzhuoAction()
        }
      }
      let {chooseColor} = this.props
      let colorlist = chooseColor.map(item=>{
        return {
          enc_color:item.enc_color,
          color_name:item.color_name,
          start_color:item.start_color
        }
      })
      createOrder(colorlist).then(res=>{
        this.data.orderid = res.order_id
        return getpay(res.order_id)
      }).then(res=>{
        return this.tradePay(res.trade_no)
      }).then(res=>{
        console.log(res)
        //判断是否是anzhuo，自定保存手机
         modeAction[/iphone/i.test(sys.model).toString()]()
      }).catch(err=>{
        console.log(err)
        err=typeof err==="string"?err:"操作失败"
        app.toastMsg(err)
        err==="支付失败"&&setTimeout(()=>{
          this.iosAction()
        },1000)
      })
    },
    goprint(){
      my.navigateTo({
        url:`/pages/printWeb/printWeb`
      });
    },
    gopay(){
      let {paytype} = this.props
      let fn = paytype==='ele'?this.elepay:this.goprint
      fn.call(this)
    }
  }
})