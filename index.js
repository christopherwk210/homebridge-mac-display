const package = require('./package.json');
const exec = require('child_process').exec;

let Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("mac-display", "DisplaySwitch", macDisplay);
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

macDisplay.prototype.getSwitchOnCharacteristic = function(next) {
  exec('pmset -g powerstate IODisplayWrangler | tail -1 | cut -c29', (err, stdout, stderr) => {
    next(null, parseInt(stdout) >= 4);
  });
}
 
macDisplay.prototype.setSwitchOnCharacteristic = function(on, next) {
  this.log('Mac display: ' + on);

  exec('pmset -g powerstate IODisplayWrangler | tail -1 | cut -c29', (err, stdout, stderr) => {
    if ((parseInt(stdout) >= 4) !== on) {
      on ? exec('caffeinate -u -t 1') : exec('pmset displaysleepnow');
    }
    next();    
  });
}