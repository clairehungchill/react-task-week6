import { useState } from "react";
import apiRequest from "../api/request";

function Login({ getProducts, setIsAuth }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // 登入
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiRequest.post(`/admin/signin`, formData);
      // console.log(response.data);
      const { token, expired } = response.data;
      // 儲存 Token 到 Cookie
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      // 設定 axios 預設 header
      apiRequest.defaults.headers.common["Authorization"] = token;
      getProducts();
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
      console.log("登入失敗: ", error.response?.data);
    }
  };

  // 表單輸入處理
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);
    setFormData((preData) => ({ ...preData, [name]: value }));
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">請先登入</h2>
        <form
          className="form-floating"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="username"
              name="username"
              placeholder="name@example.com"
              value={formData.username}
              onChange={(e) => handleInputChange(e)}
              required
            />
            <label htmlFor="username">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange(e)}
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <button type="submit" className="btn login-btn w-100 mt-3">
            登入
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
