/* Course Tab */
let currentOngoingTabPage = 1;
let ongoingTabLimit = 5;
let totalOngoingTabRecords = 0;

let selectedOngoingEnrollmentId = "";

/* Completed Tab */
let currentCompletedTabPage = 1;
let completedTabLimit = 5;
let totalCompletedTabRecords = 0;

let selectedCompletedEnrollmentId = "";

/* Notification Tab */
let currentStudentNotificationPage = 1;
let studentNotificationLimit = 5;
let totalStudentNotificationRecords = 0;

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
                        <div class="student-dashboard-card-subtitle">Total enrollments</div>
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

                <div class="student-dashboard-second-row">
                    <div class="student-dashboard-panel student-dashboard-active-classes-panel">
                        <h3>My Classes</h3>
                        <div class="student-dashboard-active-table-wrapper">
                            <table class="student-dashboard-active-table">
                                <thead>
                                    <tr>
                                        <th>Class</th>
                                        <th>Trainer</th>
                                        <th>Timing</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody id="studentDashboardActiveClassesTableBody">
                                    <tr>
                                        <td colspan="6">Loading...</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="student-dashboard-panel">
                        <h3>Attendance Overview</h3>
                        <canvas id="studentAttendanceChart"></canvas>
                    </div>
                </div>

                <!-- ROW 3 -->

                <div class="student-dashboard-third-row">
                    <div class="student-dashboard-recent-class-container">
                        <div class="student-dashboard-sub-container-header">
                            <h4>Newly Created Classes</h4>
                        </div>
                        <div class="student-dashboard-recent-class-list" id="studentDashboardRecentClassList"></div>
                    </div>

                    <div class="student-dashboard-notification-sub-container">
                        <div class="student-dashboard-sub-container-header">
                            <h4>Latest Notifications</h4>
                        </div>

                        <div class="student-dashboard-notification-static" id="studentDashboardNotificationContainer">Loading...</div>
                    </div>
                </div>
            </div>
        `; 
        loadStudentDashboard();
    }

    if (tabName === "courses") {
        content.innerHTML = `
            <div class="course-tab-container">
                <div class="course-tab-scroll-container" id="courseTabScrollContainer">
                    <div class="course-tab-course-grid" id="courseTabCourseGrid">Loading...</div>
                </div>
            </div>

            <!-- COURSE MODAL -->
            <div id="courseTabDetailsModal" class="course-tab-details-modal" style="display: none">
                <div class="course-tab-details-modal-content">
                    <div class="course-tab-details-header">
                        <h2 id="courseTabModalCourseName"></h2>

                        <span class="course-tab-details-close" onclick="closeCourseTabDetailsModal()"> &times; </span>
                    </div>

                    <div id="courseTabDetailsBody" class="course-tab-details-body"></div>
                </div>
            </div>
        `; 
        fetchCourseTabCourses();
    }

    if (tabName === "ongoing") {
        content.innerHTML = `
            <div class="ongoing-tab-container">
                <div class="ongoing-tab-table-container">
                    <div class="ongoing-tab-table-header">
                        <h3 class="ongoing-tab-title">My Ongoing Classes</h3>
                        <div class="ongoing-tab-search-box">
                            <input
                                type="text"
                                id="ongoingTabSearchInput"
                                placeholder="Search Class..."
                                onkeyup="handleOngoingTabSearch()"
                            >
                        </div>
                    </div>
                    <table class="ongoing-tab-table">
                        <thead>
                            <tr>
                                <th>Class</th>
                                <th>Trainer</th>
                                <th>Timing</th>
                                <th>Start Date</th>
                                <th>Days</th>
                                <th>Attendance %</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody id="ongoingTabTableBody">
                            <tr><td colspan="8">Loading...</td></tr>
                        </tbody>
                    </table>
                    <div class="ongoing-tab-pagination">
                        <button id="ongoingTabPrevBtn" onclick="prevOngoingTabPage()">Previous</button>
                        <span id="ongoingTabPageInfo"></span>
                        <button id="ongoingTabNextBtn" onclick="nextOngoingTabPage()">Next</button>
                    </div>
                </div>
            </div>

            <!-- VIEW ONGOING CLASS MODAL -->
            <div id="ongoingDetailsModal" class="ongoing-details-modal" style="display: none">
                <div class="ongoing-details-modal-content">
                    <div class="ongoing-details-header">
                        <h2>Ongoing Class Details</h2>

                        <span class="ongoing-details-close" onclick="closeOngoingDetailsModal()"> &times; </span>
                    </div>

                    <div id="ongoingDetailsBody" class="ongoing-details-body">Loading...</div>
                </div>
            </div>

            <!-- ONGOING ATTENDANCE MODAL -->

            <div class="ongoing-attendance-overlay" id="ongoingAttendanceModal" style="display: none">
                <div class="ongoing-attendance-box">
                    <div class="ongoing-attendance-header">
                        <h4 id="ongoingAttendanceTitle">Attendance Progress</h4>
                        <span onclick="closeOngoingAttendanceModal()"> × </span>
                    </div>

                    <div class="ongoing-attendance-table-wrapper">
                        <table class="ongoing-attendance-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Count Days</th>
                                    <th>Attendance</th>
                                </tr>
                            </thead>

                            <tbody id="ongoingAttendanceTableBody"></tbody>
                        </table>
                    </div>
                </div>
            </div>

        `; 
        fetchStudentOngoingClasses();
    }

    if (tabName === "completed") { 
        content.innerHTML = `
            <div class="completed-tab-container">
                <div class="completed-tab-table-container">
                    <div class="completed-tab-table-header">
                        <h3 class="completed-tab-title">My Completed Classes</h3>

                        <div class="completed-tab-search-box">
                            <input
                                type="text"
                                id="completedTabSearchInput"
                                placeholder="Search Class..."
                                onkeyup="handleCompletedTabSearch()"
                            />
                        </div>
                    </div>

                    <table class="completed-tab-table">
                        <thead>
                            <tr>
                                <th>Class</th>
                                <th>Trainer</th>
                                <th>Timing</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Days</th>
                                <th>Attendance %</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody id="completedTabTableBody">
                            <tr>
                                <td colspan="9">Loading...</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="completed-tab-pagination">
                        <button id="completedTabPrevBtn" onclick="prevCompletedTabPage()">Previous</button>
                        <span id="completedTabPageInfo"></span>
                        <button id="completedTabNextBtn" onclick="nextCompletedTabPage()">Next</button>
                    </div>
                </div>
            </div>

            <!-- COMPLETED DETAILS MODAL -->

            <div id="completedDetailsModal" class="completed-details-modal" style="display: none">
                <div class="completed-details-modal-content">
                    <div class="completed-details-header">
                        <h2>Completed Class Details</h2>

                        <span class="completed-details-close" onclick="closeCompletedDetailsModal()"> &times; </span>
                    </div>

                    <div id="completedDetailsBody" class="completed-details-body">Loading...</div>
                </div>
            </div>

            <!-- COMPLETED ATTENDANCE MODAL -->

            <div class="completed-attendance-overlay" id="completedAttendanceModal" style="display: none">
                <div class="completed-attendance-box">
                    <div class="completed-attendance-header">
                        <h4 id="completedAttendanceTitle">Attendance Progress</h4>
                        <span onclick="closeCompletedAttendanceModal()"> × </span>
                    </div>

                    <div class="completed-attendance-table-wrapper">
                        <table class="completed-attendance-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Count Days</th>
                                    <th>Attendance</th>
                                </tr>
                            </thead>

                            <tbody id="completedAttendanceTableBody"></tbody>
                        </table>
                    </div>
                </div>
            </div>

        `; 
        fetchStudentCompletedClasses(); 
    }

    if (tabName === "noticeboard") { 
        content.innerHTML = `
            <div class="student-notification-container">
                <div class="student-notification-header">
                    <div>
                        <h4>Notifications Feed</h4>
                    </div>

                    <div>
                        <input
                            type="text"
                            id="studentNotificationSearch"
                            class="student-notification-search"
                            placeholder="Search notifications..."
                            onkeyup="handleStudentNotificationSearch()"
                        />
                    </div>
                </div>

                <div id="studentNotificationFeed" class="student-notification-feed">
                    <p>Loading notifications...</p>
                </div>

                <div class="notification-tab-pagination-controls">
                    <button id="studentNotificationPrevBtn" onclick="prevStudentNotificationPage()">Previous</button>
                    <span id="studentNotificationPageInfo"></span>
                    <button id="studentNotificationNextBtn" onclick="nextStudentNotificationPage()">Next</button>
                </div>
            </div>
        `; 
        fetchStudentNotifications(); 
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
    loadStudentDashboardRecentClasses()
    loadStudentDashboardNotifications();
}

function fetchStudentDashboardSummary() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    fetch(`http://127.0.0.1:8000/dashboard/student/student_dashboard_summary/?username=${username}`, {
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

    fetch(`http://127.0.0.1:8000/dashboard/student/student_dashboard_active_classes/?username=${username}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then(renderStudentDashboardActiveClasses);
}

function renderStudentDashboardActiveClasses(result) { 
	console.log( "Student Dashboard Active Classes API Result:", result ); 
	const tbody = document.getElementById( "studentDashboardActiveClassesTableBody" ); 
	tbody.innerHTML = ""; 

	if(!result.data || result.data.length === 0) { 
		tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center">No Active Classes Found</td>
            </tr>
        `; 
		return; 
	} 

	result.data.forEach((item) => { 
		tbody.innerHTML += `
            <tr>
                <td>${item.class_name}</td>
                <td>${item.trainer}</td>
                <td>${item.timing}</td>
                <td>${item.start_date}</td>
                <td>${item.end_date || "-"}</td>
                <td><span class="student-dashboard-status-badge ${item.status.toLowerCase()}""> ${item.status} </span></td>
            </tr>
		`; 
	}); 
}

