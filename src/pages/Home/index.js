import React from "react";
// 导入antd-mobile
import { TabBar } from "antd-mobile";
// 导入路由
import { Route } from "react-router-dom";
// 导入组件
import Index from "../Index";
import Houselist from "../Houselist";
import News from "../News";
import Profile from "../Profile";
// 导入css
import "./home.css";
// tabbar标签数据
const tabItems = [
  {
    title: "首页",
    icon: "icon-ind",
    path: "/home/index"
  },
  {
    title: "找房",
    icon: "icon-findHouse",
    path: "/home/houselist"
  },
  {
    title: "资讯",
    icon: "icon-infom",
    path: "/home/news"
  },
  {
    title: "我的",
    icon: "icon-my",
    path: "/home/profile"
  }
];
// 创建并导出
export default class Home extends React.Component {
  state = {
    selectedTab: "/home/index", // 设置是否选中状态高亮
    hidden: false
  };
  renderTabbar() {
    return tabItems.map(item => {
      return (
        <TabBar.Item
          title={item.title}
          key={item.icon}
          icon={<i className={`iconfont ${item.icon}`}></i>} // 渲染生成四个item
          selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
          selected={this.state.selectedTab === item.path}
          onPress={() => {
            this.setState({
              selectedTab: item.path
            });
            this.props.history.push(item.path); // 跳转到首页
          }}
          data-seed="logId"
        ></TabBar.Item>
      );
    });
  }

  render() {
    return (
      <div className="home">
        {/* 挖坑 显示 四个子路由 */}
        <Route path="/home/index" component={Index}></Route>
        <Route path="/home/houselist" component={Houselist}></Route>
        <Route path="/home/news" component={News}></Route>
        <Route path="/home/profile" component={Profile}></Route>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#21b97a"
          barTintColor="white"
          hidden={this.state.hidden}
          noRenderContent={true}
        >
          {/* 循环生成四个tabbar item,（这个注释不能写下面） */}
          {this.renderTabbar()}
        </TabBar>
      </div>
    );
  }
}
