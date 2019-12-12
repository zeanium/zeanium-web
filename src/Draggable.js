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