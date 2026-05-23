/* Ongoing Batch Pagination */

let currentStaffBatchPage = 1;
const staffBatchLimit = 5;
let totalStaffBatchRecords = 0;

/* Completed Batch Pagination */

let currentCompletedBatchPage = 1;
const completedBatchLimit = 5;
let totalCompletedBatchRecords = 0;

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
        `; 
        fetchStaffBatches();  
        loadStaffBatchClasses();
        fetchCompletedBatches();
    }

    if (tabName === "completed") {
        content.innerHTML = `
            <h4>Completed Batches</h4>
            <p>Previously completed batches.</p>
        `;
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
                <td><span class="staff-ongoing-status-badge">${item.class_status}</span></td>
                <td>
                    <button class="student-list-btn">
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
                    <span class="staff-ongoing-status-badge"> ${item.class_status} </span>
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
                closeUpdateClassModal();
                fetchStaffBatches();
                fetchCompletedBatches();
            }
        });
}

function closeUpdateClassModal() {
    document.getElementById("staffUpdateClassModal").style.display = "none";
}