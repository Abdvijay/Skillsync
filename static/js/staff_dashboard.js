/* Ongoing Batch Pagination */

let currentStaffBatchPage = 1;
const staffBatchLimit = 5;
let totalStaffBatchRecords = 0;
let selectedStudentTabButton = null;

let selectedAttendanceAssignmentId = null;
let attendanceStudents = [];
let selectedAttendanceClassTitle = "";

let attendanceState = {};
let selectedAttendanceHistoryId = null;
let selectedAttendanceDate = null;

let isAttendanceUpdate = false;
let selectedUpdateDate = null;
let originalOngoingAttendanceHistoryData = [];

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

/* Completed Student List */

let currentCompletedStudentPage = 1;
const completedStudentLimit = 5;
let totalCompletedStudentRecords = 0;
let selectedCompletedAssignmentId = null;
let selectedCompletedClassTitle = "";

/* STUDENT TAB */

let currentStudentTabPage = 1;
const studentTabLimit = 5;
let totalStudentTabRecords = 0;

/* STUDENT TAB STUDENTS */

let currentStudentTabStudentPage = 1;
const studentTabStudentLimit = 5;
let totalStudentTabStudentRecords = 0;
let selectedStudentTabAssignmentId = null;
let selectedStudentTabTitle = "";

/* Attendance Tab */
let attendanceTabBatchPage = 1;
let attendanceTabBatchLimit = 5;
let totalAttendanceTabRecords = 0;
let attendanceTabBatchData = [];

let selectedAttendanceTabAssignmentId = null;
let selectedAttendanceTabDate = null;
let selectedAttendanceTabUpdateDate = null;
let isAttendanceTabUpdate = false;

let attendanceTabHistoryData = [];
let originalAttendanceTabBatches = [];
let attendanceTabViewOriginalData = [];

/* Notifications */
let currentStaffNotificationPage = 1;
const staffNotificationLimit = 5;
let totalStaffNotificationRecords = 0;

/* Leave Request */
let originalUpcomingLeaveData = [];
let originalLeaveHistoryData = [];

let staffUpcomingLeavePage = 1;
const staffUpcomingLeaveLimit = 5;

