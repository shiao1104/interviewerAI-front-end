export const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case "容易":
            return "success";
        case "中等":
            return "warning";
        case "困難":
            return "error";
        default:
            return "default";
    }
};