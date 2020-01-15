const app = getApp()
let config = app.globalData
import {getQrcodeM} from "/utils/model.js"
import {iosSaveImg} from "/utils/utils.js"
Component({
  props:{
    info:{},
    idx:-1,
    mb:16,
    type:"owner",
    onSetLoading:()=>{},
    onJointeam:()=>{},
    onTakePhoto:()=>{}
  },
  methods:{
    godown(){
      let {info,idx} = this.props
      my.navigateTo({
        url: '/pages/teamdetail/teamdetail?info='+JSON.stringify(info)+'&idx='+idx
      });
    },
    enterdetail(e){
      let {type} = this.props
      let obj = {
        "owner":()=>{
          this.godown()
        },
        "joiner":(e)=>{
          this.gopreview(e)
        }
      }
      obj[type](e)
    },
    ownerphoto(){
      let {idx} = this.props
      this.props.onTakePhoto(idx)
    },
    odcopyFn(){
      let {order_id} = this.props.info
      console.log("订单id",order_id)
      my.setClipboard({
        text:order_id,
        success(){
          app.toastMsg("复制成功")
        },
        fail(err){
          app.toastMsg("复制失败")
        }
      })
    },
    gopreview(e){
      let {info} = this.props
      let {state} = e.currentTarget.dataset
      if(state==="已结束"&&info.is_order===0){
        //没有订单活动又结束
        app.alertMsg("该活动你没有任何订单")
        return
      }
      if(info.is_order===0){
        this.pszjz()
        return
      }
      console.log("下载：",info)
      config.makePhotoInfo=info
      my.navigateTo({
        url:'/pages/joinpreview/joinpreview'
      })
    },
    rephoto(){
      let {info} = this.props
      let {refund_amount,refuse_reason} = info
      let txt = refund_amount===1?`您的照片因为：“${refuse_reason}”被打回，照片第一次被打回，您享有一次免费重拍同价位证件照的机会，请仔细了解拍摄需求~`:`您的照片因为：${refuse_reason}被打回，这是您第${refund_amount}次被打回，您需要重新付费拍摄~`
      my.confirm({
        title:'重新拍摄',
        content:txt,
        confirmButtonText:'重新拍摄',
        cancelButtonText:'关闭',
        success:(result)=>{
          result.confirm && this.tophoto()
        }
      })
    },
    tophoto(){
      console.log("去拍照喽")
      let {info} = this.props
      this.props.onJointeam(info)
    },
    ticopyFn(){
      let {project_no} = this.props.info
      console.log("info",this.props.info)
      my.setClipboard({
        text:project_no,
        success(){
          app.toastMsg("复制成功")
        },
        fail(err){
          app.toastMsg("复制失败")
        }
      })
    },
    saveewm(){
      let {info} = this.props
      let {project_no} = info
      let data = {
        url_param: 'pages/jointeam/jointeam',
        query_param: 'teamid='+project_no,
        project_no
      }
      getQrcodeM(data).then(res=>{
        console.log(res)
        let {qr_code_url} = res
        this.props.onSetLoading("保存图片中")
        iosSaveImg([qr_code_url],()=>{
          this.props.onSetLoading("")
          app.alertMsg("您创建的团体对应的二维码已保存到您手机相册啦，可以去分享啦")
        })
      })
      console.log("二维码喽")
    },
    pszjz(){
      let {info} = this.props
      this.props.onJointeam(info)
    },
    shareinfo(){
      let {info} = this.props
      let {project_name,project_no,spec_name,color_china} = info
      config.teamshare.title=project_name
      config.teamshare.content="我正在收照片，邀请你快来制作证件照",
      config.teamshare.desc=`${spec_name} | ${color_china}`
      config.teamshare.path="pages/jointeam/jointeam?teamid="+project_no
      config.teamshare.bgImgUrl="/images/collect/share.png"
      config.teamshare.imageUrl="/images/logo.png"
    }
  }
})