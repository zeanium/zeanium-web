(function (zn) {

    zn.cookie = zn.Class({
        static: true,
        methods: {
            setItem: function (name, value, time) {
                var _name = name + '=' + encodeURIComponent(value);
                if (time) {
                    _name += '; expires=' + (new Date(+(new Date()) + time * 36E5)).toGMTString();
                }

                document.cookie = _name;
            },
            getItem: function (name) {
                var oRE = new RegExp('(?:; )?' + name + '=([^;]*);?');
                if (oRE.test(document.cookie)) {
                    return decodeURIComponent(RegExp.$1);
                } else {
                    return null;
                }
            },
            removeItem: function (name) {
                this.setItem(name, null, -9999);
            },
            clear: function () {
                document.cookie = null;
            }
        }
    });

})(zn);

(function (zn) {

    var ZNData = zn.Class({
        events: ['before', 'array', 'object', 'convert', 'data', 'error', 'after'],
        properties: {
            zncaller: null,
            argv: null,
            context: null,
            data: null
        },
        methods: {
            init: function (argv, events, context){
                var _argv = argv || {},
                    _auto = _argv.auto;
                if(_auto == null){
                    _auto = true;
                }
                this._argv = _argv;
                this._context = context;
                this.__initEvents(events);

                if(zn.is(_argv, 'object')){
                    this._zncaller = _argv.zncaller;
                }

                if(_auto) {
                    this.__init(_argv);
                }
            },
            refresh: function (argv, events, context){
                return this.overwriteCall(argv || this._argv, events, context), this;
            },
            recall: function (){
                return this.refresh(), this;
            },
            call: function (argv){
                return this.__init(argv), this;
            },
            overwriteCall: function (argv, events, context){
                if(argv){
                    this._argv = argv;
                    if(context){
                        this._context = context;
                    }
                    if(events){
                        this.__initEvents(events);
                    }
                    
                    this.__init(this._argv);
                }
                
                return this;
            },
            extendArgv: function (){
                if(arguments.length == 1) {
                    zn.extend(this._argv, arguments[0]);
                } else if(arguments.length == 2 && this._argv[arguments[0]]) {
                    zn.extend(this._argv[arguments[0]], arguments[1]);
                }

                return this;
            },
            overwriteArgv: function (){
                if(arguments.length == 1) {
                    zn.overwrite(this._argv, arguments[0]);
                } else if(arguments.length == 2 && this._argv[arguments[0]]) {
                    zn.overwrite(this._argv[arguments[0]], arguments[1]);
                }
                
                return this;
            },
            __initEvents: function (events){
                if(events){
                    for(var event in events){
                        this.on(event, events[event], this);
                    }
                }

                return this;
            },
            __init: function (data){
                var _type = Object.prototype.toString.call(data);
                this.fire('before', data);
                if(_type == '[object Array]') {
                    data.__proto__.owner = this;
                    data.__proto__.refresh = this.refresh;
                    this.__array(data);
                }else if(_type == '[object Object]'){
                    data.__proto__.owner = this;
                    data.__proto__.refresh = this.refresh;
                    this.__object(data);
                }else{
                    this.fire('error', data);
                }
            },
            __array: function (data){
                this.fire('array', data);
                this.fire('after', this.__dataConvert(data));
            },
            __object: function (data){
                this.fire('object', data);
                var _zncaller = this._zncaller || zn.data.zncaller;
                if(!_zncaller){
                    throw new Error('zncaller is null');
                }

                _zncaller.call(data, this._context || _zncaller).then(function (value, xhr){
                    this.fire('after', this.__dataConvert(value), xhr);
                }.bind(this), function (xhr){
                    this.fire('error', xhr);
                }.bind(this));
            },
            __dataConvert: function (data){
                var _return = this.fire('convert', data);
                if(_return !== undefined && _return !== null){
                    return _return;
                }

                var _data = data.result || data;
                this._data = this.fire('data', _data) || _data;

                return this._data;
            }
        }
    });

    zn.data = zn.Class({
        static: true,
        properties: {
            zncaller: null
        },
        methods: {
            create: function (argv, events, context){
                return new ZNData(argv, events, context);
            },
            settings: function (settings){
                return this.sets(settings), this;
            }
        }
    });

})(zn);
(function (zn) {
    var tempElement = document.createElement('div'),
        tempStyle = tempElement.style;
    var rsizeElement = /width|height|top|right|bottom|left|size|margin|padding/i,
        rHasUnit = /[c-x%]/,
        PX = 'px',
        rUpperCameCase = /(?:^|-)([a-z])/g,
        rDeCameCase = /([A-Z])/g;

    var cssNumber = {
        'lineHeight': true,
        'zIndex': true,
        'zoom': true
    };

    var styleHooks = {
        float: 'cssFloat'
    };

    zn.style = zn.Class({
        static: true,
        methods: {
            each: function (target, callback, context) {
                if (target && callback) {
                    var length = target.length;
                    if (length >= 0) {
                        for (var i = 0; i < length; i++) {
                            callback.call(context, target[i], i);
                        }
                    }
                    else {
                        for (var key in target) {
                            if (target.hasOwnProperty(key)) {
                                callback.call(context, target[key], key);
                            }
                        }
                    }
                }
            },
            getCssText: function (inStyles) {
                var cssText = [''];
                this.each(inStyles,function (styleValue,styleName) {
                    cssText.push(this.getStyleProperty(styleName,true) + ':' + this.getStyleValue(styleName,styleValue));
                },this);
                return cssText.join(';');
            },
            getStyleValue: function (inName,inValue) {
                var property = this.getStyleProperty(inName);
                var value = inValue;
                if (rsizeElement.test(property)) {
                    if (!rHasUnit.test(inValue) && !cssNumber[property]) {
                        value += PX;
                    }
                }
                return value;
            },
            getStyleProperty: function (inName,isLowerCase) {
                var property = this.lowerCamelCase(inName);
                if (property in tempStyle) {
                    if (isLowerCase) {
                        property = this.deCamelCase(inName);
                    }
                } else {
                    if (isLowerCase) {
                        property = env.prefix()[1] + inName;
                    } else {
                        property = env.prefix()[0] + this.upperCamelCase(inName);
                    }
                }
                return styleHooks[inName] || property;
            },
            lowerCamelCase: function (inName) {
                var _camelizeString = this.upperCamelCase(inName);
                return _camelizeString.charAt(0).toLowerCase() + _camelizeString.substring(1);
            },
            upperCamelCase: function (inName) {
                return inName.replace(rUpperCameCase,function (match,group1) {
                    return group1.toUpperCase();
                });
            },
            deCamelCase: function (inName) {
                return inName.replace(rDeCameCase,function (match,group1) {
                    return '-' + group1.toLowerCase();
                });
            },
            capitalize: function (inString) {
                return inString.charAt(0).toUpperCase() + inString.slice(1);
            }
        }
    });

    zn.dom = zn.Class({
        static: true,
        methods: {
            init: function (){
                this._roots = [];
            },
            createRootElement: function (tag, attrs){
                var _dom = this.createElement(tag, attrs, document.body);

                return this._roots.push(_dom), _dom;
            },
            createElement: function (tag, attrs, parent){
                var _tag = tag || 'div',
                    _attrs = attrs || {},
                    _dom = document.createElement(_tag);

                for(var attr in _attrs){
                    _dom.setAttribute(attr, _attrs[attr]);
                }

                if(parent) {
                    parent.appendChild(_dom);
                }

                return _dom;
            },
    		removeAllRoots: function (){
    			this._roots.forEach(function (dom){
    				document.body.removeChild(dom);
    			});

    			return this._roots = [], this;
    		},
            hasClass: function (target, className) {
                return target.classList.contains(className);
            },
            addClass: function (target) {
                var classList = target.classList;
                arguments.shift();
                return classList.add.apply(classList, arguments);
            },
            removeClass: function (target) {
                var classList = target.classList;
                arguments.shift();
                return classList.remove.apply(classList, arguments);
            },
            toggleClass: function (target, inClassName) {
                return  target.classList.toggle(inClassName);
            },
            setStyle: function (target, inName, inValue) {
                var property = zn.style.getStyleProperty(inName);
                target.style[property] = zn.style.getStyleValue(inName,inValue);
            },
            getStyle: function (target, inName, isInline) {
                var element = target,
                    property = zn.style.getStyleProperty(inName),
                    styles = isInline ? target.style : (window.getComputedStyle?getComputedStyle(element, null):element.currentStyle);

                return styles[property] || '';
            },
            removeStyle: function (target, inName) {
                var property = zn.style.getStyleProperty(inName,true);
                target.style.removeProperty(property);
            },
            hasStyle: function (target, inName) {
                //todo:height/line-height
                //fix bug
                var cssText = target.style.cssText;
                return cssText.indexOf(inName + ':') > -1;
            },
            setStyles: function (target, inStyles) {
                target.style.cssText += zn.style.getCssText(inStyles);
            },
            getPosition: function (target){
                var _target = target,
                    _x = 0, _y = 0, _w = 0, _h = 0;

                if(_target.getBoundingClientRect){
                    var _bounding = _target.getBoundingClientRect();
                    _x = _bounding.left + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) - document.documentElement.clientLeft;
                    _y = _bounding.top + Math.max(document.documentElement.scrollTop, document.body.scrollTop) - document.documentElement.clientTop;
                    _w = _bounding.width;
                    _h = _bounding.height;
                } else {
                    while (_target != document.body) {
                        if(!_target){ break; }
                        _x += _target.offsetLeft;
                        _y += _target.offsetTop;
                        _target = _target.offsetParent;
                    }
                    _w = _target.offsetWidth;
                    _h = _target.offsetHeight;
                }

                /*
                while (_target != document.body) {
                    if(!_target){ break; }
                    _x += _target.offsetLeft + _target.scrollLeft || 0;
                    _y += _target.offsetTop + _target.scrollTop || 0;
                    _target = _target.offsetParent;
                }
                _w = target.offsetWidth;
                _h = target.offsetHeight;*/

                return {
                    x: _x,
                    y: _y,
                    width: _w,
                    height: _h
                };
            },
            on: function(target, event, handler, useCapture){
                if (target.addEventListener) {
                    target.addEventListener(event, handler, useCapture || false);
                } else if (element.attachEvent) {
                    target.attachEvent('on' + event, handler);
                } else {
                    target['on' + event] = handler;
                }
            },
            off:function(target, event, handler){
                if (target.removeEventListener) {
                    target.removeEventListener(event, handler, false);
                } else if (target.detachEvent) {
                    target.detachEvent('on' + event, handler);
                } else {
                    target['on' + event] = null;
                }
            }
        }
    });

})(zn);

