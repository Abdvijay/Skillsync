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

            <div class="d-flex justify-content-between mb-3">
                <h4>User Management</h4>

                <button class="btn btn-dark"
                        data-bs-toggle="modal"
                        data-bs-target="#registerModal">
                    + Add User
                </button>
            </div>

            <table class="table table-bordered">
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
        <div class="modal fade" id="registerModal">
            <div class="modal-dialog">
                <div class="modal-content">

                    <div class="modal-header">
                        <h5 class="modal-title">Register User</h5>
                        <button class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body">

                        <input id="regUsername" class="form-control mb-2" placeholder="Username">
                        <input id="regEmail" class="form-control mb-2" placeholder="Email">
                        <input id="regPassword" class="form-control mb-2" placeholder="Password">
                        <input id="regPhone" class="form-control mb-2" placeholder="Phone">

                        <select id="regRole" class="form-control">
                            <option value="ADMIN">Admin</option>
                            <option value="STAFF">Staff</option>
                            <option value="STUDENT">Student</option>
                        </select>

                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-dark" onclick="registerUser()">
                            Create User
                        </button>
                    </div>

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
                    <td>${user.role}</td>
                    <td>
                        <button class="btn btn-sm btn-primary">Edit</button>
                        <button class="btn btn-sm btn-danger"
                            onclick="deleteUser(${user.id})">
                            Delete
                        </button>
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

  fetch("http://127.0.0.1:8000/delete_user/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  })
    .then((res) => res.json())
    .then(() => {
      alert("User Deleted");
      fetchUsers();
    })
    .catch((err) => console.log(err));
}