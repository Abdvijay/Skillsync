document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        password: document.getElementById("password").value,
        role: document.getElementById("role").value,
        created_by: "self"
    };

    fetch("http://127.0.0.1:8000/user/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === "Success") {
            window.location.reload();
            alert("Registration successful! Please login.");
            window.location.href = "/login/";
        } else {
            alert(result.message || "Registration failed");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Server error. Try again.");
    });
});