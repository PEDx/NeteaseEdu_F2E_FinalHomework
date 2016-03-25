(function(){							
    var STEP=5000;
    var _slide = document.getElementById('m-slide')
    var _ctrls = _slide.getElementsByTagName('i');
    var _lists = _slide.getElementsByTagName('li');
    var pcnt=_lists.length;
    var i=1;
//读取cookie函数
    function getCookie(c_name){
        if (document.cookie.length>0){ 
            c_start=document.cookie.indexOf(c_name + "=")
            if (c_start!=-1){ 
                c_start=c_start + c_name.length+1 
                c_end=document.cookie.indexOf(";",c_start)
                if (c_end==-1) c_end=document.cookie.length
                return unescape(document.cookie.substring(c_start,c_end))
            } 
        }
        return ""
    }
//设置cookie函数
    function setCookie(c_name,value,expiredays){
        var exdate=new Date()
        exdate.setDate(exdate.getDate()+expiredays)
        document.cookie=c_name+ "=" +escape(value)+
        ((expiredays==null) ? "" : "; expires="+exdate.toGMTString())
    }

    function hasClass(_object,_clsname){
        var _sCls = " "+(_object.className)+" ";
        return (_sCls.indexOf(" "+_clsname+" ") != -1) ? true : false;
    }

    function toClass(_str){
        var _str = _str.toString();
        _str = _str.replace(/(^\s*)|(\s*$)/g,"");
        _str = _str.replace(/\s{2,}/g," ");
        return _str;
    }
//为元素添加类名
    function addClass(_object,_clsname){
        if(!hasClass(_object,_clsname)){
            _object.className = toClass(_object.className+(" "+_clsname));
        }
    }
//为元素删除类名
    function delClass(_object,_clsname){
        if(hasClass(_object,_clsname)){
            _object.className = toClass(_object.className.replace(new RegExp("(?:^|\\s)"+_clsname+"(?=\\s|$)","g")," "));
        }
    }
    function each(_objects,_fn){
        for(var i=0,len=_objects.length;i<len;i++){
            _fn(_objects[i],i);
        }
    }
//dataset兼容方案
    function getDataset(ele){
        if(window.dataset){
            return ele.dataset;
        }else{
            var oAttributes = window.attributes;
            var dataset = {};
            for(var i=0; i<this.length; i++){
                if(/^data-/.test(oAttributes[i].nodeName)){
                    var name = oAttributes[i].nodeName.slice(5).toLowerCase().replace(/-(.)/g, function(match, p1){
                        return p1.toUpperCase();
                    });
                    dataset[name] = oAttributes[i].value;
                }
            }
            return dataset;
        }
    }

    function addURLParam(url,name,value){
        url +=(url.indexOf("?")==-1 ? "?" : "&");
        url +=encodeURIComponent(name) + "=" +encodeURIComponent(value);
        return url;
    }
    function delThenadd(_object,_clsname1,_clsname2){
        delClass(_object,_clsname1);
        addClass(_object,_clsname2);
    }
//异源策略跨浏览器方案
    function createCORSRequest(method,url){
        var xhr=new XMLHttpRequest();
        if("withCredentials" in xhr){
            xhr.open(method,url,true);
        }else if(typeof XDomainRequest != "undefined"){
            xhr=new XDomainRequest();
            xhr.open(method,url);
        }else {
            xhr=null;
        }
        return xhr;
    }
//事件对象兼容封装    
    var EventUtil={
        getEvent:function(event){
            return event?event:window.event;
        },
        getTarget:function(event){
            return event.target||event.srcElenment;
        }
    }
//圆点和图片动画函数
    var runf=function(index){
        each(_lists,function(_list,i){
            delClass(_list,"z-crt");
        });
        each(_ctrls,function(_ctrl,i){
            delClass(_ctrl,"z-crt");
        });
        addClass(_lists[index],"z-crt");
        addClass(_ctrls[index],"z-crt");
    }
//自动轮播
    var settime=setInterval(function(){
        if (i<pcnt){
            runf(i);
            i++;
        }
        if(i==pcnt){
            i=0;
        } 
    },STEP);
//遍历每个小圆点 添加鼠标点击事件处理函数
    each(_ctrls,function(_ctrl,i){
        _ctrl.onclick=function(){
            clearInterval(settime);                
            runf(i);
        } 
    });
//鼠标移入清除自动轮播
    _slide.onmouseover=function () {
        clearInterval(settime);
    }
//鼠标移出设置自动轮播     
    each(_lists,function(_list,i){
        _list.onmouseout=(function(){
            var getElement = function (eve, filter) {
                var element = EventUtil.getTarget(EventUtil.getEvent(eve));
                while (element) {
                    if (filter(element))
                        return element;
                    element = element.parentNode;
                }
            }
            return function (event) {
                var elecnt = getElement(event, function (ele) {
                    return (ele.className.indexOf("bn") !== -1);
                });  
                i=this.value;
                if(i==2){
                    i=0;
                }else i++;           
                settime=setInterval(function(){
                    if (i<pcnt){
                        runf(i);
                        i++;
                    }
                    if(i==pcnt){
                        i=0;
                    } 
                },STEP);
            }
        })();
    });
//关闭顶部小条
    var ele=document.getElementById('header');
     if(getCookie("hasClosed")==1){
        addClass(ele,"closed");
    }
    document.getElementById("close").onclick=function(){
        addClass(ele,"closed");
        setCookie("hasClosed",1,365);
    };
//登录与关注
    var s5=document.getElementById('s5');
    var s6=document.getElementById('s6');
    var ms=document.getElementById('m-ms');
    document.getElementById('x').onclick=function(){
        delThenadd(ms,"open","closed");
        document.forms.log.reset();
        delThenadd(document.getElementById('error'),"open","closed");
    }
//关闭视频
    document.getElementById('x2').onclick=function(){
        delThenadd(document.getElementById('m-ms2'),"open","closed");
        player.currentTime = 0;
        player.pause();
    }
//点击打开视频和遮罩
    document.getElementById('mov').onclick=function(){
        delThenadd(document.getElementById('m-ms2'),"closed","open");
    }
//播放按钮    
    document.getElementById('playbtm').onclick=function(){
        delThenadd(document.getElementById('playbtm'),"open","closed");
        player.play();
    }
//点击播放画面暂停播放    
    document.getElementById('player').onclick=function(){
        player.pause();
        delThenadd(document.getElementById('playbtm'),"closed","open");
    }
//关注cookie
    if(getCookie("followSuc")){
        addClass(s5,"closed");
    }else addClass(s6,"closed");
    s5.onclick=function(){
        if(getCookie("loginSuc")){
            var xhrt=createCORSRequest("get","http://study.163.com/webDev/attention.htm");
            if(xhrt){
                xhrt.onload=function(){
                    if(this.responseText=="1"){
                        addClass(s5,"closed");
                        addClass(s6,"open");
                        setCookie("followSuc",1,365);
                        }
                }
                xhrt.send();
            }
        }else{
            addClass(ms,"open");
        }
    }
//登录框事件
    var ipt1=document.getElementById("ipt1");
    var ipt2=document.getElementById("ipt2");
    document.getElementById('user').onkeydown=function(){
        delThenadd(ipt1,"open","closed");
    }
    document.getElementById('user').onblur=function(){
        if(document.getElementById('user').value==""){
            delThenadd(ipt1,"closed","open");
        }
    }
    document.getElementById('passw').onkeydown=function(){
        delThenadd(ipt2,"open","closed");
    }
    document.getElementById('passw').onblur=function(){
        if(document.getElementById('passw').value==""){
            delThenadd(ipt2,"closed","open");
        }
    }
//登录事件和通讯
    document.getElementById('dologin').onmousedown=function(){
        delThenadd(document.getElementById('dologin'),"clickup","clickdown");
    }
    document.getElementById('dologin').onmouseup=function(){
        delThenadd(document.getElementById('dologin'),"clickdown","clickup");
    }
    document.getElementById('dologin').onclick=function(){
        var userData=hex_md5(document.forms.log['user'].value);
        var passwordData=hex_md5(document.forms.log['passw'].value);
        var url="http://study.163.com/webDev/login.htm"
        url=addURLParam(url,"userName",userData);
        url=addURLParam(url,"password",passwordData);
        var xhrt=createCORSRequest("get",url);
        if(xhrt){
            xhrt.onload=function(){
                if(this.responseText=="1"){
                    setCookie("loginSuc",1,365);
                    setCookie("followSuc",1,365);
                    var xhrt=createCORSRequest("get","http://study.163.com/webDev/attention.htm");
                    if(xhrt){
                        xhrt.onload=function(){
                            if(this.responseText=="1"){
                                addClass(s5,"closed");
                                addClass(s6,"open");
                                setCookie("followSuc",1,365);
                                delThenadd(ms,"open","closed");
                            }
                        }
                        xhrt.send();
                    }
                }   else{
                        delThenadd(document.getElementById('error'),"closed","open");
                    }
            }
            xhrt.send();      
        }    
    } 
    function clearHtmItm(ele){
        ele.innerHTML="";
    }
    function appendText(ele,str){
        ele.appendChild(document.createTextNode(str));
    }
    function append(ele,ele2){
        ele.appendChild(ele2);
    }
    function apply(appendEle,createEle,eleText){
        var ele=document.createElement(createEle);
        if(eleText){
            appendText(ele,eleText);
        }
        append(appendEle,ele);
        return ele;
    }
//生成课程卡片列表
    function creatHtmItm(cnt,couList){
        for(var i=0;i<cnt;i++){
            var xdiv=document.createElement("div");
            xdiv.className="cou";
            xdiv.id="cou"+i;
            xdiv.onmouseover="hehe"
            var xa=apply(xdiv,"a");
                var div2=apply(xa,"div");
                div2.id="cont";
                    var div3=apply(div2,"div");
                    div3.className="pic";
                        var img=apply(div3,"img")
                        img.src=couList[i].middlePhotoUrl;

                    var div4=apply(div2,"div")
                    div4.className="titl";
                        var h2=apply(div4,"h2",couList[i].name);
                        h2.className="cont";

                    var div5=apply(div2,"div",couList[i].provider);
                    div5.className="provider";

                    var div6=apply(div2,"div");
                    div6.className="info";
                        var div7=apply(div6,"div");
                        div7.className="cnt";
                            var span1=apply(div7,"span",couList[i].learnerCount)

                        var div8=apply(div6,"div");
                        div8.className="mon";
                            var span2=apply(div8,"span");
                            if(couList[i].price==0){
                                span2.appendChild(document.createTextNode("免费"));
                            }else span2.appendChild(document.createTextNode("¥"+couList[i].price));
                            div8.appendChild(span2);
//生成课程详情
                    var div7=apply(div2,"div");
                    div7.id="detail";
                    div7.className="closed";
                        var div8=apply(div7,"div");
                        div8.className="top f-cb";
                            var div9=apply(div8,"div");
                            div9.className="pic";
                                var img=apply(div9,"img")
                                img.src=couList[i].middlePhotoUrl;

                            var div10=apply(div8,"div");
                            div10.className="info f-cb";
                                var div11=apply(div10,"div");
                                div11.className="titl";
                                    var h2=apply(div11,"h2",couList[i].name);
                                    h2.className="cont";

                                var div12=apply(div10,"div");
                                div12.className="cnt";
                                    var span3=apply(div12,"span",couList[i].learnerCount);
                                    span3.className="hot"
                                var span4=apply(div10,"span","人在学");
                                span4.className="wei"

                                var div13=apply(div10,"div");
                                div13.className="provider";
                                    var span5=apply(div13,"span","发布者：");
                                    span5.className="hot"
                                    var span6=apply(div13,"span",couList[i].provider);

                                var div14=apply(div10,"div");
                                div14.className="categ";
                                    var span7=apply(div14,"span","分类：");
                                    var span8=apply(div14,"span",couList[i].categoryName);
                        var div15=apply(div7,"div");
                        div15.className="bottom";
                            var p1=apply(div15,"p",couList[i].description);
            itmList.appendChild(xdiv);
//为课程卡片绑定事件处理函数            
            (function(e,a){ 
                (function() {
                    a.onmouseover=function(){
                        delThenadd(e,"closed","open");
                    }
                    a.onmouseout=function(){
                        delThenadd(e,"open","closed");
                    }
                })();
            })(div7,xdiv);
        }
    }
//生成分页器
    var pagelist=document.getElementById("pageList");
    function creatPageNav(index,pageAll,coursetype,mod){
        var pre=apply(pagelist,"a");
        pre.className="pre";
        pre.onclick=function(){
            var prePageNum=index-1;
            if(prePageNum>=1){
                clearHtmItm(itmlist);
                clearHtmItm(pagelist);
                applyCous(prePageNum,20,coursetype);
            } 
        }
        // apply(pagelist,"a",1).value=1;
        var asp=apply(pre,"span");
        if(index<7){
            for(var i=1;i<=8;i++){
                var a=apply(pagelist,"a",i);
                a.name="nav";
                a.value=i;
                if(a.value!=index){
                    (function(n,m){
                        (function() {
                            n.onclick=function(){
                                clearHtmItm(itmlist);
                                clearHtmItm(pagelist);
                                if(m==pageAll){
                                    applyCous(pageAll,mod,coursetype);
                                }else {
                                    applyCous(m,20,coursetype);
                                }
                            }
                        })();
                    })(a,a.value); 
                } 
            }
            var navList=document.getElementsByName("nav");
            for(var i=0;i<index;i++){
                if(navList[i].value==index){
                    navList[i].className="navSec"; 
                }
            }
        }else{
            var index1=apply(pagelist,"a",1);
            index1.onclick=function(){
                clearHtmItm(itmlist);
                clearHtmItm(pagelist);
                applyCous(1,20,coursetype);
            }
            var asp=apply(pagelist,"span","...");
            asp.className="zdot";
            for(var i=index-3;(i<=index+3)&&(i<=27);i++){
                console.log(pageAll);
                if(i==index){
                    var idx=apply(pagelist,"a",i);
                    idx.value=i;
                    idx.className="navSec";
                }else {
                    var idx=apply(pagelist,"a",i);
                    idx.value=i;
                    (function(n,m){
                        (function() {
                            n.onclick=function(){
                                clearHtmItm(itmlist);
                                clearHtmItm(pagelist);
                                if(m==pageAll){
                                    console.log(m);
                                    applyCous(m,mod,coursetype);
                                }else {
                                    applyCous(m,20,coursetype);
                                }
                                // this.disabled = true;
                            }
                        })();
                    })(idx,idx.value);
                }
            }
        }
        if(pageAll>8&&(index+3)<27){
            var asp=apply(pagelist,"span","...");
            asp.className="zdot";
        }
        var nxt=apply(pagelist,"a");
        nxt.className="nxt";
        var asp=apply(nxt,"span");
        nxt.onclick=function(){
            var nxtPageNum=index+1;
            if(nxtPageNum<=27){
                clearHtmItm(itmlist);
                clearHtmItm(pagelist);
                if(nxtPageNum==27){
                    applyCous(nxtPageNum,mod,coursetype);
                }else applyCous(nxtPageNum,20,coursetype);
            } 
            
        }
    }
    // creatPageNav(9,9);
//跨域请求课程列表jason数据
    var itmlist=document.getElementById("itmList");
    function applyCous(pageNum,pagecount,coursetype){
        var url="http://study.163.com/webDev/couresByCategory.htm"
        var allcnt;
        url=addURLParam(url,"pageNo",pageNum);
        url=addURLParam(url,"psize",pagecount);
        url=addURLParam(url,"type",coursetype);
        var xhr1=createCORSRequest("get",url);
        if(xhr1){
            xhr1.onload=function(){
                if(xhr1.responseText){
                        var courseData=JSON.parse(xhr1.responseText);
                        var cindex=courseData.pagination.pageIndex;//当前页码
                        var ccnt=courseData.pagination.pageSize;//每页的数据个数
                        var allcnt=courseData.pagination.totlePageCount;//总页数
                        var allcot=courseData.totalCount;//返回的数据总数
                        var allpag=courseData.totalPage;//返回的数据总页数
                        var mod=allcot-(allcnt-1)*ccnt;//最后一页卡片数目
                        creatHtmItm(ccnt,courseData.list);
                        creatPageNav(pageNum,allcnt,coursetype,mod);
                        console.log(courseData);
                        console.log(allcnt);
                }
            }
            xhr1.send();
        }
    }
//初始化页面
    applyCous(1,20,10);
//tab事件添加
    document.getElementById("lan").onclick=function(){
        clearHtmItm(itmlist);
        clearHtmItm(pagelist);
        applyCous(1,20,20);
        delThenadd(document.getElementById("lan"),"notsec","sec");
        delThenadd(document.getElementById("pro"),"sec","notsec");
    }
    document.getElementById("pro").onclick=function(){
        clearHtmItm(itmlist);
        clearHtmItm(pagelist);
        applyCous(1,20,10);
        delThenadd(document.getElementById("lan"),"sec","notsec");
        delThenadd(document.getElementById("pro"),"notsec","sec");
    }
//生成热门列表    
    var topList=document.getElementById("list");
    function creatTopItm(index,hotList){
        for(var i=index;i<index+10;i++){
            var a=i;
            if(i>=20){
               a=i%20; 
            }
            var a1=apply(topList,"a");
                var div1=apply(a1,"div");
                div1.className="itm";
                    var div2=apply(div1,"div");
                    div2.className="pic";
                        var img=apply(div2,"img")
                        img.src=hotList[a].smallPhotoUrl;

                    var div3=apply(div1,"div");
                    div3.className="info f-cb";
                        var div4=apply(div3,"div");
                        div4.className="titl";
                            var h2=apply(div4,"h2",hotList[a].name);
                            h2.className="cont";

                        var div5=apply(div3,"div");
                        div5.className="cnt";
                            var span3=apply(div5,"span",hotList[a].learnerCount);
        }
    }
//请求边栏热门课程数据
    var url="http://study.163.com/webDev/hotcouresByCategory.htm"
    var xhr2=createCORSRequest("get",url);
    if(xhr2){
        xhr2.onload=function(){
            if(xhr2.responseText){
                var hotData=JSON.parse(xhr2.responseText);
                var idx=0;
                creatTopItm(idx,hotData);
                idx++;
//滚动函数
                setInterval(function(){  
                    clearHtmItm(topList);
                    creatTopItm(idx,hotData);
                    idx++;
                    if(idx==hotData.length){
                        idx=0;
                    }
                },STEP);
            }
        }
        xhr2.send();
    }
})();