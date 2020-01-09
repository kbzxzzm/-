import axios from "axios"; //导入多个直接export  导入单个 export defult

export let getCurrentcity = () => {
  //获取本地存储中的定位城市，因为它不仅仅是这一个地方会用到
  let city = JSON.parse(localStorage.getItem("my-city"));
  if (!city) {
    return new Promise((resolve, reject) => {
      var mycity = new window.BMap.LocalCity();
      mycity.get(async result => {
        var cityname = result.name; //接口那边需要通过城市名获取城市信息
        let dw = await axios.get(
          "http://localhost:8080/area/info?name=" + cityname
        );
        localStorage.setItem("my-city", JSON.stringify(dw.data.body));
        resolve(dw.data.body);
      });
    });
  } else {
    return Promise.resolve(city); //简化写法
    // return new Promise((resolve,reject)=>{
    //     resolve(city)
    // })
  }
};
