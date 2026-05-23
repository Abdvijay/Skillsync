/* Ongoing Batch Pagination */

let currentStaffBatchPage = 1;
const staffBatchLimit = 5;
let totalStaffBatchRecords = 0;

/* Completed Batch Pagination */

let currentCompletedBatchPage = 1;
const completedBatchLimit = 5;
let totalCompletedBatchRecords = 0;

/* Ongoing Student List Pagination */

let currentOngoingStudentPage = 1;
const ongoingStudentLimit = 5;
let totalOngoingStudentRecords = 0;
let selectedAssignmentId = null;
let selectedClassTitle = "";

function loadTab(tabName) {
    const content = document.getElementById("content-area");

    if (tabName === "dashboard") { 
        content.innerHTML = `
                <h4>Dashboard</h4>
                <p>Staff overview & quick stats.</p>
        `; 
    }

    if (tabName === "ongoing") { 
        content.innerHTML = `

            <!-- ONGOING BATCHES -->

            <div class="staff-ongoing-main-container">
                <div class="staff-ongoing-header">
                    <div>
                        <h4>My Ongoing Batches</h4>
                    </div>

                    <div class="staff-ongoing-controls">
                        <input
                            type="text"
                            id="staffBatchSearchInput"
                            class="staff-ongoing-search"
                            placeholder="Search Class..."
                            onkeyup="handleStaffBatchFilterChange()"
                        />

                        <select id="staffBatchClassFilter" class="staff-ongoing-filter" onchange="handleStaffBatchFilterChange()">
                            <option value="">All Classes</option>
                        </select>

                        <select id="staffBatchStatusFilter" class="staff-ongoing-filter" onchange="handleStaffBatchFilterChange()">
                            <option value="">All Status</option>
                            <option value="OPEN">OPEN</option>
                            <option value="ONGOING">ONGOING</option>
                            <option value="FULL">FULL</option>
                        </select>

                        <button class="staff-ongoing-clear-btn" onclick="clearStaffBatchFilters()">Clear</button>
                    </div>
                </div>

                <table class="staff-ongoing-table">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Timing</th>
                            <th>Start Date</th>
                            <th>Students</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody id="staffBatchTableBody">
                        <tr>
                            <td colspan="6">Loading...</td>
                        </tr>
                    </tbody>
                </table>

                <div class="pagination-controls">
                    <button id="staffBatchPrevBtn" onclick="prevStaffBatchPage()">Previous</button>
                    <span id="staffBatchPageInfo"></span>
                    <button id="staffBatchNextBtn" onclick="nextStaffBatchPage()">Next</button>
                </div>
            </div>

            <!-- UPDATE CLASS MODAL -->

            <div class="staff-update-class-modal-overlay" id="staffUpdateClassModal">
                <div class="staff-update-class-modal-box">
                    <div class="staff-update-class-modal-header">
                        <h6 style= "margin-top : 2%;">Update Class</h6>
                        <span class="staff-update-class-close-btn" onclick="closeUpdateClassModal()"> × </span>
                    </div>

                    <div class="staff-update-class-modal-body">
                        <!-- HIDDEN FIELDS -->

                        <input type="hidden" id="staffUpdateClassId" />
                        <input type="hidden" id="staffUpdateClassTime" />
                        <input type="hidden" id="staffUpdateClassStartDate" />
                        <input type="hidden" id="staffUpdateStudentLimit" />

                        <!-- CLASS NAME -->

                        <div class="staff-update-class-modal-notification-form-row">
                            <label> Class Name </label>
                            <input type="text" id="staffUpdateClassName" disabled style="cursor: not-allowed" />
                        </div>

                        <!-- CURRENT TIMING -->

                        <div class="staff-update-class-modal-notification-form-row">
                            <label> Timing </label>
                            <input type="text" id="staffUpdateDisplayTiming" disabled style="cursor: not-allowed" />
                        </div>

                        <!-- START DATE -->

                        <div class="staff-update-class-modal-notification-form-row">
                            <label> Start Date </label>
                            <input type="text" id="staffUpdateDisplayStartDate" disabled style="cursor: not-allowed" />
                        </div>

                        <!-- STUDENT LIMIT -->

                        <div class="staff-update-class-modal-notification-form-row">
                            <label> Student Limit </label>
                            <input type="text" id="staffUpdateDisplayStudentLimit" disabled style="cursor: not-allowed" />
                        </div>

                        <!-- STATUS -->

                        <div class="staff-update-class-modal-notification-form-row">
                            <label> Class Status </label>

                            <select id="staffUpdateClassStatus">
                                <option value="OPEN">OPEN</option>
                                <option value="ONGOING">ONGOING</option>
                                <option value="FULL">FULL</option>
                                <option value="COMPLETED">COMPLETED</option>
                            </select>
                        </div>
                    </div>

                    <div class="staff-update-class-modal-modal-footer">
                        <button class="staff-update-class-modal-create-btn" onclick="updateStaffClassStatus()">Update Class</button>
                    </div>
                </div>
            </div>

            <!-- ONGOING STUDENTS LIST -->

            <div class="ongoing-student-list-container" id="ongoingStudentListContainer" style="display: none">
                <div class="ongoing-student-list-header">
                    <div>
                        <h4 id="ongoingStudentDynamicTitle">Enrolled Students</h4>
                    </div>

                    <div>
                        <input
                            type="text"
                            id="ongoingStudentSearchInput"
                            class="ongoing-student-list-search"
                            placeholder="Search Student..."
                            onkeyup="handleOngoingStudentSearch()"
                        />
                    </div>
                </div>

                <table class="staff-ongoing-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Purchased Course</th>
                            <th>Joined Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody id="ongoingStudentTableBody"></tbody>
                </table>

                <div class="pagination-controls">
                    <button id="ongoingStudentPrevBtn" onclick="prevOngoingStudentPage()">Previous</button>
                    <span id="ongoingStudentPageInfo"></span>
                    <button id="ongoingStudentNextBtn" onclick="nextOngoingStudentPage()">Next</button>
                </div>
            </div>

            <!-- UPDATE STUDENT STATUS MODAL -->

            <div class="update-student-status-overlay" id="ongoingStudentUpdateModal">
                <div class="update-student-status-modal-box">
                    <div class="update-student-status-header">
                        <h6 style="margin-top : 2%;">Update Student Status</h6>
                        <span class="update-student-status-close-btn" onclick="closeUpdateStudentModal()"> × </span>
                    </div>

                    <div class="update-student-status-body">
                        <input type="hidden" id="updateStudentEnrollmentId" />
                        <div class="update-student-status-form-row">
                            <label> Student Name </label>
                            <input type="text" id="updateStudentName" disabled style="cursor: not-allowed" />
                        </div>

                        <div class="update-student-status-form-row">
                            <label> Enrollment Status </label>
                            <select id="updateStudentStatus">
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="DROPPED">DROPPED</option>
                            </select>
                        </div>
                    </div>

                    <div class="update-student-status-footer">
                        <button class="update-student-status-btn" onclick="updateStudentEnrollmentStatus()">Update Status</button>
                    </div>
                </div>
            </div>
        `; 
        fetchStaffBatches();  
        loadStaffBatchClasses();
    }

    if (tabName === "completed") {
        content.innerHTML = `
            <!-- COMPLETED BATCHES -->

            <div class="staff-completed-main-container">
                <div class="staff-completed-header">
                    <div>
                        <h4>Completed Batches</h4>
                    </div>

                    <div>
                        <input
                            type="text"
                            id="completedBatchSearchInput"
                            class="staff-completed-search"
                            placeholder="Search Class..."
                            onkeyup="handleCompletedBatchSearch()"
                        />
                    </div>
                </div>

                <table class="staff-ongoing-table">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Timing</th>
                            <th>Start Date</th>
                            <th>Students</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody id="completedBatchTableBody">
                        <tr>
                            <td colspan="6">Loading...</td>
                        </tr>
                    </tbody>
                </table>

                <div class="pagination-controls">
                    <button id="completedBatchPrevBtn" onclick="prevCompletedBatchPage()">Previous</button>

                    <span id="completedBatchPageInfo"></span>

                    <button id="completedBatchNextBtn" onclick="nextCompletedBatchPage()">Next</button>
                </div>
            </div>
        `;
        fetchCompletedBatches();
    }

    if (tabName === "students") {
        content.innerHTML = `
            <h4>Students</h4>
            <p>Students under your batches.</p>
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

function fetchStaffBatches() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const search = document.getElementById("staffBatchSearchInput")?.value || "";
    const className = document.getElementById("staffBatchClassFilter")?.value || "";
    const status = document.getElementById("staffBatchStatusFilter")?.value || "";

    fetch(
        `http://127.0.0.1:8000/classes/get_staff_batches/?page=${currentStaffBatchPage}&limit=${staffBatchLimit}&search=${search}&class_name=${className}&class_status=${status}&username=${username}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then(renderStaffBatches);
}

function loadStaffBatchClasses() {
    const token = localStorage.getItem("access_token");

    const username = localStorage.getItem("username");

    fetch(`http://127.0.0.1:8000/classes/get_staff_batch_classes/?username=${username}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            const dropdown = document.getElementById("staffBatchClassFilter");
            if (!dropdown) return;

            dropdown.innerHTML = `
                <option value="">
                    All Classes
                </option>
            `;

            result.data.forEach((item) => {
                dropdown.innerHTML += `
                    <option value="${item}">
                        ${item}
                    </option>
            	`;
            });
        });
}

function renderStaffBatches(result) {
    console.log("Fetched Batches:", result);
    totalStaffBatchRecords = result.total;
    const tbody = document.getElementById("staffBatchTableBody");
    tbody.innerHTML = "";

    if (!result.data.length) {
        tbody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="staff-ongoing-empty-row"
                >
                    No Batches Found
                </td>
            </tr>
        `;
        selectedAssignmentId = null;
        currentOngoingStudentPage = 1;
        const studentContainer = document.getElementById("ongoingStudentListContainer");
        if (studentContainer) {
            studentContainer.style.display = "none";
        }

        renderStaffBatchPagination();
        return;
    }

    result.data.forEach((item) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.class_name}</td>
                <td>${item.class_time}</td>
                <td>${item.class_start_date}</td>
                <td>${item.student_count} / ${item.student_limit}</td>
                <td><span class="staff-ongoing-status-badge ${item.class_status.toLowerCase()}">${item.class_status}</span></td>
                <td>
                    <button class="student-list-btn" onclick='showOngoingStudentList(
                        "${item.id}",
                        "${item.class_name}",
                        "${item.class_time}"
                    )'>
                        Students
                    </button>

                    <button class="staff-ongoingpage-attendance-btn">
                        Attendance
                    </button>

                    <button
                        class="staff-update-class-btn"
                        onclick="openUpdateClassModal(
                                '${item.id}',
                                '${item.class_name}',
                                '${item.class_time || ""}',
                                '${item.class_start_date || ""}',
                                '${item.student_limit || ""}',
                                '${item.class_status}'
                            )"
                    >
                        Update
                    </button>
                </td>
            </tr>
        `;
    });

    renderStaffBatchPagination();
}

function renderStaffBatchPagination() {
    const totalPages = Math.ceil(totalStaffBatchRecords / staffBatchLimit);

    /* NO DATA */

    if (totalStaffBatchRecords === 0) {
        document.getElementById("staffBatchPageInfo").innerText = "";
        document.getElementById("staffBatchPrevBtn").style.display = "none";
        document.getElementById("staffBatchNextBtn").style.display = "none";
        return;
    }

    /* SHOW BUTTONS */

    document.getElementById("staffBatchPrevBtn").style.display = "inline-block";
    document.getElementById("staffBatchNextBtn").style.display = "inline-block";
    document.getElementById("staffBatchPageInfo").innerText = `Page ${currentStaffBatchPage} of ${totalPages}`;
    document.getElementById("staffBatchPrevBtn").disabled = currentStaffBatchPage === 1;
    document.getElementById("staffBatchNextBtn").disabled = currentStaffBatchPage >= totalPages;
}

function nextStaffBatchPage() {
    const totalPages = Math.ceil(totalStaffBatchRecords / staffBatchLimit);
    if (currentStaffBatchPage < totalPages) {
        currentStaffBatchPage++;
        fetchStaffBatches();
    }
}

function prevStaffBatchPage() {
    if (currentStaffBatchPage > 1) {
        currentStaffBatchPage--;
        fetchStaffBatches();
    }
}

function handleStaffBatchFilterChange() {
    currentStaffBatchPage = 1;
    fetchStaffBatches();
}

function clearStaffBatchFilters() {
    document.getElementById("staffBatchSearchInput").value = "";
    document.getElementById("staffBatchClassFilter").value = "";
    document.getElementById("staffBatchStatusFilter").value = "";
    currentStaffBatchPage = 1;
    fetchStaffBatches();
}

function fetchCompletedBatches() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const search = document.getElementById("completedBatchSearchInput")?.value || "";

    fetch(
        `http://127.0.0.1:8000/classes/get_staff_completed_batches/?page=${currentCompletedBatchPage}&limit=${completedBatchLimit}&search=${search}&username=${username}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then(renderCompletedBatches);
}