let staffHistoryLeavePage = 1;
const staffHistoryLeaveLimit = 5;

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
        const dashboardBtn = document.querySelector(".nav-link[onclick=\"loadTab('dashboard')\"]");

        if (dashboardBtn) {
            dashboardBtn.classList.add("active");
        }
    }

    if (tabName === "dashboard") { 
        content.innerHTML = `
            <div class="staff-dashboard-main-container">
                <!-- ROW 1 -->

                <div class="staff-dashboard-card-row">
                    <div class="staff-dashboard-total-class-card">
                        <div class="staff-dashboard-card-title">Total Classes</div>

                        <div class="staff-dashboard-card-count" id="staffDashboardTotalClasses">0</div>
                    </div>

                    <div class="staff-dashboard-ongoing-card">
                        <div class="staff-dashboard-card-title">Active Classes</div>

                        <div class="staff-dashboard-card-count" id="staffDashboardActiveClasses">0</div>
                    </div>

                    <div class="staff-dashboard-student-card">
                        <div class="staff-dashboard-card-title">Total Students</div>

                        <div class="staff-dashboard-card-count" id="staffDashboardTotalStudents">0</div>
                    </div>

                    <div class="staff-dashboard-attendance-card">
                        <div class="staff-dashboard-card-title">Today's Attendance</div>

                        <div class="staff-dashboard-attendance-status" id="staffDashboardAttendanceStatus">0 Taken | 0 Pending</div>
                    </div>
                </div>

                <!-- ROW 2 -->

                <div class="staff-dashboard-second-row">
                    <div class="staff-dashboard-active-class">
                        <div class="staff-dashboard-section-header">Today's Active Classes</div>

                        <div id="staffDashboardActiveClassTable"></div>
                    </div>

                    <div class="staff-dashboard-class-summary">
                        <div class="staff-dashboard-section-header">Class Status Summary</div>

                        <div id="staffDashboardClassSummary"></div>
                    </div>
                </div>

                <!-- ROW 3 -->

                <div class="staff-dashboard-third-row">
                    <!-- NEWLY CREATED CLASS -->

                    <div class="staff-dashboard-new-class-container">
                        <div class="staff-dashboard-sub-header">
                            <h4>Newly Created Classes</h4>
                        </div>

                        <div class="staff-dashboard-new-class-list" id="staffDashboardRecentClassList"></div>
                    </div>

                    <!-- NOTIFICATION PLACEHOLDER -->

                    <div class="staff-dashboard-notification-container">
                        <div class="staff-dashboard-sub-header">
                            <h4>Latest Notifications</h4>
                        </div>

                        <div class="staff-dashboard-notification-scroll-container" id="staffDashboardNotificationContainer"></div>
                    </div>
                </div>
            </div>
        `; 
        fetchStaffDashboardCards(); 
        fetchStaffDashboardActiveClasses();
        loadStaffDashboardRecentClasses();
        loadStaffDashboardNotifications();
    }

    if (tabName === "ongoing") { 
        content.innerHTML = `

            <!-- ONGOING BATCHES -->

            <div class="staff-ongoing-main-container">
                <div class="staff-ongoing-header">
                    <div>
                        <h4>My Ongoing Batches</h4>
                    </div>

                    <div>
                        <input
                            type="text"
                            id="staffBatchSearchInput"
                            class="staff-ongoing-search"
                            placeholder="Search Class..."
                            onkeyup="handleStaffBatchFilterChange()"
                        />
                    </div>

                    <div class="ongoing-batch-student-list-filters">

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
                            <th>Count Days</th>
                            <th>Students</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody id="staffBatchTableBody">
                        <tr>
                            <td colspan="8">Loading...</td>
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
                        <h6 style="margin-top : 2%;/* margin: 0; */font-size: 16px;font-weight: 700;color: #111827;">Update Class</h6>
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

                    <div class="ongoing-batch-student-list-filters">

                        <select
                            id="ongoingStudentStatusFilter"
                            class="ongoing-student-list-filter"
                            onchange="handleOngoingStudentSearch()"
                        >
                            <option value="">All Status</option>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="DROPPED">DROPPED</option>
                        </select>

                        <button class="ongoing-batch-student-clear-btn" onclick="clearOngoingStudentFilters()">Clear</button>
                    </div>
                </div>

                <table class="staff-ongoing-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
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
                        <h6 style="margin-top : 2%;/* margin: 0; */font-size: 16px;font-weight: 700;color: #111827;">Update Student Status</h6>
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
                                <option value="DROPPED">DROPPED</option>
                            </select>
                        </div>
                    </div>

                    <div class="update-student-status-footer">
                        <button class="update-student-status-btn" onclick="updateStudentEnrollmentStatus()">Update Status</button>
                    </div>
                </div>
            </div>

            <!-- ATTENDANCE BUTTON FUNCTIONALITY -->
            <div class="ongoingtab-attendance-modal-overlay" id="ongoingAttendanceModal">
                <div class="ongoingtab-attendance-modal-box">
                    <div class="ongoingtab-attendance-header">
                        <h4 id="ongoingAttendanceTitle">Attendance</h4>

                        <span onclick="closeAttendanceModal()"> × </span>
                    </div>

                    <div class="ongoingtab-attendance-topbar">
                        <input
                            type="text"
                            id="attendanceSearchInput"
                            placeholder="Search Student"
                            onkeyup="filterAttendanceStudents()"
                        />

                        <input type="date" id="attendanceDate" disabled style="cursor: not-allowed; background: #f5f5f5;" />

                        <button class="ongoingtab-attendance-save-btn" onclick="saveAttendance()">Save Attendance</button>
                    </div>

                    <div class="ongoingtab-attendance-table-wrapper">
                        <table class="ongoingtab-attendance-table">
                            <thead>
                                <tr>
                                    <th>Present</th>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Joined Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="attendanceTableBody"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ATTENDANCE HISTORY MODAL -->
            <div class="ongoingtab-attendance-history-overlay" id="attendanceHistoryModal">
                <div class="ongoingtab-attendance-history-box">
                    <div class="ongoingtab-attendance-history-header">
                        <div class="ongoingtab-attendance-history-left">
                            <h4 id="attendanceHistoryTitle">Attendance History</h4>
                        </div>

                        <div class="ongoingtab-attendance-history-filter-container">
                                <input
                                    type="date"
                                    id="ongoingAttendanceHistoryDateFilter"
                                    class="ongoingAttendanceHistoryDateFilter"
                                    onchange="handleOngoingAttendanceHistoryFilter()"
                                />

                                <button class="ongoingtab-attendance-history-clear-btn" onclick="clearOngoingAttendanceHistoryFilter()">
                                    Clear
                                </button>
                        </div>

                        <span onclick="closeAttendanceHistoryModal()"> × </span>
                    </div>

                    <div class="ongoingtab-attendance-history-table-wrapper">
                        <table class="ongoingtab-attendance-history-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Present</th>
                                    <th>Absent</th>
                                    <th>Present %</th>
                                    <th>Absent %</th>
                                    <th>Count Days</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody id="attendanceHistoryTableBody"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ATTENDANCE HISTORY VIEW MODAL -->
            <div class="ongoingtab-attendance-view-overlay" id="attendanceViewModal">
                <div class="ongoingtab-attendance-view-box">
                    <div class="ongoingtab-attendance-view-header">
                        <h4 id="attendanceViewTitle">Attendance View</h4>

                        <input
                            type="text"
                            id="ongoingAttendanceViewSearchInput"
                            class="ongoingtab-attendance-view-search"
                            placeholder="Search Student ID / Name"
                            onkeyup="fetchAttendanceDayDetails()"
                        />

                        <span onclick="closeAttendanceViewModal()">×</span>
                    </div>

                    <div class="ongoingtab-attendance-view-table-wrapper">
                        <table class="ongoingtab-attendance-view-table">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Attendance</th>
                                </tr>
                            </thead>

                            <tbody id="attendanceViewTableBody"></tbody>
                        </table>
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
                            <th>End Date</th>
                            <th>Count Days</th>
                            <th>Students</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody id="completedBatchTableBody">
                        <tr>
                            <td colspan="8">Loading...</td>
                        </tr>
                    </tbody>
                </table>

                <div class="pagination-controls">
                    <button id="completedBatchPrevBtn" onclick="prevCompletedBatchPage()">Previous</button>
                    <span id="completedBatchPageInfo"></span>
                    <button id="completedBatchNextBtn" onclick="nextCompletedBatchPage()">Next</button>
                </div>
            </div>

            <!-- COMPLETED STUDENTS LIST -->
            
            <div class="completed-batch-student-list-container" id="completedStudentListContainer" style="display: none">
                <div class="completed-batch-student-list-header">
                    <div>
                        <h4 id="completedStudentDynamicTitle">Students</h4>
                    </div>

                    <div>
                        <input
                            type="text"
                            id="completedStudentSearchInput"
                            class="completed-batch-student-list-search"
                            placeholder="Search Student..."
                            onkeyup="handleCompletedStudentSearch()"
                        />
                    </div>

                    <div class="completed-batch-student-list-filters">
                        <select
                            id="completedStudentStatusFilter"
                            class="completed-batch-student-list-filter"
                            onchange="handleCompletedStudentSearch()"
                        >
                            <option value="">All Status</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="DROPPED">DROPPED</option>
                        </select>

                        <button class="completed-batch-student-clear-btn" onclick="clearCompletedStudentFilters()">Clear</button>
                    </div>
                </div>

                <table class="staff-ongoing-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Purchased Course</th>
                            <th>Joined Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="completedStudentTableBody"></tbody>
                </table>

                <div class="pagination-controls">
                    <button id="completedStudentPrevBtn" onclick="prevCompletedStudentPage()">Previous</button>
                    <span id="completedStudentPageInfo"></span>
                    <button id="completedStudentNextBtn" onclick="nextCompletedStudentPage()">Next</button>
                </div>
            </div>

            <!-- UPDATE CLASS MODAL -->

            <div class="staff-update-class-modal-overlay" id="staffUpdateClassModal">
                <div class="staff-update-class-modal-box">
                    <div class="staff-update-class-modal-header">
                        <h6 style="margin-top : 2%;/* margin: 0; */font-size: 16px;font-weight: 700;color: #111827;">Update Class</h6>
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
        fetchCompletedBatches();
    }

    if (tabName === "students") { 
        content.innerHTML = `
            <div class="student-tab-main-container">
                <div class="student-tab-header">
                    <div>
                        <h4>My Batches</h4>
                    </div>

                    <div class="student-tab-controls">
                        <input
                            type="text"
                            id="studentTabSearchInput"
                            class="student-tab-search"
                            placeholder="Search Class..."
                            onkeyup="handleStudentTabFilterChange()"
                        />
                    </div>

                    <div class="student-tab-filter-section">

                        <select id="studentTabClassFilter" class="student-tab-filter" onchange="handleStudentTabFilterChange()">
                            <option value="">All Classes</option>
                        </select>

                        <select id="studentTabStatusFilter" class="student-tab-filter" onchange="handleStudentTabFilterChange()">
                            <option value="">All Status</option>
                            <option value="OPEN">OPEN</option>
                            <option value="ONGOING">ONGOING</option>
                            <option value="FULL">FULL</option>
                            <option value="COMPLETED">COMPLETED</option>
                        </select>

                        <button class="staff-ongoing-clear-btn" onclick="clearStudentTabFilters()">Clear</button>
                    </div>
                </div>

                <table class="staff-ongoing-table">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Timing</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Students</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody id="studentTabTableBody">
                        <tr>
                            <td colspan="6">Loading...</td>
                        </tr>
                    </tbody>
                </table>

                <div class="pagination-controls">
                    <button id="studentTabPrevBtn" onclick="prevStudentTabPage()">Previous</button>
                    <span id="studentTabPageInfo"></span>
                    <button id="studentTabNextBtn" onclick="nextStudentTabPage()">Next</button>
                </div>
            </div>

            <!-- STUDENTS TAB STUDENT LIST -->

            <div class="student-tab-student-list-container" id="studentTabStudentContainer" style="display: none">
                <div class="student-tab-student-header">
                    <div>
                        <h4 id="studentTabDynamicTitle">Students</h4>
                    </div>

                    <div class="student-tab-student-controls">
                        <input
                            type="text"
                            id="studentTabStudentSearchInput"
                            class="student-tab-search"
                            placeholder="Search Student..."
                            onkeyup="handleStudentTabStudentFilter()"
                        />
                    </div>

                    <div class="student-tab-student-filter-section">
                        <select
                            id="studentTabStudentStatusFilter"
                            class="student-tab-filter"
                            onchange="handleStudentTabStudentFilter()"
                        >
                            <option value="">All Status</option>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="DROPPED">DROPPED</option>
                        </select>

                        <button class="staff-ongoing-clear-btn" onclick="clearStudentTabStudentFilters()">Clear</button>
                    </div>
                </div>

                <table class="staff-ongoing-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Purchased Course</th>
                            <th>Joined Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody id="studentTabStudentTableBody"></tbody>
                </table>

                <div class="pagination-controls">
                    <button id="studentTabStudentPrevBtn" onclick="prevStudentTabStudentPage()">Previous</button>
                    <span id="studentTabStudentPageInfo"></span>
                    <button id="studentTabStudentNextBtn" onclick="nextStudentTabStudentPage()">Next</button>
                </div>
            </div>

            <!-- UPDATE CLASS STATUS MODAL --> 
            
            <div class="student-tab-update-class-modal-overlay" id="studentTabUpdateClassModal" style="display: none;">
                <div class="student-tab-update-class-modal-box">
                    <div class="student-tab-update-class-modal-header">
                        <h6 style="margin-top : 2%;/* margin: 0; */font-size: 16px;font-weight: 700;color: #111827;">Update Class</h6>
                        <span class="student-tab-update-class-close-btn" onclick="closeStudentTabUpdateClassModal()"> × </span>
                    </div>

                    <div class="student-tab-update-class-modal-body">
                        <!-- HIDDEN FIELDS -->

                        <input type="hidden" id="studentTabUpdateClassId" />
                        <input type="hidden" id="studentTabUpdateClassTime" />
                        <input type="hidden" id="studentTabUpdateClassStartDate" />
                        <input type="hidden" id="studentTabUpdateStudentLimit" />

                        <!-- CLASS NAME -->

                        <div class="student-tab-update-class-modal-notification-form-row">
                            <label> Class Name </label>
                            <input type="text" id="studentTabUpdateClassName" disabled style="cursor: not-allowed" />
                        </div>

                        <!-- CURRENT TIMING -->

                        <div class="student-tab-update-class-modal-notification-form-row">
                            <label> Timing </label>
                            <input type="text" id="studentTabUpdateDisplayTiming" disabled style="cursor: not-allowed" />
                        </div>

                        <!-- START DATE -->

                        <div class="student-tab-update-class-modal-notification-form-row">
                            <label> Start Date </label>
                            <input type="text" id="studentTabUpdateDisplayStartDate" disabled style="cursor: not-allowed" />
                        </div>

                        <!-- STUDENT LIMIT -->

                        <div class="student-tab-update-class-modal-notification-form-row">
                            <label> Student Limit </label>
                            <input type="text" id="studentTabUpdateDisplayStudentLimit" disabled style="cursor: not-allowed" />
                        </div>

                        <!-- STATUS -->

                        <div class="student-tab-update-class-modal-notification-form-row">
                            <label> Class Status </label>

                            <select id="studentTabUpdateClassStatus">
                                <option value="OPEN">OPEN</option>
                                <option value="ONGOING">ONGOING</option>
                                <option value="FULL">FULL</option>
                                <option value="COMPLETED">COMPLETED</option>
                            </select>
                        </div>
                    </div>

                    <div class="student-tab-update-class-modal-modal-footer">
                        <button class="student-tab-update-class-modal-create-btn" onclick="updateStudentTabClassStatus()">
                            Update Class
                        </button>
                    </div>
                </div>
            </div>

            <!-- UPDATE STUDENT STATUS MODAL -->
            <div class="update-student-status-overlay" id="studentTabUpdateStudentModal" style="display: none">
                <div class="update-student-status-modal-box">
                    <div class="update-student-status-header">
                        <h6 style="margin-top : 2%;/* margin: 0; */font-size: 16px;font-weight: 700;color: #111827;">Update Student Status</h6>
                        <span class="update-student-status-close-btn" onclick="closeStudentTabUpdateStudentModal()"> × </span>
                    </div>

                    <div class="update-student-status-body">
                        <input type="hidden" id="studentTabUpdateEnrollmentId" />
                        <div class="update-student-status-form-row">
                            <label> Student Name </label>
                            <input type="text" id="studentTabUpdateStudentName" disabled style="cursor: not-allowed" />
                        </div>

                        <div class="update-student-status-form-row">
                            <label> Enrollment Status </label>
                            <select id="studentTabUpdateStudentStatus">
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="DROPPED">DROPPED</option>
                            </select>
                        </div>
                    </div>

                    <div class="update-student-status-footer">
                        <button class="update-student-status-btn" onclick="updateStudentTabStudentStatus()">Update Status</button>
                    </div>
                </div>
            </div>

        `; 
        fetchStudentTabBatches(); 
        loadStudentTabClasses(); 
    }

    if (tabName === "attendance") {
        content.innerHTML = `
            <!-- ATTENDANCE TAB BATCH DISPLAY -->
            <div class="staff-attendance-tab-container">
                <div class="staff-attendance-tab-header">
                    <h4>Attendance Report</h4>
                    <input
                        type="text"
                        id="attendanceTabSearchInput"
                        placeholder="Search Batch"
                        onkeyup="handleAttendanceTabFilter()"
                        class="attendanceTabSearchInput"
                    />
                </div>

                <table class="staff-attendance-tab-table">
                    <thead>
                        <tr>
                            <th>Class Name</th>
                            <th>Timing</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Class Status</th>
                            <th>Students</th>
                            <th>Count Days</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody id="attendanceReportTableBody">
                        <tr>
                            <td colspan="8">Loading Attendance...</td>
                        </tr>
                    </tbody>
                </table>

                <div class="attendance-tab-pagination-controls">
                    <button id="attendanceTabPrevBtn" onclick="prevAttendanceTabPage()">Previous</button>
                    <span id="attendanceTabPageInfo"></span>
                    <button id="attendanceTabNextBtn" onclick="nextAttendanceTabPage()">Next</button>
                </div>
            </div>

            <!-- SHOWING ATTENDANCE TAB MODAL -->

            <div class="attendance-tab-attendance-modal-overlay" id="attendanceTabAttendanceModal">
                <div class="attendance-tab-attendance-modal-box">
                    <div class="attendance-tab-attendance-header">
                        <h4 id="attendanceTabAttendanceTitle">
                            Attendance
                        </h4>

                        <span onclick="closeAttendanceTabAttendanceModal()">
                            ×
                        </span>
                    </div>

                    <div class="attendance-tab-attendance-topbar">
                        <input type="text" id="attendanceTabUpdateSearchInput" placeholder="Search Student" onkeyup="filterAttendanceTabStudents()"/>

                        <input type="date" id="attendanceTabDate" disabled style="cursor: not-allowed; background: #f5f5f5"/>

                        <button class="attendance-tab-attendance-save-btn" onclick="saveAttendanceTab()">
                            Save Attendance
                        </button>
                    </div>

                    <div class="attendance-tab-attendance-table-wrapper">
                        <table class="attendance-tab-attendance-table">
                            <thead>
                                <tr>
                                    <th>Present</th>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Joined Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody id="attendanceTabTableBody"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ATTENDANCE TAB HISTORY MODAL -->

            <div class="attendance-tab-history-overlay" id="attendanceTabHistoryModal">
                <div class="attendance-tab-history-box">
                    <div class="attendance-tab-history-header">
                        <div class="attendance-tab-history-header-left">
                            <h4 id="attendanceTabHistoryTitle">
                                Attendance History
                            </h4>
                        </div>

                        <div class="attendance-tab-history-header-right">
                            <select
                                id="attendanceTabHistoryDateFilter"
                                class="attendance-tab-history-date-filter"
                                onchange="filterAttendanceTabHistoryByDate()"
                            >
                                <option value="">
                                    Select Attendance Date
                                </option>
                            </select>
                            <button class="attendance-tab-history-clear-btn" onclick="clearAttendanceTabHistoryDateFilter()">Clear</button>
                        </div>

                        <span onclick="closeAttendanceTabHistoryModal()">×</span>
                    </div>

                    <div class="attendance-tab-history-table-wrapper">
                        <table class="attendance-tab-history-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Present</th>
                                    <th>Absent</th>
                                    <th>Present %</th>
                                    <th>Absent %</th>
                                    <th>Count Days</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody id="attendanceTabHistoryTableBody"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ATTENDANCE TAB VIEW MODAL -->

            <div class="attendance-tab-view-overlay" id="attendanceTabViewModal">
                <div class="attendance-tab-view-box">
                    <div class="attendance-tab-view-header">
                        <div class="attendance-tab-view-header-left">
                            <h4 id="attendanceTabViewTitle">
                                Attendance View
                            </h4>
                        </div>

                        <div class="attendance-tab-view-header-right">
                            <input
                                type="text"
                                id="attendanceTabViewSearchInput"
                                placeholder="Search Student ID / Name"
                                onkeyup="handleAttendanceTabViewFilter()"
                                class="attendance-tab-view-search"
                            />
                        </div>

                        <span onclick="closeAttendanceTabViewModal()">×</span>
                    </div>

                    <div class="attendance-tab-view-table-wrapper">
                        <table class="attendance-tab-view-table">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Attendance</th>
                                </tr>
                            </thead>

                            <tbody id="attendanceTabViewTableBody"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `; 
        fetchAttendanceTabBatches();
    }

    if (tabName === "noticeboard") { 
        content.innerHTML = `
            <div class="staff-notification-container">
                <div class="staff-notification-header">
                    <div>
                        <h4>Notifications Feed</h4>
                    </div>

                    <div>
                        <input
                            type="text"
                            id="staffNotificationSearch"
                            class="staff-notification-search"
                            placeholder="Search notifications..."
                            onkeyup="handleStaffNotificationSearch()"
                        />
                    </div>
                </div>

                <div id="staffNotificationFeed" class="staff-notification-feed"><p>Loading notifications...</p></div>

                <div class="notification-tab-pagination-controls">
                    <button id="staffNotificationPrevBtn" onclick="prevStaffNotificationPage()">Previous</button>
                    <span id="staffNotificationPageInfo"></span>
                    <button id="staffNotificationNextBtn" onclick="nextStaffNotificationPage()">Next</button>
                </div>
            </div>
        `; 
        fetchStaffNotifications(); 
    }

    if (tabName === "leaveRequest") { 
        content.innerHTML = `
            <div class="staff-leave-request-main-container">
                <!-- TOP FORM -->

                <div class="staff-leave-request-form-container">
                    <div class="staff-leave-request-inner-card">
                        <div class="staff-leave-request-header">
                            <h3>Leave Request Form</h3>

                            <p>Submit your leave request</p>
                        </div>

                        <div class="staff-leave-request-compact-grid">
                            <!-- LEAVE TYPE -->

                            <div class="staff-leave-request-field">
                                <label> Leave Type </label>

                                <select id="staffLeaveType" class="staff-leave-request-input">
                                    <option value="">Select Type</option>
                                    <option value="SICK">Sick</option>
                                    <option value="CASUAL">Casual</option>
                                    <option value="PERSONAL">Personal</option>
                                    <option value="EMERGENCY">Emergency</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            <!-- START DATE -->

                            <div class="staff-leave-request-field">
                                <label> Start Date </label>

                                <input
                                    type="date"
                                    id="staffLeaveStartDate"
                                    class="staff-leave-request-input"
                                    min="${new Date().toISOString().split('T')[0]}"
                                    onchange="calculateLeaveDays()"
                                />
                            </div>

                            <!-- END DATE -->

                            <div class="staff-leave-request-field">
                                <label> End Date </label>

                                <input
                                    type="date"
                                    id="staffLeaveEndDate"
                                    class="staff-leave-request-input"
                                    min="${new Date().toISOString().split('T')[0]}"
                                    onchange="calculateLeaveDays()"
                                />
                            </div>

                            <!-- TOTAL DAYS -->

                            <div class="staff-leave-request-field">
                                <label> Total Days </label>

                                <input type="text" id="staffLeaveTotalDays" class="staff-leave-request-input" value="-" readonly />
                            </div>

                            <!-- BUTTON -->

                            <div class="staff-leave-request-btn-wrapper">
                                <button class="staff-leave-request-submit-btn" onclick="submitStaffLeaveRequest()">
                                    Submit Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- UPCOMING + HISTORY -->

                <div class="staff-leave-history-main-container">
                    <!-- UPCOMING -->

                    <div class="staff-leave-history-container">
                        <div class="staff-leave-history-header">
                            <h3>Upcoming Leave Requests</h3>

                            <div class="staff-leave-history-tools">
                                <input
                                    type="text"
                                    id="staffUpcomingLeaveSearch"
                                    placeholder="Search Start Date"
                                    onkeyup="filterStaffUpcomingLeaves()"
                                    class="staff-leave-history-search"
                                />

                                <select
                                    id="staffUpcomingLeaveTypeFilter"
                                    onchange="filterStaffUpcomingLeaves()"
                                    class="staff-leave-upcoming-history-filter"
                                >
                                    <option value="">All Types</option>
                                    <option value="SICK">Sick</option>
                                    <option value="CASUAL">Casual</option>
                                    <option value="PERSONAL">Personal</option>
                                    <option value="EMERGENCY">Emergency</option>
                                    <option value="OTHER">Other</option>
                                </select>

                                <button class="staff-upcoming-leave-history-clear-btn" onclick="clearUpcomingLeaveFilters()">Clear</button>
                            </div>
                        </div>

                        <div class="staff-leave-history-scroll-wrapper">
                            <table class="staff-leave-history-table">
                                <thead>
                                    <tr>
                                        <th>Applied</th>
                                        <th>Type</th>
                                        <th>Start</th>
                                        <th>End</th>
                                        <th>Days</th>
                                        <th>Status</th>
                                        <th>Approved By</th>
                                    </tr>
                                </thead>

                                <tbody id="staffUpcomingLeaveTableBody"></tbody>
                            </table>

                            <div class="staff-leave-upcoming-pagination-container">
                                <button id="staffUpcomingLeavePrevBtn" onclick="changeStaffUpcomingLeavePage(-1)" class="staff-leave-pagination-btn">Prev</button>
                                <span id="staffUpcomingLeavePageInfo"></span>
                                <button id="staffUpcomingLeaveNextBtn" onclick="changeStaffUpcomingLeavePage(1)" class="staff-leave-pagination-btn">Next</button>
                            </div>
                        </div>
                    </div>

                    <!-- HISTORY -->

                    <div class="staff-leave-history-container">
                        <div class="staff-leave-history-header">
                            <h3>Leave History</h3>

                            <div class="staff-leave-history-tools">
                                <input
                                    type="text"
                                    id="staffLeaveHistorySearch"
                                    placeholder="Search Start Date"
                                    onkeyup="filterStaffLeaveHistory()"
                                    class="staff-leave-history-search"
                                />

                                <select
                                    id="staffLeaveHistoryTypeFilter"
                                    onchange="filterStaffLeaveHistory()"
                                    class="staff-leave-history-filter"
                                >
                                    <option value="">All Types</option>
                                    <option value="SICK">Sick</option>
                                    <option value="CASUAL">Casual</option>
                                    <option value="PERSONAL">Personal</option>
                                    <option value="EMERGENCY">Emergency</option>
                                    <option value="OTHER">Other</option>
                                </select>

                                <button class="staff-leave-history-clear-btn" onclick="clearLeaveHistoryFilters()">Clear</button>
                            </div>
                        </div>

                        <div class="staff-leave-history-scroll-wrapper">
                            <table class="staff-leave-history-table">
                                <thead>
                                    <tr>
                                        <th>Applied</th>
                                        <th>Type</th>
                                        <th>Start</th>
                                        <th>End</th>
                                        <th>Days</th>
                                        <th>Status</th>
                                        <th>Approved By</th>
                                    </tr>
                                </thead>

                                <tbody id="staffLeaveHistoryTableBody"></tbody>
                            </table>

                            <div class="staff-leave-history-pagination-container">
                                <button id="staffLeaveHistoryPrevBtn" onclick="changeStaffHistoryLeavePage(-1)" class="staff-leave-pagination-btn">Prev</button>
                                <span id="staffLeaveHistoryPageInfo"></span>
                                <button id="staffLeaveHistoryNextBtn" onclick="changeStaffHistoryLeavePage(1)" class="staff-leave-pagination-btn">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `; 
        fetchStaffLeaveHistory();
    }

    document.querySelectorAll(".nav-link").forEach((tab) => {
        tab.classList.remove("active");
    });

    if (clickedButton) {
        clickedButton.classList.add("active");
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
    const tbody = document.getElementById("staffBatchTableBody");
    console.log("Ongoing Tab Staff Batches API Result:", result);

    /* TAB NOT ACTIVE */
    if (!tbody) {
        return;
    }

    totalStaffBatchRecords = result.total || 0;
    tbody.innerHTML = "";

    if (!result.data.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="staff-ongoing-empty-row">
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
                <td>${item.count_days}</td>
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

                    <button class="staff-ongoingpage-attendance-btn"
                        style="cursor: ${item.student_count === 0 ? "not-allowed" : "pointer"}; opacity: ${item.student_count === 0 ? "0.6" : "1"};"
                        ${item.student_count === 0 ? "disabled" : ""}
                        onclick='
                            ${item.student_count === 0 ? "" : item.attendance_taken ?
                                `openAttendanceHistoryModal(
                                    "${item.id}",
                                    "${item.class_name}",
                                    "${item.class_time}",
                                    "${item.class_start_date}"
                                )`
                                :
                                `openAttendanceModal(
                                    "${item.id}",
                                    "${item.class_name}",
                                    "${item.class_time}"
                                )`
                            }
                        '
                    >
                        ${item.student_count === 0 ? "No Students" : item.attendance_taken ? "Showing Attendance" : "Take Attendance"}
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
    console.log("Completed Batches API Result:", result);
    const tbody = document.getElementById("completedBatchTableBody");
    tbody.innerHTML = "";

    if (!result.data.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    No Completed Batches Found
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
                <td>${item.class_end_date}</td>
                <td>${item.count_days}</td>
                <td>${item.student_count} / ${item.student_limit}</td>
                <td>
                    <span class="staff-ongoing-status-badge ${item.class_status.toLowerCase()}"> ${item.class_status} </span>
                </td>
                <td>
                    <button
                        class="student-list-btn"
                        onclick='showCompletedStudentList(
                            "${item.id}",
                            "${item.class_name}",
                            "${item.class_time}"
                        )'
                    >
                        Students
                    </button>

                    <button
                        class="staff-update-class-btn"
                        onclick='openUpdateClassModal(
                                "${item.id}",
                                "${item.class_name}",
                                "${item.class_time}",
                                "${item.class_start_date}",
                                "${item.student_limit}",
                                "${item.class_status}"
                        )'
                    >
                        Update
                    </button>
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
                selectedAssignmentId = null;

                currentOngoingStudentPage = 1;

                const ongoingStudentContainer = document.getElementById("ongoingStudentListContainer");

                if (ongoingStudentContainer) {
                    ongoingStudentContainer.style.display = "none";
                }

                const completedStudentContainer = document.getElementById("completedStudentListContainer");

                if (completedStudentContainer) {
                    completedStudentContainer.style.display = "none";
                }

                closeUpdateClassModal();

                /* REFRESH ACTIVE TAB */

                if (document.getElementById("staffBatchTableBody")) {
                    fetchStaffBatches();
                }

                if (document.getElementById("completedBatchTableBody")) {
                    fetchCompletedBatches();
                }
            }
        });
}

function closeUpdateClassModal() {
    document.getElementById("staffUpdateClassModal").style.display = "none";
}

function showOngoingStudentList(assignmentId, className, classTime) {
    const container = document.getElementById("ongoingStudentListContainer");

    /* TOGGLE CLOSE */

    if (selectedAssignmentId == assignmentId && container.style.display === "block") {
        container.style.display = "none";
        selectedAssignmentId = null;
        return;
    }

    selectedAssignmentId = assignmentId;
    selectedBatchTitle = `${className} - ${classTime}`;
    currentOngoingStudentPage = 1;
    document.getElementById("ongoingStudentSearchInput").value = "";
    document.getElementById("ongoingStudentStatusFilter").value = "";
    container.style.display = "block";
    document.getElementById("ongoingStudentDynamicTitle").innerText = `${selectedBatchTitle} Students`;
    fetchOngoingBatchStudents();
}

function fetchOngoingBatchStudents() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const search = document.getElementById("ongoingStudentSearchInput")?.value || "";
    const status = document.getElementById("ongoingStudentStatusFilter")?.value || "";

    fetch(
        `http://127.0.0.1:8000/classes/get_ongoing_batch_students/?page=${currentOngoingStudentPage}&limit=${ongoingStudentLimit}&assignment_id=${selectedAssignmentId}&search=${search}&status=${status}&username=${username}`,
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
    console.log("Ongoing Tab Student List API Result:", result);
    totalOngoingStudentRecords = result.total || 0;
    const tbody = document.getElementById("ongoingStudentTableBody");
    tbody.innerHTML = "";

    if (!result.data || result.data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8">
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
                <td>${item.student_unique_id || "-"}</td>
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

function clearOngoingStudentFilters() {
    document.getElementById("ongoingStudentSearchInput").value = "";
    document.getElementById("ongoingStudentStatusFilter").value = "";
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
    const status = document.getElementById("updateStudentStatus").value;

    /* CONFIRM DROP */

    if (status === "DROPPED") {
        const confirmDrop = confirm("Are you sure you want to mark this student as DROPPED?");
        if (!confirmDrop) {
            return;
        }
    }

    const payload = {
        id: document.getElementById("updateStudentEnrollmentId").value,
        enrollment_status: status
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

function showCompletedStudentList(assignmentId, className, classTime) {
    const container = document.getElementById("completedStudentListContainer");

    /* TOGGLE CLOSE */

    if (selectedCompletedAssignmentId == assignmentId && container.style.display === "block") {
        container.style.display = "none";
        selectedCompletedAssignmentId = null;
        return;
    }

    selectedCompletedAssignmentId = assignmentId;
    selectedCompletedClassTitle = `${className} - ${classTime}`;
    currentCompletedStudentPage = 1;
    document.getElementById("completedStudentSearchInput").value = "";
    document.getElementById("completedStudentStatusFilter").value = "";
    container.style.display = "block";
    document.getElementById("completedStudentDynamicTitle").innerText = `${selectedCompletedClassTitle} Students`;
    fetchCompletedBatchStudents();
}

function fetchCompletedBatchStudents() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const search = document.getElementById("completedStudentSearchInput")?.value || "";
    const status = document.getElementById("completedStudentStatusFilter")?.value || "";

    fetch(
        `http://127.0.0.1:8000/classes/get_completed_batch_students/?page=${currentCompletedStudentPage}&limit=${completedStudentLimit}&assignment_id=${selectedCompletedAssignmentId}&search=${search}&status=${status}&username=${username}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then(renderCompletedStudentList);
}

function renderCompletedStudentList(result) {
    totalCompletedStudentRecords = result.total || 0;
    console.log("Completed Student API Result:", result);
    const tbody = document.getElementById("completedStudentTableBody");
    tbody.innerHTML = "";

    if (!result.data || result.data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    No Students Found
                </td>
            </tr>
        `;
        renderCompletedStudentPagination();
        return;
    }

    result.data.forEach((item) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.student_unique_id || "-"}</td>
                <td>${item.student_name}</td>
                <td>${item.email}</td>
                <td>${item.phone}</td>
                <td>${item.purchased_course}</td>
                <td>${item.joined_date}</td>
                <td>${item.end_date}</td>
                <td>
                    <span class="ongoing-student-status-badge ${item.status.toLowerCase()}">
                        ${item.status}
                    </span>
                </td>
            </tr>
        `;
    });
    renderCompletedStudentPagination();
}

function renderCompletedStudentPagination() {
    const totalPages = Math.ceil(totalCompletedStudentRecords / completedStudentLimit);

    /* NO DATA */

    if (totalCompletedStudentRecords === 0) {
        document.getElementById("completedStudentPageInfo").innerText = "";
        document.getElementById("completedStudentPrevBtn").style.display = "none";
        document.getElementById("completedStudentNextBtn").style.display = "none";
        return;
    }

    /* SHOW PAGINATION */

    document.getElementById("completedStudentPrevBtn").style.display = "inline-block";
    document.getElementById("completedStudentNextBtn").style.display = "inline-block";
    document.getElementById("completedStudentPageInfo").innerText = `Page ${currentCompletedStudentPage} of ${totalPages}`;
    document.getElementById("completedStudentPrevBtn").disabled = currentCompletedStudentPage === 1;
    document.getElementById("completedStudentNextBtn").disabled = currentCompletedStudentPage >= totalPages;
}

function nextCompletedStudentPage() {
    const totalPages = Math.ceil(totalCompletedStudentRecords / completedStudentLimit);

    if (currentCompletedStudentPage < totalPages) {
        currentCompletedStudentPage++;
        fetchCompletedBatchStudents();
    }
}

function prevCompletedStudentPage() {
    if (currentCompletedStudentPage > 1) {
        currentCompletedStudentPage--;
        fetchCompletedBatchStudents();
    }
}

function handleCompletedStudentSearch() {
    currentCompletedStudentPage = 1;
    fetchCompletedBatchStudents();
}

function clearCompletedStudentFilters() {
    document.getElementById("completedStudentSearchInput").value = "";
    document.getElementById("completedStudentStatusFilter").value = "";
    currentCompletedStudentPage = 1;
    fetchCompletedBatchStudents();
}

function fetchStudentTabBatches() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const search = document.getElementById("studentTabSearchInput")?.value || "";
    const className = document.getElementById("studentTabClassFilter")?.value || "";
    const status = document.getElementById("studentTabStatusFilter")?.value || "";

    fetch(
        `http://127.0.0.1:8000/classes/get_student_tab_batches/?page=${currentStudentTabPage}&limit=${studentTabLimit}&search=${search}&class_name=${className}&class_status=${status}&username=${username}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then(renderStudentTabBatches);
}

function renderStudentTabBatches(result) {
    const tbody = document.getElementById("studentTabTableBody");
    if (!tbody) return;
    totalStudentTabRecords = result.total || 0;
    tbody.innerHTML = "";
    console.log("Student Tab Batches API Result:", result);

    if (!result.data || result.data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    No Batches Found
                </td>
            </tr>
        `;

        document.getElementById("studentTabStudentContainer").style.display = "none";
        renderStudentTabPagination();
        return;
    }

    result.data.forEach((item) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.class_name}</td>
                <td>${item.class_time}</td>
                <td>${item.class_start_date}</td>
                <td>${item.class_end_date || "-"}</td>
                <td>${item.student_count}/${item.student_limit}</td>
                <td><span class="staff-ongoing-status-badge ${item.class_status.toLowerCase()}">${item.class_status}</span></td>
                <td class="staff-ongoing-action-buttons">
                    <button class="student-list-btn"
                        onclick='showStudentTabStudents(
                            "${item.id}",
                            "${item.class_name}",
                            "${item.class_time}"
                        )'
                    >
                        Students
                    </button>

                    <button
                        class="staff-update-class-btn"
                        onclick='openStudentTabUpdateClassModal(
                                "${item.id}",
                                "${item.class_name}",
                                "${item.class_time || ""}",
                                "${item.class_start_date || ""}",
                                "${item.student_limit || ""}",
                                "${item.class_status}"
                            )'
                    >
                        Update
                    </button>
                </td>
            </tr>
        `;
    });
    renderStudentTabPagination();
}

function renderStudentTabPagination() {
    const totalPages = Math.ceil(totalStudentTabRecords / studentTabLimit);

    /* NO DATA */

    if (totalStudentTabRecords === 0) {
        document.getElementById("studentTabPageInfo").innerText = "";
        document.getElementById("studentTabPrevBtn").style.display = "none";
        document.getElementById("studentTabNextBtn").style.display = "none";
        return;
    }

    /* SHOW PAGINATION */

    document.getElementById("studentTabPrevBtn").style.display = "inline-block";
    document.getElementById("studentTabNextBtn").style.display = "inline-block";
    document.getElementById("studentTabPageInfo").innerText = `Page ${currentStudentTabPage} of ${totalPages}`;
    document.getElementById("studentTabPrevBtn").disabled = currentStudentTabPage === 1;
    document.getElementById("studentTabNextBtn").disabled = currentStudentTabPage >= totalPages;
}

function nextStudentTabPage() {
    currentStudentTabPage++;
    fetchStudentTabBatches();
}

function prevStudentTabPage() {
    if (currentStudentTabPage > 1) {
        currentStudentTabPage--;
        fetchStudentTabBatches();
    }
}

function handleStudentTabFilterChange() {
    currentStudentTabPage = 1;
    fetchStudentTabBatches();
}

function clearStudentTabFilters() {
    document.getElementById("studentTabSearchInput").value = "";
    document.getElementById("studentTabClassFilter").value = "";
    document.getElementById("studentTabStatusFilter").value = "";
    currentStudentTabPage = 1;
    fetchStudentTabBatches();
}

function loadStudentTabClasses() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    fetch(`http://127.0.0.1:8000/classes/get_student_tab_batches/?username=${username}&page=1&limit=100`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            const select = document.getElementById("studentTabClassFilter");
            if (!select) return;

            /* RESET */

            select.innerHTML = `
                <option value="">
                    All Classes
                </option>
            `;

            const classes = [...new Set((result.data || []).map((item) => item.class_name))];

            classes.forEach((cls) => {
                select.innerHTML += `
                    <option value="${cls}">
                        ${cls}
                    </option>
                `;
            });
        });
}

