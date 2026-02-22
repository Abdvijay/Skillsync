let currentPage = 1;
const limit = 5;
let totalRecords = 0;

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
                      <!-- LEFT -->
                      <div class="header-left">
                        <h4>User Management</h4>
                      </div>

                      <!-- CENTER -->
                      <div class="header-center">
                        <input type="text" id="searchInput" placeholder="Search username..." />

                        <select id="roleFilter">
                            <option value="">All Roles</option>
                            <option value="ADMIN">Admin</option>
                            <option value="STAFF">Staff</option>
                            <option value="STUDENT">Student</option>
                        </select>

                        <button class="search-btn" onclick="searchUsers()">Search</button>
                        <button class="clear-btn" onclick="clearSearch()">Clear</button>
                      </div>

                      <!-- RIGHT -->
                      <div class="header-right">
                        <button class="add-user-btn" onclick="openRegisterModal()">+ Add User</button>
                      </div>
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
                        <tr>
                            <td colspan="6">Loading users...</td>
                        </tr>
                      </tbody>
                  </table>
                  <div class="pagination-controls">
                      <button id="prevBtn" onclick="prevPage()">Previous</button>
                      <span id="pageInfo"></span>
                      <button id="nextBtn" onclick="nextPage()">Next</button>
                  </div>
                </div>

                <!-- ✅ REGISTER MODAL -->
                <div class="modal-overlay" id="registerModal">
                  <div class="modal-box">
                      <div class="modal-header">
                        <h5>Register User</h5>
                        <span class="close-btn" onclick="closeRegisterModal()">×</span>
                      </div>

                      <div class="modal-body">
                        <input id="regUsername" placeholder="Username" />
                        <input id="regEmail" placeholder="Email" />
                        <input id="regPassword" placeholder="Password" />
                        <input id="regPhone" placeholder="Phone" />

                        <select id="regRole">
                            <option value="ADMIN">Admin</option>
                            <option value="STAFF">Staff</option>
                            <option value="STUDENT">Student</option>
                        </select>
                      </div>

                      <div class="modal-footer">
                        <button class="create-btn" onclick="registerUser()">Create User</button>
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
                        <input id="editUserId" type="hidden" />

                        <input id="editUsername" placeholder="Username" />
                        <input id="editEmail" placeholder="Email" />
                        <input id="editPhone" placeholder="Phone" />

                        <select id="editRole">
                            <option value="ADMIN">Admin</option>
                            <option value="STAFF">Staff</option>
                            <option value="STUDENT">Student</option>
                        </select>
                      </div>

                      <div class="modal-footer">
                        <button class="create-btn" onclick="updateUser()">Update User</button>
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

// DISPLAY ALL USERS WHEN CLICK USERS TAB
function fetchUsers() {
  const token = localStorage.getItem("access_token");

  fetch(
    `http://127.0.0.1:8000/user/get_all_users/?page=${currentPage}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
    .then((res) => res.json())
    .then(renderUsers);
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
      adjustPageAfterDelete();
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
  id = document.getElementById("editUserId").value.trim();
  username = document.getElementById("editUsername").value.trim();
  email = document.getElementById("editEmail").value.trim();
  phone = document.getElementById("editPhone").value.trim();
  role = document.getElementById("editRole").value.trim();

  if (!username || !email || !role || !phone) {
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

  const data = {
    id,
    username,
    email,
    phone,
    role,
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

document.addEventListener("click", function (e) {
  if (e.target.id === "editPhone") {
    e.target.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "");
    });
  }
});

function searchUsers() {
  currentPage = 1;
  const token = localStorage.getItem("access_token");

  const username = document.getElementById("searchInput").value;
  const role = document.getElementById("roleFilter").value;

  let url = "http://127.0.0.1:8000/user/search_user/?";

  if (username) {
    url += `username=${username}&`;
  }

  if (role) {
    url += `role=${role}&`;
  }

  url += `page=${currentPage}&limit=${limit}`;
  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then(renderUsers);
}

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("input", function (e) {
    if (e.target.id === "searchInput") {
      searchUsers();
    }
  });
});

function renderUsers(result) {
  totalRecords = result.total;
  const tbody = document.getElementById("usersTableBody");

  if (!result.data.length) {
    tbody.innerHTML = `<tr><td colspan="6">No Users Found</td></tr>`;
    renderPagination();
    return;
  }

  tbody.innerHTML = "";

  result.data.forEach((user) => {
    tbody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td><span class="role-badge role-${user.role.toLowerCase()}">${user.role}</span></td>
                <td>
                    <button class="action-btn edit-btn" onclick="openEditModal(${user.id}, '${user.username}', '${user.email}', '${user.phone}', '${user.role}')">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            </tr>
        `;
  });
  console.log("Total Records:", totalRecords);
  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(totalRecords / limit);

  document.getElementById("pageInfo").innerText =
    `Page ${currentPage} of ${totalPages || 1}`;

  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage >= totalPages;
}

function nextPage() {
  currentPage++;
  searchOrFetch();
}

function prevPage() {
  if (currentPage > 1) currentPage--;
  searchOrFetch();
}

function searchOrFetch() {
  const username = document.getElementById("searchInput").value;
  const role = document.getElementById("roleFilter").value;

  if (username || role) {
    searchUsers();
  } else {
    fetchUsers();
  }
}

function adjustPageAfterDelete() {
  const totalPages = Math.ceil((totalRecords - 1) / limit);

  // If current page > available pages → go back
  if (currentPage > totalPages && currentPage > 1) {
    currentPage--;
  }

  searchOrFetch();
}

// CLEAR SEARCH FILTERS
function clearSearch() {
  document.getElementById("searchInput").value = "";
  document.getElementById("roleFilter").value = "";

  currentPage = 1;

  fetchUsers();
}