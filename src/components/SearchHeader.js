import React, { Component } from "react";
import { Carousel, Flex, Grid } from "antd-mobile";
import { withRouter } from "react-router-dom"; //class组件传参数props。封装顶部导航栏
import { PropTypes } from "prop-types"; //下面把cityname和history解构出来
function SearchHeader({ cityname, history }) {
  return (
    <Flex className="searchBox">
      <Flex className="searchLeft">
        <div
          className="location"
          onClick={() => {
            history.push("/citylist"); // 去选择切换城市
          }}
        >
          {/* 修改城市名 */}
          <span>{cityname}</span>
          <i className="iconfont icon-arrow" />
        </div>
        <div className="searchForm">
          <i className="iconfont icon-seach" />
          <span>请输入小区或地址</span>
        </div>
      </Flex>
      <i
        className="iconfont icon-map"
        onClick={() => {
          history.push("/map"); //跳转去 地图 map
        }}
      />
    </Flex>
  );
}
SearchHeader.propTypes = {
  cityname: PropTypes.string //组件别忘了写校验规则
};
SearchHeader.defaultProps = {
  cityname: "上海"
};
export default withRouter(SearchHeader);
