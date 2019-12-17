const app = getApp()
const config = app.globalData;
import {makephoto} from "/utils/model.js";
import {testImgRisk,chooseImage,uploadImage} from "/utils/utils.js";
Component({
  props: {
    showFlag:false,
    onControlPhoto:()=>{},
    onRruleDetail:()=>{},//点击取消返回详情页
    onShowLoading:()=>{}
  },
  data:{},
  methods:{
    takephoto(e){
      let {type} = e.currentTarget.dataset
      let {makePhotoInfo} = config
      chooseImage(type).then(res=>{
        this.props.onShowLoading("图片上传中")
        return uploadImage(res)
      }).then(res=>{
        console.log(res)
        let data = JSON.parse(res.data)
        if(data.code!==200){
          throw data.warning
        }
        let {key,url}=data
        this.props.onShowLoading("图片检测中")
        return testImgRisk({key,url})
        // return key
      }).then(res=>{
        let {spec_id,file_size_max,file_size_min,ppi,width_px,height_px} = config.makePhotoInfo
        let formdata = {
          ...spec_id&&{spec_id},
          ...!spec_id&&{
            file_size_max,
            file_size_min,
            ppi,
            width_px,
            height_px
          },
          key:res
        }
        this.props.onShowLoading("图片制作中")
        makephoto(formdata).then(res=>{
          console.log(res)
          makePhotoInfo = {
            ...makePhotoInfo,
            ...res,
            clothes_path:'',
            inputVal:'',
            wm_url_zheng:''
          }
          config.makePhotoInfo = makePhotoInfo
          this.props.onShowLoading("")
          my.navigateTo({
            url:'/pages/background/background'
          });
        }).catch(err=>{
          this.props.onShowLoading("")
          console.log("只是捕获异常不弹窗显示")
        })
      }).catch(err=>{
        console.log(err)
        this.props.onShowLoading("")
        if (typeof err === 'object'){
          err.error!==11  && app.alertMsg("发生错误，请重新操作")
        }else{
          app.alertMsg(err)
        }
      })
    },
    onShowpop(){
      this.props.onControlPhoto()
    },
    ruleDetail(){
      this.props.onRruleDetail()
    }
  }
});