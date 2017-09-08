# homebridge-mac-display
Control your mac display with [HomeBridge](https://github.com/nfarina/homebridge). Currently this only works if you are running homebridge on a mac, and will only control the display of that specific mac. I made this for personal use, since I use a Mac mini to control my homebridge as well as a HTPC, so it's convenient to be able to turn the display on and off from my phone.

## Installation
- Install homebridge: `npm install -g homebridge`
- Install homebridge-mac-display: `npm install -g homebridge-mac-display`
- Update configuration file

## Configuration file
All you have to do is add a new accessory under the `DisplaySwitch` name:
```json
"accessories": [
  {
    "accessory": "DisplaySwitch",
    "name": "My Mac HomeBridge Host"
  }
]
```