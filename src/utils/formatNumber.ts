export const formatNumber = (value: number) => {
    if (!value) return "";
    return new Intl.NumberFormat("en-US").format(value);
  };