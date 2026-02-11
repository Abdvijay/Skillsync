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
                <h4>User Management</h4>
                <p>View, search, and manage users.</p>
            `;
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

  // Tab Highlight Logic
  document.querySelectorAll(".nav-link").forEach((tab) => {
    tab.classList.remove("active");
  });

  event.target.classList.add("active");
}

// logged out functionality
function logout() {

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    alert("Logged out successfully");

    window.location.href = "/";
}