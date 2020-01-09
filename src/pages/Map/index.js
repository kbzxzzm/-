import React, { Component } from "react";

// react 引入地图js后 BMap 必须加上window.BMap
let BMap = window.BMap;
export default class Map extends Component {
  // 必须保证页面有div了
  componentDidMount() {
    this.initMap();
  }
  // 封装显示地图
  initMap() {
    // 地图初始化
    var map = new BMap.Map("container");
    // 设置中心点 经纬度
    var point = new BMap.Point(116.404, 39.915);
    // 显示地图并设置缩放
    map.centerAndZoom(point, 15); //11 市区 13 县镇  15 街道
  }
  render() {
    return (
      <div className="map">
        {/* 写一个div 用来放地图 */}
        <div id="container"></div>
      </div>
    );
  }
}
