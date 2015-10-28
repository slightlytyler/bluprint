#!/usr/bin/env node


'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _help = require('./help');

var _help2 = _interopRequireDefault(_help);

var _generate = require('./generate');

var _generate2 = _interopRequireDefault(_generate);

_commander2['default'].version('0.1.0').usage('<keywords> [options]').option('-p, --pods [pods flag]', 'Generates using the defined pods based file structure').on('--help', function () {
  return _help2['default'].print();
}).parse(process.argv);

var args = _commander2['default'].args;

var anyArgs = function anyArgs() {
  return !!args.length;
};

if (!anyArgs()) {
  _commander2['default'].help();
} else {
  if (args[0] === "generate") {
    (0, _generate2['default'])(_lodash2['default'].drop(args));
  } else {
    _commander2['default'].help();
  }
}