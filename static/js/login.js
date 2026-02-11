document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    fetch("/user/login/", {
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

            // OPTIONAL (for later)
            // localStorage.setItem("access_token", result.access);

        } else {
            alert(result.message || "Invalid credentials");
        }

    })
    .catch(error => {
        console.error("Error:", error);
        alert("Server error. Try again.");
    });
});