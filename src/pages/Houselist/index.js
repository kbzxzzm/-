import React, { Component } from "react";
import "./index.scss";
import styles from "./index.module.css";//导入modules.css
import SearchHeader from "../../components/SearchHeader";
import { getCurrentcity } from "../../utils";
import Filter from "./Filter";
import { API } from "../../utils/app";
import { List, AutoSizer } from "react-virtualized";
export default class Houselist extends Component {
  state = {
    cityname: "",
    id: "",
    list: [],
    count: 0
  };
  async componentDidMount() {
    let dw = await getCurrentcity(); //写全才会显示dw数据await
    this.setState({
      cityname: dw.label,
      id: dw.value
    });
  }
  onFilter = filters => {
    //console.log(filters); //拿到一模一样的数据，
    this.filters = filters; //赋值给组件，或者可以传参
    this.gethouselist();
  };
  gethouselist = async () => {
    let res = await API.get("/houses", {
      params: {
        cityId: this.state.id, //params为get请求第二参数
        ...this.filters,
        start: 1, //第一条
        end: 20 //拿20条数据
      }
    });
    console.log(res);
    this.setState({
      list: res.data.body.list,
      count: res.data.body.count
    });
  };
  rowRenderer = ({
    key, // 唯一key 必须有
    index, // 每项的索引  必须有
    isScrolling, //是否在滚动
    isVisible, // 是否可见
    style // 每一项的样式 必须有
  }) => {
    return (
      // 每一个房子
      <div key={key} style={style} className={styles.house}>
        <div className={styles.imgWrap}>
          <img
            className={styles.img}
            src={`http://localhost:8080/newImg/7bl2kl92b.jpg`}
            alt=""
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>整租 · 哈哈 3室1厅 7000元</h3>
          <div className={styles.desc}>三室/112/南|北/世嘉博苑</div>
          <div>
            {/* ['近地铁', '随时看房'] */}
            <span className={[styles.tag, styles.tag1].join(" ")}>近地铁</span>
          </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>7000</span> 元/月
          </div>
        </div>
      </div>
    );
  };
  render() {
    return (
      <div className="houselist">
        <div className="header">
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          ></i>
          <SearchHeader cityname={this.state.cityname}></SearchHeader>
        </div>
        <Filter onFilter={this.onFilter}></Filter>
        {/* <h1>房子列表</h1> */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              width={width}
              height={height}
              rowCount={this.state.count} // 总条数
              rowHeight={120}
              rowRenderer={this.rowRenderer}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}
