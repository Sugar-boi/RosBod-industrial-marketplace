"use client";

export const getCurrentUser = () => {
    const user =
        localStorage.getItem("user");

    return user
        ? JSON.parse(user)
        : null;
};

export const logout = (
    reason?: "session-expired" | "manual"
) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(
        new Event("authChanged")
    );

    if (reason === "session-expired") {
        window.location.href =
            "/login?reason=session-expired";
        return;
    }

    window.location.href = "/login";
};