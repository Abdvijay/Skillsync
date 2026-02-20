function registerUser() {

    const token = localStorage.getItem("access_token");
    const adminUsername = localStorage.getItem("username");

    const data = {
        username: document.getElementById("regUsername").value,
        email: document.getElementById("regEmail").value,
        phone: document.getElementById("regPhone").value,
        password: document.getElementById("regPassword").value,
        role: document.getElementById("regRole").value,
        created_by: adminUsername
    };

    fetch("http://127.0.0.1:8000/user/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {

        console.log(result);

        if (result.status === "Success") {

            alert("User Created Successfully");
            closeRegisterModal();
            fetchUsers();

        } else {
            alert(result.message || result.error);
        }
    });
}