function checkRoleAccess(allowedRole) {

    const userRole = localStorage.getItem("user_role");

    if (!userRole) {
        alert("Session error. Please login.");
        window.location.href = "/login/";
        return;
    }

    if (userRole !== allowedRole) {
        alert("Unauthorized Access ❌");
        window.location.href = "/login/";
    }
}