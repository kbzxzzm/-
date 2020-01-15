import React from "react";
import { Flex } from "antd-mobile";
import styles from "./index.module.css";
const titleList = [
  { title: "区域", type: "area" }, // 条件筛选栏标题数组：
  { title: "方式", type: "mode" },
  { title: "租金", type: "price" },
  { title: "筛选", type: "more" }
]; //函数组件中，props可以直接传进来
export default function FilterTitle(props) {
  return (
    <Flex align="center" className={styles.root}>
      {titleList.map(item => {
        let isSelected = props.titleStatus[item.type]; // 判断 是否应该选中 props.titleStatus  item.type就是 area mode price more四个单词
        return (
          <Flex.Item
            key={item.type}
            onClick={() => {
              props.onTitleClick(item.type); //点击 让当前的标题高亮 点area就让area变成true 点谁让谁变成true
            }} //去filter父函数组件看  ↓选中类名： selected  styles.selected
          >
            <span
              className={[
                styles.dropdown,
                isSelected ? styles.selected : ""
              ].join(" ")}
            >
              <span>{item.title}</span>
              <i className="iconfont icon-arrow" />
            </span>
          </Flex.Item>
        );
      })}
    </Flex>
  );
}
