import React, { Component } from "react";
import FilterFooter from "../../../components/FilterFooter";
import styles from "./index.module.css";
// 渲染标签
export default class FilterMore extends Component {
  state = {
    selectedValue: this.props.defaultvalues //将点后的放入数组，数组里面有的就应该高亮
  }; //默认值传进来
  onSpanClick = id => {
    let newValues = [...this.state.selectedValue]; //第一次，如果没有就追加
    //let index = newValues.indexOf(id); //如果数组没有，就加，如果数组有了，就应该取消
    let index = newValues.findIndex(item => item === id);
    if (index === -1) {
      newValues.push(id); //['a','b','c'].indexOf('a') 找到就是索引
    } else {
      newValues.splice(index, 1); //从index索引删除一个
      // console.log(newValues);
    }
    this.setState({
      selectedValue: newValues //要注意，重复点同一个第二次是取消选项。
    });
  };
  renderFilters(arr) {
    return arr.map(item => {
      //let isSlected = this.state.selectedValue.indexOf(item.value) !== -1; //索引
      let isSlected = this.state.selectedValue.includes(item.value); //新方法，有就true，没有就false
      return (
        <span
          key={item.value} //判断是否在数组中
          onClick={() => {
            this.onSpanClick(item.value); //传参需要套起来，传入id,ajax后台需求
          }} //点谁push进去
          className={
            [styles.tag, isSlected ? styles.tagActive : ""].join(" ") //数组中是否有这个值//将点后的放入数组
          }
        >
          {item.label}
        </span>
      ); //每一个小盒子  // 高亮类名： styles.tagActive
    });
  }
  render() {
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div
          className={styles.mask}
          onClick={() => {
            this.props.onCancel(); //直接调用filter里面的onCancel
          }}
        />
        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>
              {this.renderFilters(this.props.data.roomType)}
            </dd>
            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>
              {this.renderFilters(this.props.data.oriented)}
            </dd>
            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>
              {this.renderFilters(this.props.data.floor)}
            </dd>
            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>
              {this.renderFilters(this.props.data.characteristic)}
            </dd>
          </dl>
        </div>
        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          cancelText="清除"
          onCancel={() => {
            this.setState({
              selectedValue: [] //清除数组清空
            });
          }}
          onSave={() => {
            this.props.onSave("more", this.state.selectedValue);
          }}
        />
      </div>
    );
  }
}
