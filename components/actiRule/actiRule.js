const config = getApp().globalData;
import {getSpecDetail} from "/utils/model.js";
Component({
  props: {
    showFlag:false,
    normal:true,//是否显示 支持电子照冲印信息以及规格详情
    onControlRule:()=>{},
    onReturnrule:()=>{},//去主页关闭该详情并返回rule模块
    onSureid:()=>{}
  },
  didMount(){
    config.event.on('openActiwrap',this.openme,this)
  },
  data:{
    name:'',
    print:1,
    width_mm:0,
    height_mm:0,
    width_px:0,
    height_px:0,
    file_size_max:0,
    file_size_min:0,
    ppi:300,
    background_color:[],
    photo_format:"jpg",
    remark:'',
    spec_id:0,
    colorIdx:0,
    returnRule:true //判断点击×是否返回规格列表还是直接首页
  },
  methods:{
    openme(){
      //参数1为规格id，参数2为是否点击×直接返回首页
      let specid = arguments[0]
      let returnRule = !arguments[1]
      console.log(returnRule)
      this.data.specid = specid
      getSpecDetail(specid).then(res=>{
        console.log(res)
        let obj = res.result
        let colorInfo = typeof obj.background_color==="object"?obj.background_color:JSON.parse(obj.background_color)
        let color = colorInfo.map(item => {
          return {
            start_color: item.start_color,
            enc_color: item.enc_color,
            s_color: item.start_color.toString(16),
            e_color: item.enc_color.toString(16),
            color_name: item.color_name,
          }
        })
        obj.background_color=color
        obj.returnRule=returnRule
        obj.colorIdx=0
        this.setData(obj)
      })
    },
    onShowpop(){
      this.props.onControlRule()
    },
    onSetidx(idx){
      this.setData({
        colorIdx:idx
      })
    },
    returnrule(){
      if(this.data.returnRule){
        this.props.onReturnrule()
      }else{
        this.props.onControlRule()
      }
    },
    sureid(){
      let dt = this.data
      console.log(dt)
      let obj = {
        spec_id:dt.spec_id,
        clothes_path:'',
        algo_fileuuid_origin:'',
        width_px:dt.width_px,
        height_px:dt.height_px,
        width_mm:dt.width_mm,
        height_mm:dt.height_mm,
        ppi:dt.ppi,
        background_color:dt.background_color,
        print:dt.print,
        specName:dt.name,
        coloridx:dt.colorIdx,
        file_size_min:dt.file_size_min,
        file_size_max:dt.file_size_max,
        ppi:dt.ppi,
        is_word:dt.is_word
      }
      config.makePhotoInfo = obj
      this.props.onSureid()
    }
  }
});