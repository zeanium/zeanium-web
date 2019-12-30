!function(e){e.cookie=e.Class({static:!0,methods:{setItem:function(e,t,n){var o=e+"="+encodeURIComponent(t);n&&(o+="; expires="+new Date(+new Date+36e5*n).toGMTString()),document.cookie=o},getItem:function(e){return new RegExp("(?:; )?"+e+"=([^;]*);?").test(document.cookie)?decodeURIComponent(RegExp.$1):null},removeItem:function(e){this.setItem(e,null,-9999)},clear:function(){document.cookie=null}}})}(zn);
!function(s){var e=s.Class({events:["before","array","object","convert","data","error","after"],properties:{zncaller:null,argv:null,context:null,data:null},methods:{init:function(t,r,i){var e=t||{},n=e.auto;null==n&&(n=!0),this._argv=e,this._context=i,this.__initEvents(r),s.is(e,"object")&&(this._zncaller=e.zncaller),n&&this.__init(e)},refresh:function(t,r,i){return this.overwriteCall(t||this._argv,r,i),this},recall:function(){return this.refresh(),this},call:function(t){return this.__init(t),this},overwriteCall:function(t,r,i){return t&&(this._argv=t,i&&(this._context=i),r&&this.__initEvents(r),this.__init(this._argv)),this},__initEvents:function(t){if(t)for(var r in t)this.on(r,t[r],this);return this},__init:function(t){var r=Object.prototype.toString.call(t);this.fire("before",t),"[object Array]"==r?(t.owner=this,t.refresh=t.owner.refresh,this.__array(t)):"[object Object]"==r?(t.owner=this,t.refresh=t.owner.refresh,this.__object(t)):this.fire("error",t)},__array:function(t){this.fire("array",t),this.fire("after",this.__dataConvert(t))},__object:function(t){this.fire("object",t);var r=this._zncaller||s.data.zncaller;if(!r)throw new Error("zncaller is null");r.call(t,this._context||r).then(function(t,r){this.fire("after",this.__dataConvert(t),r)}.bind(this),function(t){this.fire("error",t)}.bind(this))},__dataConvert:function(t){var r=this.fire("convert",t);if(null!=r)return r;var i=t.result||t;return this._data=this.fire("data",i)||i,this._data}}});s.data=s.Class({static:!0,properties:{zncaller:null},methods:{create:function(t,r,i){return new e(t,r,i)},settings:function(t){return this.sets(t),this}}})}(zn);
!function(s){var o=document.createElement("div").style,r=/width|height|top|right|bottom|left|size|margin|padding/i,i=/[c-x%]/,e=/(?:^|-)([a-z])/g,n=/([A-Z])/g,l={lineHeight:!0,zIndex:!0,zoom:!0},a={float:"cssFloat"};s.style=s.Class({static:!0,methods:{each:function(t,e,n){if(t&&e){var o=t.length;if(0<=o)for(var r=0;r<o;r++)e.call(n,t[r],r);else for(var s in t)t.hasOwnProperty(s)&&e.call(n,t[s],s)}},getCssText:function(t){var n=[""];return this.each(t,function(t,e){n.push(this.getStyleProperty(e,!0)+":"+this.getStyleValue(e,t))},this),n.join(";")},getStyleValue:function(t,e){var n=this.getStyleProperty(t),o=e;return r.test(n)&&(i.test(e)||l[n]||(o+="px")),o},getStyleProperty:function(t,e){var n=this.lowerCamelCase(t);return n in o?e&&(n=this.deCamelCase(t)):n=e?env.prefix()[1]+t:env.prefix()[0]+this.upperCamelCase(t),a[t]||n},lowerCamelCase:function(t){var e=this.upperCamelCase(t);return e.charAt(0).toLowerCase()+e.substring(1)},upperCamelCase:function(t){return t.replace(e,function(t,e){return e.toUpperCase()})},deCamelCase:function(t){return t.replace(n,function(t,e){return"-"+e.toLowerCase()})},capitalize:function(t){return t.charAt(0).toUpperCase()+t.slice(1)}}}),s.dom=s.Class({static:!0,methods:{init:function(){this._roots=[]},createRootElement:function(t,e){var n=this.createElement(t,e,document.body);return this._roots.push(n),n},createElement:function(t,e,n){var o=t||"div",r=e||{},s=document.createElement(o);for(var i in r)s.setAttribute(i,r[i]);return n&&n.appendChild(s),s},removeAllRoots:function(){return this._roots.forEach(function(t){document.body.removeChild(t)}),this._roots=[],this},hasClass:function(t,e){return t.classList.contains(e)},addClass:function(t){var e=t.classList;return arguments.shift(),e.add.apply(e,arguments)},removeClass:function(t){var e=t.classList;return arguments.shift(),e.remove.apply(e,arguments)},toggleClass:function(t,e){return t.classList.toggle(e)},setStyle:function(t,e,n){var o=s.style.getStyleProperty(e);t.style[o]=s.style.getStyleValue(e,n)},getStyle:function(t,e,n){var o=t,r=s.style.getStyleProperty(e);return(n?t.style:window.getComputedStyle?getComputedStyle(o,null):o.currentStyle)[r]||""},removeStyle:function(t,e){var n=s.style.getStyleProperty(e,!0);t.style.removeProperty(n)},hasStyle:function(t,e){return-1<t.style.cssText.indexOf(e+":")},setStyles:function(t,e){t.style.cssText+=s.style.getCssText(e)},getPosition:function(t){var e=t,n=0,o=0,r=0,s=0;if(e.getBoundingClientRect){var i=e.getBoundingClientRect();n=i.left+Math.max(document.documentElement.scrollLeft,document.body.scrollLeft)-document.documentElement.clientLeft,o=i.top+Math.max(document.documentElement.scrollTop,document.body.scrollTop)-document.documentElement.clientTop,r=i.width,s=i.height}else{for(;e!=document.body&&e;)n+=e.offsetLeft,o+=e.offsetTop,e=e.offsetParent;r=e.offsetWidth,s=e.offsetHeight}return{x:n,y:o,width:r,height:s}},on:function(t,e,n,o){t.addEventListener?t.addEventListener(e,n,o||!1):element.attachEvent?t.attachEvent("on"+e,n):t["on"+e]=n},off:function(t,e,n){t.removeEventListener?t.removeEventListener(e,n,!1):t.detachEvent?t.detachEvent("on"+e,n):t["on"+e]=null}}})}(zn);
!function(o){o.draggable=o.Class({statics:{create:function(o,n){return new this.prototype.constructor(o,n)}},methods:{init:function(o,n){var t=n||{},r={source:o,vector:["left","top"],start:["30","30"],minX:0,maxX:null,minY:0,maxY:null,xHandler:null,yHandler:null,onDragStrat:function(){},onDrag:function(){},onDragEnd:function(){}};for(var e in r)t.hasOwnProperty(e)||(t[e]=r[e]);var s=t.source,u=t.start,a=t.vector;t.DX=a[0],t.DY=a[1],s.style.position="absolute",o.style.cursor="move",u&&(s.style[t.DX]=(u[0]||0)+"px",s.style[t.DY]=(u[1]||0)+"px"),(this._argv=t).event&&this.__mousedown(t.event),o.onmousedown=this.__mousedown.bind(this)},__mousedown:function(o){var n=o||window.event,t=this._argv,r=t.source,e=parseFloat(r.style[t.DX])||0,s=parseFloat(r.style[t.DY])||0,u=n.clientX||n.x,a=n.clientY||n.y,i=t.onDragStrat&&t.onDragStrat(e,s,u,a,n);if(i)for(var m in i)void 0!==i[m]&&null!==i[m]&&(t[m]=i[m]);return t.currX=e,t.currY=s,t.mouseX=u,t.mouseY=a,!1!==(!!t.onDragStart&&t.onDragStart(o,t))&&(document.onmousemove=this.__mousemove.bind(this),document.onmouseup=this.__mouseup.bind(this)),!1},__mousemove:function(o){var n=o||window.event,t=n.clientX||n.x,r=n.clientY||n.y,e=this._argv,s=t-e.mouseX,u=r-e.mouseY;"right"==e.DX.toLowerCase()&&(s*=-1),"bottom"==e.DY.toLowerCase()&&(u*=-1);var a=e.currX+s,i=e.currY+u;return a<e.minX&&(a=e.minX),e.maxX&&a>e.maxX&&(a=e.maxX),i<e.minY&&(i=e.minY),e.maxY&&i>e.maxY&&(i=e.maxY),a!==e.currX&&(e.mouseX=t,e.currX=a,e.source.style[e.DX]=a+"px"),i!==e.currY&&(e.mouseY=r,e.currY=i,e.source.style[e.DY]=i+"px"),e.onDrag&&e.onDrag(o,e),!1},__mouseup:function(o){this._argv.onDragEnd&&this._argv.onDragEnd(o,this._argv),document.onmousemove=null,document.onmouseup=null}}})}(zn);
!function(u){u.Class({events:["init","start","stop","cancle","goNext","goPre"],properties:{pre:null,next:null,delay:null,action:null,args:[],context:this,taskList:null,status:{value:"",get:function(){return this._status}}},methods:{init:function(t){this.sets(t),this.fire("init",this)},start:function(){"started"!=this._status&&(this._action?(this._action.apply(this._context,this._args),this._status="started"):this.goNext(),this.fire("start",this))},stop:function(){this._status="stoped",this.fire("stop",this)},cancle:function(){this._status="cancle",this.fire("cancle",this)},goNext:function(){this._next&&this._next.start(),this.fire("goNext",this)},goPre:function(){this._pre&&this._pre.start(),this.fire("goPre",this)}}});var n=u.Class({properties:{url:"",data:{set:function(t){this._data=t},get:function(){return"GET"==this._method.toUpperCase()?this._data?u.querystring.stringify(this._data):"":u.is(this._data,"object")?JSON.stringify(this._data):this._data}},method:"GET",asyns:!0,username:null,password:null,withCredentials:!1,headers:{get:function(){return u.overwrite({"X-Requested-With":"XMLHttpRequest","Content-type":"application/json"},this._headers)},set:function(t){this._headers=t}},timeout:{get:function(){return this._timeout||2e4},set:function(t){this._timeout=t}}},events:["before","after","success","error","complete","timeout"],methods:{init:function(t){this.sets(t),this._isRunning=!1},__initXMLHttpRequest:function(){if(this._XMLHttpRequest)return this._XMLHttpRequest;if(!window.ActiveXObject)return this._XMLHttpRequest=new XMLHttpRequest,this._XMLHttpRequest;for(var t="MSXML2.XMLHTTP",e=["Microsoft.XMLHTTP",t,t+".3.0",t+".4.0",t+".5.0",t+".6.0"],i=e.length-1;-1<i;i--)try{return this._XMLHttpRequest=new ActiveXObject(e[i]),this._XMLHttpRequest}catch(t){continue}},__onComplete:function(t,e){clearTimeout(this._timeoutID),t.abort(),this._isRunning=!1,this.fire("complete",t,e),this.fire("after",t,e),this.offs()},__initRequestHeader:function(t,e){for(var i in e)t.setRequestHeader(i,e[i])},resetEvents:function(){this.offs()},send:function(t){if(this._isRunning)return!1;this.sets(t);var e=this.__initXMLHttpRequest(),i=this,r=u.async.defer();if(this._isRunning=!0,this.timeout&&(this._timeoutID=setTimeout(function(){i._isRunning&&(i.fire("timeout",i),i.__onComplete(e,"timeout"))},this.timeout)),!1===this.fire("before",this)||!this.url)return this.__onComplete(e),r.promise;var s=this.url,n=this.data,o=this._method.toUpperCase();return"GET"===o&&(n&&(s=s+"?"+u.querystring.stringify(n)),n=null),this.get("withCredentials")&&(e.withCredentials=!0),e.open(o,s,this.asyns),e.onreadystatechange=function(t){var e=t.currentTarget;if(4==e.readyState){var i=e.status,s=e.responseText,n=e.getResponseHeader("Content-Type");if(200<=i&&i<300){try{s=n&&0<=n.indexOf("application/json")?JSON.parse(s):s}catch(t){s=s}this.fire("success",s),r.resolve(s,e)}else this.fire("error",e),r.reject(e,s);return this.__onComplete(e,s),s}}.bind(this),this.__initRequestHeader(e,this.headers),e.send(n),this.asyns||this.__onComplete(e),r.promise},abort:function(){this._XMLHttpRequest&&this._XMLHttpRequest.abort()}}}),r=u.Class({static:!0,properties:{max:3,count:{get:function(){return this._data.length}}},methods:{init:function(){this._data=[]},getInstance:function(){for(var t=0,e=this._data.length;t<e;t++)if(!this._data[t]._isRunning)return this._data[t].resetEvents(),this._data[t];return i=this,s=new n,i._data.push(s),s;var i,s}}});u.http=u.Class({static:!0,methods:{init:function(){this._config={host:window.location.origin,port:null}},setHost:function(t,e){return u.extend(this._config,{host:t,port:e})},getURL:function(){return this._config.port?this._config.host.split(":")[0]+this._config.port:this._config.host},fixURL:function(t){return t?(t&&-1==t.indexOf("http://")&&-1==t.indexOf("https://")&&(t=this.getURL()+t),t):""},request:function(t,e,i){var s=r.getInstance();return t.url&&(t.url=this.fixURL(t.url)),i&&(t.method=i),u.each(t,function(t,e){"function"==typeof t&&s.on(e,t,this)},this),e&&e(s),s.send(t)},fixArguments:function(){var t=Array.prototype.slice.call(arguments);return 1==t.length&&"object"==typeof t[0]?t[0]:{url:t[0],data:t[1],headers:t[2]}},get:function(){return this.request(this.fixArguments.apply(this,arguments),null,"GET")},post:function(t){return this.request(this.fixArguments.apply(this,arguments),null,"POST")},put:function(t){return this.request(this.fixArguments.apply(this,arguments),null,"PUT")},delete:function(t){return this.request(this.fixArguments.apply(this,arguments),null,"DELETE")}}})}(zn);
!function(l){var e=l.Class({events:["init","validate","before","success","error","complete","after"],properties:{url:null,data:null,method:"POST",headers:null},methods:{init:function(e,t,r,n){this.sets({url:e,data:t,method:r,headers:n}),this.fire("init",this.gets())},validateArgv:function(e,t,r,n){return{url:e||this._url||"",data:t||this._data||{},method:r||this._method||"POST",headers:n||this._headers||{}}},exec:function(e,t,r,n){var i=this.validateArgv(e,t,r,n),s=l.store.fire("before",i);return!1!==s&&(!1!==(s=this.fire("before",i))&&i)},__onComplete:function(e){var t=l.store.fire("after",e);return!1!==t&&(!1!==(t=this.fire("complete",e))&&void 0)},__onSuccess:function(e,t){var r=l.store.fire("success",e,t);return!1!==r&&(!1!==(r=this.fire("success",e,t))&&void 0)},__onError:function(e){var t=l.store.fire("success",e);return!1!==t&&(!1!==(t=this.fire("success",e))&&void 0)},refresh:function(e,t,r,n){return this.exec(e,t,r,n)},clone:function(e){var t=this._data;return t="object"==typeof t?l.extend(JSON.parse(JSON.stringify(t)),e):e,new this.constructor(this._url,t,this._method,this._headers)},extend:function(e){return this._data=l.extend(this._data,e),this},overwrite:function(e){return this._data=l.overwrite(this._data,e),this}}}),t=l.Class(e,{methods:{init:function(e,t,r,n){this.sets({url:e,data:t,method:r,headers:n}),this.fire("init",this.gets())},exec:function(e,t,r,n){var i=this.validateArgv(e,t,r,n),s=l.store.fire("before",i);return!1!==s&&(!1!==(s=this.fire("before",i))&&(!1!==i&&l.http[i.method.toLowerCase()]({url:i.url,data:i.data,headers:i.headers,success:function(e,t,r){this.__onSuccess(t,r)}.bind(this),error:function(e,t){this.__onError(t)}.bind(this),complete:function(e,t){this.__onComplete(t)}.bind(this)})))}}}),r=l.Class(e,{methods:{init:function(e,t,r,n){this.sets({url:e,data:t,method:r,headers:n}),this.fire("init",this.gets())},exec:function(e,t,r,n){var i=this.validateArgv(e,t,r,n),s=l.store.fire("before",i);if(!1===s)return!1;if(!1===(s=this.fire("before",i)))return!1;if(!1===i)return!1;var o=i.url,a=i.method,u=i.data,h=i.headers,c=this,f={method:a.toUpperCase()};switch(a.toUpperCase()){case"POST":var d=new FormData;for(var _ in u)d.append(_,u[_]);f.body=d,f.headers=l.overwrite(h,{Accept:"multipart/form-data","Content-Type":"multipart/form-data; charset=UTF-8"});break;case"GET":var v=[];l.each(u,function(e,t){v.push(t+"="+e)}),o+="?"+v.join("&");break;case"JSON":f.body=JSON.stringify(u),f.method="POST",f.headers=l.overwrite(h,{Accept:"multipart/form-data","Content-Type":"multipart/form-data; charset=UTF-8"})}return new Promise(function(t,r){fetch(l.http.fixURL(o),f).then(function(e){return e.json()}).then(function(e){c.__onSuccess(e),c.__onComplete(e),t(e)}).catch(function(e){c.__onError(e),c.__onComplete(e),r(e)})})}}}),n=l.Class({events:["init","before","after"],properties:{data:null,argv:{set:function(e){this._argv=e},get:function(){return this._argv||{}}}},methods:{init:function(e,t){this.reset(e,t),this.fire("init",this)},reset:function(e,t){return e&&(this._data=e),t&&(this._argv=t),this._argv&&this._argv.autoLoad&&this.exec(),this},refresh:function(){return this.exec(),this},exec:function(){var r=this._data,n=this;return!!r&&(!1!==(this._argv.onExec&&this._argv.onExec(r))&&(!1!==this.fire("before",r)&&(r.__id__?void r.on("success",function(e,t){t=n._argv.dataHandler&&n._argv.dataHandler(t)||t,n._argv.onSuccess&&n._argv.onSuccess(t)}).on("error",function(e,t){n._argv.onError&&n._argv.onError(t)}).on("complete",function(e,t){n._argv.onComplete&&n._argv.onComplete(t)}).exec():new Promise(function(e,t){if(r){if(r=n._argv.dataHandler&&n._argv.dataHandler(r)||r,!1===l.store.fire("success",r))return!1;n._argv.onSuccess&&n._argv.onSuccess(r),n._argv.onComplete&&n._argv.onComplete(r),e(r)}else{if(!(r="this._data is undefined.")===l.store.fire("error",r))return!1;n._argv.onError&&n._argv.onError(r),n._argv.onComplete&&n._argv.onComplete(r),t(r)}}))))}}}),i=l.Class({events:["before","success","error","complete","after"],properties:{engine:{set:function(e){this._engine=e},get:function(){return"Fetcher"==this._engine?r:t}}},methods:{fixURL:function(e){return l.http.fixURL(e)},dataSource:function(e,t){return new n(e,t)},request:function(e,t,r,n){return new this.engine(e,t,r,n)},post:function(e,t,r){return this.request(e,t,"POST",r)},delete:function(e,t,r){return this.request(e,t,"DELETE",r)},put:function(e,t,r){return this.request(e,t,"PUT",r)},get:function(e,t,r){return this.request(e,t,"GET",r)}}});l.store=l.GLOBAL.Store=new i}(zn);