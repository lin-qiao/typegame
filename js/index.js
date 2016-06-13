var
obj={},
// 数量
shuliang=5,
//分数
rig=0,
//丢失的个数
ls=0,
//时间
t=0,
timerId=null,
//难易度
easy=4,
timerId2=null;

//创建字母
var createzimu=function  () {
  do{
    var zimu=String.fromCharCode(Math.floor(Math.random()*26+65));
  }while($('#'+zimu).length)

  var el='<div class="zi zi-'+zimu+'">'+zimu+'</div>';
  var ran=Math.ceil(Math.random()*easy);
  obj[zimu]={top:-100,yuanshu:'zi-'+zimu,off:ran};
  $('<div id="'+zimu+'"></div>').appendTo('.centent');

  var pos=Math.floor(Math.random()*($('.box').width()-$(el).width()))+"px";
  $(el).css({'left':pos,'top':-100}).appendTo('#'+zimu);

  //创建字母后面的效果
  $('<ul class="bj '+zimu+'"></ul>').css('left',pos).appendTo('#'+zimu);
  for(var i=0;i<30;i++){
    var _z=String.fromCharCode(Math.floor(Math.random()*26+65));
    $('<li>'+_z+'</li>').appendTo('.'+zimu);
  }
}
//页面中添加字母
for(var i=0;i<shuliang;i++){
  createzimu();
}
//删除字母
var removezimu=function(key){
  var el=obj[key].yuanshu;
  $('.'+el).remove();
  $('#'+key).delay(8000).queue(function () {
    $(this).remove().dequeue();
  })
  delete obj[key];
}
//主程序
var diao=function(){
  var arr=[];
  for(var i in obj){
    var el=obj[i];
    var ss=el.yuanshu;
    el.top+=el.off;
    //后面的代码效果
    $('.'+ss).next().children().each(function(i,v){
      var _v=$(v).offset().top+10;
      if(el.top>=_v && el.top<=_v+$(v).height()){
        $(v).css('opacity',1).animate({opacity:0},8000)
      }
    })
    //出屏外
    $('.'+ss).css('top',el.top);
    if(el.top>$('.box').height()+100){
      arr.push(i);
    }
  }
  //删除出屏的元素
  if(arr.length){
    for(var i=0; i<arr.length;i++){
      removezimu(arr[i]);
      createzimu();
      //判断什么时候结束游戏
      if(ls>=5){
        $(document).off('keyup',type);
        $('.over').css('display','block');
        $('.over h2').html(rig);
        clearInterval(timerId2);
      }else{
        ls+=1;
        $('.lose span').html(ls);
      }
    }
  }
}
//鼠标控制
var type=function(e){
  if(e.keyCode===32){
    kaiguan();
  }
  var key=String.fromCharCode(e.keyCode).toUpperCase();
  if(obj[key]){
    var el=obj[key].yuanshu;
    //动画
    $('.'+el)
    .animate({fontSize:1000,opacity:0},1000)
    .queue(function(){
      removezimu(key);
      $(this).dequeue();
    })
    rig+=10;
    $('.grade span').html(rig);
    if(rig>300&&rig<600){
      easy=6;
    }else if(rig>600){
      easy=10;
    }
    createzimu();
  }
}

var kaiguan=function(){
  if(timerId){
    clearInterval(timerId);
    clearInterval(timerId2);
    timerId=false;
  }else{
    timerId=setInterval(diao,30);
    timerId2=setInterval(function(){
      ++t;
      time.innerHTML=(t);
    },1000);
  }
}

var start=function  () {
  $(document).on('keyup',type);
  clearInterval(timerId);
  clearInterval(timerId2);
  timerId=setInterval(diao,30);
  timerId2=setInterval(function(){
    ++t;
    $('.time span').html(t);
  },1000);
}

var stop=function  () {
  clearInterval(timerId);
  clearInterval(timerId2);
}

var again=function  () {
  stop();
  obj={},
  shuliang=7;
  rig=0;
  ls=0;
  easy=4;
  t=0;
  $('.time span').html(0);
  $('.grade span').html(0);
  $('.lose span').html(0);
  timerId=null;
  timerId2=null;
  $('.box .centent').empty();
  for(var i=0;i<shuliang;i++){
    createzimu();
  }
}

//开始
$('.play').on('click',function () {
  $('.main').css('display','none');
  start();
})
//失败后重新开始
$('.restart').on('click',function () {
  $('.over').css('display','none');
  again();
  start();
})