(function (zn) {

    zn.draggable = zn.Class({
        statics: {
            create: function (target, argv) {
                return new this.prototype.constructor(target, argv);
            }
        },
        methods: {
            init: function (target, argv){
                var _argv = argv || {},
                    _default = {
                        source: target,
                        vector: ['left', 'top'],                //tl: top-left, br: bottom-right
                        start: ['30', '30'],
                        minX: 0,
                        maxX: null,
                        minY: 0,
                        maxY: null,
                        xHandler: null,
                        yHandler: null,
                        onDragStrat: function () { },
                        onDrag: function () { },
                        onDragEnd: function () { }
                    };
    
                for(var key in _default){
                    if(!_argv.hasOwnProperty(key)){
                        _argv[key] = _default[key];
                    }
                }
    
                var _source = _argv.source,
                    _start = _argv.start,
                    _vector = _argv.vector;
    
                _argv.DX = _vector[0];
                _argv.DY = _vector[1];
    
                _source.style.position = 'absolute';
                target.style.cursor = 'move';
    
                if(_start){
                    _source.style[_argv.DX] = (_start[0] || 0) + 'px';
                    _source.style[_argv.DY] = (_start[1] || 0) + 'px';
                }
    
                this._argv = _argv;
    
                if(_argv.event){
                    this.__mousedown(_argv.event);
                }
    
                target.onmousedown = this.__mousedown.bind(this);
            },
            __mousedown: function (event){
                var _event = event || window.event,
                    _argv = this._argv,
                    _source = _argv.source;
    
                //event.stopPropagation();
                //event.preventDefault();
    
                var _x = parseFloat(_source.style[_argv.DX]) || 0,
                    _y = parseFloat(_source.style[_argv.DY]) || 0,
                    _px = _event.clientX || _event.x,
                    _py = _event.clientY || _event.y;
    
                var _limit = _argv.onDragStrat && _argv.onDragStrat(_x, _y, _px, _py, _event);
                if(_limit){
                    for(var _key in _limit){
                        if(_limit[_key] !== undefined && _limit[_key] !== null){
                            _argv[_key] = _limit[_key];
                        }
                    }
                }
    
                _argv.currX = _x;
                _argv.currY = _y;
                _argv.mouseX = _px;
                _argv.mouseY = _py;
    
                var _return = !!_argv.onDragStart && _argv.onDragStart(event, _argv);
                if(_return!==false){
                    document.onmousemove = this.__mousemove.bind(this);
                    document.onmouseup = this.__mouseup.bind(this);
                }
    
                return false;
            },
            __mousemove: function (event){
                var _event = event || window.event,
                    _px = _event.clientX || _event.x,
                    _py = _event.clientY || _event.y,
                    _argv = this._argv;
    
                //event.stopPropagation();
                //event.preventDefault();
                var _dx = _px - _argv.mouseX,
                    _dy = _py - _argv.mouseY;
    
                _argv.DX.toLowerCase() == 'right' && (_dx *= -1);
                _argv.DY.toLowerCase() == 'bottom' && (_dy *= -1);
    
                var _currX = _argv.currX + _dx,
                    _currY = _argv.currY + _dy;
    
                _currX < _argv.minX && (_currX = _argv.minX);
                _argv.maxX && _currX > _argv.maxX && (_currX = _argv.maxX);
                _currY < _argv.minY && (_currY = _argv.minY);
                _argv.maxY && _currY > _argv.maxY && (_currY = _argv.maxY);
    
                if(_currX!==_argv.currX){
                    _argv.mouseX = _px;
                    _argv.currX = _currX;
                    _argv.source.style[_argv.DX] = _currX + 'px';
                }
    
                if(_currY!==_argv.currY){
                    _argv.mouseY = _py;
                    _argv.currY = _currY;
                    _argv.source.style[_argv.DY] = _currY + 'px';
                }
    
                _argv.onDrag && _argv.onDrag(event, _argv);
                return false;
            },
            __mouseup: function (event) {
                //event.stopPropagation();
                this._argv.onDragEnd && this._argv.onDragEnd(event, this._argv);
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }
    });
    
})(zn);
(function (zn) {

    var MIME = {
        text: 'text/plain; charset=UTF-8',
        html: 'text/html; charset=UTF-8',
        xml: 'text/xml; charset=UTF-8',
        form: 'application/x-www-form-urlencoded; charset=UTF-8',
        json: 'application/json; charset=UTF-8',
        javascript: 'text/javascript; charset=UTF-8'
    };

    var Task = zn.Class({
        events: [
            'init',
            'start',
            'stop',
            'cancle',
            'goNext',
            'goPre'
        ],
        properties: {
            pre: null,
            next: null,
            delay: null,
            action: null,
            args: [],
            context: this,
            taskList: null,
            status: {
                value: '',
                get: function () { return this._status; }
            }
        },
        methods: {
            init: function (config) {
                this.sets(config);
                this.fire('init', this);
            },
            start: function (){
                if (this._status=='started'){ return; }
                if (this._action){
                    this._action.apply(this._context, this._args);
                    this._status = 'started';
                }else {
                    this.goNext();
                }
                this.fire('start', this);
            },
            stop: function (){
                this._status = 'stoped';
                this.fire('stop', this);
            },
            cancle: function (){
                this._status = 'cancle';
                this.fire('cancle', this);
            },
            goNext: function (){
                if (this._next){
                    this._next.start();
                }
                this.fire('goNext', this);
            },
            goPre: function (){
                if (this._pre){
                    this._pre.start();
                }
                this.fire('goPre', this);
            }
        }
    });

    /**
     * XHR: XmlHttpRequest
     * @class XHR
     * @constructor
     */
    var XHR = zn.Class({
        properties: {
            url: '',
            data: {
                set: function (value){
                    this._data = value;
                },
                get: function (){
                    if(this._method.toUpperCase()=='GET'){
                        if(this._data){
                            return zn.querystring.stringify(this._data);
                        }else {
                            return '';
                        }
                    }else {
                        return zn.is(this._data, 'object') ? JSON.stringify(this._data) : this._data;
                    }
                }
            },
            method: 'GET',
            asyns: true,
            username: null,
            password: null,
            withCredentials: false,
            headers: {
                get: function(){
                    return zn.overwrite({
                        'X-Requested-With': 'XMLHttpRequest',
                        'Content-type': 'application/json'
                    }, this._headers);
                },
                set: function (value){
                    this._headers = value;
                }
            },
            timeout: {
                get: function (){
                    return this._timeout || 2e4;
                },
                set: function (value){
                    this._timeout = value;
                }
            }
        },
        events: [
            'before',
            'after',
            'success',
            'error',
            'complete',
            'timeout'
        ],
        methods: {
            init: function (argv){
                this.sets(argv);
                this._isRunning = false;
            },
            __initXMLHttpRequest: function (){
                if (this._XMLHttpRequest){
                    return this._XMLHttpRequest;
                }
                if (!window.ActiveXObject){
                    return this._XMLHttpRequest = new XMLHttpRequest(), this._XMLHttpRequest;
                }
                var e = "MSXML2.XMLHTTP",
                    t = ["Microsoft.XMLHTTP", e, e + ".3.0", e + ".4.0", e + ".5.0", e + ".6.0"];

                for (var i = t.length - 1; i > -1; i--) {
                    try {
                        return this._XMLHttpRequest = new ActiveXObject(t[i]), this._XMLHttpRequest;
                    } catch (ex) {
                        continue;
                    }
                }
            },
            __onComplete: function(XHR, data){
                clearTimeout(this._timeoutID);
                XHR.abort();
                this._isRunning = false;
                this.fire('complete', XHR, data);
                this.fire('after', XHR, data);
                this.offs();
            },
            __initRequestHeader: function (RH, args){
                for(var k in args){
                    RH.setRequestHeader(k, args[k]);
                }
            },
            resetEvents: function(){
                this.offs();
            },
            send: function (config){
                if (this._isRunning){
                    return false;
                }
                this.sets(config);
                var _XHR = this.__initXMLHttpRequest(),
                    _self = this,
                    _defer = zn.async.defer();

                this._isRunning = true;
                if(this.timeout){
                    this._timeoutID = setTimeout(function(){
                        if(_self._isRunning){
                            _self.fire('timeout', _self);
                            _self.__onComplete(_XHR, 'timeout');
                        }
                    }, this.timeout);
                }

                if(this.fire('before', this)===false || !this.url){
                    return this.__onComplete(_XHR), _defer.promise;
                }

                var _url = this.url,
                    _data = this.data,
                    _method = this._method.toUpperCase();
                if(_method === 'GET'){
                    if(_data){
                        _url = _url + '?' + zn.querystring.stringify(_data);
                    }
                    _data = null;
                }
                if(this.get('withCredentials')){
                    _XHR.withCredentials = true;
                }

                _XHR.open(_method, _url, this.asyns);
                _XHR.onreadystatechange = function (event){
                    var _XHR = event.currentTarget;
                    if (_XHR.readyState == 4) {
                        var e = _XHR.status,
                            t = _XHR.responseText,
                            _ct = _XHR.getResponseHeader('Content-Type');

                        if (e >= 200 && e < 300) {
                            try {
                                t = (_ct && _ct.indexOf('application/json')>=0) ? JSON.parse(t) : t;
                            } catch (error) {
                                t = t;
                            }
                            this.fire('success', t);
                            _defer.resolve(t, _XHR);
                        } else {
                            this.fire('error', _XHR);
                            _defer.reject(_XHR, t);
                        }

                        return this.__onComplete(_XHR, t), t;
                    }
                }.bind(this);
                this.__initRequestHeader(_XHR, this.headers);
                _XHR.send(_data);
                if(!this.asyns){
                    this.__onComplete(_XHR);
                }

                return _defer.promise;
            },
            abort: function (){
                if(this._XMLHttpRequest){
                    this._XMLHttpRequest.abort();
                }
            }
        }
    });

    /**
     * XHRPool: XmlHttpRequestPool
     * @class nx.http.XHRPool
     * @constructor
     */
    var XHRPool = zn.Class({
        static: true,
        properties: {
            max: 3,
            count: {
                get: function (){ return this._data.length;  }
            }
        },
        methods: {
            init: function (){
                this._data = [];
            },
            getInstance: function (){
                for(var i= 0, _len = this._data.length; i<_len; i++){
                    if(!this._data[i]._isRunning){
                        return this._data[i].resetEvents(), this._data[i];
                    }
                }

                return (function(context){
                    var _xhr = new XHR();
                    context._data.push(_xhr);
                    return _xhr;
                })(this);
            }
        }
    });

    zn.http = zn.Class({
        static: true,
        methods: {
            init: function (){
                this._config = {
                    host: window.location.origin,
                    port: null
                };
            },
            setHost: function (host, port){
                return zn.extend(this._config, {
                    host: host,
                    port: port
                });
            },
            getURL: function (){
                if(this._config.port){
                    return this._config.host.split(':')[0] + this._config.port;
                }else {
                    return this._config.host;
                }
            },
            fixURL: function (url) {
                if(!url){
                    return '';
                }

                if(url){
                    if(url.indexOf('http://') == -1 && url.indexOf('https://') == -1){
                        url = this.getURL() + url;
                    }
                }

                return url;
            },
            request: function (value, callback, method){
                var _xhr = XHRPool.getInstance();
                if(value.url){
                    value.url = this.fixURL(value.url);
                }

                if(method){
                    value.method = method;
                }

                zn.each(value, function(v, k){
                    if(typeof v=='function'){
                        _xhr.on(k, v, this);
                    }
                }, this);

                if(callback) {
                    callback(_xhr);
                }

                return _xhr.send(value);
            },
            fixArguments: function (){
                var _argv = Array.prototype.slice.call(arguments),
                    _value = {};
                if(_argv.length == 1 && typeof _argv[0] == 'object'){
                    _value = _argv[0];
                }else {
                    _value = {
                        url: _argv[0],
                        data: _argv[1],
                        headers: _argv[2]
                    };
                }

                return _value;
            },
            get: function (){
                return this.request(this.fixArguments.apply(this, arguments), null, 'GET');
            },
            post: function (value){
                return this.request(this.fixArguments.apply(this, arguments), null, 'POST');
            },
            put: function (value){
                return this.request(this.fixArguments.apply(this, arguments), null, 'PUT');
            },
            delete: function (value){
                return this.request(this.fixArguments.apply(this, arguments), null, 'DELETE');
            }
        }
    });

})(zn);

(function (zn) {

    var HttpRequest = zn.Class({
        events: [
            'init',
            'validate',
            'before',
            'success',
            'error',
            'complete',
            'after'
        ],
        properties: {
            url: null,
            data: null,
            method: 'POST',
            headers: null
        },
        methods: {
            init: function (url, data, method, headers) {
                this.sets({
                    url: url,
                    data: data,
                    method: method,
                    headers: headers
                });

                this.fire('init', this.gets());
            },
            validateArgv: function (url, data, method, headers){
                var _url = url || this._url || '',
                    _data = data || this._data || {},
                    _method = method || this._method || 'POST',
                    _headers = headers || this._headers || {};

                var _args = {
                    url: _url,
                    data: _data,
                    method: _method,
                    headers: _headers
                };
                return _args;
                /*
                var _result = this.fire('validate', _args);
                if(_result !== null && _result !== undefined){
                    return _result;
                }else {
                    return _args;
                }*/
            },
            exec: function (url, data, method, headers){
                var _argv = this.validateArgv(url, data, method, headers);
                var _result = zn.store.fire('before', _argv);
                if(_result===false){
                    return false;
                }
                _result = this.fire('before', _argv);
                if(_result===false){
                    return false;
                }

                return _argv;
            },
            __onComplete: function (data){
                var _result = zn.store.fire('after', data);
                if(_result===false){
                    return false;
                }
                _result = this.fire('complete', data);
                if(_result===false){
                    return false;
                }
            },
            __onSuccess: function (data, xhr){
                var _result = zn.store.fire('success', data, xhr);
                if(_result===false){
                    return false;
                }
                _result = this.fire('success', data, xhr);
                if(_result===false){
                    return false;
                }
            },
            __onError: function (xhr){
                var _result = zn.store.fire('success', xhr);
                if(_result===false){
                    return false;
                }
                _result = this.fire('success', xhr);
                if(_result===false){
                    return false;
                }
            },
            refresh: function (url, data, method, headers){
                return this.exec(url, data, method, headers);
            },
            clone: function (data){
                var _data = this._data;
                if(typeof _data === 'object'){
                    _data = zn.extend(JSON.parse(JSON.stringify(_data)), data);
                }else {
                    _data = data;
                }

                return new this.constructor(this._url, _data, this._method, this._headers);
            },
            extend: function (value){
                return this._data = zn.extend(this._data, value), this;
            },
            overwrite: function (value){
                return this._data = zn.overwrite(this._data, value), this;
            }
        }
    });

    var XHR = zn.Class(HttpRequest, {
        methods: {
            init: function (url, data, method, headers){
                this.sets({
                    url: url,
                    data: data,
                    method: method,
                    headers: headers
                });

                this.fire('init', this.gets());
                //this.super(url, data, method, headers);
            },
            exec: function (url, data, method, headers){
                //var _argv = this.super(url, data, method, headers);

                var _argv = this.validateArgv(url, data, method, headers);
                var _result = zn.store.fire('before', _argv);
                if(_result===false){
                    return false;
                }
                _result = this.fire('before', _argv);
                if(_result===false){
                    return false;
                }

                if(_argv===false){
                    return false;
                }

                return zn.http[_argv.method.toLowerCase()]({
                    url: _argv.url,
                    data: _argv.data,
                    headers: _argv.headers,
                    success: function (sender, data, xhr){
                        this.__onSuccess(data, xhr);
                    }.bind(this),
                    error: function (sender, xhr){
                        this.__onError(xhr);
                    }.bind(this),
                    complete: function (sender, xhr){
                        this.__onComplete(xhr);
                    }.bind(this)
                });
            }
        }
    });

    var Fetcher = zn.Class(HttpRequest, {
        methods: {
            init: function (url, data, method, headers){
                this.sets({
                    url: url,
                    data: data,
                    method: method,
                    headers: headers
                });

                this.fire('init', this.gets());
                //this.super(url, data, method, headers);
            },
            exec: function (url, data, method, headers){
                //var _argv = this.super(url, data, method, headers);

                var _argv = this.validateArgv(url, data, method, headers);
                var _result = zn.store.fire('before', _argv);
                if(_result===false){
                    return false;
                }
                _result = this.fire('before', _argv);
                if(_result===false){
                    return false;
                }

                //return _argv;

                if(_argv===false){
                    return false;
                }
                var _url = _argv.url,
                    _method = _argv.method,
                    _data = _argv.data,
                    _headers = _argv.headers,
                    _self = this,
                    _clone = {
                        method: _method.toUpperCase()
                    };

                switch (_method.toUpperCase()) {
                    case "POST":
                        var _temp = new FormData();
                        for(var key in _data){
                            _temp.append(key, _data[key]);
                        }
                        _clone.body = _temp;
                        _clone.headers = zn.overwrite(_headers, {
                            'Accept': 'multipart/form-data',
                            'Content-Type': 'multipart/form-data; charset=UTF-8'
                        });
                        break;
                    case "GET":
                        var _params = [];
                        zn.each(_data, function (value, key){
                            _params.push(key+'='+value);
                        });
                        _url += '?'+_params.join('&');
                        break;
                    case "JSON":
                        _clone.body = JSON.stringify(_data);
                        _clone.method = 'POST';
                        _clone.headers = zn.overwrite(_headers, {
                            'Accept': 'multipart/form-data',
                            'Content-Type': 'multipart/form-data; charset=UTF-8'
                        });
                        break;
                }

                return new Promise(function (resolve, reject) {
                    fetch(zn.http.fixURL(_url), _clone).then(function (response) {
                        return response.json();
                    }).then(function (responseData) {
                        _self.__onSuccess(responseData);
                        _self.__onComplete(responseData);
                        resolve(responseData);
                    }).catch(function (error) {
                        _self.__onError(error);
                        _self.__onComplete(error);
                        reject(error);
                    });
                });
            }
        }
    });

    var DataSource = zn.Class({
        events: [ 'init', 'before', 'after' ],
        properties: {
            data: null,
            argv: {
                set: function (value){
                    this._argv = value;
                },
                get: function (){
                    return this._argv || {};
                }
            }
        },
        methods: {
            init: function (data, argv) {
                this.reset(data, argv);
                this.fire('init', this);
            },
            reset: function (data, argv){
                if(data){
                    this._data = data;
                }
                if(argv){
                    this._argv = argv;
                }
                if(this._argv&&this._argv.autoLoad){
                    this.exec();
                }

                return this;
            },
            refresh: function (){
                return this.exec(), this;
            },
            exec: function (){
                var _data = this._data,
                    _self = this;
            	if(!_data){
                    return false;
                }

                if((this._argv.onExec && this._argv.onExec(_data))===false){
                    return false;
                }

                var _temp = this.fire('before', _data);
                if(_temp===false){
                    return false;
                }

            	if(_data.__id__){
                    _data.on('success', function (sender, data){
                        data = (_self._argv.dataHandler && _self._argv.dataHandler(data)) || data;
                        if(_self._argv.onSuccess){
                            _self._argv.onSuccess(data);
                        }
                    }).on('error', function (sender, data){
                        if(_self._argv.onError){
                            _self._argv.onError(data);
                        }
                    }).on('complete', function (sender, data){
                        if(_self._argv.onComplete){
                            _self._argv.onComplete(data);
                        }
                    }).exec();
            	} else {
                    return new Promise(function (resolve, reject) {
                        if(_data){
                            _data = (_self._argv.dataHandler && _self._argv.dataHandler(_data)) || _data;
                            if(zn.store.fire('success', _data) === false){
                                return false;
                            }
                            if(_self._argv.onSuccess){
                                _self._argv.onSuccess(_data);
                            }
                            if(_self._argv.onComplete){
                                _self._argv.onComplete(_data);
                            }
                            resolve(_data);
                        }else {
                            _data = 'this._data is undefined.';
                            if(zn.store.fire('error', _data) === false){
                                return false;
                            }
                            if(_self._argv.onError){
                                _self._argv.onError(_data);
                            }
                            if(_self._argv.onComplete){
                                _self._argv.onComplete(_data);
                            }
                            reject(_data);
                        }
                    });
            	}
            }
        }
    });

    var StoreClass = zn.Class({
        events: ['before', 'success', 'error', 'complete', 'after'],
        properties: {
            engine: {
                set: function (value){
                    this._engine = value;
                },
                get: function (){
                    if(this._engine=='Fetcher'){
                        return Fetcher;
                    }else {
                        return XHR;
                    }
                }
            }
        },
        methods: {
            fixURL: function (url){
                return zn.http.fixURL(url);
            },
            dataSource: function (data, argv) {
                return new DataSource(data, argv);
            },
            request: function (url, data, method, headers){
                var _class = this.engine;
                return new _class(url, data, method, headers);
            },
            post: function (url, data, headers){
                return this.request(url, data, "POST", headers);
            },
            delete: function (url, data, headers){
                return this.request(url, data, "DELETE", headers);
            },
            put: function (url, data, headers){
                return this.request(url, data, "PUT", headers);
            },
            get: function (url, data, headers){
                return this.request(url, data, "GET", headers);
            }
        }
    });

    zn.store = zn.GLOBAL.Store = new StoreClass();

})(zn);
