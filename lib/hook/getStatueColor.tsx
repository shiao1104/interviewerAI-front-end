export const getStatueColor = (statue: string) => {
  switch (statue) {
    case "積極徵才中":
      return "warning";
    case "招募中":
      return "success";
    case "已關閉":
      return "error";
    default:
      return "default";
  }
};
