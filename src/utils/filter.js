//-- 資料轉換 --//

// 將數字轉換為千位分隔符格式
export const currency = (num) => {
  const n = Number(num) || 0;
  // 不是數字的話強制變成 0
  return n.toLocaleString();
};