function showStudentTabStudents(assignmentId, className, classTime) {
    const container = document.getElementById("studentTabStudentContainer");

    /* SAME STUDENT BUTTON CLICK */

    if (selectedStudentTabAssignmentId == assignmentId && container.style.display === "block") {
        container.style.display = "none";
        selectedStudentTabAssignmentId = null;
        return;
    }

    selectedStudentTabAssignmentId = assignmentId;
    selectedStudentTabTitle = `${className} - ${classTime}`;
    currentStudentTabStudentPage = 1;
    document.getElementById("studentTabStudentSearchInput").value = "";
    document.getElementById("studentTabStudentStatusFilter").value = "";
    container.style.display = "block";
    document.getElementById("studentTabDynamicTitle").innerText = `${selectedStudentTabTitle} Students`;
    fetchStudentTabStudents();
}

function fetchStudentTabStudents() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const search = document.getElementById("studentTabStudentSearchInput")?.value || "";
    const status = document.getElementById("studentTabStudentStatusFilter")?.value || "";

    fetch(
        `http://127.0.0.1:8000/classes/get_student_tab_students/?page=${currentStudentTabStudentPage}&limit=${studentTabStudentLimit}&assignment_id=${selectedStudentTabAssignmentId}&search=${search}&status=${status}&username=${username}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then(renderStudentTabStudents);
}

function renderStudentTabStudents(result) {
    const tbody = document.getElementById("studentTabStudentTableBody");
    tbody.innerHTML = "";
    totalStudentTabStudentRecords = result.total || 0;
    console.log("Student Tab Students API Result:", result);

    if (!result.data || result.data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    No Students Found
                </td>
            </tr>
        `;
        renderStudentTabStudentPagination();
        return;
    }

    result.data.forEach((item) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.student_unique_id || "-"}</td>
                <td>${item.student_name}</td>
                <td>${item.email}</td>
                <td>${item.phone}</td>
                <td>${item.purchased_course}</td>
                <td>${item.joined_date}</td>
                <td><span class="ongoing-student-status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
            </tr>
        `;
    });
    renderStudentTabStudentPagination();
}

function renderStudentTabStudentPagination() {
    const totalPages = Math.ceil(totalStudentTabStudentRecords / studentTabStudentLimit);

    /* NO DATA */

    if (totalStudentTabStudentRecords === 0) {
        document.getElementById("studentTabStudentPageInfo").innerText = "";
        document.getElementById("studentTabStudentPrevBtn").style.display = "none";
        document.getElementById("studentTabStudentNextBtn").style.display = "none";
        return;
    }

    /* SHOW PAGINATION */

    document.getElementById("studentTabStudentPrevBtn").style.display = "inline-block";
    document.getElementById("studentTabStudentNextBtn").style.display = "inline-block";
    document.getElementById("studentTabStudentPageInfo").innerText = `Page ${currentStudentTabStudentPage} of ${totalPages}`;
    document.getElementById("studentTabStudentPrevBtn").disabled = currentStudentTabStudentPage === 1;
    document.getElementById("studentTabStudentNextBtn").disabled = currentStudentTabStudentPage >= totalPages;
}

function nextStudentTabStudentPage() {
    const totalPages = Math.ceil(totalStudentTabStudentRecords / studentTabStudentLimit);

    if (currentStudentTabStudentPage < totalPages) {
        currentStudentTabStudentPage++;
        fetchStudentTabStudents();
    }
}

function prevStudentTabStudentPage() {
    if (currentStudentTabStudentPage > 1) {
        currentStudentTabStudentPage--;
        fetchStudentTabStudents();
    }
}

function handleStudentTabStudentFilter() {
    currentStudentTabStudentPage = 1;
    fetchStudentTabStudents();
}

function clearStudentTabStudentFilters() {
    document.getElementById("studentTabStudentSearchInput").value = "";
    document.getElementById("studentTabStudentStatusFilter").value = "";
    currentStudentTabStudentPage = 1;
    fetchStudentTabStudents();
}

function openStudentTabUpdateClassModal(id, className, classTime, startDate, studentLimit, status) {
    document.getElementById("studentTabUpdateClassId").value = id || "";
    document.getElementById("studentTabUpdateClassName").value = className || "";
    document.getElementById("studentTabUpdateClassTime").value = classTime || "";
    document.getElementById("studentTabUpdateClassStartDate").value = startDate || "";
    document.getElementById("studentTabUpdateStudentLimit").value = studentLimit || "";
    document.getElementById("studentTabUpdateDisplayTiming").value = classTime || "-";
    document.getElementById("studentTabUpdateDisplayStartDate").value = startDate || "-";
    document.getElementById("studentTabUpdateDisplayStudentLimit").value = studentLimit || "-";
    document.getElementById("studentTabUpdateClassStatus").value = status || "OPEN";
    document.getElementById("studentTabUpdateClassModal").style.display = "flex";
}

function closeStudentTabUpdateClassModal() {
    document.getElementById("studentTabUpdateClassModal").style.display = "none";
}

function updateStudentTabClassStatus() {
    const token = localStorage.getItem("access_token");

    fetch("http://127.0.0.1:8000/classes/update_assignment_timing/", {
        method: "PUT",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
            id: document.getElementById("studentTabUpdateClassId").value,
            class_time: document.getElementById("studentTabUpdateClassTime").value,
            class_start_date: document.getElementById("studentTabUpdateClassStartDate").value,
            student_limit: document.getElementById("studentTabUpdateStudentLimit").value,
            class_status: document.getElementById("studentTabUpdateClassStatus").value,
        }),
    })
        .then((res) => res.json())
        .then((result) => {
            if (result.status === "Success") {
                closeStudentTabUpdateClassModal();
                fetchStudentTabBatches();
                document.getElementById("studentTabStudentContainer").style.display = "none";
            }
            alert(result.message);
        });
}

function openStudentTabUpdateStudentModal(id, studentName, status) {
    document.getElementById("studentTabUpdateEnrollmentId").value = id;
    document.getElementById("studentTabUpdateStudentName").value = studentName;
    document.getElementById("studentTabUpdateStudentStatus").value = status;
    document.getElementById("studentTabUpdateStudentModal").style.display = "flex";
}

function closeStudentTabUpdateStudentModal() {
    document.getElementById("studentTabUpdateStudentModal").style.display = "none";
}

function updateStudentTabStudentStatus() {
    const token = localStorage.getItem("access_token");
    const status = document.getElementById("studentTabUpdateStudentStatus").value;

    /* CONFIRM DROP */
    if (status === "DROPPED") {
        const confirmDrop = confirm("Are you sure you want to mark this student as DROPPED?");
        if (!confirmDrop) {
            return;
        }
    }

    fetch("http://127.0.0.1:8000/classes/update_student_enrollment_status/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
            id: document.getElementById("studentTabUpdateEnrollmentId").value,
            enrollment_status: document.getElementById("studentTabUpdateStudentStatus").value,
        }),
    })
        .then((res) => res.json())
        .then((result) => {
            alert(result.message);
            if (result.status === "Success") {
                closeStudentTabUpdateStudentModal();
                fetchStudentTabStudents();
            }
        });
}

function fetchStaffNotifications() {
    const token = localStorage.getItem("access_token");
    const search = document.getElementById("staffNotificationSearch")?.value || "";

    fetch(
        `http://127.0.0.1:8000/notifications/get_notifications/?search=${search}&category=&page=${currentStaffNotificationPage}&limit=${staffNotificationLimit}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
	)
    .then((res) => res.json())
    .then((result) => {
        console.log("Staff Notification Result:", result);
		const container = document.getElementById("staffNotificationFeed");

        /* SAFE GUARD */
        if (!container) {
            return;
        }

        container.innerHTML = "";
        totalStaffNotificationRecords = result.total || 0;

        /* ERROR */

        if (result.status === "Error") {
            alert(result.message);
            return;
        }

        /* NO DATA */

        if ( !result.data || result.data.length === 0 ) { 
            container.innerHTML = `
                <p class="staff-notification-empty">No Notifications Found</p>
            `; 
            renderStaffNotificationPagination(); 
            return; 
        }

        const currentUser = localStorage.getItem("username");

        /* RENDER DATA */

        result.data.forEach((item) => {
                container.innerHTML += `
                    <div class="staff-notification-card ${item.priority === "Important" ? "staff-important-notification" : ""}">
                        <!-- HEADER -->

                        <div class="staff-notification-header-card">
                            <div class="staff-notification-user">
                                <div class="staff-notification-avatar">${ item.posted_by ? item.posted_by.charAt(0) : "A" }</div>
                                <div class="staff-notification-user-info">
                                    <h4>
                                        ${item.posted_by}
                                        <span class="staff-admin-label"> Admin </span>
                                    </h4>
                                    <p>${item.category}</p>
                                </div>
                            </div>
                            <span class="staff-priority-badge"> ${item.priority} </span>
                        </div>

                        <!-- CONTENT -->

                        <div class="staff-notification-content-wrapper">
                            <p class="staff-notification-content collapsed" id="staff-content-${item.id}">${item.content}</p>

                            ${ item.content && item.content.length > 90 ? `
                                <span
                                    class="staff-show-more-btn"
                                    id="staff-show-btn-${item.id}"
                                    onclick="toggleStaffNotificationContent(
                                        ${item.id}
                                    )"
                                    style="display:none;"
                                >
                                    Show More
                                </span>` : "" 
                            }
                        </div>

                        <!-- FOOTER -->

                        <div class="staff-notification-footer">
                            <div class="staff-notification-footer-left">
                                <span> ${new Date( item.created_at ).toLocaleString()} </span>
                                ${ item.edited ? `<span class="staff-edited-label"> Edited </span>` : "" }
                            </div>
                        </div>
                    </div>
                `;
        });
        renderStaffNotificationPagination();
    })
    .catch((error) => {
        console.error("Staff Notification Error:",error);
    });
}

