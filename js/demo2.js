/**
 * Created by northka.chen on 2015/8/26.
 */
;(function(win,undef){
    var demo=(function(win){
        var rAF = window.requestAnimationFrame	||
            window.webkitRequestAnimationFrame	||
            window.mozRequestAnimationFrame		||
            window.oRequestAnimationFrame		||
            window.msRequestAnimationFrame		||
            function (callback) { window.setTimeout(callback, 1000 / 60);},
            winHeight=window.innerHeight,starty,
            startTime,index= 0,topNum,downNum,reg=/^matrix3d\((.*)\)$/,
            event={
                touchstart:"touchstart.turn.page ontouchstart.turn.page",
                touchmove:"touchmove.turn.page",
                touchend:"touchend.turn.page"
            },
            page={
                init:function(){
                    var dom={
                        $box:$(".box"),
                        $top_turn:$(".top_turn"),
                        $down_turn:$(".down_turn")
                        };
                    topNum=dom.$top_turn.length;
                    downNum=dom.$down_turn.length;
                    index=0;
                    dom.$box.css("height",winHeight+"px");
                    this.bindEvent(dom.$box,dom);
                    this.adaptation(dom.$down_turn);
                    $(".down_page").css("transform","translate(0,"+-winHeight/2+"px)")
                },
                adaptation:function($element){
                    var centerP=$element.height()-156+winHeight/2-$(".top_img>img").height();
                    $(".main_p").css("height",centerP);
                    centerP=Math.floor(centerP/16);
                    $(".main_p p").css({"height":centerP*16,"-webkit-line-clamp":""+centerP});
                },
                bindEvent:function($element,dom){
                    $element.off(event.touchstart).on(event.touchstart,function(evt){
                        var e=evt.originalEvent;
                        starty=e.touches[0].clientY;
                        startTime= e.timeStamp;
                    });
                    $element.off(event.touchmove).on(event.touchmove,function(evt){
                        var e=evt.originalEvent,
                            y= e.touches[0].clientY-starty,
                            deg=y/winHeight*180;
                        e.preventDefault();
                        if(deg>0){
                            if(index==0){
                                dom.$top_turn.eq(0).css("transform", "perspective(2000px) rotateX("+-deg/3+"deg)");
                                dom.$down_turn.eq(downNum-1).css("-webkit-filter","contrast(1)");
                            }else{
                                if(deg<90){
                                    dom.$top_turn.eq(index-1).css("-webkit-filter","contrast("+deg/90+")");
                                    dom.$top_turn.eq(index).css("transform", "perspective(2000px) rotateX("+-deg+"deg)");
                                    dom.$down_turn.eq(downNum-index).css("transform", "perspective(2000px) rotateX(90deg)");
                                    dom.$down_turn.eq(downNum-index-1).css("-webkit-filter","contrast(1)")
                                }else{
                                    deg=180-deg;
                                    dom.$top_turn.eq(index-1).css("-webkit-filter","contrast(1)");
                                    dom.$top_turn.eq(index).css("transform", "perspective(2000px) rotateX(-90deg)");
                                    dom.$down_turn.eq(downNum-index).css("transform", "perspective(2000px) rotateX("+deg+"deg)");
                                    dom.$down_turn.eq(downNum-index-1).css("-webkit-filter","contrast("+deg/90+")");
                                }
                            }
                        }else{
                            if(index<downNum){
                                if(index==0){
                                    if(deg>-90){
                                        deg=-deg;
                                        dom.$down_turn.eq(downNum-2-index).css("-webkit-filter","contrast("+deg/90+")");
                                        dom.$down_turn.eq(downNum-1-index).css("transform", "perspective(2000px) rotateX("+deg+"deg)");
                                        dom.$top_turn.eq(index+1).css("transform", "perspective(2000px) rotateX(-90deg)");
                                        dom.$top_turn.eq(index).css("-webkit-filter","contrast(1)");
                                    }else{
                                        deg=180+deg;
                                        dom.$down_turn.eq(downNum-2-index).css("-webkit-filter","contrast(1)");
                                        dom.$down_turn.eq(downNum-1-index).css("transform", "perspective(2000px) rotateX(90deg)");
                                        dom.$top_turn.eq(index+1).css("transform", "perspective(2000px) rotateX("+-deg+"deg)");
                                        dom.$top_turn.eq(index).css("-webkit-filter","contrast("+deg/90+")");
                                    }
                                }else{
                                    if(deg>-90){
                                        deg=-deg;
                                        dom.$top_turn.eq(index).css("-webkit-filter","contrast(1)");
                                        dom.$top_turn.eq(index+1).css("transform", "perspective(2000px) rotateX(-90deg)");
                                        dom.$down_turn.eq(downNum-1-index).css("transform", "perspective(2000px) rotateX("+deg+"deg)");
                                        dom.$down_turn.eq(downNum-2-index).css("-webkit-filter","contrast("+deg/90+")");
                                    }else{
                                        deg=180+deg;
                                        dom.$top_turn.eq(index).css("-webkit-filter","contrast("+deg/90+")");
                                        dom.$top_turn.eq(index+1).css("transform", "perspective(2000px) rotateX("+-deg+"deg)");
                                        dom.$down_turn.eq(downNum-1-index).css("transform", "perspective(2000px) rotateX(90deg)");
                                        dom.$down_turn.eq(downNum-2-index).css("-webkit-filter","contrast(1)");
                                    }
                                }
                            }
                        }
                    });
                    $element.off(event.touchend).on(event.touchend,function(evt){
                        var e=evt.originalEvent,
                            endTime= e.timeStamp;
                        if(endTime-startTime<300){
                            if(e.changedTouches[0].clientY==starty) return;
                            if(e.changedTouches[0].clientY>starty){
                                if(index>0){
                                    var topTurn=dom.$top_turn.eq(index),
                                        result=reg.exec(topTurn.css('transform'))[1].split(', '),
                                        deg=Math.acos(result[5])/Math.PI*180;
                                    if(deg<90){
                                        animateNextPage(-deg,-90,100,topTurn,dom.$down_turn.eq(downNum-index),false);
                                    }else{
                                        var downTurn=dom.$down_turn.eq(downNum-index);
                                            result=reg.exec(topTurn.css('transform'))[1].split(', ');
                                            deg=Math.acos(result[5])/Math.PI*180;
                                        animate(deg,0,100,downTurn);
                                    }
                                    index--;
                                    return;
                                }
                            }else{
                                if(downNum>index){
                                    var downTurn=dom.$down_turn.eq(downNum-1-index),
                                        result=reg.exec(downTurn.css('transform'))[1].split(', '),
                                        deg=Math.acos(result[5])/Math.PI*180;
                                    if(deg<90){
                                        animateNextPage(deg,90,100,downTurn,dom.$top_turn.eq(index+1),true);
                                    }else{
                                        var topTurn=dom.$top_turn.eq(index+1);
                                            result=reg.exec(downTurn.css('transform'))[1].split(', ');
                                            deg=Math.acos(result[5])/Math.PI*180;
                                        animate(-deg,0,100,topTurn);
                                    }
                                    index++;
                                    return;
                                }
                            }
                        }
                        var topTurn=dom.$top_turn.eq(index),
                            result=reg.exec(topTurn.css('transform'))[1].split(', '),
                            deg=Math.acos(result[5])/Math.PI*180;
                            if(index==0){
                                if(deg>0){
                                    animate(-deg,0,300,topTurn);
                                    return;
                                }else{
                                    topTurn=dom.$top_turn.eq(index+1);
                                    result=reg.exec(topTurn.css('transform'))[1].split(', ');
                                    deg=Math.acos(result[5])/Math.PI*180;
                                    if(deg<90){
                                        animate(-deg,0,300,topTurn);
                                        index++;
                                        return;
                                    }
                                }
                            }else{
                                if(deg>0&&deg<90){
                                    animate(-deg,0,300,topTurn);
                                    return;
                                }
                                if(index+1<topNum){
                                    topTurn=dom.$top_turn.eq(index+1);
                                    result=reg.exec(topTurn.css('transform'))[1].split(', ');
                                    deg=Math.acos(result[5])/Math.PI*180;

                                    if(deg<90){
                                        animate(-deg,0,300,topTurn);
                                        index++;
                                        return;
                                    }
                                }
                            }

                        if(downNum-1-index>=0){
                            var downTurn=dom.$down_turn.eq(downNum-1-index);
                            result=reg.exec(downTurn.css('transform'))[1].split(', ');
                            deg=Math.acos(result[5])/Math.PI*180;
                            if(deg > 0){
                                animate(deg,0,300,downTurn);
                            }
                            if(index>0){
                                downTurn=dom.$down_turn.eq(downNum-index);
                                result=reg.exec(downTurn.css('transform'))[1].split(', ');
                                deg=Math.acos(result[5])/Math.PI*180;
                                if(deg>0&&deg!=90){
                                    animate(deg,0,300,downTurn);
                                    index--;
                                }
                            }
                        }else{

                                var downTurn=dom.$down_turn.eq(downNum-index),
                                    result=reg.exec(downTurn.css('transform'))[1].split(', '),
                                    deg=Math.acos(result[5])/Math.PI*180;
                                if(deg>0&&deg!=90){
                                    animate(deg,0,300,downTurn);
                                    index--;
                                }

                        }
                    })
                }
            };
        function animate (start,destination,duration,$that) {
           var startX=start,
               startTime=new Date().getTime(),
               destTime=startTime+duration;
           function step(){
               var now = new Date().getTime(),
                   easing;
               if (now>=destTime) {
                   isAnimating=false;
                   $that.css("transform","perspective(2000px) rotateX("+destination+"deg)");
                   return;
               }
               now = ( now - startTime ) / duration;
               easing =now * ( 2 - now );
               var rotate=(destination-startX)*easing+startX;
               $that.css("transform","perspective(2000px) rotateX("+rotate+"deg)");
               if ( isAnimating ) {
                   rAF(step);
               }
           }
            var isAnimating=true;
            step();
        };
        function animateNextPage (start,destination,duration,$that,$next,up) {
            var startX=start,
                startTime=new Date().getTime(),
                destTime=startTime+duration;
            function step(){
                var now = new Date().getTime(),
                    easing;
                if (now>=destTime) {
                    isAnimating=false;
                    $that.css("transform","perspective(2000px) rotateX("+destination+"deg)");
                    $that.prev().css("-webkit-filter","contrast(1)");
                    if(up){
                        var result=reg.exec($next.css('transform'))[1].split(', '),
                            deg=Math.acos(result[5])/Math.PI*180;
                        animate(-deg,0,100,$next);
                    }else{
                        var result=reg.exec($next.css('transform'))[1].split(', '),
                            deg=Math.acos(result[5])/Math.PI*180;
                        animate(deg,0,100,$next);
                    }
                    return;
                }
                now = ( now - startTime ) / duration;
                easing =now * ( 2 - now );
                var rotate=(destination-startX)*easing+startX;
                $that.css("transform","perspective(2000px) rotateX("+rotate+"deg)");
                $that.prev().css("-webkit-filter","contrast("+rotate/90+")");
                if ( isAnimating ) {
                    rAF(step);
                }
            }
            var isAnimating=true;
            step();
        };
        return page;
    }(win));
    demo.init();
}(window,undefined));
