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

/* Notifications */
let currentStaffNotificationPage = 1;
const staffNotificationLimit = 5;
let totalStaffNotificationRecords = 0;

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
                        <h5>My Ongoing Batches</h5>
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
                            <th>End Date</th>
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
                        <h5 id="ongoingStudentDynamicTitle">Enrolled Students</h5>
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
                        <h4 id="attendanceHistoryTitle">Attendance History</h4>
                        <span onclick="closeAttendanceHistoryModal()">
                            ×
                        </span>
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
                        <h5>Completed Batches</h5>
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

            <!-- COMPLETED STUDENTS LIST -->
            
            <div class="completed-batch-student-list-container" id="completedStudentListContainer" style="display: none">
                <div class="completed-batch-student-list-header">
                    <div>
                        <h5 id="completedStudentDynamicTitle">Students</h5>
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
                        <h6 style="margin-top: 2%">Update Class</h6>
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
                        <h6>Update Student Status</h6>
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

    if (tabName === "noticeboard") { 
        content.innerHTML = `
            <div class="staff-notification-container">
                <div class="staff-notification-header">
                    <div>
                        <h2>Notifications Feed</h2>
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
    const tbody = document.getElementById("staffBatchTableBody");
    console.log("Staff Batches API Result:", result);

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
                <td>${item.class_end_date || "-"}</td>
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

                    <button
                        class="staff-ongoingpage-attendance-btn"
                        onclick='
                            ${
                                item.attendance_taken
                                ?
                                `openAttendanceHistoryModal(
                                    "${item.id}",
                                    "${item.class_name}",
                                    "${item.class_time}"
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
                        ${ item.attendance_taken ? "Showing Attendance" : "Take Attendance" }
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
                <td colspan="7">
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
    console.log("Student API Result:", result);
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

                    <button class="staff-student-tab-attendance-btn">Attendance</button>

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

    fetch("http://127.0.0.1:8000/classes/get_student_tab_batches/?page=1&limit=100", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            const select = document.getElementById("studentTabClassFilter");
            const classes = [...new Set(result.data.map((item) => item.class_name))];
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
}

function fetchAttendanceStudents() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const attendanceDate = isAttendanceUpdate ? selectedUpdateDate : document.getElementById("attendanceDate").value;

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
                        console.log("Attendance Update Student Details API Result :", attendanceResult);
                        attendanceState = {};

                        if (attendanceResult.status === "Success" && attendanceResult.data) {
                            attendanceResult.data.forEach((item) => {
                                attendanceState[item.student_enrollment_id] = item.attendance_status === "PRESENT";
                            });
                        }
                        renderAttendanceStudents();
                    });
            } else {
                renderAttendanceStudents();
            }
        });
}

function renderAttendanceStudents(students = attendanceStudents) {
    const tbody = document.getElementById("attendanceTableBody");
    tbody.innerHTML = "";

    if (students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    Student Not Found
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
            <tr>
                <td colspan="6" style="text-align:center; padding:20px;">
                    No Students Found
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
            if (result.status === "Success") {
                    /* UPDATE MODE */
                if (isAttendanceUpdate) {
                    closeAttendanceModal();
                    fetchAttendanceHistory();
                } else {
                    closeAttendanceModal();
                    /* REFRESH ONGOING TABLE */
                    fetchStaffOngoingBatches();
                }
            }
        });
}

function openAttendanceHistoryModal(assignmentId, className, classTime) {
    selectedAttendanceHistoryId = assignmentId;
    document.getElementById("attendanceHistoryTitle").innerText = `${className} - ${classTime} - Attendance`;
    document.getElementById("attendanceHistoryModal").style.display = "flex";
    fetchAttendanceHistory();
}

function closeAttendanceHistoryModal() {
    document.getElementById("attendanceHistoryModal").style.display = "none";
    document.getElementById("attendanceHistoryTableBody").innerHTML = "";
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
            renderAttendanceHistory(result.data || []);
        });
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

    console.log("Particular Batch Attendance History Data:", data);

	data.forEach((item) => { 
		tbody.innerHTML += `
            <tr>
                <td>${item.attendance_date}</td>
                <td>${item.total_students}</td>
                <td>${item.present_count}</td>
                <td>${item.absent_count}</td>
                <td>${item.present_percentage}%</td>
                <td>${item.absent_percentage}%</td>
                <td>${item.count_days}</td>
                <td>
                    <button class="ongoingtab-attendance-history-view-btn" onclick='openAttendanceViewModal("${item.attendance_date_raw}","${item.attendance_date}","${document.getElementById("attendanceHistoryTitle").innerText}")'>View</button>
                    <button class="ongoingtab-attendance-history-update-btn" onclick='openUpdateAttendanceModal("${item.attendance_date_raw}","${item.attendance_date}")'>Update</button>
                </td>
            </tr>
		`; 
	}); 
}

function openAttendanceViewModal(rawDate, displayDate, classTitle) {
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

    fetch(
        `http://127.0.0.1:8000/classes/get_attendance_day_details/?assignment_id=${selectedAttendanceHistoryId}&attendance_date=${selectedAttendanceDate}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then((result) => {
            console.log("Particular Day Attendance With Student Details API Result:", result);
            renderAttendanceView(result.data || []);
        });
}

function renderAttendanceView(data) {
    const tbody = document.getElementById("attendanceViewTableBody");
    tbody.innerHTML = "";

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

function openUpdateAttendanceModal(rawDate, displayDate) {
    isAttendanceUpdate = true;
    selectedUpdateDate = rawDate;

    /* IMPORTANT FIX */

    selectedAttendanceAssignmentId = selectedAttendanceHistoryId;

    /* CLOSE HISTORY MODAL */

    document.getElementById("attendanceHistoryModal").style.display = "none";

    /* TITLE */

    const classTitle = document.getElementById("attendanceHistoryTitle").innerText;

    document.getElementById("ongoingAttendanceTitle").innerText = `${displayDate} - ${classTitle}`;

    /* DATE */

    document.getElementById("attendanceDate").value = rawDate;

    /* BUTTON TEXT */

    document.querySelector(".ongoingtab-attendance-save-btn").innerText = "Update Attendance";

    /* OPEN MODAL */

    document.getElementById("ongoingAttendanceModal").style.display = "flex";

    fetchAttendanceStudents();
}