function renderStaffNotificationPagination() {
    const pageInfo = document.getElementById("staffNotificationPageInfo");
    if (!pageInfo) return;
    const totalPages = Math.ceil(totalStaffNotificationRecords / staffNotificationLimit);

    if (totalStaffNotificationRecords === 0) {
        document.getElementById("staffNotificationPageInfo").innerText = "";
        document.getElementById("staffNotificationPrevBtn").style.display = "none";
        document.getElementById("staffNotificationNextBtn").style.display = "none";
        return;
    }

    document.getElementById("staffNotificationPrevBtn").style.display = "inline-block";
    document.getElementById("staffNotificationNextBtn").style.display = "inline-block";
    document.getElementById("staffNotificationPageInfo").innerText =`Page ${currentStaffNotificationPage} of ${totalPages}`;
    document.getElementById("staffNotificationPrevBtn").disabled = currentStaffNotificationPage === 1;
    document.getElementById("staffNotificationNextBtn").disabled = currentStaffNotificationPage >= totalPages;

    setTimeout(() => {
        document.querySelectorAll(".staff-notification-content").forEach((content) => {
            const id = content.id.replace("staff-content-", "");
            const button = document.getElementById(`staff-show-btn-${id}`);

            /* IF CONTENT > 2 LINES */

            if (content.scrollHeight > content.clientHeight + 5) {
                button.style.display = "inline-block";
            }
        });
    }, 50);
}

