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
                    data.owner = this;
                    data.refresh = data.owner.refresh;
                    this.__array(data);
                }else if(_type == '[object Object]'){
                    data.owner = this;
                    data.refresh = data.owner.refresh;
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