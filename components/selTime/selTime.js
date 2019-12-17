let moment = require("./utils/moment.js");
Component({
  props:{
    showFlag:false,
    maxDay:60,
    startData:"",
    selDate:"",
    onShowpop:()=>{},
    onResult:()=>{}
  },
  data:{
    result:[0,0,0],
    years:[],
    months:[],
    days:[]
  },
  didMount(){
    this.initResult()
  },
  methods:{
    cancelFn(){
      this.initResult()
      this.props.onShowpop()
    },
    finishFn(){
      let {years,months,days,result} = this.data
      console.log("最终结果:::",years[result[0]],months[result[1]],days[result[2]])
      this.props.onResult(years[result[0]],months[result[1]],days[result[2]])
    },
    initResult(){
      let {startData,maxDay,selDate} = this.props
      let {result}=this.data
      let years=[],months=[],days=[]
      let nowtime = startData?moment(startData):moment()
      let endTime = startData?moment(startData):moment()
      endTime = endTime.add(maxDay,"days")
      let selTime = selDate?moment(selDate):nowtime
      let [selyear,selmonth,selday] = [selTime.year(),selTime.month()+1,selTime.date()]
      years=this.pushData(nowtime.year(),endTime.year())
      months=this.setYears(selyear)
      days = this.setMonths(selyear,selmonth)
      let arr = [years.findIndex(item=>item===selyear),months.findIndex(item=>item===selmonth),days.findIndex(item=>item===selday)]
      this.setData({
        years,
        months,
        days,
        result:arr
      })
    },
    onShowpop(){
      this.props.onShowpop()
    },
    onChange(e){
      console.log(e)
      let {value} = e.detail
      let {result} = this.data
      let idx = this.getdiffIdx(value,result)
      if(idx===0){
        value[1]=0
        value[2]=0
      }
      if(idx===1){
        value[2]=0
      }
      this.setData({
        result:value
      })
      this.autoSetTime(idx)
    },
    autoSetTime(idx){
      let {result,years,months,days} = this.data
      let year = years[result[0]]
      let month = months[result[1]]
      let obj={
        "0":()=>{
          let monthval = this.setYears(year)
          this.setData({
            months:monthval
          })
        },
        "1":()=>{
          let nowdays = this.setMonths(year,month)
          this.setData({
            days:nowdays
          })
        },
        "2":()=>{}
      }
      obj[idx.toString()]()
    },
    getdiffIdx(arr,brr){
      for(var i=0,len=arr.length;i<len;i++){
        if(arr[i]!==brr[i]){break}
      }
      return i
    },
    setYears(year){
      let {startData,maxDay} = this.props
      let endTime = moment().add(maxDay,"days")
      let nowtime = startData?moment(startData):moment()
      let arr=[]
      if(nowtime.year()===endTime.year()){
        arr=this.pushData(nowtime.month()+1,endTime.month()+1)
      }else if(year === nowtime.year()){
        arr = this.pushData(nowtime.month()+1,12)
      }else if(year === endTime.year()){
        arr = this.pushData(1,endTime.month()+1)
      }else{
        arr=[1,2,3,4,5,6,7,8,9,10,11,12]
      }
      return arr
    },
    setMonths(year,month){
      let {startData,maxDay} = this.props
      let endTime = moment().add(maxDay,"days")
      let nowtime = startData?moment(startData):moment()
      let arr=[]
      if(nowtime.year()===endTime.year()&&nowtime.month()===endTime.month()){
        arr = this.pushData(nowtime.date(),endTime.date())
      }else if(nowtime.year()===year&&nowtime.month()===month-1){
        arr = this.pushData(nowtime.date(),nowtime.daysInMonth())
      }else if(endTime.year()===year&&endTime.month()===month-1){
        arr = this.pushData(1,endTime.date())
      }else{
        arr = this.pushData(1,moment([year,month-1]).daysInMonth())
      }
      return arr
    },
    pushData(start,end){
      let arr=[]
      while(start<=end){
        arr.push(start++)
      }
      return arr
    }
  }
})