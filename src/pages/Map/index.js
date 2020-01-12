import React, { Component } from "react";
import Header from "../../components/Header";
import { getCurrentcity } from "../../utils"; //先定位。找到index
import "./index.scss";
import styles from "./index.module.scss";
import axios from "axios";
import { Toast } from "antd-mobile";
let BMap = window.BMap; // react 引入地图js后 BMap 必须加上window.BMap
export default class Map extends Component {
  componentDidMount() {
    this.initMap(); // 必须保证页面有div了
  }
  state = {
    count: 0,
    list: [],
    isshow: true //得到房源列表了，显示
  };
  render() {
    return (
      <div className="map">
        <Header>地图找房</Header>
        <div id="container"></div>
        {/* 房子列表 */}
        {this.renderhouselist()}
      </div>
    );
  }
  renderhouselist = () => {
    return this.state.list.map(item => {
      return (
        <div
          key={item.houseCode}
          className={[
            styles.houseList,
            this.state.isshow ? styles.show : ""
          ].join(" ")} //类名+空格
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <a className={styles.titleMore} href="/house/list">
              更多房源
            </a>
          </div>
          <div className={styles.houseItems}>
            <div className={styles.house}>
              <div className={styles.imgWrap}>
                <img
                  className={styles.img}
                  src={`http://localhost:8080${item.houseImg}`}
                  alt=""
                />
              </div>
              <div className={styles.content}>
                <h3 className={styles.title}>{item.title}</h3>
                <div className={styles.desc}>{item.desc}</div>
                <div>
                  {/* ['近地铁', '随时看房'] */}
                  {item.tags.map((val, index) => {
                    let tagclass = "tag" + (index + 1);
                    return (
                      <span
                        className={[styles.tag, styles[tagclass]].join(" ")} //tag1 tag2不同样式而已
                        key={index}
                      >
                        {val}
                      </span>
                    );
                  })}
                </div>
                <div className={styles.price}>
                  <span className={styles.priceNum}>{item.pric}</span> 元/月
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  async initMap() {
    this.map = new BMap.Map("container"); // 地图初始化 // 封装显示地图//用this.直接放到整个全局使用
    //var point = new BMap.Point(116.404, 39.915); // 设置中心点 经纬度,这里是写死的数据
    //map.centerAndZoom(point, 11); // 显示地图并设置缩放//11 市区 13 县镇  15 街道
    let dw = await getCurrentcity(); //拿到定位：北京，但是当前没有经纬度，把城市名转换成经纬度,逆地址解析转换
    var myGeo = new BMap.Geocoder(); //创建地址解析器实例
    myGeo.getPoint(
      dw.label, //百度覆盖物自带的
      async point => {
        if (point) {
          this.map.centerAndZoom(point, 11); //point就是经纬度
          // map.addOverlay(new BMap.Marker(point));//红点
          this.map.addControl(new BMap.NavigationControl()); //平移缩放控件
          this.map.addControl(new BMap.ScaleControl()); //比例尺
          //map.addControl(new BMap.OverviewMapControl()); //缩略地图
          this.map.addControl(new BMap.MapTypeControl()); //地图类型
          // map.addControl(new BMap.CopyrightControl());//版权
          //封装发送请求，生成覆盖物
          this.renderOverleys(dw.value, "cycle"); //第一次进来画圆形
        }
      },
      dw.label
    );
    this.map.addEventListener("movestart", () => {
      this.setState({
        isshow: false //移动地图，隐藏房源列表
      });
    });
  }
  gethouselist = async id => {
    Toast.loading("正在加载", 0);
    let res = await axios.get("http://localhost:8080/houses?cityId=" + id);
    console.log(res);
    Toast.hide();
    this.setState({
      count: res.data.body.count,
      list: res.data.body.list,
      isshow: true //拿到数据，显示房源列表
    });
  }; //传入id和覆盖物类型  ↓
  renderOverleys = async (id, type) => {
    // Toast.loading(content, duration, onClose, mask);
    Toast.loading("正在加载", 0);
    let res = await axios.get(
      "http://localhost:8080/area/map?id=" + id //画覆盖物前，获取所有房子套数
    );
    console.log(res); //所有房源数据
    Toast.hide(); //拿到数据后隐藏即可
    res.data.body.forEach(item => {
      let { coord } = item;
      let point = new BMap.Point(coord.longitude, coord.latitude);
      var opts = {
        position: point, //指定文本标标注的位置
        offset: new BMap.Size(-35, -35) //位置偏移
      };
      var label = new BMap.Label("", opts);
      if (type === "cycle") {
        label.setContent(`
        <div class="${styles.bubble}">
           <p class="${styles.name}">${item.label}</p>
           <p>${item.count}套</p>
        </div>
       `); //直接写内容 圆形覆盖物样式
      } else if (type === "rect") {
        label.setContent(` 
        <div class="${styles.rect}">
         <span class="${styles.housename}">${item.label}</span>
         <span class="${styles.housenum}">${item.count}套</span>
         <i class="${styles.arrow}"></i>
       </div>`); //矩形样式覆盖物
      }

      label.setStyle({ border: 0, padding: 0 }); //清除默认样式
      this.map.addOverlay(label); //添加覆盖物
      label.addEventListener("click", e => {
        let zoom = this.map.getZoom(); //当前地图缩放，判断是区还是县
        if (zoom === 11) {
          console.log("aa", item.value); //当前坐标物id
          this.map.centerAndZoom(point, 13); //进入市区
          setTimeout(() => {
            this.map.clearOverlays(); //百度地图有bug，需要延时否则报错‘R’
          });
          this.renderOverleys(item.value, "cycle");
        } else if (zoom === 13) {
          console.log("aa", item.value); //当前坐标物id
          this.map.centerAndZoom(point, 15); //进入市区
          setTimeout(() => {
            this.map.clearOverlays(); //百度地图有bug，需要延时否则报错‘R’
          });
          this.renderOverleys(item.value, "rect");
        } else if (zoom === 15) {
          console.log("弹出框，并显示房源列表");
          // console.log(e);e里面包含坐标
          let clickX = e.changedTouches[0].clientX; //向左移动的距离=点击的x坐标-中心点x坐标
          let clickY = e.changedTouches[0].clientY; //window.innerHeight就是屏幕宽高
          let centerX = window.innerWidth / 2; //中心点=（屏幕宽-列表宽）/2
          let centerY = (window.innerHeight - 330) / 2; //中心点=（屏幕高-列表高）/2
          let removeX = centerX - clickX; //移动的距离
          let removeY = centerY - clickY; //移动的距离
          this.map.panBy(removeX, removeY); //百度地图自带功能移动位置
          this.gethouselist(item.value); //显示房源列表
        }
      });
      this.map.addOverlay(label);
    });
  };
}