function nextStaffNotificationPage() {
    const totalPages = Math.ceil(totalStaffNotificationRecords / staffNotificationLimit);

    if (currentStaffNotificationPage < totalPages) {
        currentStaffNotificationPage++;
        fetchStaffNotifications();
    }
}

function prevStaffNotificationPage() {
    if (currentStaffNotificationPage > 1) {
        currentStaffNotificationPage--;
        fetchStaffNotifications();
    }
}

function handleStaffNotificationSearch() {
    currentStaffNotificationPage = 1;
    fetchStaffNotifications();
}

function toggleStaffNotificationContent(id) {
    const content = document.getElementById(`staff-content-${id}`);
    const button = document.querySelector(`[onclick="toggleStaffNotificationContent(${id})"]`);

    if (content.classList.contains("collapsed")) {
        content.classList.remove("collapsed");
        button.innerText = "Show Less";
    } else {
        content.classList.add("collapsed");
        button.innerText = "Show More";
    }
}

function openAttendanceModal(assignmentId, className, classTime) {
    selectedAttendanceAssignmentId = assignmentId;
    selectedAttendanceClassTitle = `${className} - ${classTime}`;
    document.getElementById("ongoingAttendanceTitle").innerText = `${selectedAttendanceClassTitle} Attendance`;

    /* TODAY DEFAULT */

    const today = new Date().toISOString().split("T")[0];
    document.getElementById("attendanceDate").value = today;
    document.getElementById("ongoingAttendanceModal").style.display = "flex";
    fetchAttendanceStudents();
}

function closeAttendanceModal() {
    document.getElementById("ongoingAttendanceModal").style.display = "none";
    document.getElementById("attendanceSearchInput").value = "";
    document.getElementById("attendanceTableBody").innerHTML = "";
    attendanceState = {};

    /* REOPEN HISTORY */

    if (isAttendanceUpdate) {
        document.getElementById("attendanceHistoryModal").style.display = "flex";
    }

    isAttendanceUpdate = false;
    selectedUpdateDate = null;
    document.querySelector(".ongoingtab-attendance-save-btn").innerText = "Save Attendance";

    if (
        document.getElementById("attendanceTabHistoryModal") &&
        document.getElementById("attendanceTabHistoryModal").style.display === "none"
    ) {
        document.getElementById("attendanceTabHistoryModal").style.display = "flex";
        fetchAttendanceTabHistory();
    }
}

function fetchAttendanceStudents(isAttendanceTab = false) {
    const token = localStorage.getItem("access_token");

    const username = localStorage.getItem("username");

    const attendanceDate = isAttendanceUpdate
        ? selectedUpdateDate
        : document.getElementById(isAttendanceTab ? "attendanceTabDate" : "attendanceDate").value;

    fetch(
        `http://127.0.0.1:8000/classes/get_ongoing_batch_students/?assignment_id=${selectedAttendanceAssignmentId}&username=${username}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then((result) => {
            attendanceStudents = result.data || [];

            /* UPDATE MODE */

            if (isAttendanceUpdate) {
                fetch(
                    `http://127.0.0.1:8000/classes/get_attendance_day_details/?assignment_id=${selectedAttendanceAssignmentId}&attendance_date=${attendanceDate}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                    .then((res) => res.json())
                    .then((attendanceResult) => {
                        console.log("Attendance Update Student Details API Result:", attendanceResult);
                        attendanceState = {};

                        if (attendanceResult.status === "Success" && attendanceResult.data) {
                            attendanceResult.data.forEach((item) => {
                                attendanceState[item.student_enrollment_id] = item.attendance_status === "PRESENT";
                            });
                        }

                        renderAttendanceStudents(attendanceStudents, isAttendanceTab);
                    });
            } else {
                renderAttendanceStudents(attendanceStudents, isAttendanceTab);
            }
        });
}

function filterAttendanceTabStudents() {
    const search = document.getElementById("attendanceTabUpdateSearchInput").value.trim().toLowerCase();

    /* EMPTY SEARCH */

    if (!search) {
        renderAttendanceStudents(attendanceStudents, true);
        return;
    }

    const filteredStudents = attendanceStudents.filter(
        (item) =>
            (item.student_unique_id && item.student_unique_id.toLowerCase().includes(search)) ||
            (item.student_name && item.student_name.toLowerCase().includes(search)) ||
            (item.email && item.email.toLowerCase().includes(search))
    );

    renderAttendanceStudents(filteredStudents, true);
}

function renderAttendanceStudents(students = attendanceStudents, isAttendanceTab = false) {
    const tbody = document.getElementById(isAttendanceTab ? "attendanceTabTableBody" : "attendanceTableBody");
    const searchInput = document.getElementById(isAttendanceTab ? "attendanceTabSearchInput" : "attendanceSearchInput");
    tbody.innerHTML = "";

    if (students.length === 0) {
        tbody.innerHTML = `
            <tr class="ongoingtab-update-attendance-empty-row">
                <td colspan="7">
                    <div class="ongoingtab-update-attendance-empty-state">Student not found</div>
                </td>
            </tr>
        `;
        return;
    }

    students.forEach((item) => {
        const isDropped = item.status === "DROPPED";

        /* KEEP STATE */

        if (attendanceState[item.id] === undefined) {
            attendanceState[item.id] = !isDropped;
        }

        tbody.innerHTML += `
                <tr>
                    <td>
                        <input
                            type="checkbox"
                            class="ongoingtab-attendance-checkbox"
                            data-id="${item.id}"
                            ${attendanceState[item.id] ? "checked" : ""}
                            ${isDropped ? "disabled" : ""}
                            onchange="updateAttendanceState('${item.id}',this.checked)"
                        />
                    </td>
                    <td>${item.student_unique_id || "-"}</td>
                    <td>${item.student_name}</td>
                    <td>${item.email}</td>
                    <td>${item.phone}</td>
                    <td>${item.joined_date}</td>
                    <td>${item.status}</td>
                </tr>
            `;
    });
}

function updateAttendanceState(id, checked) {
    attendanceState[id] = checked;
}

function filterAttendanceStudents() {
    const search = document.getElementById("attendanceSearchInput").value.trim().toLowerCase();

    /* EMPTY SEARCH */

    if (!search) {
        renderAttendanceStudents(attendanceStudents);
        return;
    }

    const filteredData = attendanceStudents.filter(
        (item) => item.student_name.toLowerCase().includes(search) || item.email.toLowerCase().includes(search)
    );

    /* NO RESULT */

    if (filteredData.length === 0) {
        document.getElementById("attendanceTableBody").innerHTML = `
            <tr class="ongoingtab-update-attendance-empty-row">
                <td colspan="7">
                    <div class="ongoingtab-update-attendance-empty-state">Student not found</div>
                </td>
            </tr>
        `;
        return;
    }
    renderAttendanceStudents(filteredData);
}

