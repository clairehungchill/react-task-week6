import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as bootstrap from "bootstrap";
import "../../assets/style-admin.css";
import Pagination from "../../components/Pagination";
import ProductModal from "../../components/ProductModal";
// API 設定
import apiRequest from "../../api/request";
const API_PATH = import.meta.env.VITE_API_PATH;

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
  size: "",
};

const getTokenFromCookie = () =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith("hexToken="))
    ?.split("=")[1];

export default function AdminProduct() {
  const navigate = useNavigate();

  const [authToken] = useState(() => getTokenFromCookie() || "");
  const [isAuth, setIsAuth] = useState(false);

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});

  // Modal 控制相關狀態
  const productModalRef = useRef(null);
  const [modalType, setModalType] = useState(""); // "create", "edit", "delete", "view"
  // 產品表單資料模板
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);

  // 取得產品資料
  const getProducts = async (page = 1) => {
    try {
      const response = await apiRequest.get(
        `/api/${API_PATH}/admin/products?page=${page}`,
      );
      // console.log("產品資料：", response.data);
      setProducts(response.data.products);
      setPagination(response.data.pagination); // 儲存分頁資訊
    } catch (error) {
      console.log("取得產品失敗：", error.response?.data);
    }
  };

  // 初始化 Modal + 讀取 cookie token
  useEffect(() => {
    if (!authToken) {
      navigate("/login");
      return;
    }

    // 初始化 Bootstrap Modal
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });

    const modalEl = document.querySelector("#productModal");
    const onHide = () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    };
    modalEl?.addEventListener("hide.bs.modal", onHide);

    return () => {
      modalEl?.removeEventListener("hide.bs.modal", onHide);
    };
  }, [authToken, navigate]);

  // 有 token 才做副作用：設定 header + check + 抓資料
  useEffect(() => {
    if (!authToken) return;

    apiRequest.defaults.headers.common["Authorization"] = authToken;

    (async () => {
      try {
        await apiRequest.post(`/api/user/check`);
        setIsAuth(true);
        await getProducts(1);
      } catch (error) {
        console.log("Token 驗證失敗：", error.response?.data);
        setIsAuth(false);
        navigate("/login");
      }
    })();
  }, [authToken, navigate]);

  const openModal = (type, product) => {
    // console.log("type:", type, "product:", product);
    // console.log("templateProduct:", templateProduct);
    // console.log("product:", product);
    setModalType(type);
    // setTemplateProduct((prev) => ({ ...prev, ...product }));
    // 上面這樣寫可能會吃到上一筆產品的副圖（假如此筆產品沒有附圖時）
    setTemplateProduct({
      ...INITIAL_TEMPLATE_DATA,
      ...product,
    });
    productModalRef.current.show();
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };

  return (
    <>
      <div className="container admin-shell">
        <div className="admin-topbar">
          <div className="admin-topbar__left">
            <h1 className="admin-title">產品後台</h1>
          </div>
          <div className="admin-topbar__right">
            <div className="login-status">
              <span
                className={`login-dot ${
                  isAuth ? "login-dot--on" : "login-dot--off"
                }`}
              />
              <span className="login-text">{isAuth ? "已登入" : "未登入"}</span>
            </div>
          </div>
        </div>
        <div className="admin-panel">
          <div className="section-header">
            <h2 className="section-title">產品列表</h2>
            <button
              type="button"
              className="action-btn--add"
              onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}
            >
              <i className="bi bi-plus-lg"></i>
              建立新產品
            </button>
          </div>
          <div className="table-card">
            <table className="product-table">
              <thead className="product-table__head">
                <tr>
                  <th scope="col" className="th-center">
                    圖片
                  </th>
                  <th scope="col" className="th-left">
                    產品名稱
                  </th>
                  <th scope="col" className="th-center">
                    分類
                  </th>
                  <th scope="col" className="th-center">
                    原價
                  </th>
                  <th scope="col" className="th-center">
                    售價
                  </th>
                  <th scope="col" className="th-center">
                    啟用
                  </th>
                  <th scope="col" className="th-center th-actions">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="product-table__body">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="td-center">
                      <img
                        className="thumb-img"
                        src={product.imageUrl}
                        alt={product.title}
                      />
                    </td>
                    <td className="td-left">{product.title}</td>
                    <td className="td-center">{product.category}</td>
                    <td className="td-center">${product.origin_price}</td>
                    <td className="td-center">${product.price}</td>
                    <td className="td-center">
                      <span
                        className={`status ${
                          product.is_enabled ? "status--on" : "status--off"
                        }`}
                      >
                        {product.is_enabled ? "已啟用" : "未啟用"}
                      </span>
                    </td>
                    <td className="td-center">
                      <div className="row-actions">
                        <button
                          className="action-btn action-btn--view"
                          type="button"
                          onClick={() => {
                            openModal("view", product);
                          }}
                        >
                          <i className="bi bi-eye"></i>
                          查看
                        </button>
                        <button
                          className="action-btn action-btn--edit"
                          type="button"
                          onClick={() => {
                            openModal("edit", product);
                          }}
                        >
                          <i className="bi bi-pencil-square"></i>
                          編輯
                        </button>
                        <button
                          className="action-btn action-btn--delete"
                          type="button"
                          onClick={() => {
                            openModal("delete", product);
                          }}
                        >
                          <i className="bi bi-trash3"></i>
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 分頁 */}
          <div className="section-footer">
            <Pagination pagination={pagination} onChangePage={getProducts} />
          </div>
        </div>
      </div>

      {/* Modal */}
      <ProductModal
        modalType={modalType}
        templateProduct={templateProduct}
        closeModal={closeModal}
        getProducts={getProducts}
      />
    </>
  );
}
