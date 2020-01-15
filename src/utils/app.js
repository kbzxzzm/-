import axios from "axios"; //配置axios并导出
import { BASE_URL } from "./url";
// axios.defaults.baseURL = "http://localhost:8080";export { axios };//
console.log("地址", process.env.REACT_APP_URL);
let API = axios.create({
  baseURL: BASE_URL
});
export { API }; //API就是配置好的axios
