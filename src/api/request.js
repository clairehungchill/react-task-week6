import axios from "axios";
// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;

// 建立 Axios 實體，並設定 baseURL
const apiRequest = axios.create({
  baseURL: API_BASE,
});

export default apiRequest;
