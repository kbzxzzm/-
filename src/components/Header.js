import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { NavBar, Icon } from "antd-mobile";
import PropTypes from "prop-types";
class Header extends Component {
  render() {
    return (
      <NavBar
        className="navbar"
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => this.props.history.go(-1)}
      >
        {this.props.children}
      </NavBar>
    );
  }
}
//导出之前验证规则
Header.propTypes = {
  children: PropTypes.string
};
Header.defaultProps = {
  children: "默认导航" //如果没传值，则使用默认值
};
export default withRouter(Header);
