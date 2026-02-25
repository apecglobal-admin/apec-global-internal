export const formatNumber = (value: number) => {
    if (value == null) return "";
    return new Intl.NumberFormat("en-US").format(value);
  };