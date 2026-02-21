import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { currency } from "../utils/filter";
import apiRequest from "../api/request";

const API_PATH = import.meta.env.VITE_API_PATH;

function Cart() {
  const [cart, setCart] = useState([]);

  const getCart = async () => {
    try {
      const response = await apiRequest.get(`/api/${API_PATH}/cart`);
      // console.log(response);
      setCart(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getCart();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // 更新商品數量
  const updateCart = async (cartId, productId, qty = 1) => {
    try {
      const data = { product_id: productId, qty };
      await apiRequest.put(`/api/${API_PATH}/cart/${cartId}`, { data });
      await getCart();
    } catch (error) {
      console.log(error.response);
    }
  };

  // 清除單一筆購物車
  const deleteCart = async (cartId) => {
    try {
      await apiRequest.delete(`/api/${API_PATH}/cart/${cartId}`);
      await getCart();
    } catch (error) {
      console.log(error.response);
    }
  };

  // 清空購物車
  const clearCart = async () => {
    try {
      await apiRequest.delete(`/api/${API_PATH}/carts`);
      await getCart();
    } catch (error) {
      console.log(error.response);
    }
  };

  const items = cart?.carts ?? [];
  const isEmpty = items.length === 0;

  return (
    <>
      <div className="site-container page-heading page-heading--with-action">
        <h1 className="page-heading__title">CART</h1>

        <button
          type="button"
          className="cart-page__clear"
          onClick={clearCart}
          disabled={isEmpty}
        >
          清空購物車
        </button>
      </div>

      <div className="site-container py-5">
        {isEmpty ? (
          <div className="cart-empty">
            <p className="cart-empty__text">目前購物車是空的</p>
          </div>
        ) : (
          <div className="cart-table">
            <div className="cart-table__head">
              <div className="cart-table__cell cart-table__cell--product">
                商品
              </div>
              <div className="cart-table__cell cart-table__cell--qty">數量</div>
              <div className="cart-table__cell cart-table__cell--subtotal">
                小計
              </div>
              <div className="cart-table__cell cart-table__cell--actions"></div>
            </div>

            {items.map((cartItem) => (
              <div className="cart-row" key={cartItem.id}>
                <div className="cart-row__product">
                  <div className="cart-row__title">
                    {cartItem.product.title}
                  </div>
                  <div className="cart-row__unit">{cartItem.product.unit}</div>
                </div>

                <div className="cart-row__qty">
                  <div className="qty-field">
                    <button
                      type="button"
                      className="qty-field__btn"
                      onClick={() =>
                        updateCart(
                          cartItem.id,
                          cartItem.product.id,
                          Math.max(1, cartItem.qty - 1),
                        )
                      }
                      aria-label="decrease"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      className="qty-field__input"
                      min="1"
                      value={cartItem.qty}
                      onChange={(e) => {
                        const next = Number(e.target.value);
                        if (!Number.isFinite(next) || next < 1) return;
                        updateCart(cartItem.id, cartItem.product.id, next);
                      }}
                    />

                    <button
                      type="button"
                      className="qty-field__btn"
                      onClick={() =>
                        updateCart(
                          cartItem.id,
                          cartItem.product.id,
                          cartItem.qty + 1,
                        )
                      }
                      aria-label="increase"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-row__subtotal">
                  {currency(cartItem.final_total)}
                </div>

                <div className="cart-row__actions">
                  <button
                    type="button"
                    className="btn cart-row__remove"
                    onClick={() => deleteCart(cartItem.id)}
                  >
                    刪除
                  </button>
                </div>
              </div>
            ))}

            <div className="cart-summary">
              <div className="cart-summary__content">
                <div className="cart-summary__total">
                  <span className="cart-summary__label">總計</span>
                  <span className="cart-summary__value">
                    {currency(cart.final_total)}
                  </span>
                </div>

                <Link
                  to="/checkout"
                  className="checkout-nav__btn checkout-nav__btn--forward"
                >
                  前往結帳
                  <i className="bi bi-arrow-right checkout-nav__icon"></i>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
