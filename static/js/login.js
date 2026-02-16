function loginUser() {
  const data = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  fetch("http://127.0.0.1:8000/user/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("LOGIN RESPONSE:", result);

      if (result.status === "Success") {
        const role = result.data.Role;
        const username = result.data.Username;

        localStorage.setItem("access_token", result.access);
        localStorage.setItem("refresh_token", result.refresh);
        localStorage.setItem("user_role", role);
        localStorage.setItem("username", username); 

        const storedRole = localStorage.getItem("user_role");

        console.log("Stored Role:", storedRole);

        if (!storedRole) {
          alert("Role not stored ❌");
          return;
        }

        alert("Login Successful ✅");

        if (storedRole === "ADMIN") {
          window.location.href = "/admin-dashboard/";
        }

        if (storedRole === "STAFF") {
          window.location.href = "/staff-dashboard/";
        }

        if (storedRole === "STUDENT") {
          window.location.href = "/student-dashboard/";
        }

        return;
      }

      alert(result.message || "Invalid credentials");
    })
    .catch((error) => {
      console.error("Login Error:", error);
      alert("Server error");
    });
}