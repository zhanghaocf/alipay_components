import {saveAllimg,iosSaveImg} from "/utils/utils.js";
import {sendEmail,testscan} from "/utils/model.js";
let app = getApp()
Component({
  props:{
    showFlag:false,
    printName:[],
    finalName:[],
    orderid:'',
    downurl:'www.id-photo-verify.com/t',
    extract_str:'',
    onCloseEleSave:()=>{},//关闭保存图片窗口
    onSavesuccess:()=>{} //保存成功
  },
  data:{
    wayidx:0,
    isIos:false,
    email:'',
    filename:'',
    theme:'',
    detail:''
  },
  didMount(){
    let isIos = app.globalData.isIos
    let wayidx = isIos?1:0
    this.setData({
      isIos,
      wayidx
    })
  },
  methods:{
    propt(type,cot){
      my.prompt({
        title: cot,
        success: (result) => {
          let {ok,inputValue}=result
          ok&&this.setData({
            [type]:inputValue
          })
        }
      })
    },
    // iptfocus(e){
    //   let {type} = e.currentTarget.dataset
    //   let {isIos} = this.data
    //   let obj = {
    //     "email":()=>{
    //       console.log(this)
    //       this.propt("email","请输入您的邮箱")
    //     },
    //     "filename":()=>{
    //       this.propt("filename","请为照片命名")
    //     },
    //     "theme":()=>{
    //       this.propt("theme","请输入您的邮件主题")
    //     }
    //   }
    //   isIos&&obj[type].call(this)
    //   console.log(e)
    // },
    blurfn(){
      my.pageScrollTo({
        scrollTop:1
      })
    },
    onSubmit(e){
      let {detail,email,filename,theme} = e.detail.value
      var reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if(email===undefined || email === ''){
        app.alertMsg("请输入邮箱")
        return
      }
      let describe = email+filename+theme+detail
      testscan(describe).then(res=>{
        let {is_sensitive} = res
        if(is_sensitive){
          throw "您输入的信息有敏感词汇"
        }
        let data={
          order_id:this.props.orderid,
          email,
          ...filename&&{
            file_name:filename
          },
          ...theme&&{
            subject:theme
          },
          ...detail&&{
            content:detail
          }
        }
        return sendEmail(data)
      }).then(res=>{
        let {result} = res
        this.setData({
          email:'',
          filename:'',
          theme:'',
          detail:'',
        })
        app.toastMsg(result)
      }).catch(err=>{
        app.alertMsg(err)
      })
    },
    onShowpop(){
      let isIos = app.globalData.isIos
      let wayidx = isIos?1:0
      this.setData({
        wayidx
      })
      this.props.onCloseEleSave()
    },
    selway(e){
      let {idx} = e.currentTarget.dataset
      idx = +idx
      let {wayidx} = this.data
      wayidx!==idx && this.setData({
        wayidx:idx
      })
    },
    copyFn(){
      let {downurl,extract_str} = this.props
      let txt = `下载地址:${downurl}\n提取码:${extract_str}`
      my.setClipboard({
        text: txt,
        success:()=>{
          app.toastMsg("复制成功")
        },
        fail:()=>{
          app.toastMsg("复制失败")
        }
      });
    },
    savephone(){
      let {printName,finalName}=this.props
      let {isIos} = app.globalData
      let funcname = iosSaveImg
      console.log(funcname)
      let pages = getCurrentPages()
      let len = pages.length
      let page = pages[len-1]
      page.setData({
        loadingTxt:'图片保存中'
      })
      // if(isIos){
      iosSaveImg([...finalName,...printName],()=>{
        console.log("lalala")
        page.setData({
        loadingTxt:''
        })
        app.toastMsg("图片保存成功")
        setTimeout(()=>{
          this.props.onSavesuccess()
        },1000)
      })
      // }else{
      //   saveAllimg([...finalName,...printName]).then(res=>{
      //     page.setData({
      //       loadingTxt:''
      //     })
      //     app.toastMsg("图片保存成功")
      //     setTimeout(()=>{
      //       this.props.onSavesuccess()
      //     },1000)
      //   }).catch(err=>{
      //     app.alertMsg("保存图片失败")
      //   })
      // }
    }
  }
})