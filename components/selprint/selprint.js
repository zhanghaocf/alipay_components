let app = getApp()
let config = app.globalData
import {goprint,getWmPrint} from "/utils/model.js";
Component({
  props:{
    isShow:false,
    onClosePrint:()=>{}//关闭冲印选颜色窗口
  },
  data:{
    imgurl:"",
    color:[],
    selIdx:0,
    print_filename:'',
    spec_id:-1,
    specName:'',
    ori_file_name:''
  },
  didMount(){
    config.event.on("selprint",this.selprint,this)
  },
  methods:{
    closeFn(){
      this.props.onClosePrint()
    },
    selprint(order){
      goprint(order.order_id).then(res=>{
        console.log(res)
        let {choice_color_index,spec_id,total_background_color,print_url,no_fm_print_filename,fm_print_filename} = res.data
        let color = total_background_color.map(item=>{
          return {
            ...item,
            s_color:item.start_color.toString(16).padStart(6,0),
            e_color:item.enc_color.toString(16).padStart(6,0)
          }
        })
        if(choice_color_index>0){
          let obj = color.splice(choice_color_index,1)[0]
          color.unshift(obj)
        }
        this.setData({
          imgurl:print_url,
          color,
          no_fm_print_filename,
          fm_print_filename,
          spec_id,
          specName:order.spec_name,
          ori_file_name:order.origin_pic_name
        })
        console.log(res)
      })
    },
    selClr(e){
      let {idx} = e.currentTarget.dataset
      this.setData({
        selIdx:+idx
      })
    },
    submitprint(){
      let {selIdx,color,spec_id,no_fm_print_filename,fm_print_filename,specName,ori_file_name} = this.data
      console.log([color[selIdx]])
      getWmPrint({
        colors:[color[selIdx]],
        spec_id,
        no_fm_filename:no_fm_print_filename,
        ...fm_print_filename&&{
          fm_filename:fm_print_filename
        },
        judge_number:1
      }).then(res=>{
        console.log(res)
        let {wm_fm_url,wm_no_fm_url,number} = res
        config.makePhotoInfo.wmprinturl=wm_fm_url
        config.makePhotoInfo.wmprinturl_nofm=wm_no_fm_url
        config.makePhotoInfo.number=number
        config.makePhotoInfo.background_color=color
        config.makePhotoInfo.coloridx=selIdx
        config.makePhotoInfo.spec_id=spec_id
        config.makePhotoInfo.algo_filename_no_fm=no_fm_print_filename
        config.makePhotoInfo.algo_fileuuid=fm_print_filename
        config.makePhotoInfo.specName = specName
        config.makePhotoInfo.ori_file_name=ori_file_name
        config.judge_number=1 //作为订单列表订单详情进入
        console.log(config.makePhotoInfo)
        my.navigateTo({
          url:'/pages/printWeb/printWeb'
        });
      })
    }
  }
})