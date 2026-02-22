function registerUser() {
  const token = localStorage.getItem("access_token");
  const adminUsername = localStorage.getItem("username");

  const username = document.getElementById("regUsername").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const role = document.getElementById("regRole").value.trim();

  const data = {
    username,
    email,
    phone,
    password,
    role,
    created_by: adminUsername,
  };

  if (!username || !email || !password || !phone) {
    alert("All fields are required");
    return;
  }

  if (!/^\d+$/.test(phone)) {
    alert("Phone number must contain numbers only");
    return;
  }

  if (phone.length !== 10) {
    alert("Phone number must be exactly 10 digits");
    return;
  }

  fetch("http://127.0.0.1:8000/user/register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((result) => {
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

document.addEventListener("click", function (e) {

    if (e.target.id === "regPhone") {

        e.target.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, "");
        });
    }
});