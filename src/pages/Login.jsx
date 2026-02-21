import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import apiRequest from "../api/request";
import "../assets/style-admin.css";

function Login() {
  const navigate = useNavigate();
  const [authPayload, setAuthPayload] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!authPayload) return;

    const { token, expired } = authPayload;

    document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
    apiRequest.defaults.headers.common["Authorization"] = token;

    navigate("/admin/product");
  }, [authPayload, navigate]);

  const onSubmit = async (data) => {
    try {
      const res = await apiRequest.post("/admin/signin", data);
      const { token, expired } = res.data;
      setAuthPayload({ token, expired });
    } catch (error) {
      console.log("登入失敗: ", error.response?.data);
      alert("登入失敗，請確認帳號密碼");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">請先登入</h2>
        <form className="form-floating" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="username"
              name="username"
              placeholder="name@example.com"
              {...register("username", {
                required: "帳號為必填",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Email 格式不正確",
                },
              })}
            />
            <label htmlFor="username">Email address</label>
            {errors.username && (
              <div className="invalid-feedback">{errors.username.message}</div>
            )}
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Password"
              {...register("password", {
                required: "密碼為必填",
              })}
            />
            <label htmlFor="password">Password</label>
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>
          <button
            type="submit"
            className="btn login-btn w-100 mt-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? "登入中..." : "登入"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