function renderCompletedBatches(result) {
    totalCompletedBatchRecords = result.total;
    const tbody = document.getElementById("completedBatchTableBody");
    tbody.innerHTML = "";

    if (!result.data.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    No Completed
                    Batches Found
                </td>
            </tr>
        `;
        renderCompletedBatchPagination();
        return;
    }

    result.data.forEach((item) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.class_name}</td>
                <td>${item.class_time}</td>
                <td>${item.class_start_date}</td>
                <td>${item.student_count} / ${item.student_limit}</td>
                <td>
                    <span class="staff-ongoing-status-badge ${item.class_status.toLowerCase()}"> ${item.class_status} </span>
                </td>
                <td>
                    <button class="student-list-btn">Students</button>
                    <button class="staff-ongoingpage-attendance-btn">History</button>
                </td>
            </tr>
        `;
    });
    renderCompletedBatchPagination();
}

function renderCompletedBatchPagination() {
    const totalPages = Math.ceil(totalCompletedBatchRecords / completedBatchLimit);

    if (totalCompletedBatchRecords === 0) {
        document.getElementById("completedBatchPageInfo").innerText = "";
        document.getElementById("completedBatchPrevBtn").style.display = "none";
        document.getElementById("completedBatchNextBtn").style.display = "none";

        return;
    }

    document.getElementById("completedBatchPrevBtn").style.display = "inline-block";
    document.getElementById("completedBatchNextBtn").style.display = "inline-block";
    document.getElementById("completedBatchPageInfo").innerText = `Page ${currentCompletedBatchPage} of ${totalPages}`;
    document.getElementById("completedBatchPrevBtn").disabled = currentCompletedBatchPage === 1;
    document.getElementById("completedBatchNextBtn").disabled = currentCompletedBatchPage >= totalPages;
}