function fetchStudentDashboardAttendanceChart() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    fetch(`http://127.0.0.1:8000/dashboard/student/student_dashboard_attendance_chart/?username=${username}`, {
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

function loadStudentDashboardRecentClasses() { 
	const token = localStorage.getItem("access_token"); 

	fetch("http://127.0.0.1:8000/dashboard/student/student_dashboard_new_classes/", { 
		headers: { 
			Authorization: `Bearer ${token}`, 
		}, 
	})
	.then((res) => res.json()) 
	.then((result) => { 
		const container = document.getElementById("studentDashboardRecentClassList" ); 
		if (!result.data || result.data.length === 0) { 
			container.innerHTML = `
            	<div class="student-dashboard-no-data" style="text-align : center";>No Classes Available</div>
            `; 
			return; 
		} 

		container.innerHTML = `
            <div class="student-dashboard-class-table-wrapper">
                <table class="student-dashboard-recent-class-table">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Trainer</th>
                            <th>Start</th>
                            <th>Timing</th>
                            <th>Available Slot</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                </table>

                <div class="student-dashboard-class-scroll-body" id="studentDashboardClassScrollBody">
                    <table class="student-dashboard-recent-class-table">
                        <tbody id="studentDashboardClassTableBody"></tbody>
                    </table>
                </div>
            </div>
		`; 

		const tbody = document.getElementById( "studentDashboardClassTableBody" ); 
		result.data.forEach((item) => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.class_name}</td>
                    <td>${item.trainer}</td>
                    <td>${item.start_date}</td>
                    <td>${item.timing}</td>
                    <td>${item.available_slot}</td>
                    <td>
                        <button class="student-dashboard-table-join-btn">Join</button>
                        <button class="student-dashboard-table-view-btn">View</button>
                    </td>
                </tr>
            `; 
		}); 

		setTimeout(() => { 
			startStudentDashboardRecentClassScroll(); 
		}, 100); 
	}); 
}

let studentDashboardRecentClassScrollInterval;

function startStudentDashboardRecentClassScroll() {
    const container = document.getElementById("studentDashboardClassScrollBody");

    if (!container) return;

    clearInterval(studentDashboardRecentClassScrollInterval);

    if (container.scrollHeight <= container.clientHeight) {
        return;
    }

    container.innerHTML += container.innerHTML;

    function startScroll() {
        studentDashboardRecentClassScrollInterval = setInterval(() => {
            container.scrollTop += 1;

            const halfHeight = container.scrollHeight / 2;

            if (container.scrollTop >= halfHeight) {
                container.scrollTop = 0;
            }
        }, 40);
    }

    function stopScroll() {
        clearInterval(studentDashboardRecentClassScrollInterval);
    }

    startScroll();
    container.addEventListener("mouseenter", stopScroll);
    container.addEventListener("mouseleave", startScroll);
}

function loadStudentDashboardNotifications() {
    const token = localStorage.getItem("access_token");

    fetch(
        "http://127.0.0.1:8000/dashboard/student/student_dashboard_notifications/",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
    .then((res) => res.json())
    .then((result) => {
        const container = document.getElementById("studentDashboardNotificationContainer");
        container.innerHTML = "";
        if (!result.data || result.data.length === 0) {
            container.innerHTML = `
                <div class="student-dashboard-no-data">
                    No Notifications Found
                </div>
            `;
            return;
        }

        result.data.forEach((item) => {
            container.innerHTML += `
                <div class="student-dashboard-notification-card">
                    <p>${item.content}</p>
                    <span>${item.category}•${item.created_at}</span>
                </div>
            `;
        });

        setTimeout(() => {
            const contentHeight = container.scrollHeight;
            const maxHeight = 395;

            if (contentHeight > maxHeight) {
                container.classList.add("student-dashboard-notification-scroll");
                container.classList.remove("student-dashboard-notification-static");
                container.innerHTML += container.innerHTML;
                startStudentDashboardNotificationAutoScroll();

            } else {
                container.classList.add("student-dashboard-notification-static");
                container.classList.remove("student-dashboard-notification-scroll");
                container.scrollTop = 0;
                clearInterval(studentDashboardNotificationScrollInterval);
            }

        }, 50);
    });
}

let studentDashboardNotificationScrollInterval;

function startStudentDashboardNotificationAutoScroll() {
    const container = document.getElementById("studentDashboardNotificationContainer");

    if (!container) return;

    clearInterval(studentDashboardNotificationScrollInterval);

    function startScroll() {
        studentDashboardNotificationScrollInterval = setInterval(() => {
            container.scrollTop += 1;
            const halfHeight = container.scrollHeight / 2;

            if (container.scrollTop >= halfHeight) {
                container.scrollTop = 0;
            }
        }, 40);
    }

    function stopScroll() {
        clearInterval(studentDashboardNotificationScrollInterval);
    }

    startScroll();
    container.addEventListener("mouseenter", stopScroll);
    container.addEventListener("mouseleave", startScroll);
}

function fetchCourseTabCourses() {
    const token = localStorage.getItem("access_token");
    fetch("http://127.0.0.1:8000/courses/get_student_courses/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then(renderCourseTabCourses);
}

function renderCourseTabCourses(result) { 
	console.log( "Student Course Tab API Result:", result ); 
	const grid = document.getElementById( "courseTabCourseGrid" ); 
	grid.innerHTML = ""; 

	if (!result.data || result.data.length === 0) {
        grid.innerHTML = `
        	<div class="course-tab-no-data">No Courses Available</div>
        `; 
		return; 
	} 

	result.data.forEach((item) => { 
		grid.innerHTML += `
            <div class="course-tab-course-card">
                <div class="course-tab-course-header">
                    <h4>${item.course_name}</h4>

                    <span class="course-tab-course-code"> ${item.course_code} </span>
                </div>

                <div class="course-tab-course-duration">${item.duration}</div>

                <div class="course-tab-course-classes">${item.related_classes}</div>

                <div class="course-tab-course-description">${item.description}</div>

                <button class="course-tab-view-btn"
                    onclick='openCourseTabDetailsModal(
                        ${JSON.stringify(item)}
                    )'
                >View Details</button>
            </div>
		`; 
	}); 
}

function openCourseTabDetailsModal(course) { 
	document.getElementById( "courseTabModalCourseName" ).innerText = course.course_name; 
	document.getElementById( "courseTabDetailsBody" ).innerHTML = `
        <div class="course-tab-course-badge">${course.course_code}</div>
        <div class="course-tab-details-cards">
            <div class="course-tab-info-card">
                <h4>Duration</h4>
                <p>${course.duration}</p>
            </div>

            <div class="course-tab-info-card">
                <h4>Related Classes</h4>
                <p>${course.related_classes}</p>
            </div>
        </div>

        <div class="course-tab-detail-section">
            <h4>Technologies Covered</h4>
            <p>${course.related_classes}</p>
        </div>

        <div class="course-tab-detail-section">
            <h4>Course Description</h4>
            <p>${course.description}</p>
        </div>

	`; 
	document.getElementById( "courseTabDetailsModal" ).style.display = "flex"; 
}

function closeCourseTabDetailsModal() {
    document.getElementById("courseTabDetailsModal").style.display = "none";
}

function fetchStudentOngoingClasses() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const search = document.getElementById("ongoingTabSearchInput")?.value || "";

    fetch(`http://127.0.0.1:8000/classes/student/get_student_ongoing_classes/?username=${username}&page=${currentOngoingTabPage}&limit=${ongoingTabLimit}&search=${search}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then(renderStudentOngoingClasses);
}

function renderStudentOngoingClasses(result) { 
	console.log( "Student Ongoing Classes API Result:", result ); 
	const tbody = document.getElementById( "ongoingTabTableBody" ); 
	tbody.innerHTML = ""; 
    totalOngoingTabRecords = result.total || 0;

	if (!result.data || result.data.length === 0){ 
		tbody.innerHTML = `
            <tr>
                <td colspan="8" class="ongoing-tab-empty-row" style="text-align:center;">No Ongoing Classes Found</td>
            </tr>
        `; 
		return; 
	} 

	result.data.forEach((item) => { 
		tbody.innerHTML += `
            <tr>
                <td>${item.class_name}</td>
                <td>${item.trainer}</td>
                <td>${item.timing}</td>
                <td>${item.start_date}</td>
                <td><span class="ongoing-tab-days-badge">Day ${item.count_days}</span></td>
                <td class="attendance-percent-cell">
                    ${
                        item.attendance_percentage === "-"
                        ?
                        `<span class="attendance-percent-na">N/A</span>`
                        :
                        `
                        <div class="attendance-progress-container">
                            <div
                                class="attendance-progress-fill
                                    ${
                                        item.attendance_percentage >= 75
                                        ? "attendance-progress-good"
                                        : item.attendance_percentage >= 50
                                        ? "attendance-progress-average"
                                        : "attendance-progress-poor"
                                    }"
                                style="width:${item.attendance_percentage}%"
                            >
                            </div>
                            <span class="attendance-progress-text">
                                ${item.attendance_percentage}%
                            </span>
                        </div>
                        `
                    }
                </td>
                <td><span class="ongoing-tab-status-badge"> ${item.status} </span></td>
                <td>
                    <button class="ongoing-tab-view-btn" onclick="openOngoingDetailsModal(${item.enrollment_id})">View</button>
                    <button class="ongoing-tab-attendance-btn" onclick="openOngoingAttendanceModal(${item.enrollment_id})">Attendance</button>
                </td>
            </tr>
		`; 
	}); 
    renderOngoingTabPagination();
}

function handleOngoingTabSearch() {
    currentOngoingTabPage = 1;
    fetchStudentOngoingClasses();
}

function renderOngoingTabPagination() {
    const totalPages = Math.ceil(totalOngoingTabRecords / ongoingTabLimit);
    document.getElementById("ongoingTabPageInfo").innerText = `Page ${currentOngoingTabPage} of ${totalPages || 1}`;
    document.getElementById("ongoingTabPrevBtn").disabled = currentOngoingTabPage === 1;
    document.getElementById("ongoingTabNextBtn").disabled = currentOngoingTabPage >= totalPages;
}

function nextOngoingTabPage(){
    currentOngoingTabPage++;
    fetchStudentOngoingClasses();
}

function prevOngoingTabPage() {
    if (currentOngoingTabPage > 1) {
        currentOngoingTabPage--;
        fetchStudentOngoingClasses();
    }
}

function openOngoingDetailsModal(enrollmentId) {
    document.getElementById("ongoingDetailsModal").style.display = "flex";
    fetchStudentOngoingDetails(enrollmentId);
}

function closeOngoingDetailsModal() {
    document.getElementById("ongoingDetailsModal").style.display = "none";
}

function fetchStudentOngoingDetails(enrollmentId) {
    const token = localStorage.getItem("access_token");
    fetch(
        `http://127.0.0.1:8000/classes/student/ongoing_class_details/?enrollment_id=${enrollmentId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then(renderStudentOngoingDetails);
}

function renderStudentOngoingDetails( result ) { 
	console.log( "Student Ongoing Details API Result:", result ); 
	if (result.status === "Error" ) { 
		alert(result.message); 
		return; 
	} 

	const item = result.data; 
	document.getElementById("ongoingDetailsBody" ).innerHTML = `
        <div class="ongoing-details-grid">
            <div class="ongoing-details-card">
                <label>Class Name</label>
                <span> ${item.class_name} </span>
            </div>

            <div class="ongoing-details-card">
                <label>Trainer</label>
                <span> ${item.trainer} </span>
            </div>

            <div class="ongoing-details-card">
                <label>Timing</label>
                <span> ${item.timing} </span>
            </div>

            <div class="ongoing-details-card">
                <label>Start Date</label>
                <span> ${item.start_date} </span>
            </div>

            <div class="ongoing-details-card">
                <label>End Date</label>
                <span> ${item.end_date} </span>
            </div>

            <div class="ongoing-details-card">
                <label>Joined Date</label>
                <span> ${item.joined_date} </span>
            </div>
        </div>

        <div class="ongoing-details-progress">
            <div class="ongoing-details-progress-card">
                <label> Attendance </label>
                <h3>${item.attendance_percentage}%</h3>
            </div>

            <div class="ongoing-details-progress-card">
                <label> Total Classes </label>
                <h3>${item.total_classes}</h3>
            </div>

            <div class="ongoing-details-progress-card">
                <label> Present </label>
                <h3>${item.present_classes}</h3>
            </div>

            <div class="ongoing-details-progress-card">
                <label> Absent </label>
                <h3>${item.absent_classes}</h3>
            </div>
        </div>

        <div class="ongoing-details-footer">
            <button class="ongoing-details-attendance-btn" onclick="openOngoingAttendanceModal(${item.enrollment_id})">
                View Attendance
            </button>
        </div>
	`; 
}

function openOngoingAttendanceModal(enrollmentId) {
    selectedOngoingEnrollmentId = enrollmentId;
    document.getElementById("ongoingAttendanceModal").style.display = "flex";
    fetchOngoingAttendanceProgress();
}

function closeOngoingAttendanceModal() {
    document.getElementById("ongoingAttendanceModal").style.display = "none";
}

function fetchOngoingAttendanceProgress() {
    const token = localStorage.getItem("access_token");

    fetch(
        `http://127.0.0.1:8000/classes/get_student_attendance_progress/?student_enrollment_id=${selectedOngoingEnrollmentId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then((result) => {
            console.log("Ongoing Courses Tab View Attendance API Result: ", result);
            renderOngoingAttendanceProgress(result.data || []);
        });
}

function renderOngoingAttendanceProgress(data) {
    const tbody = document.getElementById("ongoingAttendanceTableBody");
    tbody.innerHTML = "";

    if (!data.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="ongoing-attendance-no-data">
                    No Attendance Found
                </td>
            </tr>
        `;
        return;
    }

    data.forEach((item) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.attendance_date}</td>
                <td>${item.count_days}</td>
                <td>
                    <span style="color:${item.attendance_status === "PRESENT" ? "green" : "red"};font-weight:600;">
                        ${item.attendance_status}
                    </span>
                </td>
            </tr>
        `;
    });
}

function fetchStudentCompletedClasses() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const search = document.getElementById("completedTabSearchInput")?.value || "";

    fetch(
        `http://127.0.0.1:8000/classes/student/get_completed_student_classes/?username=${username}&page=${currentCompletedTabPage}&limit=${completedTabLimit}&search=${search}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then(renderStudentCompletedClasses);
}

function renderStudentCompletedClasses(result) { 
	console.log( "Completed Classes API Result:", result ); 
	const tbody = document.getElementById( "completedTabTableBody" ); 
	tbody.innerHTML = ""; 
	totalCompletedTabRecords = result.total || 0;

	if ( !result.data || result.data.length === 0 ) { 
		tbody.innerHTML = `
            <tr>
                <td colspan="9" class="completed-tab-empty-row" style="text-align:center;">No Completed Classes Found</td>
            </tr>
		`; 
		renderCompletedTabPagination(); 
		return; 
	} 

	result.data.forEach((item) => { 
		tbody.innerHTML += `
            <tr>
                <td>${item.class_name}</td>
                <td>${item.trainer}</td>
                <td>${item.timing}</td>
                <td>${item.start_date}</td>
                <td>${item.end_date}</td>
                <td><span class="completed-tab-days-badge"> Day ${item.count_days} </span></td>
                <td class="attendance-percent-cell">
                    ${
                        item.attendance_percentage === "-"
                        ?
                        `<span class="attendance-percent-na">N/A</span>`
                        :
                        `
                        <div class="attendance-progress-container">
                            <div
                                class="attendance-progress-fill
                                    ${
                                        item.attendance_percentage >= 75
                                        ? "attendance-progress-good"
                                        : item.attendance_percentage >= 50
                                        ? "attendance-progress-average"
                                        : "attendance-progress-poor"
                                    }"
                                style="width:${item.attendance_percentage}%"
                            >
                            </div>
                            <span class="attendance-progress-text">
                                ${item.attendance_percentage}%
                            </span>
                        </div>
                        `
                    }
                </td>
                <td><span class="completed-tab-status-badge"> ${item.status} </span></td>
                <td>
                    <div class="completed-tab-action-container">
                        <button class="completed-tab-view-btn" onclick="openCompletedDetailsModal(${item.id})">View</button>
                        <button class="completed-tab-attendance-btn" onclick="openCompletedAttendanceModal(${item.id})">Attendance</button>
                    </div>
                </td>
            </tr>

		`; 
	}); 
	renderCompletedTabPagination(); 
}

function handleCompletedTabSearch() {
    currentCompletedTabPage = 1;
    fetchStudentCompletedClasses();
}

function renderCompletedTabPagination() {
    const totalPages = Math.ceil(totalCompletedTabRecords / completedTabLimit);
    document.getElementById("completedTabPageInfo").innerText = `Page ${currentCompletedTabPage} of ${totalPages || 1}`;
    document.getElementById("completedTabPrevBtn").disabled = currentCompletedTabPage === 1;
    document.getElementById("completedTabNextBtn").disabled = currentCompletedTabPage >= totalPages;
}

function nextCompletedTabPage() {
    currentCompletedTabPage++;
    fetchStudentCompletedClasses();
}

function prevCompletedTabPage() {
    if (currentCompletedTabPage > 1) {
        currentCompletedTabPage--;
        fetchStudentCompletedClasses();
    }
}

function openCompletedDetailsModal(enrollmentId) {
    document.getElementById("completedDetailsModal").style.display = "flex";
    fetchCompletedDetails(enrollmentId);
}

function closeCompletedDetailsModal() {
    document.getElementById("completedDetailsModal").style.display = "none";
}

function fetchCompletedDetails(enrollmentId) {
    const token = localStorage.getItem("access_token");
    fetch(
        `http://127.0.0.1:8000/classes/student/get_completed_student_details/?enrollment_id=${enrollmentId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then(renderCompletedDetails);
}

function renderCompletedDetails(result) { 
	console.log( "Completed Details API:", result ); 

	if (result.status === "Error") { 
		alert(result.message); 
		return; 
	} 

	const item = result.data;
	document.getElementById("completedDetailsBody").innerHTML = `
        <div class="completed-details-grid">
            <div class="completed-details-card">
                <label>Class Name</label>
                <span>${item.class_name}</span>
            </div>

            <div class="completed-details-card">
                <label>Trainer</label>
                <span>${item.trainer}</span>
            </div>

            <div class="completed-details-card">
                <label>Timing</label>
                <span>${item.timing}</span>
            </div>

            <div class="completed-details-card">
                <label>Start Date</label>
                <span>${item.start_date}</span>
            </div>

            <div class="completed-details-card">
                <label>End Date</label>
                <span>${item.end_date}</span>
            </div>

            <div class="completed-details-card">
                <label>Joined Date</label>
                <span>${item.joined_date}</span>
            </div>
        </div>

        <div class="completed-details-progress">
            <div class="completed-details-progress-card">
                <label>Attendance</label>
                <h3>${item.attendance_percentage}%</h3>
            </div>

            <div class="completed-details-progress-card">
                <label>Total Classes</label>
                <h3>${item.total_classes}</h3>
            </div>

            <div class="completed-details-progress-card">
                <label>Present</label>
                <h3>${item.present_classes}</h3>
            </div>

            <div class="completed-details-progress-card">
                <label>Absent</label>
                <h3>${item.absent_classes}</h3>
            </div>
        </div>

        <div class="completed-details-footer">
            <button class="completed-details-attendance-btn" onclick="openCompletedAttendanceModal(${item.enrollment_id})">
                View Attendance
            </button>
        </div>

	`; 
}

function openCompletedAttendanceModal(enrollmentId) {
    selectedCompletedEnrollmentId = enrollmentId;
    document.getElementById("completedAttendanceModal").style.display = "flex";
    fetchCompletedAttendanceProgress();
}

function closeCompletedAttendanceModal() {
    document.getElementById("completedAttendanceModal").style.display = "none";
}

function fetchCompletedAttendanceProgress() {
    const token = localStorage.getItem("access_token");

    fetch(
        `http://127.0.0.1:8000/classes/get_student_attendance_progress/?student_enrollment_id=${selectedCompletedEnrollmentId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then((result) => {
            console.log("Completed Student Particular Class Attendance Progress API Result: ",result);
            renderCompletedAttendanceProgress(result.data || []);
        });
}

function renderCompletedAttendanceProgress(data) {
    const tbody = document.getElementById("completedAttendanceTableBody");
    tbody.innerHTML = "";

    if (!data.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="completed-attendance-no-data" style="text-align:center;">
                    No Attendance Found
                </td>
            </tr>
        `;
        return;
    }

    data.forEach((item) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.attendance_date}</td>
                <td>${item.count_days}</td>
                <td>
                    <span style="color:${item.attendance_status === "PRESENT" ? "green" : "red"};font-weight:600;">
                        ${item.attendance_status}
                    </span>
                </td>
            </tr>
        `;
    });
}

function handleStudentNotificationSearch() {
    currentStudentNotificationPage = 1;
    fetchStudentNotifications();
}

function fetchStudentNotifications() {
    const token = localStorage.getItem("access_token");
    const search = document.getElementById("studentNotificationSearch")?.value || "";

    fetch(
        `http://127.0.0.1:8000/notifications/get_notifications/?search=${search}&category=&page=${currentStudentNotificationPage}&limit=${studentNotificationLimit}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then((result) => {
            console.log("Student Notification Result:", result);
            const container = document.getElementById("studentNotificationFeed");
        
            if (!container) {
                return;
            }
        
            container.innerHTML = "";
            totalStudentNotificationRecords = result.total || 0;
        
            if (result.status === "Error") {
                alert(result.message);
                return;
            }

            if (!result.data || result.data.length === 0) {
                container.innerHTML = `
                    <p class="student-notification-empty">No Notifications Found</p>
                `;
                renderStudentNotificationPagination();
                return;
            }

            result.data.forEach((item) => {
                container.innerHTML += `
                <div class="student-notification-card ${item.priority === "Important" ? "student-important-notification" : ""}">
                    <div class="student-notification-header-card">
                        <div class="student-notification-user">
                            <div class="student-notification-avatar">
                                ${item.posted_by ? item.posted_by.charAt(0) : "A"}
                            </div>
                            <div class="student-notification-user-info">
                                <h4>
                                    ${item.posted_by}
                                    <span class="student-admin-label">Admin</span>
                                </h4>
                                <p>${item.category}</p>
                            </div>
                        </div>
                        <span class="student-priority-badge">${item.priority}</span>
                    </div>

                    <div class="student-notification-content-wrapper">
                        <p class="student-notification-content collapsed" id="student-content-${item.id}">
                            ${item.content}
                        </p>

                        ${item.content && item.content.length > 90 ? `
                            <span
                                class="student-show-more-btn"
                                id="student-show-btn-${item.id}"
                                onclick="toggleStudentNotificationContent(${item.id})"
                                style="display:none;"
                            >
                            	Show More
                            </span>
                        `
                                : ""
                        }

                    </div>

                    <div class="student-notification-footer">
                        <div class="student-notification-footer-left">
                            <span>${new Date(item.created_at).toLocaleString()}</span>
                            ${item.edited ? `
                                <span class="student-edited-label">Edited</span>
                            `
                                    : ""
                            }
                        </div>
                    </div>
                </div>
            `;
            });
            renderStudentNotificationPagination();
        })
        .catch((error) => {
            console.error("Student Notification Error:", error);
        });
}

