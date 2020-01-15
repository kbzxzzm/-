import React, { Component } from "react";
import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker"; 
import FilterMore from "../FilterMore";
import styles from "./index.module.css";
import { getCurrentcity } from "../../../utils/index";
import { API } from "../../../utils/app";
const titleSelectedStatus = {
  area: false, //区域//是否点亮图标
  mode: false, //方式
  price: false, // 租金
  more: false //筛选more
};
const selectedValues = {
  area: ["area", null], //默认选中的值
  mode: ["null"],
  price: ["null"],
  more: []
};
export default class Filter extends Component {
  componentDidMount() {
    this.getFilterData();
  } //axios获取数据
  getFilterData = async () => {
    let dw = await getCurrentcity();
    let res = await API.get(
      "http://localhost:8080/houses/condition?id=" + dw.value //定位的id
    );
    // console.log(res);
    this.setState({
      filterdata: res.data.body
    });
  }; //渲染picker组件
  renderpicker = () => {
    let { openType, filterdata, selectedValues } = this.state; //解构赋值出来
    if (openType === "area" || openType === "mode" || openType === "price") {
      let data = [];
      let cols = 3; //判断点击了哪里，
      let defaultvalues = selectedValues[openType]; //默认值 ["area", null]  ["null"]  ["null"]
      switch (openType) {
        case "area": //如果传来的数据是area
          data = [filterdata.area, filterdata.subway]; //稍微复杂了些，
          cols = 3; //传递行数
          break;
        case "mode":
          data = filterdata["rentType"]; //整租合租
          cols = 1;
          break;
        case "price": //如果传过来的type是price
          data = filterdata["price"]; //金额范围
          cols = 1;
          break;
      }
      return (
        <FilterPicker
          key={openType} //必须有key才能数据改动更新全部视图
          type={openType}
          defaultValues={defaultvalues}
          data={data}
          cols={cols}
          onCancel={this.onCancel}
          onSave={this.onSave}
        />
      );
    }
    return null;
  };
  state = {
    titleStatus: titleSelectedStatus,
    openType: "", //点击area mode more 才显示
    selectedValues,
    filterdata: {}
  }; //↓是 父亲 标题点击的函数。从filtertitle接收类型
  onTitleClick = type => {
    let newstatus = { ...this.state.titleStatus }; //高亮
    let newvalues = { ...this.state.selectedValues }; //新值
    for (let key in newstatus) {
      //console.log("key:", key, type); //key: area mode price more ,type:area mode price more
      if (key === type) {
        newstatus[key] = true; //点谁谁高亮
        continue; //结束这里的循环，进行下一次循环
      }
      let selectval = newvalues[key]; //每一个的 selectedVal值
      if (
        key === "area" &&
        (selectval.length !== 2 ||
          (selectval.length === 2 && selectval[0] !== "area"))
      ) {
        newstatus[key] = true;
      } else if (key === "mode" && selectval[0] !== "null") {
        // 方式mode 并且有值
        newstatus[key] = true;
      } else if (key === "price" && selectval[0] !== "null") {
        // 租金 并且有值
        newstatus[key] = true;
      } else if (key === "more" && selectval.length !== 0) {
        //筛选户型 并且有值
        newstatus[key] = true;
      } else {
        newstatus[key] = false;
      }
    }
    this.setState({
      titleStatus: newstatus,
      openType: type
    });
  }; //↓遮罩层
  rendermask = () => {
    let { openType } = this.state; //点击的是title里就显示遮罩层
    if (openType === "area" || openType === "mode" || openType === "price") {
      return <div className={styles.mask}></div>;
    }
    return null; //点别的就不显示
  }; //↓取消
  onCancel = () => {
    let newStatus = { ...this.state.titleStatus };
    let type = this.state.openType;
    let selectval = this.state.selectedValues[type]; //每一个的 selectedVal值
    if (
      type === "area" &&
      (selectval.length !== 2 ||
        (selectval.length === 2 && selectval[0] !== "area"))
    ) {
      newStatus[type] = true;
    } else if (type === "mode" && selectval[0] !== "null") {
      // 方式mode 并且有值
      newStatus[type] = true;
    } else if (type === "price" && selectval[0] !== "null") {
      // 租金 并且有值
      newStatus[type] = true;
    } else if (type === "more" && selectval.length !== 0) {
      //筛选户型 并且有值
      newStatus[type] = true;
    } else {
      newStatus[type] = false;
    }

    this.setState({
      titleStatus: newStatus,
      openType: "" //不管成功与否，都关闭显示窗口
    });
  }; //↓确定
  onSave = (type, val) => {
    //完善，按取消就取消高亮有值就高亮，
    let newStatus = { ...this.state.titleStatus };
    let selectval = val; //每一个的 selectedVal值
    if (
      type === "area" &&
      (selectval.length !== 2 ||
        (selectval.length === 2 && selectval[0] !== "area"))
    ) {
      newStatus[type] = true;
    } else if (type === "mode" && selectval[0] !== "null") {
      // 方式mode 并且有值
      newStatus[type] = true;
    } else if (type === "price" && selectval[0] !== "null") {
      // 租金 并且有值
      newStatus[type] = true;
    } else if (type === "more" && selectval.length !== 0) {
      //筛选户型 并且有值
      newStatus[type] = true;
    } else {
      newStatus[type] = false;
    }
    this.setState(
      {
        titleStatus: newStatus,
        openType: "", //不管成功与否，都关闭显示窗口
        selectedValues: {
          ...this.state.selectedValues, //val代表设置后的值
          [type]: val //点击确定后，覆盖默认属性中的属性名的值["PRICE|3000"]
        }
      },
      () => {
        console.log(this.state.selectedValues); //筛选后的数据{} 但这时候要传给houselist发ajax，因为这里没有列表渲染
        let newvalues = { ...this.state.selectedValues }; //但是后台要求格式为对象。现在的数据是数组
        let filters = {};
        let areaname = newvalues.area[0];
        let areavalue = "null";
        if (newvalues.area.length === 3) {
          areavalue =
            newvalues.area[2] !== "null"
              ? newvalues.area[2]
              : newvalues.area[1]; //是null 用前面那个，不是则用后面那个
        }
        filters[areaname] = areavalue;
        filters.mode = newvalues.mode[0];
        filters.more = newvalues.more.join(","); //把数组以逗号拆分成字符串
        filters.price = newvalues.price[0];
        filters.area = this.props.onFilter(filters); //传值
      }
    );
  }; //渲染更多组件
  rendermore = () => {
    let { openType, filterdata } = this.state; //所有数据
    let data = {
      roomType: filterdata.roomType, //解构一下
      oriented: filterdata.oriented,
      floor: filterdata.floor,
      characteristic: filterdata.characteristic
    };
    let defaultvalues = this.state.selectedValues.more; //传入默认值，more再传到Filtermore保证下一次打开有上一次的值
    if (openType === "more") {
      return (
        <FilterMore
          data={data}
          defaultvalues={defaultvalues} //传入默认值
          onSave={this.onSave}
          onCancel={this.onCancel} //传到filtermore组件中，点击遮罩层隐藏more组件
        />
      ); //1、传值进去
    }
    return null;
  };
  render() {
    let { openType } = this.state.openType;
    return (
      <div className={styles.root}>
        {this.rendermask()}
        <div className={styles.content}>
          <FilterTitle
            titleStatus={this.state.titleStatus}
            onTitleClick={this.onTitleClick}
          />
          {this.renderpicker()}
          {/* <FilterMore /> */}
          {this.rendermore()}
        </div>
      </div>
    );
  }
}
