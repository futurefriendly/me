define('conan/main.js', function(require, exports, module){

"use strict"
var Class = require('conan/class.js');
var attr = require('conan/attr.js');
var events = require('conan/event.js');

var Event = Class.extend(new events, attr);
module.exports = Event.extend({
	init: function(config) {
		this.initConf(config);
	},
	
	destroy: function() {
		this.off();
		for (var p in this) {
			if (this.hasOwnProperty(p)) {
				delete this[p];
			}
		}
		this.destroy = function() {};
	}
})

});