function renderStudentNotificationPagination() {
    const pageInfo = document.getElementById("studentNotificationPageInfo");
    if (!pageInfo) return;
    const totalPages = Math.ceil(totalStudentNotificationRecords / studentNotificationLimit);

    if (totalStudentNotificationRecords === 0) {
        document.getElementById("studentNotificationPageInfo").innerText = "";
        document.getElementById("studentNotificationPrevBtn").style.display = "none";
        document.getElementById("studentNotificationNextBtn").style.display = "none";
        return;
    }

    document.getElementById("studentNotificationPrevBtn").style.display = "inline-block";
    document.getElementById("studentNotificationNextBtn").style.display = "inline-block";
    document.getElementById("studentNotificationPageInfo").innerText = `Page ${currentStudentNotificationPage} of ${totalPages}`;
    document.getElementById("studentNotificationPrevBtn").disabled = currentStudentNotificationPage === 1;
    document.getElementById("studentNotificationNextBtn").disabled = currentStudentNotificationPage >= totalPages;

    setTimeout(() => {
        document.querySelectorAll(".student-notification-content").forEach((content) => {
            const id = content.id.replace("student-content-", "");
            const button = document.getElementById(`student-show-btn-${id}`);
            if (content.scrollHeight > content.clientHeight + 5) {
                button.style.display = "inline-block";
            }
        });
    }, 50);
}

function toggleStudentNotificationContent(id) {
    const content = document.getElementById(`student-content-${id}`);
    const button = document.querySelector(`[onclick="toggleStudentNotificationContent(${id})"]`);

    if (content.classList.contains("collapsed")) {
        content.classList.remove("collapsed");
        button.innerText = "Show Less";
    } else {
        content.classList.add("collapsed");
        button.innerText = "Show More";
    }
} 