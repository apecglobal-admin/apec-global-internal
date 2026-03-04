export const formatNumber = (value: number) => {
    if (value == null) return "";
    return value.toLocaleString("vi-VN");
  };