function nextCompletedBatchPage() {
    const totalPages = Math.ceil(totalCompletedBatchRecords / completedBatchLimit);

    if (currentCompletedBatchPage < totalPages) {
        currentCompletedBatchPage++;
        fetchCompletedBatches();
    }
}

function prevCompletedBatchPage() {
    if (currentCompletedBatchPage > 1) {
        currentCompletedBatchPage--;
        fetchCompletedBatches();
    }
}

function handleCompletedBatchSearch() {
    currentCompletedBatchPage = 1;
    fetchCompletedBatches();
}

function openUpdateClassModal(id, className, classTime, startDate, studentLimit, status) {
    document.getElementById("staffUpdateClassId").value = id || "";
    document.getElementById("staffUpdateClassName").value = className || "";
    document.getElementById("staffUpdateClassTime").value = classTime || "";
    document.getElementById("staffUpdateClassStartDate").value = startDate || "";
    document.getElementById("staffUpdateStudentLimit").value = studentLimit || "";
    document.getElementById("staffUpdateDisplayTiming").value = classTime || "-";
    document.getElementById("staffUpdateDisplayStartDate").value = startDate || "-";
    document.getElementById("staffUpdateDisplayStudentLimit").value = studentLimit || "-";
    document.getElementById("staffUpdateClassStatus").value = status || "OPEN";
    document.getElementById("staffUpdateClassModal").style.display = "flex";
}

