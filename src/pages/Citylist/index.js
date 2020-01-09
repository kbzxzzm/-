/* eslint-disable no-lone-blocks */
import React, { Component } from "react";
import { NavBar, Icon, Toast } from "antd-mobile";
import axios from "axios";
import "./citylist.scss"; // 导入样式
import { getCurrentcity } from "../../utils/index";
import { List, AutoSizer } from "react-virtualized";
import Header from "../../components/Header";
export default class Citylist extends Component {
  state = {
    citylist: {},
    cityindex: [],
    activeindex: 0
  };
  componentDidMount() {
    this.getCityList();
  }
  setcity = list => {
    let citylist = {};
    list.forEach(item => {
      let word = item.short.substr(0, 1); // 从0索引开始 截取1个,把首字母拿出来
      // citylist[word] citylist['a'] citylist.a
      if (citylist[word]) {
        citylist[word].push(item); //有这个单词  就把城市push 到数组
      } else {
        citylist[word] = [item]; //citylist.a=//没有 就设置为数组 并且带上第一次的城市
      }
    });
    //console.log("城市", citylist); // 1 在公司里面  1 发送ajax拿到的数据 正好是符合 可以直接用  2 发送ajax拿到数据 格式不太好 (1 给后台 2 只能自己再做格式)
    let cityindex = Object.keys(citylist).sort(); //拿到首字母并排序
    // console.log(cityindex);
    return { citylist, cityindex };
  };
  async getCityList() {
    let res = await axios.get("http://localhost:8080/area/city?level=1");
    console.log("城市列表数据", res); //0:label: "北京"value: "AREA|88cff55c-aaa4-e2e0"pinyin: "beijing"short: "bj"
    let { citylist, cityindex } = this.setcity(res.data.body);
    // this.setState({  //由于js执行顺序问题，出现了组件更新后才执行
    //   citylist: citylist, //将改好的值重新赋值
    //   cityindex: cityindex
    // });
    let hotres = await axios.get("http://localhost:8080/area/hot"); // console.log(hotres);//当前数据还差热门城市和定位城市，并且unshift添加前面位置
    citylist["hot"] = hotres.data.body; //将数据赋值给citylist console.log(citylist); //{b: Array(3), a: Array(1), n: Array(6), c: Array(5), w: Array(6), …}
    cityindex.unshift("hot"); //console.log(cityindex); //) ["hot", "a", "b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "q", "s", "t", "w", "x", "y", "z"]
    let dw = await getCurrentcity();
    citylist["#"] = [dw];
    cityindex.unshift("#"); //在添加完成后执行修改值并赋值，解决
    this.setState({
      citylist: citylist, //将改好的值重新赋值
      cityindex: cityindex
    });
    //console.log(citylist); //后面添加了k: (2) [{…}, {…}] hot: (4) [{…}, {…}, {…}, {…}] #: [{…}]
    //console.log(cityindex); //["#", "hot", "a", "b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "q", "s", "t", "w", "x", "y", "z"]
  }
  setword = word => {
    switch (word) {
      case "#":
        return "当前定位";
      // break;
      case "hot":
        return "热门城市";
      // break;
      default:
        return word.toUpperCase(); // break;因为已经return了所以也不需要break。加上也不会报错
    }
  };
  // 渲染每一行的内容
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // 索引号
    isScrolling, // 当前项是否正在滚动中
    isVisible, // 当前项在List中是可见的
    style // 重点属性：一定要给每一个行数添加该样式
  }) => {
    let word = this.state.cityindex[index];
    let citys = this.state.citylist[word];
    return (
      <div key={key} style={style} className="city">
        <div className="title">{this.setword(word)}</div>
        {citys.map(item => {
          return (
            <div
              key={item.value}
              className="name"
              onClick={() => {
                const DATA = ["北京", "上海", "广州", "深圳"]; //有房源的数组
                if (DATA.indexOf(item.label) !== -1) {
                  localStorage.setItem("my-city", JSON.stringify(item)); //跳转前存入本地存储
                  this.props.history.push("/home/index"); //数组中有该数据
                } else {
                  Toast.info("暂无房源"); //导入后使用 ,.loading
                }
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    );
  };
  getheigth = ({ index }) => {
    // console.log(index);//通过索引算出每一行高度不同高度，动态设置，然后返回。
    //高度=title高度（36）+城市数量*单个城市高度（50）
    // return 36+ 城市数量*50
    let word = this.state.cityindex[index]; //找每一个单词 index 1...  数组的长度，就有多少城市
    let citys = this.state.citylist[word];
    return 36 + citys.length * 50;
  };
  //循环生成单词列表index
  renderIndex = () => {
    return this.state.cityindex.map((item, index) => {
      return (
        <li
          key={item}
          className={index === this.state.activeindex ? "green" : ""}
        >
          {item === "hot" ? "热" : item.toUpperCase()}
        </li>
      );
    });
  };
  onRowsRendered = ({
    overscanStartIndex,
    overscanStopIndex,
    startIndex, //开始的索引
    stopIndex //结束的索引
  }) => {
    if (startIndex !== this.state.activeindex) {
      this.setState({
        activeindex: startIndex //做一步优化，值改变了才去执行，函数防抖
      });
    }
  };
  render() {
    return (
      <div className="citylist">
        {/* 导航 */}
        <Header>城市列表</Header>
        <AutoSizer>
          {/* 内容 */}
          {({ height, width }) => (
            <List
              width={width} // 组件的宽度
              height={height} // 组件的高度
              rowCount={this.state.cityindex.length} // 渲染总条数
              rowHeight={this.getheigth} // 每行的高度 //当前高度不对，应该计算每一次渲染的高度//index为每一行索引值
              rowRenderer={this.rowRenderer} //渲染每行的内容
              onRowsRendered={this.onRowsRendered}
            />
          )}
        </AutoSizer>
        {/* 右侧单词列表 */}
        <ul className="cityIndex">{this.renderIndex()}</ul>
      </div>
    );
  }
}
