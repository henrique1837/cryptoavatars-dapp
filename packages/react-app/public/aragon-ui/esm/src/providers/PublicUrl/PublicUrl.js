import _extends from '../../../node_modules/@babel/runtime/helpers/extends.js';
import _classCallCheck from '../../../node_modules/@babel/runtime/helpers/classCallCheck.js';
import _createClass from '../../../node_modules/@babel/runtime/helpers/createClass.js';
import _inherits from '../../../node_modules/@babel/runtime/helpers/inherits.js';
import _possibleConstructorReturn from '../../../node_modules/@babel/runtime/helpers/possibleConstructorReturn.js';
import _getPrototypeOf from '../../../node_modules/@babel/runtime/helpers/getPrototypeOf.js';
import _defineProperty from '../../../node_modules/@babel/runtime/helpers/defineProperty.js';
import React, { useContext } from 'react';
import propTypes from '../../../node_modules/prop-types/index.js';
import getDisplayName from '../../../node_modules/react-display-name/lib/getDisplayName.js';
import { prefixUrl } from '../../utils/url.js';

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
var PublicUrlContext = /*#__PURE__*/React.createContext('');
var Provider = PublicUrlContext.Provider,
    Consumer = PublicUrlContext.Consumer;

var PublicUrlProvider = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(PublicUrlProvider, _React$PureComponent);

  var _super = _createSuper(PublicUrlProvider);

  function PublicUrlProvider() {
    _classCallCheck(this, PublicUrlProvider);

    return _super.apply(this, arguments);
  }

  _createClass(PublicUrlProvider, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          url = _this$props.url,
          children = _this$props.children;
      return /*#__PURE__*/React.createElement(Provider, {
        value: url
      }, children);
    }
  }]);

  return PublicUrlProvider;
}(React.PureComponent); // HOC wrapper


_defineProperty(PublicUrlProvider, "propTypes", {
  url: propTypes.string.isRequired,
  children: propTypes.node
});

var hocWrap = function hocWrap(Component) {
  var HOC = function HOC(props) {
    return /*#__PURE__*/React.createElement(Consumer, null, function (url) {
      return /*#__PURE__*/React.createElement(Component, _extends({}, props, {
        publicUrl: url
      }));
    });
  };

  HOC.displayName = "PublicUrlProvider(".concat(getDisplayName(Component), ")");
  return HOC;
}; // styled-components utility for URLs


var styledUrl = function styledUrl(url) {
  return function (_ref) {
    var publicUrl = _ref.publicUrl;
    return prefixUrl(url, publicUrl);
  };
};

var PublicUrl = function PublicUrl(props) {
  return /*#__PURE__*/React.createElement(Consumer, props);
};

PublicUrl.Provider = PublicUrlProvider;
PublicUrl.hocWrap = hocWrap;
PublicUrl.styledUrl = styledUrl;

function usePublicUrl() {
  return useContext(PublicUrlContext);
}

export default PublicUrl;
export { Provider, PublicUrl, hocWrap, styledUrl, usePublicUrl };
//# sourceMappingURL=PublicUrl.js.map
