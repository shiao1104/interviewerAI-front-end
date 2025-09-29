export const Authority = (role?: string) => {
    if (role === "面試者") {
        return "user";
    } else if (role === "管理者") {
        return "admin";
    } else if (role === "公司端") {
        return "manage";
    } else {
        return null;
    }
}