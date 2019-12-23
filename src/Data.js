(function (zn) {

    var ZNData = zn.Class({
        events: ['before', 'convert', 'data', 'error', 'after'],
        properties: {
            argv: null,
            data: null
        },
        methods: {
            init: function (argv, events){
                this._argv = argv;
                this.__init(argv);
            },
            refresh: function (){
                this.__init(this._argv);
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
                if(!zn.data.caller){
                    throw new Error('zn.data.caller is null');
                }

                zn.data.caller.call(data, zn.data.caller).then(function (value){
                    this.fire('after', this.__dataConvert(value));
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
            caller: null
        },
        methods: {
            create: function (argv){
                return new ZNData(argv);
            },
            settings: function (settings){
                return this.sets(settings), this;
            }
        }
    });

})(zn);