function saveAttendance() {
    const token = localStorage.getItem("access_token");
    const attendanceDate = document.getElementById("attendanceDate").value;
    const checkboxes = document.querySelectorAll(".ongoingtab-attendance-checkbox");
    const attendance = [];

    checkboxes.forEach((checkbox) => {
        attendance.push({
            student_enrollment_id: checkbox.dataset.id,
            attendance_status: checkbox.disabled ? "ABSENT" : checkbox.checked ? "PRESENT" : "ABSENT",
        });
    });

    fetch("http://127.0.0.1:8000/classes/save_student_attendance/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
            assignment_id: selectedAttendanceAssignmentId,
            attendance_date: attendanceDate,
            attendance,
        }),
    })
        .then((res) => res.json())
        .then((result) => {
            alert(result.message);
            console.log("Save Attendance API Result:", result);
            if (result.status === "Success") {
                    /* UPDATE MODE */
                if (isAttendanceUpdate) {
                    closeAttendanceModal();
                    fetchAttendanceHistory();
                } else {
                    closeAttendanceModal();
                    /* REFRESH ONGOING TABLE */
                    fetchStaffBatches();
                }
            }
        });
}

function openAttendanceHistoryModal(assignmentId, className, classTime, classStartDate) {
    selectedAttendanceHistoryId = assignmentId;
    document.getElementById("attendanceHistoryTitle").innerText = `${className} - ${classTime} - Attendance`;
    document.getElementById("attendanceHistoryModal").style.display = "flex";
    const dateInput = document.getElementById("ongoingAttendanceHistoryDateFilter");

    if (dateInput) {
        dateInput.value = "";
        /* ENABLE ONLY CLASS START TO TODAY */

        dateInput.min = classStartDate;
        dateInput.max = new Date().toISOString().split("T")[0];
    }

    fetchAttendanceHistory();
}

function closeAttendanceHistoryModal() {
    document.getElementById("attendanceHistoryModal").style.display = "none";
    document.getElementById("attendanceHistoryTableBody").innerHTML = "";
    document.getElementById("ongoingAttendanceHistoryDateFilter").value = "";
}

function fetchAttendanceHistory() {
    const token = localStorage.getItem("access_token");

    fetch(`http://127.0.0.1:8000/classes/get_attendance_history/?assignment_id=${selectedAttendanceHistoryId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            console.log("Ongoing Tab Particular Batch Attendance History API Result:", result);
            originalOngoingAttendanceHistoryData = result.data || [];
            renderAttendanceHistory(originalOngoingAttendanceHistoryData);
        });
}

function handleOngoingAttendanceHistoryFilter() {
    const input = document.getElementById("ongoingAttendanceHistoryDateFilter");
    const selectedDate = input.value;
    const minDate = input.min;
    const maxDate = input.max;

    /* SAFETY CHECK */

    if (selectedDate && (selectedDate < minDate || selectedDate > maxDate)) {
        alert("Please select a valid attendance date.");
        input.value = "";
        renderAttendanceHistory(originalOngoingAttendanceHistoryData);
        return;
    }

    if (!selectedDate) {
        renderAttendanceHistory(originalOngoingAttendanceHistoryData);
        return;
    }

    const filtered = originalOngoingAttendanceHistoryData.filter((item) => item.attendance_date === selectedDate);
    renderAttendanceHistory(filtered);
}

function clearOngoingAttendanceHistoryFilter() {
    document.getElementById("ongoingAttendanceHistoryDateFilter").value = "";
    renderAttendanceHistory(originalOngoingAttendanceHistoryData);
}

function renderAttendanceHistory(data) { 
	const tbody = document.getElementById("attendanceHistoryTableBody");
	tbody.innerHTML = ""; 

    if (data.length === 0) { 
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="ongoingtab-attendance-history-no-data">No Attendance History Found</td>
            </tr>
        `; 
        return; 
    }

	data.forEach((item) => { 
		tbody.innerHTML += `
            <tr>
                <td>${item.attendance_date}</td>
                <td>${item.total_students}</td>
                <td>${item.present_count}</td>
                <td>${item.absent_count}</td>
                <td>${
                    item.present_percentage !== null
                        ? `${item.present_percentage}%`
                        : "-"
                }</td>
                <td>${
                    item.absent_percentage !== null
                        ? `${item.absent_percentage}%`
                        : "-"
                }</td>
                <td>${item.count_days}</td>
                <td>
                    <button class="ongoingtab-attendance-history-view-btn" onclick='openOngoingTabAttendanceViewModal("${item.attendance_date_raw}","${item.attendance_date}","${document.getElementById("attendanceHistoryTitle").innerText}")'>View</button>
                    <button class="ongoingtab-attendance-history-update-btn" onclick='openOngoingTabUpdateAttendanceModal("${item.attendance_date_raw}","${item.attendance_date}")'>Update</button>
                </td>
            </tr>
		`; 
	}); 
}

function openOngoingTabAttendanceViewModal(rawDate, displayDate, classTitle) {
    selectedAttendanceDate = rawDate;

    /* REMOVE WORD ATTENDANCE */

    const cleanTitle = classTitle.replace(" Attendance", "");
    document.getElementById("attendanceViewTitle").innerText = `${displayDate} -  ${cleanTitle} Attendance`;
    document.getElementById("attendanceViewModal").style.display = "flex";
    fetchAttendanceDayDetails();
}

function closeAttendanceViewModal() {
    document.getElementById("attendanceViewModal").style.display = "none";
    document.getElementById("attendanceViewTableBody").innerHTML = "";
}

function fetchAttendanceDayDetails() {
    const token = localStorage.getItem("access_token");
    const search = document.getElementById("ongoingAttendanceViewSearchInput")?.value.trim() || "";

    fetch(
        `http://127.0.0.1:8000/classes/get_attendance_day_details/?assignment_id=${selectedAttendanceHistoryId}&attendance_date=${selectedAttendanceDate}&search=${encodeURIComponent(search)}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then((result) => {
            console.log("Ongoing Tab Particular Day Attendance With Student Details API Result:", result);
            renderAttendanceView(result.data || []);
        });
}

function renderAttendanceView(data) {
    const tbody = document.getElementById("attendanceViewTableBody");
    tbody.innerHTML = "";

    if (!data || data.length === 0) { 
        tbody.innerHTML = `
            <tr class="ongoingtab-attendance-empty-row">
                <td colspan="6">
                    <div class="ongoingtab-attendance-empty-state">Student not found</div>
                </td>
            </tr>
        `; 
        return; 
    }

    data.forEach((item) => {
        tbody.innerHTML += `
                <tr>
                    <td>${item.student_unique_id}</td>
                    <td>${item.student_name}</td>
                    <td>${item.email}</td>
                    <td>${item.phone}</td>
                    <td>${item.status}</td>
                    <td>
                        <span style="font-weight:600; color: ${item.attendance_status === "PRESENT" ? "green" : "red"};">
                            ${item.attendance_status}
                        </span>
                    </td>
                </tr>
            `;
    });
}

function openOngoingTabUpdateAttendanceModal(rawDate, displayDate, isAttendanceTab = false) {
    isAttendanceUpdate = true;

    selectedUpdateDate = rawDate;

    /* ASSIGNMENT ID */

    selectedAttendanceAssignmentId = isAttendanceTab ? selectedAttendanceTabAssignmentId : selectedAttendanceHistoryId;

    /* IDS */

    const historyModalId = isAttendanceTab ? "attendanceTabHistoryModal" : "attendanceHistoryModal";

    const historyTitleId = isAttendanceTab ? "attendanceTabHistoryTitle" : "attendanceHistoryTitle";

    const attendanceModalId = isAttendanceTab ? "attendanceTabAttendanceModal" : "ongoingAttendanceModal";

    const attendanceTitleId = isAttendanceTab ? "attendanceTabAttendanceTitle" : "ongoingAttendanceTitle";

    const attendanceDateId = isAttendanceTab ? "attendanceTabDate" : "attendanceDate";

    const saveBtnClass = isAttendanceTab ? ".attendance-tab-attendance-save-btn" : ".ongoingtab-attendance-save-btn";

    /* CLOSE HISTORY */

    document.getElementById(historyModalId).style.display = "none";

    /* TITLE */

    const classTitle = document.getElementById(historyTitleId).innerText;

    document.getElementById(attendanceTitleId).innerText = `${displayDate} - ${classTitle}`;

    /* DATE */

    document.getElementById(attendanceDateId).value = rawDate;

    /* BUTTON */

    document.querySelector(saveBtnClass).innerText = "Update Attendance";

    /* OPEN MODAL */

    document.getElementById(attendanceModalId).style.display = "flex";

    fetchAttendanceStudents(isAttendanceTab);
}

function fetchAttendanceTabBatches() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const search = document.getElementById("attendanceTabSearchInput")?.value || "";

    fetch(
        `http://127.0.0.1:8000/classes/get_student_tab_batches/?username=${username}&page=${attendanceTabBatchPage}&limit=${attendanceTabBatchLimit}&search=${search}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then((result) => {
            console.log("Attendance Tab Batches API Result:", result);
            attendanceTabBatchData = result.data || [];
            totalAttendanceTabRecords = result.total || 0;
            renderAttendanceTabBatches(attendanceTabBatchData);
            renderAttendanceTabPagination();
        });
}

function handleAttendanceTabFilter() {

    /* RESET PAGE */

    attendanceTabBatchPage = 1;

    /* FETCH AGAIN */

    fetchAttendanceTabBatches();
}

function renderAttendanceTabBatches(data) {
    const tbody = document.getElementById("attendanceReportTableBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    No Batch Found
                </td>
            </tr>
        `;

        /* HIDE PAGINATION */

        document.getElementById("attendanceTabPrevBtn").style.display = "none";
        document.getElementById("attendanceTabNextBtn").style.display = "none";
        document.getElementById("attendanceTabPageInfo").innerText = "";
        return;
    }

    data.forEach((item) => {
        tbody.innerHTML += `
                <tr>
                    <td>${item.class_name}</td>
                    <td>${item.class_time}</td>
                    <td>${item.class_start_date || "-"}</td>
                    <td>${item.class_end_date || "-"}</td>
                    <td><span class="staff-attendance-tab-status-badge ${item.class_status.toLowerCase()}">${item.class_status}</span></td>
                    <td>${item.student_count}</td>
                    <td>${item.count_days}</td>
                    <td>
                        <button class="staff-attendance-tab-show-btn"
                            onclick='
                                openAttendanceTabHistoryModal(
                                    "${item.id}",
                                    "${item.class_name}",
                                    "${item.class_time}"
                                )
                            '
                        >
                            Showing Attendance
                        </button>
                    </td>
                </tr>
            `;
    });
    /* SHOW PAGINATION AGAIN */

    document.getElementById("attendanceTabPrevBtn").style.display = "inline-block";
    document.getElementById("attendanceTabNextBtn").style.display = "inline-block";
}

function renderAttendanceTabPagination() {
    const totalPages = Math.ceil(totalAttendanceTabRecords / attendanceTabBatchLimit);
    const pageInfo = document.getElementById("attendanceTabPageInfo");
    const prevBtn = document.getElementById("attendanceTabPrevBtn");
    const nextBtn = document.getElementById("attendanceTabNextBtn");

    /* NO DATA */

    if (totalAttendanceTabRecords === 0) {
        pageInfo.innerText = "";
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
        return;
    }

    /* SHOW BUTTONS */

    prevBtn.style.display = "inline-block";
    nextBtn.style.display = "inline-block";
    pageInfo.innerText = `Page ${attendanceTabBatchPage} of ${totalPages}`;
    prevBtn.disabled = attendanceTabBatchPage === 1;
    nextBtn.disabled = attendanceTabBatchPage === totalPages;
}

function prevAttendanceTabPage() {
    if (attendanceTabBatchPage > 1) {
        attendanceTabBatchPage--;
        fetchAttendanceTabBatches();
    }
}

function nextAttendanceTabPage() {
    const totalPages = Math.ceil(totalAttendanceTabRecords / attendanceTabBatchLimit);

    if (attendanceTabBatchPage < totalPages) {
        attendanceTabBatchPage++;
        fetchAttendanceTabBatches();
    }
}

function openAttendanceTabHistoryModal(assignmentId, className, classTime) {
    selectedAttendanceTabAssignmentId = assignmentId;
    const batch = attendanceTabBatchData.find((item) => item.id == assignmentId);
    const dateInput = document.getElementById("attendanceTabHistoryDateFilter");

    if (batch) {
        dateInput.min = batch.class_start_date;
        if (batch.class_end_date && batch.class_end_date !== "-") {
            const parts = batch.class_end_date.split("-");
            dateInput.max = `${parts[2]}-${parts[1]}-${parts[0]}`;
        } else {
            dateInput.removeAttribute("max");
        }
    }

    document.getElementById("attendanceTabHistoryTitle").innerText = `${className} - ${classTime} - Attendance`;
    document.getElementById("attendanceTabHistoryModal").style.display = "flex";
    fetchAttendanceTabHistory();
}

function fetchAttendanceTabHistory() {
    const token = localStorage.getItem("access_token");

    fetch(`http://127.0.0.1:8000/classes/get_attendance_history/?assignment_id=${selectedAttendanceTabAssignmentId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            console.log("Attendance Tab Particular Batch Attendance History API Result:", result);
            attendanceTabHistoryData = result.data || [];
            loadAttendanceHistoryDateOptions();
            renderAttendanceTabHistory(attendanceTabHistoryData);
        });
}

