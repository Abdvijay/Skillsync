document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    fetch("http://127.0.0.1:8000/user/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {

        if (result.status === "Success") {

            alert(result.message);
            localStorage.setItem("access_token", result.access);
            localStorage.setItem("refresh_token", result.refresh);

            // Role based redirection of dashboard (Admin, Staff, Student)
            const role = result.data.Role;
            if (role === "ADMIN") {
                window.location.href = "/admin-dashboard/";
            }

            if (role === "STAFF") {
                window.location.href = "/staff-dashboard/";
            }

            if (role === "STUDENT") {
                window.location.href = "/student-dashboard/";
            }

        } else {
            alert(result.message || "Invalid credentials");
        }

    })
    .catch(error => {
        console.error("Error:", error);
        alert("Server error. Try again.");
    });
});