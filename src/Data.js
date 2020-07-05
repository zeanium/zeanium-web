(function (zn) {

    var ZNData = zn.Class({
        events: ['before', 'array', 'object', 'convert', 'success', 'error', 'after'],
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
            recall: function (argv, events, context){
                return this.refresh(argv, events, context), this;
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
                    this.__array(data);
                }else if(_type == '[object Object]'){
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
                    throw new Error('ZNData zncaller is null.');
                }
                if(data.url){
                    data.url = zn.data.resolveURL(data.url);
                }else{
                    throw new Error('ZNData data.url is exist.');
                }
                
                _zncaller(data).then(function (response, xhr){
                    var _data = response.data;
                    if(zn.data.responseHandler && typeof zn.data.responseHandler == 'function'){
                        if(zn.data.responseHandler(response, xhr)){
                            _data = _return;
                        }
                    }

                    this.fire('after', this.__dataConvert(_data), response, xhr);
                }.bind(this), function (xhr){
                    this.fire('error', xhr);
                }.bind(this));
            },
            __dataConvert: function (data){
                var _return = this.fire('convert', data);
                if(_return !== undefined && _return !== null){
                    return _return;
                }

                if(data.result && data.code && data.message) {
                    if(data.code == 200){
                        this.fire('success', data.result);
                    }else{
                        this.fire('error', data);
                    }
                    return data.result;
                }

                return this.fire('success', data), data;
            }
        }
    });

    zn.data = zn.Class({
        static: true,
        properties: {
            zncaller: null,
            host: null,
            port: null,
            responseHandler: null
        },
        methods: {
            init: function (){
                this.zncaller = null;
                this.host = window.location.origin;
                this.port = null;
            },
            create: function (argv, events, context){
                return new ZNData(argv, events, context);
            },
            setting: function (setting){
                return this.sets(setting), this;
            },
            setHost: function (host, port){
                return this.host = host, this.port = port, this;
            },
            setCaller: function (zncaller){
                return this.zncaller = zncaller, this;
            },
            getBaseURL: function (host, port){
                var _host = host || this.host,
                    _port = port || this.port;
                if(_port){
                    return _host.split(':')[0] + _port;
                }else {
                    return _host;
                }
            },
            resolveURL: function (url, host, port) {
                var _url = url || '';
                if(_url.indexOf('http://') == -1 && _url.indexOf('https://') == -1){
                    _url = this.getBaseURL(host, port) + _url;
                }

                return _url;
            },
            request: function (argv){
                if(!argv || !argv.url) {
                    throw new ReferenceError('zn.data.request() argv or argv.url is null.');
                }

                if(!this.zncaller) {
                    throw new ReferenceError('zn.data.zncaller is null.');
                }

                if(typeof this.zncaller != 'function'){
                    throw new ReferenceError('zn.data.zncaller is not "function" type.'); 
                }

                return argv.url = this.resolveURL(argv.url), this.zncaller(argv);
            },
            get: function (url, options){
                return this.request(zn.deepAssigns({
                    url: url,
                    method: 'get'
                }, options));
            },
            post: function (url, options){
                return this.request(zn.deepAssigns({
                    url: url,
                    method: 'post'
                }, options));
            },
            delete: function (url, options){
                return this.request(zn.deepAssigns({
                    url: url,
                    method: 'delete'
                }, options));
            },
            put: function (url, options){
                return this.request(zn.deepAssigns({
                    url: url,
                    method: 'put'
                }, options));
            }
        }
    });

})(zn);