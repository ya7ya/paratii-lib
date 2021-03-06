'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utils = exports.Paratii = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _paratiiEth = require('./paratii.eth.js');

var _paratiiIpfs = require('./paratii.ipfs.js');

var _paratiiPersonal = require('./paratii.personal.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Web3 = require('web3');
var dopts = require('default-options');
var utils = require('./utils.js');

/**
 * Paratii Library
 * for usage, see https://github.com/Paratii-Video/paratii-contracts/tree/master/docs
 *
 */

var Paratii = function () {
  function Paratii() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Paratii);

    var defaults = {
      provider: 'http://localhost:8545',
      registryAddress: null,
      account: null,
      privateKey: null
    };
    var config = dopts(opts, defaults);
    this.config = config;

    this.web3 = new Web3();
    this.web3.setProvider(new this.web3.providers.HttpProvider(config.provider));

    if (!config.account) {
      // this is the first account generated with testprc/ganache using the --deterministic flag
      // we use it here as default, but probably should not..
      this.account = {
        address: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
        privateKey: '4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'
      };
      this.web3.eth.accounts.wallet.add(this.account.privateKey);
    } else {
      this.account = {
        address: config.account
      };
      if (config.privateKey) {
        this.web3.eth.accounts.wallet.add(config.privateKey);
      }
    }

    this.eth = new _paratiiEth.ParatiiEth(this);

    this.ipfs = new _paratiiIpfs.ParatiiIPFS(this);
    this.personal = new _paratiiPersonal.ParatiiPersonal(this);
  }

  _createClass(Paratii, [{
    key: 'setAccount',
    value: function setAccount(address, privateKey) {
      this.account = {
        address: address,
        privateKey: privateKey
        // account = {
        //   address: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
        //   privateKey: '4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'
        // }

      };
      if (privateKey) {
        this.web3.eth.accounts.wallet.add(privateKey);
      }
    }
  }, {
    key: 'diagnose',
    value: function diagnose() {
      var msg, address, msgs, isOk, log, registry, i, name;
      return regeneratorRuntime.async(function diagnose$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              log = function log(msg) {
                msgs.push(msg);
              };

              // return an array of strings with diagnostic info

              msg = void 0, address = void 0, msgs = void 0;
              isOk = true;

              msgs = [];

              log('Paratii was initialized with the following options:');
              log(this.config);
              address = this.eth.getRegistryAddress();

              if (address) {
                _context.next = 13;
                break;
              }

              log('No registry address found!');
              log('Value of this.config.registryAddress: ' + this.config.registryAddress);
              isOk = false;
              _context.next = 33;
              break;

            case 13:
              log('checking deployed code of Registry...');
              _context.next = 16;
              return regeneratorRuntime.awrap(this.web3.eth.getCode(address));

            case 16:
              msg = _context.sent;

              if (msg === '0x') {
                log('ERROR: no code was found on the registry address ' + address);
                log(msg);
              } else {
                log('... seems ok...');
                // log(`We found the following code on the registry address ${address}`)
                // log(msg)
              }
              log('checking for addresses');
              _context.next = 21;
              return regeneratorRuntime.awrap(this.eth.getContract('ParatiiRegistry'));

            case 21:
              registry = _context.sent;
              i = 0;

            case 23:
              if (!(i < this.eth.contractNames.length)) {
                _context.next = 33;
                break;
              }

              name = this.eth.contractNames[i];

              if (!(name !== 'ParatiiRegistry')) {
                _context.next = 30;
                break;
              }

              _context.next = 28;
              return regeneratorRuntime.awrap(registry.methods.getContract(name).call());

            case 28:
              address = _context.sent;

              log('address of ' + name + ': ' + address);

            case 30:
              i++;
              _context.next = 23;
              break;

            case 33:
              log('thats it!');

              if (isOk) {
                _context.next = 36;
                break;
              }

              throw Error(msgs);

            case 36:
              return _context.abrupt('return', msgs);

            case 37:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this);
    }
  }]);

  return Paratii;
}();

exports.Paratii = Paratii;
exports.utils = utils;