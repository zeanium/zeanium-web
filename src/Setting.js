(function (zn) {

    zn.setting = zn.Class({
        static: true,
        properties: {
            
        },
        methods: {
            init: function (){
                this._data_ = {};
            },
            data: function (data) {
                return zn.deepAssigns(this._data_, data), this;
            },
            getKey: function (key) {
                return this._data_[key];
            },
            setKey: function (key, value) {
                return this._data_[key] = value, this;
            },
            setValue: function (namespace, value){
                return zn.path(this._data_, namespace, value), this;
            },
            getValue: function (namespace){
                return zn.path(this._data_, namespace);
            },
            path: function (path) {
                return zn.path(this._data_, path);
            }
        }
    });

})(zn);