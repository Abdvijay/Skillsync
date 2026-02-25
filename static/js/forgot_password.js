function verifyEmail() {

    const emailInput = document.getElementById("resetEmail");
    const verifyBtn = document.getElementById("verifyBtn");

    const email = emailInput.value.trim();

    if (!email) {
        alert("Enter email");
        return;
    }

    fetch(`http://127.0.0.1:8000/user/check_email/?email=${email}`)
        .then(res => res.json())
        .then(result => {

            console.log("Email Check:", result);

            if (result.exists) {

                document.getElementById("passwordSection").style.display = "block";

                emailInput.disabled = true;
                verifyBtn.disabled = true;
                verifyBtn.innerText = "Verified ✓";

            } else {
                alert("Email not found");
            }
        });
}

function updatePassword() {
  const email = document.getElementById("resetEmail").value.trim();
  const password = document.getElementById("newPassword").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (!password || !confirm) {
    alert("Enter password");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }

  fetch("http://127.0.0.1:8000/user/reset_password/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.status === "Success") {
        alert("Password updated successfully");

        window.location.href = "/login/";
      } else {
        alert(result.message);
      }
    });
}