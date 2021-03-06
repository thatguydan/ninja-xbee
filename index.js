var Device = require('./lib/device')
var util = require('util')
var stream = require('stream')
var configHandlers = require('./lib/config-handlers')

// Give our driver a stream interface
util.inherits(xbee,stream);

function xbee(opts,app) {

  var self = this;
  this._devices = {};
  this.opts = opts;

  app.on('client::up',function(){

    this.opts.devices.forEach(this.loadDevice.bind(this));
  }.bind(this));
};

xbee.prototype.loadDevice = function(device) {

  if (this._devices[device]) return;
  this._devices[device] = new Device(device,this);
};

xbee.prototype.config = function(rpc,cb) {

  var self = this;
  // If rpc is null, we should send the user a menu of what he/she
  // can do.
  // Otherwise, we will try action the rpc method
  if (!rpc) {
    return configHandlers.menu.call(this,cb);
  }
  else if (typeof configHandlers[rpc.method] === "function") {
    return configHandlers[rpc.method].call(this,rpc.params,cb);
  }
  else {
    return cb(true);
  }
};

// Export it
module.exports = xbee;