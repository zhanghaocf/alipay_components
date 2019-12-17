const config = getApp().globalData;
import robottp from "/templates/searchrule/index.js";
import ruletp from "/templates/rule/rule.js";
Component({
  props: {
    showFlag:false,
    ruleTp:{
      keyword:'',
      rulestyle:[],
      selId:0,
      search:{
        pageIndex:1,
        pageTotal:0,
        list:[]
      },
      allList:[{
        pageIndex:1,
        pageTotal:0,
        id:1,
        list:[]
      }],
      touimg:"",
      isLoading:false,
      isFinish:false,
      searchStatus:0, //0为不显示状态图，1为没有找到规格图，2为努力加载图，3为检查网络图，4为出错图
      onSelType:()=>{}, //选择规格
      onQuerylist:()=>{}
    },
    onControlRule:()=>{},
    onRuledetail:()=>{},
    onChangeKey:()=>{},//关键字修改
    onAutoSpec:()=>{}//点击自定义规格
  },
  didMount(){
    this.setHeight()
  },
  data:{
    sv:'',
    current:-1,
    scrollViewHeight:0,
    ruleHeight:0,
    typerule:[],
    isIos:false
  },
  methods:{
    selType(e){
      let defaultid =ruletp.selType.call(this,e)
      let {selId} = this.props.ruleTp
      if(selId===defaultid){
        console.log("重复点击了")
        return
      }
      this.props.onSelType(defaultid)
    },
    onShowpop(){
      this.props.onControlRule()
      this.setData({
        sv:'topsearch',
        current:0
      },()=>{
        this.setData({
          sv:'',
          current:-1
        })
      })
    },
    onGetList(){
      let {ruleTp} = this.props
      let name = ruleTp.keyword!==""?"scrollKey":"showClassify"
      this.props.onQuerylist(name)
    },
    setHeight(){
      let sys = my.getSystemInfoSync();
      let h = sys.windowHeight;
      this.setData({
        scrollViewHeight:h*0.8,
        ruleHeight:h*0.85,
        isIos:config.isIos
      })
    },
    makerule(){
      robottp.makerule.call(this)
    },
    refreshfn(){
      robottp.refreshfn.call(this)
      this.onGetList()
    },
    ruledetail(e){
      ruletp.ruledetail.call(this,e)
    },
    searchFn(e){
      ruletp.searchFn.call(this,e)
    },
    closeipt(){
      ruletp.closeipt.call(this)
    }
  },
});