import { useEffect, useState } from "react";
import apiRequest from "../api/request";
import { useNavigate } from "react-router";

// API 設定
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductsList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await apiRequest.get(`/api/${API_PATH}/products`);
        // console.log(response.data.products);
        setProducts(response.data.products);
      } catch (error) {
        console.log(error.response);
      }
    };
    getProducts();
  }, []);

  const handleView = async (id) => {
    // 直接切換頁面
    navigate(`/product/${id}`);

    // try {
    //   const response = await apiRequest.get(`/api/${API_PATH}/product/${id}`);
    //   console.log(response.data.product);
    //   navigate(`/product/${id}`, {
    //     state: {
    //       productData: response.data.product,
    //     },
    //   });
    // } catch (error) {
    //   console.log(error.response);
    // }
  };

  return (
    <>
      <div className="site-container page-heading">
        <h1 className="page-heading__title">SHOP</h1>
      </div>

      <div className="site-container py-5">
        <div className="row g-4">
          {products.map((product) => {
            const discount =
              product.origin_price > product.price
                ? Math.round(
                    ((product.origin_price - product.price) /
                      product.origin_price) *
                      100,
                  )
                : 0;
            return (
              <div className="col-6 col-lg-3" key={product.id}>
                <div className="shop-card h-100">
                  <div className="shop-card__img-wrapper">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="shop-card__img"
                    />
                  </div>

                  <div className="shop-card__body">
                    <h6 className="shop-card__title">{product.title}</h6>

                    <div className="shop-card__price-wrapper">
                      <span className="shop-card__origin_price">
                        ${product.origin_price}
                      </span>

                      <div className="shop-card__sale">
                        <span className="shop-card__price">
                          ${product.price}
                        </span>
                        {discount > 0 && (
                          <span className="shop-card__discount">
                            {discount}%
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      className="shop-card__btn"
                      type="button"
                      onClick={() => handleView(product.id)}
                    >
                      查看商品
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ProductsList;
