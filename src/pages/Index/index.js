import React, { Component } from "react";
import { Carousel, Flex, Grid } from "antd-mobile";
import axios from "axios";
import "./index.scss";
import nav1 from "../../assets/images/nav-1.png";
import nav2 from "../../assets/images/nav-2.png";
import nav3 from "../../assets/images/nav-3.png";
import nav4 from "../../assets/images/nav-4.png";
import { getCurrentcity } from "../../utils/index.js";
const navs = [
  {
    id: 0,
    img: nav1,
    title: "整租",
    path: "/home/houselist"
  },
  {
    id: 1,
    img: nav2,
    title: "合租",
    path: "/home/houselist"
  },
  {
    id: 2,
    img: nav3,
    title: "地图找房",
    path: "/map"
  },
  {
    id: 3,
    img: nav4,
    title: "去出租",
    path: "/rent/add"
  }
];
export default class Index extends Component {
  state = {
    swiperData: [],
    imgHeight: 176,
    isplay: false, //不轮播
    groups: [], //租房小组
    news: [], //新闻列表
    cityname: ""
  };
  async componentDidMount() {
    this.getSwiperdata(); // 发送请求 获取轮播图数据
    this.getGroups(); ///租房小组
    this.getNews();
    let dw = await getCurrentcity();
    this.setState({
      cityname: dw.label
    });
  }
  async getGroups() {
    let res = await axios.get(
      "http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0" //id是北京的
    );
    if (res.data.status === 200) {
      this.setState(
        {
          groups: res.data.body
        }
        // ,
        // () => {
        //   console.log(this.state.groups);
        // }
      );
    }
  }
  async getSwiperdata() {
    let res = await axios.get("http://localhost:8080/home/swiper");
    // console.log("轮播图数据", res);
    this.setState(
      {
        swiperData: res.data.body // 赋值
      },
      () => {
        this.setState({
          isplay: true //改成true   数据一定成功了执行这个函数
        });
      }
    );
  }

  renderSwiper() {
    return this.state.swiperData.map((
      item // 渲染轮播图图片
    ) => (
      <a
        key={item.id}
        href="http://www.alipay.com"
        style={{
          display: "inline-block",
          width: "100%",
          height: this.state.imgHeight
        }}
      >
        <img
          src={"http://localhost:8080" + item.imgSrc}
          alt=""
          style={{ width: "100%", verticalAlign: "top" }}
          onLoad={() => {
            window.dispatchEvent(new Event("resize")); // 窗口改变的时候 图片适应宽高
            this.setState({ imgHeight: "auto" });
          }}
        />
      </a>
    ));
  }
  renderNavs() {
    return navs.map(item => {
      return (
        <Flex.Item
          key={item.id}
          onClick={() => {
            this.props.history.push(item.path);
          }}
        >
          <img src={item.img} alt="" />
          <p>{item.title}</p>
        </Flex.Item>
      );
    });
  }
  async getNews() {
    let res = await axios.get(
      "http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0"
    );
    if (res.data.status === 200) {
      this.setState({
        news: res.data.body
      });
    }
  }
  renderNews() {
    return this.state.news.map(item => {
      return (
        <li key={item.id}>
          <img src={"http://localhost:8080" + item.imgSrc} alt="" />
          <div className="content-right">
            {/* 右边 */}
            <h4>{item.title}</h4>
            <p>
              <span>{item.from}</span>
              <span>{item.date}</span>
            </p>
          </div>
        </li>
      );
    });
  }
  render() {
    return (
      <div className="Index">
        <Flex className="searchBox">
          <Flex className="searchLeft">
            <div
              className="location"
              onClick={() => {
                // 去选择切换城市
                this.props.history.push("/citylist");
              }}
            >
              {/* 修改城市名 */}
              <span>{this.state.cityname}</span>
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
              //跳转去 地图 map
              this.props.history.push("/map");
            }}
          />
        </Flex>

        <Carousel
          autoplay={this.state.isplay} // true自动轮播 有问题 一开始打开没数据 没生效 有数据再设置能生效
          infinite
        >
          {this.renderSwiper()}
        </Carousel>
        <Flex className="nav">{this.renderNavs()}</Flex>
        {/* 租房小组 */}
        <div className="groups">
          <div className="groups-title">
            <h3>租房小组</h3>
            <span>更多</span>
          </div>
          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false} //矩形
            activeStyle //点击有灰色背景一闪而过
            hasLine={false} //边框
            renderItem={item => (
              <Flex className="grid-item" justify="between">
                <div className="desc">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />
        </div>
        <div className="news">
          <h3>最新资讯</h3>
          <div className="news-content">
            <ul>{this.renderNews()}</ul>
          </div>
        </div>
      </div>
    );
  }
}
{
  /* <div className="group-content">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div> 先发axios拿数据，数据是动态的*/
}
