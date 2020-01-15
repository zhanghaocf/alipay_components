const app = getApp()
let config = app.globalData
import {testscan} from "/utils/model.js"
Component({
  props:{
    team:{},
    onCloseWrap:()=>{},
    onHandleInfo:()=>{},
    onGoPhoto:()=>{},
    noops:true,
    modifyBol:false//修改信息用的值
  },
  data:{
    isIos:false
  },
  didMount(){
    this.setData({
      isIos:config.isIos
    })
  },
  methods:{
    gophoto(){
      let {noops,team} = this.props
      let {extra_information,information} = team
      console.log("team",extra_information.length===0||!noops)
      if(extra_information.length===0||!noops) {
        let desc = extra_information.length===0?"":Object.keys(information).reduce((val,item)=>{
          return val+information[item]
        },"")
        console.log("desc为",desc)
        testscan(desc).then(res=>{
          if(res.is_sensitive){
            my.alert({
              title:'提交失败',
              content:'文本检测含有敏感词'
            });
          }else{
            this.props.onGoPhoto()
          }
        })
      }
    },
    tqrf(){
      return false
    },
    closewrap(){
      this.props.onCloseWrap()
    },
    modifyinfo(e){
      let {value} = e.detail
      this.props.onHandleInfo(value)
    },
    bmteam(e){
      let {idx} = e.currentTarget.dataset
      let {team} = this.props
      let {value} = e.detail
      let keyname = team.extra_information[idx]
      let data = {
        keyname,
        value
      }
      this.props.onHandleInfo(data)
    }
  }
})