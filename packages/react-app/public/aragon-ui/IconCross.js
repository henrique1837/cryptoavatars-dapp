'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _extends = require('./extends-5150c1f4.js');
var objectWithoutProperties = require('./objectWithoutProperties-5d2c0728.js');
var React = require('react');
var IconPropTypes = require('./IconPropTypes-f5b14dc5.js');
require('./_commonjsHelpers-1b94f6bc.js');
require('./slicedToArray-bb07ac16.js');
require('./unsupportedIterableToArray-d5a3ce67.js');
require('./index-c33eeeef.js');
require('./index-37353731.js');
require('./constants.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function IconCross(_ref) {
  var size = _ref.size,
      props = objectWithoutProperties._objectWithoutProperties(_ref, ["size"]);

  var sizeValue = IconPropTypes.useIconSize(size);
  return /*#__PURE__*/React__default['default'].createElement("svg", _extends._extends({
    width: sizeValue,
    height: sizeValue,
    fill: "none",
    viewBox: "0 0 24 24"
  }, props), /*#__PURE__*/React__default['default'].createElement("path", {
    fill: "currentColor",
    stroke: "currentColor",
    strokeWidth: 0.5,
    d: "M17.858 6.142a.485.485 0 00-.685 0L6.142 17.172a.485.485 0 10.686.686l11.03-11.03a.485.485 0 000-.686z"
  }), /*#__PURE__*/React__default['default'].createElement("path", {
    fill: "currentColor",
    stroke: "currentColor",
    strokeWidth: 0.5,
    d: "M17.858 17.173l-5.515-5.516-5.516-5.515a.485.485 0 10-.685.685l11.03 11.031a.483.483 0 00.686 0 .485.485 0 000-.685z"
  }));
}

IconCross.propTypes = IconPropTypes.IconPropTypes;

exports.default = IconCross;
//# sourceMappingURL=IconCross.js.map
