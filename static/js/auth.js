function checkAuthentication() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    alert("Session expired. Please login.");

    window.location.href = "/login/";
  }
}