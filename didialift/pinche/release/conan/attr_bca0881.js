define('conan/attr.js', function(require, exports, module){

module.exports = {

  get: function(key) {
    return $.isPlainObject(this.attrs[key]) && this.attrs[key].value !== undefined ? this.attrs[key].value : this.attrs[key];
  },
  set: function(key, value) {
    if ($.isPlainObject(this.attrs[key]) && $.isFunction(this.attrs[key].setter)) {
      this.attrs[key].value = this.attrs[key].setter(value);
    } else {
      this.attrs[key] = value;
    }
  },
  initConf: function(config) {
    for (var i in config) {
      if (config.hasOwnProperty(i)) {
        this.set(i, config[i]);
      }
    }
  }
}

});