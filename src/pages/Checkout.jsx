import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import apiRequest from "../api/request";
import { currency } from "../utils/filter";
import { Link } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";

const API_PATH = import.meta.env.VITE_API_PATH;

function Checkout() {
  const [cart, setCart] = useState(null);
  const items = cart?.carts ?? [];
  const isEmpty = items.length === 0;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      tel: "",
      address: "",
      message: "",
    },
  });

  const getCart = async () => {
    try {
      const res = await apiRequest.get(`/api/${API_PATH}/cart`);
      setCart(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getCart();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (formData) => {
    if (isEmpty) return;

    try {
      const payload = {
        data: {
          user: {
            name: formData.name,
            email: formData.email,
            tel: formData.tel,
            address: formData.address,
          },
          message: formData.message,
        },
      };

      await apiRequest.post(`/api/${API_PATH}/order`, payload);
      await getCart();
      alert("訂單已送出！");
    } catch (err) {
      console.log(err?.response || err);
      alert("送出失敗，請稍後再試");
    }
  };

  return (
    <>
      <div className="site-container page-heading">
        <h1 className="page-heading__title">CHECKOUT</h1>
      </div>

      <div className="site-container py-5">
        <div className="checkout-layout">
          {/* 左：訂單摘要 */}
          <aside className="checkout-layout__summary">
            <div className="checkout-card">
              <h2 className="checkout-card__title">訂單摘要</h2>

              {isEmpty ? (
                <p className="checkout-card__muted">購物車目前是空的</p>
              ) : (
                <ul className="summary-list">
                  {items.map((it) => (
                    <li className="summary-item" key={it.id}>
                      <div className="summary-item__title">
                        {it.product.title}
                      </div>
                      <div className="summary-item__meta">
                        <span className="summary-item__qty">x {it.qty}</span>
                        <span className="summary-item__price">
                          {currency(it.final_total)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="summary-total">
                <span className="summary-total__label">總計</span>
                <span className="summary-total__value">
                  {currency(cart?.final_total ?? 0)}
                </span>
              </div>

              <Link
                to="/cart"
                className="checkout-nav__btn checkout-nav__btn--back"
              >
                <i className="bi bi-arrow-left checkout-nav__icon"></i>
                返回購物車
              </Link>
            </div>
          </aside>

          {/* 右：結帳表單 */}
          <section className="checkout-layout__form">
            <div className="checkout-card">
              <h2 className="checkout-card__title">收件資訊</h2>
              <p className="checkout-card__hint">（* 為必填）</p>

              <form className="checkout-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="checkout-form__group">
                  <label className="checkout-form__label" htmlFor="name">
                    姓名 *
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="checkout-form__input"
                    placeholder="請輸入姓名"
                    {...register("name", {
                      required: "姓名為必填",
                      minLength: {
                        value: 2,
                        message: "姓名最少 2 個字",
                      },
                    })}
                  />
                  {errors.name && (
                    <p className="checkout-form__error">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="checkout-form__group">
                  <label className="checkout-form__label" htmlFor="email">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="checkout-form__input"
                    placeholder="example@mail.com"
                    {...register("email", {
                      required: "Email 為必填",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Email 格式不正確",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="checkout-form__error">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="checkout-form__group">
                  <label className="checkout-form__label" htmlFor="tel">
                    電話 *
                  </label>
                  <input
                    id="tel"
                    type="tel"
                    className="checkout-form__input"
                    placeholder="請輸入電話"
                    {...register("tel", {
                      required: "電話為必填",
                      pattern: {
                        value: /^\d+$/,
                        message: "電話僅能輸入數字",
                      },
                      minLength: { value: 8, message: "電話至少 8 碼" },
                    })}
                  />
                  {errors.tel && (
                    <p className="checkout-form__error">{errors.tel.message}</p>
                  )}
                </div>

                <div className="checkout-form__group">
                  <label className="checkout-form__label" htmlFor="address">
                    地址 *
                  </label>
                  <input
                    id="address"
                    type="text"
                    className="checkout-form__input"
                    placeholder="請輸入地址"
                    {...register("address", { required: "地址為必填" })}
                  />
                  {errors.address && (
                    <p className="checkout-form__error">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="checkout-form__group">
                  <label className="checkout-form__label" htmlFor="message">
                    留言
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    className="checkout-form__textarea"
                    placeholder="想對我們說的話..."
                    {...register("message")}
                  />
                </div>

                <button
                  type="submit"
                  className="checkout-form__submit checkout-nav__btn"
                  disabled={isEmpty || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <RotatingLines color="white" width={16} height={16} />
                      <span>送出中...</span>
                    </>
                  ) : (
                    "送出訂單"
                  )}
                </button>

                {isEmpty && (
                  <p className="checkout-card__note">
                    購物車沒有商品，無法結帳。
                  </p>
                )}
              </form>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Checkout;
