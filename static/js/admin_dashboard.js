// ✅ TAB CONTENT LOADER
function loadTab(tabName) {
  const content = document.getElementById("content-area");

  if (tabName === "dashboard") {
    content.innerHTML = `
            <h4>Dashboard Overview</h4>
            <p>System statistics will be displayed here.</p>
        `;
  }

  if (tabName === "users") {
    content.innerHTML = `

        <div class="users-container">
            <div class="users-header">
                <h4>User Management</h4>

                <button class="add-user-btn"
                        onclick="openRegisterModal()">
                    + Add User
                </button>
            </div>

            <table class="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody id="usersTableBody">
                    <tr><td colspan="6">Loading users...</td></tr>
                </tbody>
            </table>

        </div>

        <!-- ✅ REGISTER MODAL -->
        <div class="modal-overlay" id="registerModal">

            <div class="modal-box">

                <div class="modal-header">
                    <h5>Register User</h5>
                    <span class="close-btn" onclick="closeRegisterModal()">×</span>
                </div>

                <div class="modal-body">

                    <input id="regUsername" placeholder="Username">
                    <input id="regEmail" placeholder="Email">
                    <input id="regPassword" placeholder="Password">
                    <input id="regPhone" placeholder="Phone">

                    <select id="regRole">
                        <option value="ADMIN">Admin</option>
                        <option value="STAFF">Staff</option>
                        <option value="STUDENT">Student</option>
                    </select>

                </div>

                <div class="modal-footer">
                    <button class="create-btn" onclick="registerUser()">
                        Create User
                    </button>
                </div>

            </div>
        </div>

        <!-- ✅ EDIT MODAL -->
        <div class="modal-overlay" id="editUserModal">

            <div class="modal-box">

            <div class="modal-header">
            <h5>Edit User</h5>
            <span class="close-btn" onclick="closeEditModal()">×</span>
        </div>

        <div class="modal-body">

            <input id="editUserId" type="hidden">

            <input id="editUsername" placeholder="Username">
            <input id="editEmail" placeholder="Email">
            <input id="editPhone" placeholder="Phone">

            <select id="editRole">
                <option value="ADMIN">Admin</option>
                <option value="STAFF">Staff</option>
                <option value="STUDENT">Student</option>
            </select>

        </div>

        <div class="modal-footer">
            <button class="create-btn" onclick="updateUser()">
                Update User
            </button>
        </div>

    </div>
</div>
    `;

    fetchUsers();
  }

  if (tabName === "courses") {
    content.innerHTML = `
            <h4>Course Management</h4>
            <p>View and manage courses.</p>
        `;
  }

  if (tabName === "noticeboard") {
    content.innerHTML = `
            <h4>Noticeboard</h4>
            <p>Announcements and updates.</p>
        `;
  }

  // ✅ TAB HIGHLIGHT LOGIC
  document.querySelectorAll(".nav-link").forEach((tab) => {
    tab.classList.remove("active");
  });

  event.target.classList.add("active");
}

// ✅ LOGOUT FUNCTION
function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_role");
  localStorage.removeItem("username");

  alert("Logged out successfully");

  window.location.href = "/";
}

// ✅ USERNAME DISPLAY (TIMING SAFE)
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const username = localStorage.getItem("username");

    console.log("Username from storage:", username);

    const userElement = document.getElementById("welcomeUser");

    if (!userElement) {
      console.error("welcomeUser element NOT FOUND ❌");
      return;
    }

    if (username) {
      userElement.innerText = "👋 " + username;
    }
  }, 100);
});

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
                    <td>
                        <span class="role-badge role-${user.role.toLowerCase()}">
                            ${user.role}
                        </span>
                    </td>
                    <td>
                        <button class="action-btn edit-btn"
                              onclick="openEditModal(${user.id}, '${user.username}', '${user.email}', '${user.phone}', '${user.role}')">Edit
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                </tr>
            `;
      });
    })
    .catch((err) => console.log(err));
}

function deleteUser(id) {
  const token = localStorage.getItem("access_token");

  if (!confirm("Delete this user?")) return;

  fetch("http://127.0.0.1:8000/user/delete_user/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  })
    .then((res) => res.json())
    .then(() => {
      alert("User Deleted Successfully");
      fetchUsers();
    })
    .catch((err) => console.log(err));
}

function openRegisterModal() {
  const modal = document.getElementById("registerModal");
  modal.style.display = "flex";
  modal.style.animation = "smoothFade 0.2s ease";
}

function closeRegisterModal() {
  const modal = document.getElementById("registerModal");
  modal.style.display = "none";
}

function openEditModal(id, username, email, phone, role) {
  document.getElementById("editUserId").value = id;
  document.getElementById("editUsername").value = username;
  document.getElementById("editEmail").value = email;
  document.getElementById("editPhone").value = phone;
  document.getElementById("editRole").value = role;

  document.getElementById("editUserModal").style.display = "flex";
}

function closeEditModal() {
  document.getElementById("editUserModal").style.display = "none";
}

function updateUser() {
  const token = localStorage.getItem("access_token");

  const data = {
    id: document.getElementById("editUserId").value,
    username: document.getElementById("editUsername").value,
    email: document.getElementById("editEmail").value,
    phone: document.getElementById("editPhone").value,
    role: document.getElementById("editRole").value,
  };

  fetch("http://127.0.0.1:8000/user/update_user/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((result) => {
      console.log("Update Response:", result);

      if (result.status === "Success") {
        alert("User Updated Successfully");

        closeEditModal();
        fetchUsers();
      } else {
        alert(result.message || "Update Failed");
      }
    })
    .catch((err) => console.log(err));
}