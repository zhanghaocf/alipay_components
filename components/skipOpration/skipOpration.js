Component({
  props:{
    needSkip:false,
    index:0,
    skipHeight:300,
    margBo:15,
    //不是选中哪个index，只是为了让列表只有一个可以弹出菜单设置的变量
    selectIndex:-1,
    onSt:()=>{},//触摸开始
    onDel:()=>{}//删除订单
  },
  data:{
    maxSkipDistance:182,
    tranX:0,
    startX:0,
    isMove:false,
    transStyle: 'transition:transform 0.2s linear;-webkit-transition: -webkit-transform 0.2s linear',
    isSame:false
  },
  methods:{
    startTouch(e) {
      // console.log(e.touches[0].pageX);
      //console.log(e.currentTarget.dataset.index);
      var index = e.currentTarget.dataset.index;
      var selectIndex = this.props.selectIndex;
      if (selectIndex === index){
        this.setData({
          isSame:true,
          startX: e.touches[0].pageX
        });
        return;
      }
      this.setData({
        startX: e.touches[0].pageX,
        isSame: false,
        isMove: true,
      });
    },
    moveTouch(e) {
      var data = this.data;
      var startX = data.startX;
      var pageX = e.touches[0].pageX;
      var index = e.currentTarget.dataset.index;
      var maxSkipDistance = data.maxSkipDistance;
      var isSame = data.isSame;
      var distance = pageX - startX;
      console.log(distance)
      if (distance < 0 && !isSame) {
        distance = distance <= -maxSkipDistance ? -maxSkipDistance : distance;
        this.setData({
          tranX: distance
        })
        this.props.onSt(index)
      }
      if (distance > 0 && isSame) {
        distance = distance-maxSkipDistance >=0 ? 0 : distance-maxSkipDistance;
        this.setData({
          tranX: distance
        })
        this.props.onSt(index)
      }
    },
    endTouch(e) {
      var data = this.data;
      var startX = data.startX;
      var isSame = data.isSame;
      var pageX = e.changedTouches[0].pageX;
      var maxSkipDistance = data.maxSkipDistance;
      var distance = pageX - startX;
      //console.log(distance)
      var obj = {};
      var defaultval = isSame ? 30 : -80;
      if(distance>0&&!isSame){
        //从划出到滑离开不在同一个就花不离开
        return;
      }
      if (distance > defaultval) {
        let obj ={
          tranX:0
        }
        this.props.onSt(-1)
      } else {
        obj = {
          tranX: -maxSkipDistance,
        }
      }
      obj.isMove = false;
      this.setData(obj)
    },
    delFn(e) {
      const index = e.currentTarget.dataset.index;
      this.props.onDel(index)
    }
  }
})