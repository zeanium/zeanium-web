!function(o){o.draggable=o.Class({statics:{create:function(o,n){return new this.prototype.constructor(o,n)}},methods:{init:function(o,n){var t=n||{},r={source:o,vector:["left","top"],start:["30","30"],minX:0,maxX:null,minY:0,maxY:null,xHandler:null,yHandler:null,onDragStrat:function(){},onDrag:function(){},onDragEnd:function(){}};for(var e in r)t.hasOwnProperty(e)||(t[e]=r[e]);var s=t.source,u=t.start,a=t.vector;t.DX=a[0],t.DY=a[1],s.style.position="absolute",o.style.cursor="move",u&&(s.style[t.DX]=(u[0]||0)+"px",s.style[t.DY]=(u[1]||0)+"px"),(this._argv=t).event&&this.__mousedown(t.event),o.onmousedown=this.__mousedown.bind(this)},__mousedown:function(o){var n=o||window.event,t=this._argv,r=t.source,e=parseFloat(r.style[t.DX])||0,s=parseFloat(r.style[t.DY])||0,u=n.clientX||n.x,a=n.clientY||n.y,i=t.onDragStrat&&t.onDragStrat(e,s,u,a,n);if(i)for(var m in i)void 0!==i[m]&&null!==i[m]&&(t[m]=i[m]);return t.currX=e,t.currY=s,t.mouseX=u,t.mouseY=a,!1!==(!!t.onDragStart&&t.onDragStart(o,t))&&(document.onmousemove=this.__mousemove.bind(this),document.onmouseup=this.__mouseup.bind(this)),!1},__mousemove:function(o){var n=o||window.event,t=n.clientX||n.x,r=n.clientY||n.y,e=this._argv,s=t-e.mouseX,u=r-e.mouseY;"right"==e.DX.toLowerCase()&&(s*=-1),"bottom"==e.DY.toLowerCase()&&(u*=-1);var a=e.currX+s,i=e.currY+u;return a<e.minX&&(a=e.minX),e.maxX&&a>e.maxX&&(a=e.maxX),i<e.minY&&(i=e.minY),e.maxY&&i>e.maxY&&(i=e.maxY),a!==e.currX&&(e.mouseX=t,e.currX=a,e.source.style[e.DX]=a+"px"),i!==e.currY&&(e.mouseY=r,e.currY=i,e.source.style[e.DY]=i+"px"),e.onDrag&&e.onDrag(o,e),!1},__mouseup:function(o){this._argv.onDragEnd&&this._argv.onDragEnd(o,this._argv),document.onmousemove=null,document.onmouseup=null}}})}(zn);