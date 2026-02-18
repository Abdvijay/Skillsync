function loadTab(tabName) {
  const content = document.getElementById("content-area");

  if (tabName === "dashboard") {
    content.innerHTML = `
            <h4>Dashboard</h4>
            <p>Student overview & progress.</p>
        `;
  }

  if (tabName === "courses") {
    content.innerHTML = `
            <h4>Courses</h4>
            <p>Available courses list.</p>
        `;
  }

  if (tabName === "ongoing") {
    content.innerHTML = `
            <h4>Ongoing Courses</h4>
            <p>Your active enrollments.</p>
        `;
  }

  if (tabName === "completed") {
    content.innerHTML = `
            <h4>Completed Courses</h4>
            <p>Your completed courses.</p>
        `;
  }

  if (tabName === "noticeboard") {
    content.innerHTML = `
            <h4>Noticeboard</h4>
            <p>Important announcements.</p>
        `;
  }

  document.querySelectorAll(".nav-link").forEach((tab) => {
    tab.classList.remove("active");
  });

  event.target.classList.add("active");
}

function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_role");
  localStorage.removeItem("username");

  alert("Logged out successfully");

  window.location.href = "/login/";
}

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