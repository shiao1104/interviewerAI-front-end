export const Authority = (role?: string) => {
    if (role === "user") {
        return "user";
    } else if (role === "admin") {
        return "admin";
    } else if (role === "manage") {
        return "manage";
    } else {
        return null;
    }
}