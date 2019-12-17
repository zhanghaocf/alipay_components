Component({
  /**
   * 组件的属性列表
   */
  props: {
    scrollViewHeight: 0,
    isLoading: false,
    lowerThreshold:10,
    isFinish:false,
    loadingType:'Loading0',
    isHidden:false,
    scrolltoView:'',
    onGetList:()=>{}
  },
  /**
   * 组件的初始数据
   */
  data: {
    scrolltop:0,//进去就是0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getList: function () {
      this.props.onGetList()
    }
  }
})
