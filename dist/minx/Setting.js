!function(n){n.setting=n.Class({static:!0,methods:{init:function(){this._data_={}},data:function(t){if(t)for(var e in t)n.path(this._data_,e,t[e]);return this},deepAssign:function(t,e){return n.path(this._data_,t,n.deepAssign(n.path(this._data_,t),e)),this},getKey:function(t){return this.path(t)},setKey:function(t,e){return this.setPath(t,e)},getValue:function(t){return this.path(t)},setValue:function(t,e){return this.setPath(t,e)},isVarValue:function(t){return"string"==typeof t&&(0===t.indexOf("{{")&&t.indexOf("}}")===t.length-2)},getVarValue:function(t){return"string"==typeof t&&4<t.length?this.path(t.substring(2,t.length-2)):t},realizeValue:function(t){switch(n.type(t)){case"object":for(var e in t)t[e]=this.realizeValue(t[e]);break;case"string":this.isVarValue(t)&&(t=this.getVarValue(t));case"array":var a=0;for(t.length;a++;)t[a]=this.realizeValue(t[e])}return t},getPathRoot:function(t,e,a){if(e&&e.length){var i=e.shift();return t.push(i),n.path(a,t.join("."))?void 0:this.getPathRoot(t,e,a)}},path:function(t){var e=n.path(this._data_,t);return this.isVarValue(e)&&(e=this.getVarValue(e)),this.realizeValue(e)},setPath:function(t,e){return n.path(this._data_,t,this.realizeValue(e)),this},keys:function(){return Object.keys(this._data_)}}})}(zn);