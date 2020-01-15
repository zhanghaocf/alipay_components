const app = getApp()
const config = app.globalData;
import {makephoto} from "/utils/model.js";
import {testImgRisk,chooseImage,uploadImage} from "/utils/utils.js";
Component({
  props: {
    showFlag:false,
    collectInfo:{}, //正对收照片扩展已project_no来判断
    onControlPhoto:()=>{},
    onRruleDetail:()=>{},//点击取消返回详情页
    onShowLoading:()=>{}
  },
  data:{},
  methods:{
    takephoto(e){
      let {type} = e.currentTarget.dataset
      let {collectInfo} = this.props
      chooseImage(type).then(res=>{
        this.props.onShowLoading("图片上传中")
        let type = collectInfo.project_no ?1:0 //制作 0 默认 收照片1
        return uploadImage(res,type)
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
        this.originmakephoto(res)
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
    // collectMakephoto(res){
    //   let {collectInfo} = this.props
    //   let {makePhotoInfo} = config
    //   let {project_no} = collectInfo
    //   let obj = {
    //     project_no,
    //     key:res
    //   }
    //   makephoto(obj).then(res=>{
    //     console.log(res)
    //     makePhotoInfo = {
    //         ...makePhotoInfo,
    //         ...res,
    //         clothes_path:'',
    //         inputVal:'',
    //         wm_url_zheng:''
    //       }
    //       config.makePhotoInfo = makePhotoInfo
    //       this.props.onShowLoading("")
    //       my.navigateTo({
    //         url:'/pages/background/background'
    //       });
    //   })
    // },
    originmakephoto(res){
      let {makePhotoInfo} = config
      let {spec_id,file_size_max,file_size_min,ppi,width_px,height_px,project_no,needRedirect} = makePhotoInfo
        let formdata = {
          ...spec_id&&{spec_id},
          ...project_no&&{project_no},
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
            wm_url_zheng:'',
            wmprinturl_nofm:'',
            wmprinturl:''
          }
          config.makePhotoInfo = makePhotoInfo
          this.props.onShowLoading("")
          if(needRedirect){
            //为了解决团体预览页面重新拍摄后面制作又重新跳回该页面防止出现两次
            config.makePhotoInfo.needRedirect=false
            my.redirectTo({
              url: '/pages/background/background'
            });
          }else{
            my.navigateTo({
              url:'/pages/background/background'
            });
          }
        }).catch(err=>{
          console.log(err)
          this.props.onShowLoading("")
          console.log("只是捕获异常不弹窗显示")
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