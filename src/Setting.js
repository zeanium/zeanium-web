(function (zn) {

    zn.setting = zn.Class({
        static: true,
        methods: {
            init: function (){
                this._data_ = {};
            },
            data: function (data) {
                return zn.deepAssigns(this._data_, data), this;
            },
            getKey: function (key) {
                return this.path(key);
            },
            setKey: function (key, value) {
                return this.setPath(key, value);
            },
            getValue: function (namespace){
                return this.path(namespace);
            },
            setValue: function (namespace, value){
                return this.setPath(namespace, value);
            },
            isVarValue: function (value){
                if(typeof value == 'string'){
                    return value.indexOf('{{') === 0 && value.indexOf('}}') === (value.length - 2);
                }

                return false;
            },
            getVarValue: function (value){
                if(typeof value == 'string' && value.length > 4){
                    return this.path(value.substring(2, value.length - 2));
                }
                return value;
            },
            realizeValue: function (value) {
                switch(zn.type(value)) {
                    case 'object':
                        for(var key in value) {
                            value[key] = this.realizeValue(value[key]);
                        }
                        break;
                    case 'string':
                        if(this.isVarValue(value)) {
                            value = this.getVarValue(value);
                        }
                    case 'array':
                        for(var i =0, _len = value.length; i++; i < _len) {
                            value[i] = this.realizeValue(value[key]);
                        }
                        break;
                }

                return value;
            },
            path: function (path) {
                var _value = zn.path(this._data_, path);
                if(this.isVarValue(_value)){
                    _value = this.getVarValue(_value);
                }

                return this.realizeValue(_value);
            },
            setPath: function (path, value){
                return zn.path(this._data_, path, this.realizeValue(value)), this;
            },
            keys: function (){
                return Object.keys(this._data_);
            }
        }
    });

})(zn);