function updateStaffClassStatus() {
    const token = localStorage.getItem("access_token");

    const payload = {
        id: document.getElementById("staffUpdateClassId").value,
        class_time: document.getElementById("staffUpdateClassTime").value,
        class_start_date: document.getElementById("staffUpdateClassStartDate").value,
        student_limit: document.getElementById("staffUpdateStudentLimit").value,
        class_status: document.getElementById("staffUpdateClassStatus").value,
    };

    fetch("http://127.0.0.1:8000/classes/update_assignment_timing/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
    })
        .then((res) => res.json())
        .then((result) => {
            alert(result.message);

            if (result.status === "Success") {
                /* RESET STUDENT STATE */
                selectedAssignmentId = null;
                currentOngoingStudentPage = 1;

                const studentContainer = document.getElementById("ongoingStudentListContainer");

                if (studentContainer) {
                    studentContainer.style.display = "none";
                }

                const searchInput = document.getElementById("ongoingStudentSearchInput");

                if (searchInput) {
                    searchInput.value = "";
                }

                closeUpdateClassModal();
                fetchStaffBatches();
            }
        });
}

function closeUpdateClassModal() {
    document.getElementById("staffUpdateClassModal").style.display = "none";
}

function showOngoingStudentList(assignmentId, className, classTime) {
    selectedAssignmentId = assignmentId;
    selectedClassTitle = `${className} - ${classTime}`;
    currentOngoingStudentPage = 1;

    /* CLEAR SEARCH */

    const searchInput = document.getElementById("ongoingStudentSearchInput");

    if (searchInput) {
        searchInput.value = "";
    }

    document.getElementById("ongoingStudentListContainer").style.display = "block";
    document.getElementById("ongoingStudentDynamicTitle").innerText = `${selectedClassTitle} Students`;
    fetchOngoingBatchStudents();
}