function loadAttendanceHistoryDateOptions() {
    const select = document.getElementById("attendanceTabHistoryDateFilter");

    select.innerHTML = `
            <option value="">
                Select Attendance Date
            </option>
        `;

    attendanceTabHistoryData.forEach((item) => {
        select.innerHTML += `
                <option
                    value="${item.attendance_date_raw}"
                >
                    ${item.attendance_date}
                </option>
            `;
    });
}

function renderAttendanceTabHistory( data ) { 
	const tbody = document.getElementById( "attendanceTabHistoryTableBody" );
	tbody.innerHTML = ""; 
	
	if ( data.length === 0 ) { 
		tbody.innerHTML = `
            <tr>
                <td colspan="8">No Attendance Found</td>
            </tr>
        `; 
		return; 
	} 

	data.forEach( (item) => { 
		tbody.innerHTML += `
            <tr>
                <td>${item.attendance_date}</td>
                <td>${item.total_students}</td>
                <td>${item.present_count}</td>
                <td>${item.absent_count}</td>
                <td>${
                    item.present_percentage !== null
                        ? `${item.present_percentage}%`
                        : "-"
                }</td>
                <td>${
                    item.absent_percentage !== null
                        ? `${item.absent_percentage}%`
                        : "-"
                }</td>
                <td>${item.count_days}</td>
                <td>
                    <button
                        class="attendance-tab-history-view-btn"
                        onclick='openAttendanceTabAttendanceViewModal(
                            "${item.attendance_date_raw}",
                            "${item.attendance_date}",
                            "${document.getElementById("attendanceTabHistoryTitle").innerText}"
                        )'
                    >
                        View
                    </button>

                    <button
                        class="attendance-tab-history-update-btn"
                        onclick='openAttendanceTabUpdateAttendanceModal(
                            "${item.attendance_date_raw}",
                            "${item.attendance_date}"
                        )'
                    >
                        Update
                    </button>
                </td>
            </tr>
       `; 
	}); 
}

function closeAttendanceTabHistoryModal() {
    document.getElementById("attendanceTabHistoryModal").style.display = "none";
    document.getElementById("attendanceTabHistoryTableBody").innerHTML = "";

    /* CLEAR DATE FILTER */

    document.getElementById("attendanceTabHistoryDateFilter").value = "";
}

function openAttendanceTabView(rawDate, displayDate) {
    selectedAttendanceDate = rawDate;
    const title = document.getElementById("attendanceTabHistoryTitle").innerText;
    document.getElementById("attendanceTabViewTitle").innerText = `${displayDate} - ${title}`;
    document.getElementById("attendanceTabViewModal").style.display = "flex";
    fetchAttendanceTabDayDetails();
}

function fetchAttendanceTabDayDetails() {
    const token = localStorage.getItem("access_token");
    const search = document.getElementById("attendanceTabViewSearchInput")?.value.trim();

    fetch(
        `http://127.0.0.1:8000/classes/get_attendance_tab_day_details/?assignment_id=${selectedAttendanceTabAssignmentId}&attendance_date=${selectedAttendanceDate}&search=${encodeURIComponent(search)}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then((result) => {
            console.log("Attendance Tab Particular Day Attendance With Student Details API Result: ", result);
            renderAttendanceTabView(result.data || []);
        });
}

function openAttendanceTabUpdateAttendanceModal(rawDate, displayDate) {
    isAttendanceUpdate = true;

    selectedUpdateDate = rawDate;

    selectedAttendanceAssignmentId = selectedAttendanceTabAssignmentId;

    /* CLOSE HISTORY */

    document.getElementById("attendanceTabHistoryModal").style.display = "none";

    /* TITLE */

    const classTitle = document.getElementById("attendanceTabHistoryTitle").innerText;

    document.getElementById("attendanceTabAttendanceTitle").innerText = `${displayDate} - ${classTitle}`;

    /* DATE */

    document.getElementById("attendanceTabDate").value = rawDate;

    /* BUTTON */

    document.querySelector(".attendance-tab-attendance-save-btn").innerText = "Update Attendance";

    /* OPEN MODAL */

    document.getElementById("attendanceTabAttendanceModal").style.display = "flex";

    /* IMPORTANT FIX */

    setTimeout(() => {
        fetchAttendanceStudents(true);
    }, 0);
}

function openAttendanceTabAttendanceViewModal(rawDate, displayDate, classTitle) {
    selectedAttendanceDate = rawDate;
    const cleanTitle = classTitle.replace(" Attendance", "");
    document.getElementById("attendanceTabViewTitle").innerText = `${displayDate} - ${cleanTitle} Attendance`;
    document.getElementById("attendanceTabViewModal").style.display = "flex";
    fetchAttendanceTabDayDetails();
}

function closeAttendanceTabAttendanceModal() {
    document.getElementById("attendanceTabAttendanceModal").style.display = "none";

    document.getElementById("attendanceTabSearchInput").value = "";

    attendanceState = {};

    /* REOPEN HISTORY */

    document.getElementById("attendanceTabHistoryModal").style.display = "flex";

    /* REFRESH HISTORY */

    fetchAttendanceTabHistory();
}

function renderAttendanceTabView(data = []) {
    const tbody = document.getElementById("attendanceTabViewTableBody");
    tbody.innerHTML = "";

    if (!data || data.length === 0) { 
        tbody.innerHTML = `
            <tr class="attendancetab-attendance-empty-row">
                <td colspan="6">
                    <div class="attendancetab-attendance-empty-state">Student not found</div>
                </td>
            </tr>
        `;  
        return; 
    }

    data.forEach((item) => {
        tbody.innerHTML += `
            <tr>
                <td>${item.student_unique_id}</td>
                <td>${item.student_name}</td>
                <td>${item.email}</td>
                <td>${item.phone}</td>
                <td>${item.status}</td>
                <td>
                    <span style="font-weight:600; color:${item.attendance_status === "PRESENT" ? "green" : "red"};">
                        ${item.attendance_status}
                    </span>
                </td>
            </tr>
        `;
    });
}

function closeAttendanceTabViewModal() {
    document.getElementById("attendanceTabViewModal").style.display = "none";
    document.getElementById("attendanceTabViewTableBody").innerHTML = "";
    document.getElementById("attendanceTabViewSearchInput").value = "";
}

function saveAttendanceTab() {
    const token = localStorage.getItem("access_token");
    const attendanceDate = document.getElementById("attendanceTabDate").value;

    const attendanceData = Object.keys(attendanceState).map((id) => {
        return {
            student_enrollment_id: id,
            attendance_status: attendanceState[id] ? "PRESENT" : "ABSENT",
        };
    });

    fetch("http://127.0.0.1:8000/classes/save_student_attendance/", {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
            assignment_id: selectedAttendanceAssignmentId,
            attendance_date: attendanceDate,
            attendance: attendanceData,
            is_update: isAttendanceUpdate,
        }),
    })
        .then((res) => res.json())

        .then((result) => {
            console.log("Attendance Tab Save API Result:", result);

            if (result.status === "Success") {
                alert(isAttendanceUpdate ? "Attendance Updated Successfully" : "Attendance Saved Successfully");

                /* CLOSE MODAL */

                document.getElementById("attendanceTabAttendanceModal").style.display = "none";

                /* RESET */

                attendanceState = {};

                isAttendanceUpdate = false;

                selectedUpdateDate = null;

                document.querySelector(".attendance-tab-attendance-save-btn").innerText = "Save Attendance";

                /* REOPEN HISTORY */

                document.getElementById("attendanceTabHistoryModal").style.display = "flex";

                fetchAttendanceTabHistory();

                /* REFRESH REPORT TABLE */

                fetchAttendanceTabBatches();
            } else {
                alert(result.message);
            }
        })

        .catch((error) => {
            console.error("Attendance Tab Save Error:", error);
            alert("Something went wrong");
        });
}

function filterAttendanceTabHistoryByDate() {
    const selectedDate = document.getElementById("attendanceTabHistoryDateFilter").value;

    if (!selectedDate) {
        renderAttendanceTabHistory(attendanceTabHistoryData);
        return;
    }

    const filtered = attendanceTabHistoryData.filter((item) => item.attendance_date_raw === selectedDate);
    renderAttendanceTabHistory(filtered);
}

function clearAttendanceTabHistoryDateFilter() {
    document.getElementById("attendanceTabHistoryDateFilter").value = "";
    renderAttendanceTabHistory(attendanceTabHistoryData);
}

function handleAttendanceTabViewFilter() {
    clearTimeout(window.attendanceTabViewSearchTimer);

    window.attendanceTabViewSearchTimer = setTimeout(() => {
        fetchAttendanceTabDayDetails();
    }, 150);
}

function fetchStaffDashboardCards() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    fetch(`http://127.0.0.1:8000/classes/get_staff_dashboard_cards/?username=${username}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            console.log("Staff Dashboard Cards API Result:", result.data);
            if (result.status !== "Success") return;
            const data = result.data;
            document.getElementById("staffDashboardTotalClasses").innerText = data.total_classes || 0;
            document.getElementById("staffDashboardActiveClasses").innerText = data.active_classes || 0;
            document.getElementById("staffDashboardTotalStudents").innerText = data.total_students || 0;
            document.getElementById("staffDashboardAttendanceStatus").innerText = `${data.attendance_taken || 0} Taken | ${data.attendance_pending || 0} Pending`;
        });
}

