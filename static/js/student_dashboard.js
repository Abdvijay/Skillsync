function loadTab(tabName, clickedButton = null) {
    const content = document.getElementById("content-area");

    /* REMOVE ACTIVE */

    document.querySelectorAll(".nav-link").forEach((tab) => {
        tab.classList.remove("active");
    });

    /* ADD ACTIVE */

    if (clickedButton) {
        clickedButton.classList.add("active");
    } else {
        const dashboardBtn = document.querySelector(".nav-link[onclick=\"loadTab('dashboard',this)\"]");

        if (dashboardBtn) {
            dashboardBtn.classList.add("active");
        }
    }

    if (tabName === "dashboard") { 
        content.innerHTML = `
            <div class="student-dashboard-container">
                <!-- DASHBOARD CARDS -->

                <div class="student-dashboard-cards">
                    <div class="student-dashboard-card">
                        <div class="student-dashboard-card-title">Enrolled Classes</div>
                        <div class="student-dashboard-card-value" id="studentDashboardEnrolledClasses">0</div>
                        <div class="student-dashboard-card-subtitle">Active enrollments</div>
                    </div>

                    <div class="student-dashboard-card">
                        <div class="student-dashboard-card-title">Attendance %</div>
                        <div class="student-dashboard-card-value" id="studentDashboardAttendancePercentage">0%</div>
                        <div class="student-dashboard-card-subtitle">Overall attendance</div>
                    </div>

                    <div class="student-dashboard-card">
                        <div class="student-dashboard-card-title">Completed Classes</div>
                        <div class="student-dashboard-card-value" id="studentDashboardCompletedClasses">0</div>
                        <div class="student-dashboard-card-subtitle">Finished batches</div>
                    </div>

                    <div class="student-dashboard-card">
                        <div class="student-dashboard-card-title">Notifications</div>
                        <div class="student-dashboard-card-value" id="studentDashboardNotificationCount">0</div>
                        <div class="student-dashboard-card-subtitle">Active notifications</div>
                    </div>
                </div>

                <!-- ROW 2 -->

                <div class="student-dashboard-row">
                    <div class="student-dashboard-panel student-dashboard-active-classes-panel">
                        <h3>My Active Classes</h3>
                        <div id="studentDashboardActiveClassesContainer">Loading...</div>
                    </div>

                    <div class="student-dashboard-panel">
                        <h3>Attendance Overview</h3>
                        <canvas id="studentAttendanceChart"></canvas>
                    </div>
                </div>

                <!-- ROW 3 -->

                <div class="student-dashboard-row">
                    <div class="student-dashboard-panel">
                        <h3>Newly Created Classes</h3>

                        <table class="student-dashboard-table">
                            <thead>
                                <tr>
                                    <th>Class</th>
                                    <th>Trainer</th>
                                    <th>Start</th>
                                    <th>Timing</th>
                                    <th>Available Slot</th>
                                </tr>
                            </thead>

                            <tbody id="studentDashboardNewClassesTableBody">
                                <tr>
                                    <td colspan="5">Loading...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="student-dashboard-panel">
                        <h3>Latest Notifications</h3>
                        <div id="studentDashboardNotificationsContainer">Loading...</div>
                    </div>
                </div>
            </div>
        `; 
        loadStudentDashboard();
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

}

document.addEventListener("DOMContentLoaded", function () {
    loadTab("dashboard");
});

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

function loadStudentDashboard() {
    fetchStudentDashboardSummary();
    fetchStudentDashboardActiveClasses();
    fetchStudentDashboardAttendanceChart();
    fetchStudentDashboardNewClasses();
    fetchStudentDashboardNotifications();
}

function fetchStudentDashboardSummary() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    fetch(`http://127.0.0.1:8000/dashboard/student_dashboard_summary/?username=${username}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then(renderStudentDashboardSummary);
}

function renderStudentDashboardSummary(result) {
    console.log("Dashboard Student Summary Cards API Result: ",result);
    const data = result.data;
    document.getElementById("studentDashboardEnrolledClasses").innerText = data.enrolled_classes;
    document.getElementById("studentDashboardAttendancePercentage").innerText = `${data.attendance_percentage}%`;
    document.getElementById("studentDashboardCompletedClasses").innerText = data.completed_classes;
    document.getElementById("studentDashboardNotificationCount").innerText = data.notifications;
}

function fetchStudentDashboardActiveClasses() {
    const token = localStorage.getItem("access_token");

    const username = localStorage.getItem("username");

    fetch(`http://127.0.0.1:8000/dashboard/student_dashboard_active_classes/?username=${username}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then(renderStudentDashboardActiveClasses);
}

function renderStudentDashboardActiveClasses(result) {

    console.log("Dashboard My Active Classes API Result: ", result);

    const container = document.getElementById(
        "studentDashboardActiveClassesContainer"
    );

    container.innerHTML = "";

    if (!result.data || result.data.length === 0) {

        container.innerHTML = `
            <div class="student-dashboard-empty-state">
                No Active Classes Found
            </div>
        `;

        return;
    }

    result.data.forEach((item) => {
        container.innerHTML += `
            <div class="student-dashboard-active-class-card">
                <div class="student-dashboard-class-header">${item.class_name}</div>
                <div class="student-dashboard-class-info">
                    <p><strong>Trainer :</strong>${item.trainer}</p>
                    <p><strong>Timing :</strong>${item.timing}</p>
                    <p><strong>Start Date :</strong>${item.start_date}</p>
                    <p><strong>Status :</strong>${item.status}</p>
                </div>
            </div>
        `;

    });
}

function fetchStudentDashboardAttendanceChart() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    fetch(`http://127.0.0.1:8000/dashboard/student_dashboard_attendance_chart/?username=${username}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then(renderStudentAttendanceChart);
}

let studentAttendanceChart = null;

function renderStudentAttendanceChart(result) {

    console.log("Dashaboard Student Attendance Chart API Result: ",result);
    const ctx = document.getElementById("studentAttendanceChart").getContext("2d");

    if (studentAttendanceChart) {
        studentAttendanceChart.destroy();
    }

    studentAttendanceChart = new Chart(ctx, {
        type: "doughnut",

        data: {
            labels: ["Present", "Absent"],

            datasets: [
                {
                    data: [result.present || 0, result.absent || 0],
                    backgroundColor: ["#22c55e", "#ef4444"],
                },
            ],
        },

        options: {
            responsive: true,

            plugins: {
                legend: {
                    position: "bottom",
                },
            },
        },
    });
}

function fetchStudentDashboardNewClasses() {
    const token = localStorage.getItem("access_token");
    fetch(`http://127.0.0.1:8000/dashboard/student_dashboard_new_classes/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then(renderStudentDashboardNewClasses);
}

function renderStudentDashboardNewClasses(result) { 
    console.log("Dashboard Student New Classes API Result :",result);
    const tbody = document.getElementById("studentDashboardNewClassesTableBody" ); 
    tbody.innerHTML = ""; 

    if (!result.data || result.data.length === 0) {
          tbody.innerHTML = `
              <tr>
                  <td colspan="5">No Classes Available</td>
              </tr>
          `; 
      return; 
    } 

	result.data.forEach((item) => { 
		tbody.innerHTML += `
            <tr>
                <td>${item.class_name}</td>
                <td>${item.trainer}</td>
                <td>${item.start_date}</td>
                <td>${item.timing}</td>
                <td>${item.available_slot}</td>
            </tr>
        `; 
	}); 
}

function fetchStudentDashboardNotifications() {
    const token = localStorage.getItem("access_token");

    fetch(`http://127.0.0.1:8000/dashboard/student_dashboard_notifications/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then(renderStudentDashboardNotifications);
}

function renderStudentDashboardNotifications(result) {

    const container = document.getElementById(
        "studentDashboardNotificationsContainer"
    );

    container.innerHTML = "";

    if (!result.data || result.data.length === 0) {

        container.innerHTML = `
            <div class="student-dashboard-empty-state">
                No Notifications Found
            </div>
        `;

        return;
    }

    result.data.forEach((item) => {

        container.innerHTML += `

            <div class="student-dashboard-notification-card">

                <div class="student-dashboard-notification-category">
                    ${item.category}
                </div>

                <div class="student-dashboard-notification-content">
                    ${item.content}
                </div>

                <div class="student-dashboard-notification-date">
                    ${item.created_at}
                </div>

            </div>

        `;
    });
}