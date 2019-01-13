define('conan/class.js', function(require, exports, module){


var Extend = module.exports = function() {
    "use strict"
    var initializing = false,
        superTest = /conan/.test(function() {
            conan;
        }) ? /\b_super\b/ : /.*/;
    var Class = function(prop) {};
    var clone = function(prototype, prop, _super){
        for (var name in prop) {
            prototype[name] = (typeof prop[name] === 'function' && typeof _super[name] === 'function' && superTest.test(prop[name])) ? (function(name, fn) {
                //这一步为了实现，prop里面的某个方法（如prop.init）和原型prototype方法中的方法冲突时，可以在方法中调用【this._super()】，这里将this._super方法替换成原型中的这个方法(prototype.init).
                return function() {
                    var temp = this._super;
                    this._super = _super[name];
                    var ret = fn.apply(this, arguments);
                    this._super = temp;
                    return ret;
                }
            })(name, prop[name]) : prop[name];
        }
    }
    Class.extend = function(prop) {
        //_super和prototype:new建立一个新的对象，作为新类的prototype，不能直接在上面添加方法，会影响其他使用extend方法返回的类
        var _super = this.prototype;
        //设为true就不再执行init方法
        initializing = true;
        var prototype = new this();
        initializing = false;
        //将传进来的prop对象里的方法拷贝到prototype上面去
        for(var i = 0; i< arguments.length; i++){
            clone(prototype, arguments[i], _super);
        }
        function C() {
            //构造函数中默认调用this.init方法
            if (!initializing && this.init) {
                this.init.apply(this, arguments);
            }
        }

        //让将要返回的类继承prototype
        C.prototype = prototype;
        //将类的构造函数设为
        C.constructor = C;
        //将类添加extend方法，方便继续继承
        C.extend = Class.extend;
        //返回构造函数
        return C;
    }
    return Class
}();

});