function fetchOngoingBatchStudents() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const search = document.getElementById("ongoingStudentSearchInput")?.value || "";

    fetch(
        `http://127.0.0.1:8000/classes/get_ongoing_batch_students/?page=${currentOngoingStudentPage}&limit=${ongoingStudentLimit}&assignment_id=${selectedAssignmentId}&search=${search}&username=${username}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then(renderOngoingStudentList);
}

function renderOngoingStudentList(result) {
    console.log("Student API Result:", result);
    totalOngoingStudentRecords = result.total || 0;
    const tbody = document.getElementById("ongoingStudentTableBody");
    tbody.innerHTML = "";

    if (!result.data || result.data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    No Students Found
                </td>
            </tr>
        `;
        renderOngoingStudentPagination();
        return;
    }

    result.data.forEach((item) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.student_name}</td>
                <td>${item.email}</td>
                <td>${item.phone}</td>
                <td>${item.purchased_course}</td>
                <td>${item.joined_date}</td>
                <td>
                    <span class="ongoing-student-status-badge ${item.status.toLowerCase()}">${item.status}</span>
                </td>
                <td>
                    <button
                        class="staff-update-class-btn"
                        onclick='openUpdateStudentModal(
                            "${item.id}",
                            "${item.student_name}",
                            "${item.status}"
                        )'
                    >
                        Update
                    </button>
                </td>
            </tr>
        `;
    });
    renderOngoingStudentPagination();
}

function renderOngoingStudentPagination() {
    const totalPages = Math.ceil(totalOngoingStudentRecords / ongoingStudentLimit);

    /* NO DATA */

    if (totalOngoingStudentRecords === 0) {
        document.getElementById("ongoingStudentPageInfo").innerText = "";
        document.getElementById("ongoingStudentPrevBtn").style.display = "none";
        document.getElementById("ongoingStudentNextBtn").style.display = "none";
        return;
    }

    /* SHOW PAGINATION */

    document.getElementById("ongoingStudentPrevBtn").style.display = "inline-block";
    document.getElementById("ongoingStudentNextBtn").style.display = "inline-block";
    document.getElementById("ongoingStudentPageInfo").innerText = `Page ${currentOngoingStudentPage} of ${totalPages}`;
    document.getElementById("ongoingStudentPrevBtn").disabled = currentOngoingStudentPage === 1;
    document.getElementById("ongoingStudentNextBtn").disabled = currentOngoingStudentPage >= totalPages;
}

function nextOngoingStudentPage() {
    const totalPages = Math.ceil(totalOngoingStudentRecords / ongoingStudentLimit);
    if (currentOngoingStudentPage < totalPages) {
        currentOngoingStudentPage++;
        fetchOngoingBatchStudents();
    }
}

function prevOngoingStudentPage() {
    if (currentOngoingStudentPage > 1) {
        currentOngoingStudentPage--;
        fetchOngoingBatchStudents();
    }
}

function handleOngoingStudentSearch() {
    currentOngoingStudentPage = 1;
    fetchOngoingBatchStudents();
}

function openUpdateStudentModal(id, studentName, status) {
    document.getElementById("updateStudentEnrollmentId").value = id;
    document.getElementById("updateStudentName").value = studentName;
    document.getElementById("updateStudentStatus").value = status;
    document.getElementById("ongoingStudentUpdateModal").style.display = "flex";
}

function closeUpdateStudentModal() {
    document.getElementById("updateStudentEnrollmentId").value = "";
    document.getElementById("updateStudentName").value = "";
    document.getElementById("updateStudentStatus").value = "ACTIVE";
    document.getElementById("ongoingStudentUpdateModal").style.display = "none";
}

function updateStudentEnrollmentStatus() {
    const token = localStorage.getItem("access_token");
    const payload = {
        id: document.getElementById("updateStudentEnrollmentId").value,
        enrollment_status: document.getElementById("updateStudentStatus").value,
    };

    fetch("http://127.0.0.1:8000/classes/update_student_enrollment_status/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
    })
        .then((res) => res.json())
        .then((result) => {
            alert(result.message);
            if (result.status === "Success") {
                closeUpdateStudentModal();
                fetchOngoingBatchStudents();
            }
        });
}