function fetchStaffDashboardActiveClasses() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    fetch(`http://127.0.0.1:8000/classes/get_staff_dashboard_active_classes/?username=${username}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            console.log("Staff Dashboard Active Classes API Result:", result);
            renderStaffDashboardActiveClasses(result.data || []);
            renderStaffDashboardClassSummary(result.summary || {});
        });
}

function renderStaffDashboardActiveClasses(data) {

    const container = document.getElementById("staffDashboardActiveClassTable");

    if (!container) return;

    if (!data.length) {
        container.innerHTML = `
            <div class="staff-dashboard-empty-state">
                No Active Classes
            </div>
        `;
        return;
    }

    container.innerHTML = `

        <table class="staff-dashboard-active-class-table">
            <thead>
                <tr>
                    <th>Class</th>
                    <th>Time</th>
                    <th>Students</th>
                    <th>Status</th>
                    <th>Attendance</th>
                </tr>
            </thead>

            <tbody>

                ${data.map(item => `
                    <tr>
                        <td>${item.class_name}</td>
                        <td>${item.class_time}</td>
                        <td>${item.student_count}</td>
                        <td>
                            <span class="staff-dashboard-status-badge ${item.class_status.toLowerCase()}">
                                ${item.class_status}
                            </span>
                        </td>
                        <td>
                            <span class="
                                ${
                                    item.attendance_status === "Taken"
                                    ?
                                    "staff-dashboard-attendance-taken"
                                    :
                                    item.attendance_status === "Pending"
                                    ?
                                    "staff-dashboard-attendance-pending"
                                    :
                                    "staff-dashboard-attendance-empty"
                                }
                            ">
                                ${item.attendance_status}
                            </span>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

function renderStaffDashboardClassSummary(data) { 
	const container = document.getElementById("staffDashboardClassSummary" ); 
	if (!container) return; 
	
	container.innerHTML = `

        <div class="staff-dashboard-summary-item">
            <span>Open</span>
            <strong>${data.open_count || 0}</strong>
        </div>

        <div class="staff-dashboard-summary-item">
            <span>Ongoing</span>
            <strong>${data.ongoing_count || 0}</strong>
        </div>

        <div class="staff-dashboard-summary-item">
            <span>Full</span>
            <strong>${data.full_count || 0}</strong>
        </div>

        <div class="staff-dashboard-summary-item">
            <span>Completed</span>
            <strong>${data.completed_count || 0}</strong>
        </div>
	`; 
}

function loadStaffDashboardRecentClasses() { 
	const token = localStorage.getItem( "access_token" ); 
	
	fetch("http://127.0.0.1:8000/dashboard/staff_recent_classes/", { 
		headers: { Authorization: `Bearer ${token}`, }, 
	})
	
	.then((res) => res.json()) 
	.then((result) => { 
		console.log( "Staff Dashboard Recent Classes API Result:", result); 
		const container = document.getElementById( "staffDashboardRecentClassList" ); 
		
		if (!container) return; 
		if (!result.data.length) {
			container.innerHTML = `
                <div class="staff-dashboard-no-data">No Classes Available</div>
            `; 
			return; 
		} 

		container.innerHTML = `
            <div class="staff-dashboard-class-table-wrapper">
                <table class="staff-dashboard-recent-class-table">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Trainer</th>
                            <th>Start</th>
                            <th>Timing</th>
                            <th>Available Slot</th>
                        </tr>
                    </thead>
                </table>

                <div class="staff-dashboard-class-scroll-body" id="staffDashboardClassScrollBody">
                    <table class="staff-dashboard-recent-class-table">
                        <tbody id="staffDashboardClassTableBody"></tbody>
                    </table>
                </div>
            </div>
        `; 

		const tbody = document.getElementById( "staffDashboardClassTableBody" ); 
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
		setTimeout(() => { startStaffDashboardRecentClassScroll(); }, 100); 
	}); 
}

let staffDashboardRecentClassScrollInterval;

function startStaffDashboardRecentClassScroll() {
    const container = document.getElementById("staffDashboardClassScrollBody");
    if (!container) return;

    clearInterval(staffDashboardRecentClassScrollInterval);

    if (container.scrollHeight <= container.clientHeight) {
        return;
    }

    container.innerHTML += container.innerHTML;

    function startScroll() {
        staffDashboardRecentClassScrollInterval = setInterval(() => {
            container.scrollTop += 1;
            const halfHeight = container.scrollHeight / 2;
            if (container.scrollTop >= halfHeight) {
                container.scrollTop = 0;
            }
        }, 40);
    }

    function stopScroll() {
        clearInterval(staffDashboardRecentClassScrollInterval);
    }

    startScroll();
    container.addEventListener("mouseenter", stopScroll);
    container.addEventListener("mouseleave", startScroll);
}

function loadStaffDashboardNotifications() {
    const token = localStorage.getItem("access_token");

    fetch("http://127.0.0.1:8000/dashboard/dashboard_notifications/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            console.log("Staff Dashboard Notifications API Result:", result);
            const container = document.getElementById("staffDashboardNotificationContainer");

            if (!container) return;
            container.innerHTML = "";

            if (!result.data.length) {
                container.innerHTML = `
                    <div class="staff-dashboard-no-data">
                        No Notifications Found
                    </div>
                `;
                return;
            }

            result.data.forEach((item) => {
                container.innerHTML += `
                    <div class="staff-dashboard-notification-card">
                        <p>${item.content}</p>
                        <span>${item.category}•${item.created_at}</span>
                    </div>
                `;
            });

            setTimeout(() => {
                const contentHeight = container.scrollHeight;
                const maxHeight = 395;

                if (contentHeight > maxHeight) {
                    container.classList.add("staff-dashboard-notification-scroll");
                    container.classList.remove("staff-dashboard-notification-static");
                    container.innerHTML += container.innerHTML;
                    startStaffDashboardNotificationAutoScroll();
                } else {
                    container.classList.add("staff-dashboard-notification-static");
                    container.classList.remove("staff-dashboard-notification-scroll");
                    container.scrollTop = 0;
                    clearInterval(staffDashboardNotificationScrollInterval);
                }
            }, 50);
        });
}

let staffDashboardNotificationScrollInterval;

function startStaffDashboardNotificationAutoScroll() {
    const container = document.getElementById("staffDashboardNotificationContainer");

    if (!container) return;

    clearInterval(staffDashboardNotificationScrollInterval);

    function startScroll() {
        staffDashboardNotificationScrollInterval = setInterval(() => {
            container.scrollTop += 1;
            const halfHeight = container.scrollHeight / 2;

            if (container.scrollTop >= halfHeight) {
                container.scrollTop = 0;
            }
        }, 40);
    }

    function stopScroll() {
        clearInterval(staffDashboardNotificationScrollInterval);
    }

    startScroll();
    container.addEventListener("mouseenter", stopScroll);
    container.addEventListener("mouseleave", startScroll);
}

function submitStaffLeaveRequest() {
    const token = localStorage.getItem("access_token");
    const leaveType = document.getElementById("staffLeaveType").value;
    const startDate = document.getElementById("staffLeaveStartDate").value;
    const endDate = document.getElementById("staffLeaveEndDate").value;

    /* VALIDATION */

    if (!leaveType) {
        alert("Please select leave type");
        return;
    }

    if (!startDate) {
        alert("Please select start date");
        return;
    }

    if (!endDate) {
        alert("Please select end date");
        return;
    }

    if (new Date(endDate) < new Date(startDate)) {
        alert("End date cannot be before start date");
        return;
    }

    fetch("http://127.0.0.1:8000/leaverequest/send_leave_request/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            leave_type: leaveType,
            start_date: startDate,
            end_date: endDate,
        }),
    })
        .then((res) => res.json())
        .then((result) => {
            alert(result.message);
            if (result.status === "Success") {
                document.getElementById("staffLeaveType").value = "";
                document.getElementById("staffLeaveStartDate").value = "";
                document.getElementById("staffLeaveEndDate").value = "";
                document.getElementById("staffLeaveTotalDays").value = "-";
                fetchStaffLeaveHistory();
            }
        });
}

function fetchStaffLeaveHistory() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    fetch(`http://127.0.0.1:8000/leaverequest/get_staff_leave_requests/?username=${username}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            console.log("Staff Leave History API Result:", result);
            originalUpcomingLeaveData = result.upcoming_requests || [];
            originalLeaveHistoryData = result.leave_history || [];
            renderStaffUpcomingLeaves(originalUpcomingLeaveData);
            renderStaffLeaveHistory(originalLeaveHistoryData);
        });
}

function renderStaffUpcomingLeaves(data = []) { 
	const tbody = document.getElementById( "staffUpcomingLeaveTableBody" );
	if (!tbody) return; 
	tbody.innerHTML = ""; 
	const start = ( staffUpcomingLeavePage - 1 ) * staffUpcomingLeaveLimit; 
	const paginatedData = data.slice( start, start + staffUpcomingLeaveLimit ); 

	if (!paginatedData.length) { 
		tbody.innerHTML = `
            <tr>
                <td colspan="7">No Leave Requests Found</td>
            </tr>
        `; 
	} 

	paginatedData.forEach((item) => { 
		tbody.innerHTML += `
            <tr>
                <td>${item.applied_date}</td>
                <td>${item.leave_type}</td>
                <td>${item.start_date}</td>
                <td>${item.end_date}</td>
                <td>${item.total_days}</td>
                <td>
                    <span class="${item.status === "APPROVED" ? "admin-leave-status-approved" : "admin-leave-status-rejected"}">
                        ${item.status}
                    </span>
                </td>
                <td>${item.approved_by}</td>
            </tr>
        `; 
	}); 
	renderStaffUpcomingPagination( data.length ); 
}

function renderStaffLeaveHistory(data = []) { 
	const tbody = document.getElementById( "staffLeaveHistoryTableBody" ); 
	if (!tbody) return; 
	tbody.innerHTML = "";
	const start = ( staffHistoryLeavePage - 1 ) * staffHistoryLeaveLimit; 
	const paginatedData = data.slice( start, start + staffHistoryLeaveLimit ); 

	if (!paginatedData.length) { 
		tbody.innerHTML = `
            <tr>
                <td colspan="7">No Leave History Found</td>
            </tr>
        `; 
    } 

	paginatedData.forEach((item) => { 
		tbody.innerHTML += `
            <tr>
                <td>${item.applied_date}</td>
                <td>${item.leave_type}</td>
                <td>${item.start_date}</td>
                <td>${item.end_date}</td>
                <td>${item.total_days}</td>
                <td>
                    <span class="${item.status === "APPROVED" ? "admin-leave-status-approved" : "admin-leave-status-rejected"}">
                        ${item.status}
                    </span>
                </td>
                <td>${item.approved_by}</td>
            </tr>
        `; 
	}); 
	renderStaffHistoryPagination( data.length ); 
}

function filterStaffUpcomingLeaves() {
    staffUpcomingLeavePage = 1;
    const search = document.getElementById("staffUpcomingLeaveSearch").value.toLowerCase();
    const type = document.getElementById("staffUpcomingLeaveTypeFilter").value;
    const filtered = originalUpcomingLeaveData.filter((item) => {
        const matchesSearch = item.start_date.toLowerCase().includes(search);
        const matchesType = !type || item.leave_type === type;
        return matchesSearch && matchesType;
    });
    renderStaffUpcomingLeaves(filtered);
}

function filterStaffLeaveHistory() {
    staffHistoryLeavePage = 1;
    const search = document.getElementById("staffLeaveHistorySearch").value.toLowerCase();
    const type = document.getElementById("staffLeaveHistoryTypeFilter").value;
    const filtered = originalLeaveHistoryData.filter((item) => {
        const matchesSearch = item.start_date.toLowerCase().includes(search);
        const matchesType = !type || item.leave_type === type;
        return matchesSearch && matchesType;
    });
    renderStaffLeaveHistory(filtered);
}

function calculateLeaveDays() {
    const startDate = document.getElementById("staffLeaveStartDate").value;
    const endDate = document.getElementById("staffLeaveEndDate").value;
    const totalDaysField = document.getElementById("staffLeaveTotalDays");

    if (!startDate || !endDate) {
        totalDaysField.value = "-";
        return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    /* INVALID */

    if (end < start) {
        alert("End date cannot be before start date");
        document.getElementById("staffLeaveEndDate").value = "";
        totalDaysField.value = "-";
        return;
    }

    const difference = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    totalDaysField.value = `${difference} Days`;
}

function clearUpcomingLeaveFilters() {
    staffUpcomingLeavePage = 1;
    document.getElementById("staffUpcomingLeaveSearch").value = "";
    document.getElementById("staffUpcomingLeaveTypeFilter").value = "";
    renderStaffUpcomingLeaves(originalUpcomingLeaveData);
}

function clearLeaveHistoryFilters() {
    staffHistoryLeavePage = 1;
    document.getElementById("staffLeaveHistorySearch").value = "";
    document.getElementById("staffLeaveHistoryTypeFilter").value = "";
    renderStaffLeaveHistory(originalLeaveHistoryData);
}

function renderStaffUpcomingPagination(totalRecords) {
    const totalPages = Math.max(1, Math.ceil(totalRecords / staffUpcomingLeaveLimit));
    const prev = document.getElementById("staffUpcomingLeavePrevBtn");
    const next = document.getElementById("staffUpcomingLeaveNextBtn");
    const info = document.getElementById("staffUpcomingLeavePageInfo");
    info.innerText = `Page ${staffUpcomingLeavePage} of ${totalPages}`;
    prev.disabled = staffUpcomingLeavePage === 1;
    next.disabled = staffUpcomingLeavePage >= totalPages;
}

function renderStaffHistoryPagination(totalRecords) {
    const totalPages = Math.max(1, Math.ceil(totalRecords / staffHistoryLeaveLimit));
    const prev = document.getElementById("staffLeaveHistoryPrevBtn");
    const next = document.getElementById("staffLeaveHistoryNextBtn");
    const info = document.getElementById("staffLeaveHistoryPageInfo");
    info.innerText = `Page ${staffHistoryLeavePage} of ${totalPages}`;
    prev.disabled = staffHistoryLeavePage === 1;
    next.disabled = staffHistoryLeavePage >= totalPages;
}

function changeStaffUpcomingLeavePage(direction) {
    const totalPages = Math.max(1, Math.ceil(originalUpcomingLeaveData.length / staffUpcomingLeaveLimit));
    staffUpcomingLeavePage += direction;

    if (staffUpcomingLeavePage < 1) {
        staffUpcomingLeavePage = 1;
    }

    if (staffUpcomingLeavePage > totalPages) {
        staffUpcomingLeavePage = totalPages;
    }

    renderStaffUpcomingLeaves(originalUpcomingLeaveData);
}

function changeStaffHistoryLeavePage(direction) {
    const totalPages = Math.max(1, Math.ceil(originalLeaveHistoryData.length / staffHistoryLeaveLimit));
    staffHistoryLeavePage += direction;

    if (staffHistoryLeavePage < 1) {
        staffHistoryLeavePage = 1;
    }

    if (staffHistoryLeavePage > totalPages) {
        staffHistoryLeavePage = totalPages;
    }

    renderStaffLeaveHistory(originalLeaveHistoryData);
}