function fetchUsers() {
  const token = localStorage.getItem("access_token");

  fetch("http://127.0.0.1:8000/user/get_all_users/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("usersTableBody");

      if (!data.data || data.data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">No Users Found</td></tr>`;
        return;
      }

      tbody.innerHTML = "";

      data.data.forEach((user) => {
        tbody.innerHTML += `
        <tr>
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.role}</td>
        <td>
            <button class="btn btn-sm btn-primary"
                    onclick="editUser(${user.id})">
                Edit
            </button>

            <button class="btn btn-sm btn-danger"
                    onclick="deleteUser(${user.id})">
                Delete
            </button>
        </td>
        </tr>`;
      });
    });
}

function registerUser() {
  const token = localStorage.getItem("access_token");

  const data = {
    username: document.getElementById("regUsername").value,
    email: document.getElementById("regEmail").value,
    phone: document.getElementById("regPhone").value,
    password: document.getElementById("regPassword").value,
    role: document.getElementById("regRole").value,
  };

  fetch("http://127.0.0.1:8000/user/register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Register Response:", result);

      if (result.status === "Success") {
        alert("User Created Successfully");

        fetchUsers(); // refresh table

        const modal = bootstrap.Modal.getInstance(
          document.getElementById("registerModal"),
        );
        modal.hide();
      } else {
        alert(result.message || result.error || "Registration Failed");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Server error");
    });
}

function deleteUser(id) {
  const token = localStorage.getItem("access_token");

  fetch("http://127.0.0.1:8000/user/delete_user/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  }).then(() => {
    alert("User Deleted");
    fetchUsers();
  });
}

function editUser(id) {
  alert("Edit user id: " + id);
}