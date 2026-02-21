import { useEffect, useState } from "react";
import apiRequest from "../api/request";

// API 設定
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductModal({ modalType, templateProduct, closeModal, getProducts }) {
  // 初始值
  const [tempData, setTempData] = useState(templateProduct);

  // 當 templateProduct 的時候要再重新
  useEffect(() => {
    setTempData(templateProduct);
  }, [templateProduct]);

  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    // console.log(name, value);
    setTempData((preData) => ({
      ...preData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 圖片處理
  const handleModalImageChange = (index, value) => {
    setTempData((pre) => {
      const newImages = [...pre.imagesUrl];
      newImages[index] = value;

      // 填寫最後一個空輸入框時，自動新增空白輸入框
      if (
        value !== "" &&
        index === newImages.length - 1 &&
        newImages.length < 5
      ) {
        newImages.push("");
      }

      // 清空輸入框時，移除最後的空白輸入框
      if (
        value === "" &&
        newImages.length > 1 &&
        newImages[newImages.length - 1] === ""
      ) {
        newImages.pop();
      }

      return {
        ...pre,
        imagesUrl: newImages,
      };
    });
  };

  // 新增圖片
  const handleAddImage = () => {
    setTempData((pre) => {
      const newImages = [...pre.imagesUrl];
      newImages.push("");
      return {
        ...pre,
        imagesUrl: newImages,
      };
    });
  };

  // 移除圖片
  const handleRemoveImage = () => {
    setTempData((pre) => {
      const newImages = [...pre.imagesUrl];
      newImages.pop();
      return {
        ...pre,
        imagesUrl: newImages,
      };
    });
  };

  // 上傳圖片
  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // 如果沒有檔案可以加提示
    try {
      const formData = new FormData();
      formData.append("file-to-upload", file);
      // console.log(formData);
      const response = await apiRequest.post(
        `/api/${API_PATH}/admin/upload`,
        formData,
      );
      // console.log("上傳圖片成功：", response);
      setTempData((prev) => ({
        ...prev,
        imageUrl: response.data.imageUrl,
      }));
    } catch (error) {
      console.log("Upload error:", error);
    }
  };

  // 刪除產品
  const deleteProduct = async (id) => {
    try {
      // const response = await apiRequest.delete(
      //   `/api/${API_PATH}/admin/product/${id}`,
      // );
      // console.log("刪除成功：", response);
      await apiRequest.delete(`/api/${API_PATH}/admin/product/${id}`);
      // 關閉 Modal 並重新載入資料
      closeModal();
      getProducts();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error("刪除失敗：", errorMsg);
      alert("刪除失敗：" + errorMsg);
    }
  };

  // 新增/更新產品
  const updateProduct = async (id) => {
    let url;
    let method;

    if (modalType === "edit") {
      url = `/api/${API_PATH}/admin/product/${id}`;
      method = "put";
    } else if (modalType === "create") {
      url = `/api/${API_PATH}/admin/product`;
      method = "post";
    }

    const productData = {
      data: {
        ...tempData,
        origin_price: Number(tempData.origin_price), // 轉換為數字
        price: Number(tempData.price), // 轉換為數字
        is_enabled: tempData.is_enabled ? 1 : 0, // 轉換為數字
        imagesUrl: tempData.imagesUrl.filter((url) => url !== ""), // 過濾空白
      },
    };
    try {
      // const response = await apiRequest[method](url, productData);
      // console.log("新增產品：", response);
      await apiRequest[method](url, productData);
      getProducts();
      closeModal();
      alert(modalType === "edit" ? "更新成功" : "新增成功");
    } catch (error) {
      const errorMsg = error.response?.data?.message;
      if (Array.isArray(errorMsg)) {
        // message 是陣列（多個欄位出錯）
        alert(`編輯失敗：${errorMsg.join("、")}`);
      } else if (errorMsg) {
        // message 是一般字串
        alert(`編輯失敗：${errorMsg}`);
      } else {
        alert("操作失敗，請稍後再試");
      }
      console.log("新增產品失敗：", error.response);
    }
  };

  return (
    <div
      className="modal fade product-modal"
      id="productModal"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div
            className={`modal-header ${modalType === "delete" ? "is-danger" : "is-default"}`}
          >
            <h5 id="productModalLabel" className="modal-title">
              <span>
                {modalType === "delete"
                  ? "刪除"
                  : modalType === "edit"
                    ? "編輯"
                    : modalType === "view"
                      ? "查看"
                      : "新增"}
                產品
              </span>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {modalType === "delete" ? (
              <p className="delete-text">
                確定要刪除
                <span className="delete-text__name">{tempData.title}</span>
                嗎？
              </p>
            ) : modalType === "view" ? (
              <div className="row modal-form">
                <div className="col-sm-4">
                  <div className="mb-3">
                    <div className="form-label">主圖</div>
                    {tempData.imageUrl ? (
                      <img
                        className="modal-image-preview"
                        src={tempData.imageUrl}
                        alt={tempData.title || "主圖"}
                      />
                    ) : (
                      <div className="empty-preview">尚未提供主圖</div>
                    )}
                  </div>
                  {/* 副圖：只有在有至少一張副圖時才顯示 */}
                  {Array.isArray(tempData.imagesUrl) &&
                    tempData.imagesUrl.some((url) => url) && (
                      <div className="mb-3">
                        <div className="form-label">副圖</div>
                        {tempData.imagesUrl
                          .filter((url) => url)
                          .map((url, index) => (
                            <img
                              key={index}
                              className="modal-image-preview mb-3"
                              src={url}
                              alt={`副圖${index + 1}`}
                            />
                          ))}
                      </div>
                    )}
                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <div className="form-label">標題</div>
                    <div className="field-value">{tempData.title || "—"}</div>
                  </div>
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <div className="form-label">分類</div>
                      <div className="field-value">
                        {tempData.category || "—"}
                      </div>
                    </div>
                    <div className="mb-3 col-md-6">
                      <div className="form-label">單位</div>
                      <div className="field-value">{tempData.unit || "—"}</div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <div className="form-label">原價</div>
                      <div className="field-value">
                        {tempData.origin_price ?? "—"}
                      </div>
                    </div>
                    <div className="mb-3 col-md-6">
                      <div className="form-label">售價</div>
                      <div className="field-value">{tempData.price ?? "—"}</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="form-label">產品描述</div>
                    <div className="field-value field-value--multiline">
                      {tempData.description || "—"}
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="form-label">說明內容</div>
                    <div className="field-value field-value--multiline">
                      {tempData.content || "—"}
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="form-label">商品評價星級</div>
                    <div className="field-value">
                      {tempData.size ? `${tempData.size} 顆星` : "尚未評價"}
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="form-label">是否啟用</div>
                    <div className="field-value">
                      {tempData.is_enabled ? "已啟用" : "未啟用"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-2">
                    <div className="mb-2">
                      <label htmlFor="fileUpload" className="form-label">
                        上傳圖片
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        name="fileUpload"
                        id="fileUpload"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => {
                          uploadImage(e);
                        }}
                      />
                    </div>
                    <div className="mb-2">
                      <label htmlFor="imageUrl" className="form-label">
                        輸入圖片網址
                      </label>
                      <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        value={tempData.imageUrl}
                        onChange={handleModalInputChange}
                      />
                    </div>
                    {tempData.imageUrl && (
                      <img
                        className="modal-image-preview"
                        src={tempData.imageUrl}
                        alt="主圖"
                      />
                    )}
                  </div>
                  <div>
                    {tempData.imagesUrl.map((url, index) => {
                      return (
                        <div key={index} className="modal-image-field">
                          <div className="mb-2">
                            <label htmlFor="imageUrl" className="form-label">
                              輸入圖片網址
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={`圖片網址${index + 1}`}
                              value={url}
                              onChange={(e) => {
                                handleModalImageChange(index, e.target.value);
                              }}
                            />
                          </div>
                          {url && (
                            <img
                              className="modal-image-preview"
                              src={url}
                              alt={`副圖${index + 1}`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {tempData.imagesUrl.length < 5 &&
                    tempData.imagesUrl[tempData.imagesUrl.length - 1] !==
                      "" && (
                      <button
                        type="button"
                        className="modal-action-btn modal-action-btn--add mb-2"
                        onClick={handleAddImage}
                      >
                        <i className="bi bi-plus-lg"></i>
                        新增圖片
                      </button>
                    )}
                  {tempData.imagesUrl.length >= 1 && (
                    <button
                      type="button"
                      className="modal-action-btn modal-action-btn--delete"
                      onClick={handleRemoveImage}
                    >
                      <i className="bi bi-trash3"></i>
                      刪除圖片
                    </button>
                  )}
                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      value={tempData.title}
                      onChange={handleModalInputChange}
                    />
                  </div>
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="category" className="form-label">
                        分類
                      </label>
                      <input
                        name="category"
                        id="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                        value={tempData.category}
                        onChange={handleModalInputChange}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="unit" className="form-label">
                        單位
                      </label>
                      <input
                        name="unit"
                        id="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                        value={tempData.unit}
                        onChange={handleModalInputChange}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入原價"
                        value={tempData.origin_price}
                        onChange={handleModalInputChange}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        name="price"
                        id="price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入售價"
                        value={tempData.price}
                        onChange={handleModalInputChange}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      className="form-control"
                      placeholder="請輸入產品描述"
                      value={tempData.description}
                      onChange={handleModalInputChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      name="content"
                      id="content"
                      className="form-control"
                      placeholder="請輸入說明內容"
                      rows="4"
                      value={tempData.content}
                      onChange={handleModalInputChange}
                    ></textarea>
                  </div>
                  {/* 助教直播補充：新增一個自訂欄位 */}
                  <div className="mb-3">
                    <label className="form-label" htmlFor="size">
                      商品評價星級
                    </label>
                    <select
                      id="size"
                      name="size"
                      className="form-select"
                      aria-label="Default select example"
                      value={tempData.size}
                      onChange={handleModalInputChange}
                    >
                      <option value="">請選擇</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                  {/* 助教直播補充：新增一個自訂欄位 */}
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        name="is_enabled"
                        id="is_enabled"
                        className="form-check-input"
                        type="checkbox"
                        checked={tempData.is_enabled}
                        onChange={handleModalInputChange}
                      />
                      <label className="form-check-label" htmlFor="is_enabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            {modalType === "delete" ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => deleteProduct(tempData.id)}
              >
                刪除
              </button>
            ) : modalType === "view" ? (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={closeModal}
                data-bs-dismiss="modal"
              >
                關閉
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => closeModal()}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    updateProduct(tempData.id);
                  }}
                >
                  確認
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
