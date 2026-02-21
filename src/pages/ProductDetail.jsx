// import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import apiRequest from "../api/request";
// API 設定
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductDetail() {
  // const location = useLocation();
  // const product = location.state?.productData;
  // 用 location 的缺點：直接在網址上打 id 搜尋是不會顯示的，因為沒有重新打 api

  const { id } = useParams();
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const handleView = async (id) => {
      try {
        const response = await apiRequest.get(`/api/${API_PATH}/product/${id}`);
        // console.log(response.data.product);
        setProduct(response.data.product);
      } catch (error) {
        console.log(error.response);
      }
    };
    handleView(id);
  }, [id]);

  const addCart = async (id, qty = 1) => {
    try {
      const data = {
        product_id: id,
        qty,
      };
      await apiRequest.post(`/api/${API_PATH}/cart`, { data });
      // const response = await apiRequest.post(`/api/${API_PATH}/cart`, { data });
      // console.log(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };
  return !product ? (
    <h2 className="text-center mt-5">查無產品</h2>
  ) : (
    <div className="site-container py-5">
      <div className="row g-5">
        <div className="col-lg-6">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="product-detail__img"
          />
        </div>

        <div className="col-lg-6 product-detail__info">
          <h2 className="product-detail__title">{product.title}</h2>

          <p className="product-detail__origin_price">
            原價：${product.origin_price}
          </p>

          <p className="product-detail__price">售價：${product.price}</p>

          <p className="product-detail__desc">{product.description}</p>

          <button
            className="product-detail__btn"
            onClick={() => addCart(product.id)}
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
