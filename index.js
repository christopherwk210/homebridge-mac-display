const package = require('./package.json');
const exec = require('child_process').exec;

let Service, Characteristic;

// Set up homebridge
module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("mac-display", "DisplaySwitch", macDisplay); // register
};

function macDisplay(log, config) {
  this.log = log;
}

macDisplay.prototype.getServices = function() {
  let informationService = new Service.AccessoryInformation();
  informationService
    .setCharacteristic(Characteristic.Manufacturer, "christopherwk210")
    .setCharacteristic(Characteristic.Model, "DisplaySwitch")
    .setCharacteristic(Characteristic.SerialNumber, package.version);

  let switchService = new Service.Switch("DisplaySwitch");
  switchService
    .getCharacteristic(Characteristic.On)
    .on('set', this.setSwitchOnCharacteristic.bind(this))
    .on('get', this.getSwitchOnCharacteristic.bind(this));

  this.informationService = informationService;
  this.switchService = switchService;
  return [informationService, switchService];
}

// Returns proper state of display
macDisplay.prototype.getSwitchOnCharacteristic = function(next) {
  exec('pmset -g powerstate IODisplayWrangler | tail -1 | cut -c29', (err, stdout, stderr) => {
    next(null, parseInt(stdout) >= 4);
  });
}

// Sets the display on or off
macDisplay.prototype.setSwitchOnCharacteristic = function(on, next) {
  this.log('Setting mac display: ' + (on ? 'on' : 'off'));

  // Check current status
  exec('pmset -g powerstate IODisplayWrangler | tail -1 | cut -c29', (err, stdout, stderr) => {
    if ((parseInt(stdout) >= 4) !== on) {
      on ? exec('caffeinate -u -t 1') : exec('pmset displaysleepnow');
    }
    next();    
  });
}