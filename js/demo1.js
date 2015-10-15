/**
 * Created by northka.chen on 2015/8/25.
 */
;(function(win,def){
    var demo=(function(win){
        var rAF = window.requestAnimationFrame	||
            window.webkitRequestAnimationFrame	||
            window.mozRequestAnimationFrame		||
            window.oRequestAnimationFrame		||
            window.msRequestAnimationFrame		||
            function (callback) { window.setTimeout(callback, 1000 / 60); };
        var winWidth=window.innerWidth,winHeight=window.innerHeight, startX= 0,startY= 0,up=false,beginImg= 0,firstHeight,secondHeight,thirdHeight,
            data=["poster1.jpg","poster1.jpg","poster1.jpg"],
            perfix=[ '-webkit-', '-moz-', '-ms-', '-o-',''],
            event={
                touchstart:"touchstart.picture.topic ontouchstart.picture.topic",
                touchmove:"touchmove.picture.topic",
                touchend:"touchend.picture,topic"
            },
            trans=function($element,value){
                for(var i=0;i<perfix.length;i++) {
                    $element.css(perfix[i] + 'transform',value);
                }
            },
            page={
            init:function(){
                var dom={
                    $box:$(".box"),
                    $container:$(".container"),
                    $boxChild:$(".box>div")
                }
                dom.$box.css("height",winHeight);
                dom.$container.css("height",winHeight);
                this.bindEvent(dom.$boxChild.eq(2));
                this.adaptation(dom.$boxChild);
                this.loaded(dom.$boxChild);
            },
            removeEvent:function(that){
                that.off(event.touchstart);
                that.off(event.touchmove);
                that.off(event.touchend)
            },
            bindEvent:function(that){
                var stop=false,onetouch=true;
                var removeEvent=page.removeEvent,
                    addEvent=page.bindEvent;
                that.off(event.touchstart).on(event.touchstart,function(evt){
                    var e=evt.originalEvent;
                    e.cancelBubble=true;
                    startX= e.touches[0].clientX;
                    startY= e.touches[0].clientY;
                    up=startY<winHeight/2? true:false;
                    onetouch=true;
                });
                that.off(event.touchmove).on(event.touchmove,function(evt){
                    if(!stop){
                        var e=evt.originalEvent,
                            moveX=e.touches[0].clientX-startX,
                            moveY= e.touches[0].clientY-startY,
                            deg=up?moveX/winWidth*45:-moveX/winWidth*45;
                        e.preventDefault();
                        var cosVal = Math.cos(deg * Math.PI / 180), sinVal = Math.sin(deg * Math.PI / 180);
                        var x=$(this).width()/4;
                        var y=$(this).height()/4;
                        var args=[cosVal.toFixed(5),sinVal.toFixed(5)];
                        //$(this).css("-webkit-transform",'matrix('+ args[0] +','+ args[1] +','+ (-args[1]) +','+ args[0] +','+(x*(1-args[0])+y*args[1]+moveX).toFixed(5)+','+(x*args[1]+y*(1-args[0])+moveY).toFixed(5)+') translateZ(0)');
                        trans($(this),'matrix('+ args[0] +','+ args[1] +','+ (-args[1]) +','+ args[0] +','+(x*(1-args[0])+y*args[1]+moveX).toFixed(5)+','+(x*args[1]+y*(1-args[0])+moveY).toFixed(5)+') translateZ(0)');
                        if(e.targetTouches[0].clientY<40&&onetouch){
                            stop=true;
                            that.trigger(event.touchend);
                            removeEvent(that);
                            setTimeout(function(){addEvent(that);},300);
                        }
                    }
                });
                that.off(event.touchend).on(event.touchend,function(){
                    stop=false;
                    var reg=/^matrix\((.*)\)$/,
                        transfrom=$(this).css('-webkit-transform');
                    if(transfrom){var result=reg.exec(transfrom)[1].split(', ');}
                    else{transfrom=$(this).css('transform');var result=reg.exec(transfrom)[1].split(', ');}
                    for(var i=0;i<result.length;i++){
                        result[i]=parseFloat(result[i]);
                    }
                    if(result[1]>0.03||result[1]<-0.03){
                        animate(300,result,$(this));
                        if(data[beginImg]){
                            page.creatNode(data[beginImg]);
                            beginImg++;
                        }else{
                            if($(".box>div").length==3){
                                animate1(500,{top:thirdHeight,transform:0.8},{top:secondHeight,transform:0.9},$(".box>div").eq(0));
                                animate1(500,{top:secondHeight,transform:0.9},{top:firstHeight,transform:1},$(".box>div").eq(1));
                            }
                            else{
                                if($(".box>div").length==2)
                                animate1(500,{top:secondHeight,transform:0.9},{top:firstHeight,transform:1},$(".box>div").eq(0));
                            }
                        }
                    }else{
                        animate2(300,result,$(this))
                    }
                });
            },
            loaded:function($boxChild){
                $(win).load(function(){
                    thirdHeight=Math.abs((winHeight-20-parseInt($boxChild.eq(2).css("height")))/2);
                    secondHeight=thirdHeight+10;
                    firstHeight=thirdHeight+20;
                    $boxChild.eq(0).css("top",thirdHeight);
                    $boxChild.eq(1).css("top",secondHeight);
                    $boxChild.eq(2).css("top",firstHeight);
                });
            },
            adaptation:function($element){
                var centerP=winHeight-436;
                centerP=Math.floor(centerP/16);
                centerP=centerP>1?centerP:1;
                $element.find(".main_p p").css({"max-height":centerP*16+"px","-webkit-line-clamp":""+centerP});
                $element.find(".bottom_left_top").css("width",winWidth*0.85-160)
            },
            creatNode:function(){
                animate1(500,{top:thirdHeight,transform:0.8},{top:secondHeight,transform:0.9},$(".box>div").eq(0));
                animate1(500,{top:secondHeight,transform:0.9},{top:firstHeight,transform:1},$(".box>div").eq(1));
                var struct='<div class="initial">' +
                                '<div class="header">'+
                                    '<img class="firstImg" src="poster1.jpg">'+
                                    '<p class="center_p">范思哲浮华传奇淡香水30ml</p>'+
                                '</div>'+
                                '<div class="main">'+
                                    '<div class="main_top">'+
                                        '<img src="headsculpture.png">'+
                                        '<p>美妆达人<strong>牛尔</strong>推荐</p>'+
                                    '</div>'+
                                    '<div class="main_p">' +
                                        '<img src="yinghao.jpg">'+
                                        '<p>一款具有魔力的香水，超凡脱俗，又性感妖娆，纤细娇贵又勇敢坚定，拥有极致女人味的东方花香。嗅觉金字塔主张极简艺术，增强香水中蕴含优雅！</p>' +
                                    '</div>'+
                                '</div>'+
                                '<div class="bottom">'+
                                    '<div class="bottom_left">'+
                                        '<p class="bottom_left_top">范思哲浮华传奇淡香水30ml</p>'+
                                        '<p class="bottom_left_bottom">¥355<del>¥688</del><span>4.6折</span><p>'+
                                        '<div class="bottom_right">加入购物车</div>'+
                                    '</div>'+
                                '</div>'+
                           '</div>';
                $(struct).insertBefore($(".box>div").eq(0));
                this.adaptation($(".initial"));
                $(".box>div").eq(0).css("top",thirdHeight+"px")
            }
        };
        animate= function (duration,result,that) {
            var startX =result,
                startTime = new Date().getTime(),
                destTime = startTime + duration;
            function step () {
                var now = new Date().getTime(),
                    easing;
                if ( now >= destTime ) {
                    isAnimating = false;
                    page.bindEvent(that.prev("div"));
                    that.remove();
                    return;
                }
                now = ( now - startTime ) / duration;
                easing = Math.sqrt( 1 - ( --now * now ) );
                matrix=[];
                matrix.push(startX[0]*(1-easing));
                matrix.push((1-startX[1])*easing+startX[1]);
                matrix.push((-1-startX[2])*easing+startX[2]);
                matrix.push(matrix[0]);
                if(startX[4]>0)
                    matrix.push((300-startX[4])*easing+startX[4]);
                else matrix.push((-500-startX[4])*easing+startX[4]);
                if(startX[5]>0)
                    matrix.push((1000-startX[5])*easing+startX[5]);
                else matrix.push((-1000-startX[5])*easing+startX[5]);
                //that.css("-webkit-transform", "matrix("+matrix[0]+","+matrix[1]+","+matrix[2]+","+matrix[3]+","+matrix[4]+","+matrix[5]+") translateZ(0)");
                trans(that,"matrix("+matrix[0]+","+matrix[1]+","+matrix[2]+","+matrix[3]+","+matrix[4]+","+matrix[5]+") translateZ(0)");
                if ( isAnimating ) {
                    rAF(step);
                }
            }
            var isAnimating = true;
            step();
        };
        animate1= function (duration,start,result,that) {
            var startX =start,
                startTime = new Date().getTime(),
                destTime = startTime + duration;
            function step () {
                var now = new Date().getTime(),
                    easing;
                if ( now >= destTime ) {
                    isAnimating = false;
                    that.css({
                        top:result.top+"px",
                    })//.css("-webkit-transform","scaleX("+result.transform+")"+"scaleY("+result.transform+") translateZ(0)");
                    trans(that,"scaleX("+result.transform+")"+"scaleY("+result.transform+") translateZ(0)")
                }
                now = ( now - startTime ) / duration;
                easing = now * ( 2 - now );
                var transform=(result.transform-startX.transform)*easing+startX.transform,
                    top=(result.top-startX.top)*easing+startX.top;

                that.css({
                    top:top+"px",
                })//.css("-webkit-transform","scaleX("+transform.toFixed(6)+")"+"scaleY("+transform.toFixed(6)+") translateZ(0)");
                trans(that,"scaleX("+transform.toFixed(6)+")"+"scaleY("+transform.toFixed(6)+") translateZ(0)");
                if ( isAnimating ) {
                    rAF(step);
                }
            }
            var isAnimating = true;
            step();
        };
        animate2= function (duration,start,that) {
            var startX =start,
                startTime = new Date().getTime(),
                destTime = startTime + duration;
            function step () {
                var now = new Date().getTime(),
                    easing;
                if ( now >= destTime ) {
                    isAnimating = false;
                    //that.css("-webkit-transform", "matrix(1,0,0,1,0,0) translateZ(0)");
                    trans(that,"matrix(1,0,0,1,0,0) translateZ(0)")
                }
                now = ( now - startTime ) / duration;
                easing = Math.sqrt( 1 - ( --now * now ) );
                matrix=[];
                matrix.push(((1-startX[0])*easing+startX[0]).toFixed(6));
                matrix.push(((0-startX[1])*easing+startX[1]).toFixed(6));
                matrix.push(((0-startX[2])*easing+startX[2]).toFixed(6));
                matrix.push(((1-startX[3])*easing+startX[3]).toFixed(6));
                matrix.push(((0-startX[4])*easing+startX[4]).toFixed(6));
                matrix.push(((0-startX[5])*easing+startX[5]).toFixed(6));
               // that.css("-webkit-transform", "matrix("+matrix[0]+","+matrix[1]+","+matrix[2]+","+matrix[3]+","+matrix[4]+","+matrix[5]+") translateZ(0)");
                trans(that,"matrix("+matrix[0]+","+matrix[1]+","+matrix[2]+","+matrix[3]+","+matrix[4]+","+matrix[5]+") translateZ(0)");
                if ( isAnimating ) {
                    rAF(step);
                }
            }
            var isAnimating = true;
            step();
        };
        return page;
    }(window));
    demo.init();
}(window,undefined));
$("input").on("click",function(){
    location.reload();
});
$(".container").on("touchmove",function(evt){
    var e=evt.originalEvent;
    e.preventDefault()
})