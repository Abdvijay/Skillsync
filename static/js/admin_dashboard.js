/* User Tab Pagination */
let currentPage = 1;
const limit = 5;
let totalRecords = 0;

/* Course Tab Pagination */
let currentCoursePage = 1;
const courseLimit = 5;
let totalCourseRecords = 0;

/* Class Tab Pagination */

let currentStaffPage = 1;
let currentAssignmentPage = 1;
const staffLimit = 5;
const assignmentLimit = 5;
let totalStaffRecords = 0;
let totalAssignmentRecords = 0;

/* Notification Tab Pagination */
let currentNotificationPage = 1;
let totalNotificationRecords = 0;
const notificationLimit = 5;
let notificationData = [];

// ✅ TAB CONTENT LOADER
function loadTab(tabName) {
    const content = document.getElementById("content-area");

    if (tabName === "dashboard") {
        content.innerHTML = `
            <!-- TOP SECTION -->

            <div class="admin-dashboard-main-container">
                <div class="dashboard-top-cards-container">
                    <div class="dashboard-count-card dashboard-student-card">
                        <div class="dashboard-card-top">
                            <div>
                                <p class="dashboard-card-title">Total Students</p>
                                <h2 id="dashboardStudentCount">0</h2>
                            </div>

                            <div class="dashboard-card-icon">👨‍🎓</div>
                        </div>

                        <span class="dashboard-card-subtext"> Registered students </span>
                    </div>

                    <div class="dashboard-count-card dashboard-staff-card">
                        <div class="dashboard-card-top">
                            <div>
                                <p class="dashboard-card-title">Total Staff</p>
                                <h2 id="dashboardStaffCount">0</h2>
                            </div>

                            <div class="dashboard-card-icon">👨‍🏫</div>
                        </div>

                        <span class="dashboard-card-subtext"> Active staff members </span>
                    </div>

                    <div class="dashboard-count-card dashboard-course-card">
                        <div class="dashboard-card-top">
                            <div>
                                <p class="dashboard-card-title">Total Courses</p>
                                <h2 id="dashboardCourseCount">0</h2>
                            </div>

                            <div class="dashboard-card-icon">📘</div>
                        </div>

                        <span class="dashboard-card-subtext"> Available courses </span>
                    </div>

                    <div class="dashboard-count-card dashboard-class-card">
                        <div class="dashboard-card-top">
                            <div>
                                <p class="dashboard-card-title">Active Classes</p>
                                <h2 id="dashboardClassCount">0</h2>
                            </div>

                            <div class="dashboard-card-icon">🏫</div>
                        </div>

                        <span class="dashboard-card-subtext"> OPEN + ONGOING </span>
                    </div>
                </div>
            </div>

            <!-- CHART SECTION -->

            <div class="dashboard-chart-main-container">
                <!-- LEFT CHART -->

                <div class="dashboard-chart-sub-container">
                    <div class="dashboard-chart-sub-header">
                        <h4>Student Growth</h4>
                    </div>
                    <canvas id="studentGrowthChart"></canvas>
                </div>

                <!-- RIGHT CHART -->

                <div class="dashboard-chart-small-container">
                    <div class="dashboard-chart-sub-header">
                        <h4>Class Status</h4>
                    </div>
                    <canvas id="classStatusChart"></canvas>
                </div>
            </div>

            <!-- LOWER SECTION -->

            <div class="dashboard-lower-main-container">
                <!-- RECENT CLASSES -->

                <div class="dashboard-recent-class-container">
                    <div class="dashboard-sub-container-header">
                        <h4>Newly Created Classes</h4>
                    </div>

                    <div class="dashboard-recent-class-list" id="dashboardRecentClassList"></div>
                </div>

                <!-- NOTIFICATIONS -->

                <div class="dashboard-notification-sub-container">
                    <div class="dashboard-sub-container-header">
                        <h4>Latest Notifications</h4>
                    </div>

                    <div class="dashboard-notification-scroll-container" id="dashboardNotificationContainer"></div>
                </div>
            </div>

        `;
        setTimeout(() => {
            loadDashboardCounts();
            loadDashboardCharts();
            loadRecentClasses();
            loadDashboardNotifications();
        }, 100);
    }

    currentPage = 1;
    currentCoursePage = 1;
    currentStaffPage = 1;
    currentAssignmentPage = 1;

    const searchIds = ["searchInput", "courseSearchInput", "staffSearchInput", "assignmentSearchInput"];

    searchIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.value = "";
        }
    });

    const filterIds = ["roleFilter", "courseDurationFilter", "assignmentTimeFilter"];

    filterIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.value = "";
        }
    });

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
                        <select id="regRole" onchange="toggleClassField()">
                            <option value="ADMIN">Admin</option>
                            <option value="STAFF">Staff</option>
                            <option value="STUDENT">Student</option>
                        </select>
                        <div id="purchasedCourseContainer" class="purchased-course-container">
                            <label class="purchased-course-label"> Purchased Course </label>
                            <select id="purchasedCourse" class="purchased-course-dropdown">
                                <option value="">Select Course</option>
                            </select>
                        </div>
                        <div id="classFieldContainer" class="create-classname-container">
                            <label class="create-classname-label"> Enter Class Name </label>
                            <input type="text" id="regClassName" placeholder="Enter Class Name" />
                        </div>
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
                        <select id="editRole" onchange="toggleEditClassField()" style="cursor: not-allowed;">
                            <option value="ADMIN">Admin</option>
                            <option value="STAFF">Staff</option>
                            <option value="STUDENT">Student</option>
                        </select>
                        <div id="editClassFieldContainer" class="edit-classname-container">
                            <label class="edit-classname-label"> Enter Class Name </label>
                            <input type="text" id="editClassName" placeholder="Enter Class Name" />
                        </div>
                        <div id="editPurchasedCourseContainer" class="edit-purchased-course-container">
                            <label class="edit-purchased-course-label"> Purchased Course </label>
                            <select id="editPurchasedCourse" class="edit-purchased-course-dropdown" style="cursor: not-allowed;">
                                <option value="">Select Course</option>
                            </select>
                        </div>
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
            <div class="courses-container">
                <div class="courses-header">
                    <!-- LEFT -->
                    <div class="courses-header-left">
                        <h4>Course Management</h4>
                    </div>

                    <!-- CENTER -->
                    <div class="courses-header-center">
                        <div class="course-controls">
                            <input type="text" id="courseSearchInput" placeholder="Search Coursename" onkeyup="searchCourses()" />
                            <select id="courseFilter">
                                <option value="">All Duration</option>
                                <option value="3 Months">3 Months</option>
                                <option value="6 Months">6 Months</option>
                            </select>
                            <button class="courses-search-btn" onclick="searchCourses()">Search</button>
                            <button class="courses-clear-btn" onclick="clearCourseSearch()">Clear</button>
                        </div>
                    </div>

                    <!-- RIGHT -->
                    <div class="courses-header-right">
                        <button class="add-course-btn" onclick="openCourseModal()">+ Add Course</button>
                    </div>
                </div>
            </div>

            <table class="courses-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Course Name</th>
                        <th>Course Code</th>
                        <th>Related Classes</th>
                        <th>Duration</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody id="coursesTableBody">
                    <tr>
                        <td colspan="5">Loading...</td>
                    </tr>
                </tbody>
            </table>

            <div class="pagination-controls">
                <button id="coursePrevBtn" onclick="prevCoursePage()">Previous</button>
                <span id="coursePageInfo"></span>
                <button id="courseNextBtn" onclick="nextCoursePage()">Next</button>
            </div>

            <!-- ADD COURSE MODAL -->

            <div class="modal-overlay" id="courseModal">
                <div class="course-modal-box">
                    <div class="modal-header">
                        <h5>Add Course</h5>
                        <span class="close-btn" onclick="closeCourseModal()">×</span>
                    </div>

                    <div class="modal-body">
                        <div class="course-form-row">
                            <label class="course-form-label"> Course Name </label>
                            <input id="courseName" class="course-form-input" type="text" />
                        </div>
                        <div class="course-form-row">
                            <label class="course-form-label"> Course Code </label>
                            <input id="courseCode" class="course-form-input" type="text" />
                        </div>
                        <div class="course-form-row">
                            <label class="course-form-label"> Related Classes(CSV) </label>
                            <textarea id="relatedClasses" class="course-form-textarea" rows="3"
                                placeholder="Example : Python, Django, React"
                                oninput="validateCourseFields()"
                            ></textarea>
                        </div>
                        <div id="relatedClassesCount" class="course-word-count">0 / 15 words</div>
                        <div class="course-form-row">
                            <label class="course-form-label"> Description </label>
                            <textarea id="courseDescription" class="course-form-textarea" rows="3" oninput="validateCourseFields()"></textarea>
                        </div>
                        <div id="courseDescriptionCount" class="course-word-count">0 / 15 words</div>
                        <div class="course-form-row">
                            <label class="course-form-label"> Duration </label>
                            <select id="courseDuration" class="course-form-input">
                                <option value="">Select Duration</option>
                                <option value="3 Months">3 Months</option>
                                <option value="6 Months">6 Months</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button id="addCourseBtn" class="create-btn" onclick="addCourse()">Add Course</button>
                    </div>
                </div>
            </div>

            <!-- EDIT COURSE MODAL -->

            <div class="modal-overlay" id="editCourseModal">
                <div class="course-modal-box">
                    <div class="modal-header">
                        <h5>Edit Course</h5>
                        <span class="close-btn" onclick="closeEditCourseModal()">×</span>
                    </div>

                    <div class="modal-body">
                        <input type="hidden" id="editCourseId" />
                        <div class="course-form-row">
                            <label class="course-form-label"> Course Name </label>
                            <input id="editCourseName" class="course-form-input" type="text" style = "cursor : not-allowed;"/>
                        </div>
                        <div class="course-form-row">
                            <label class="course-form-label"> Course Code </label>
                            <input id="editCourseCode" class="course-form-input" type="text" style = "cursor : not-allowed;"/>
                        </div>
                        <div class="course-form-row">
                            <label class="course-form-label"> Related Classes(CSV) </label>
                            <textarea id="editRelatedClasses" class="course-form-textarea" rows="3"
                                placeholder="Example:Python,Django,React"
                                oninput="validateCourseFields()"
                            ></textarea>
                        </div>
                        <div id="editRelatedClassesCount" class="course-word-count">0 / 15 words</div>
                        <div class="course-form-row">
                            <label class="course-form-label"> Description </label>
                            <textarea id="editCourseDescription" class="course-form-textarea" rows="3" oninput="validateCourseFields()"></textarea>
                        </div>
                        <div id="editCourseDescriptionCount" class="course-word-count">0 / 15 words</div>
                        <div class="course-form-row">
                            <label class="course-form-label"> Duration </label>
                            <select id="editCourseDuration" class="course-form-input">
                                <option value="">Select Duration</option>
                                <option value="3 Months">3 Months</option>
                                <option value="6 Months">6 Months</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button id="updateCourseBtn" class="create-btn" onclick="updateCourse()">Update Course</button>
                    </div>
                </div>
            </div>
        `; 
        fetchCourses(); 
    }

    if (tabName === "classes") {
        content.innerHTML = `

            <div class="staff-list-section">
                <div class="table-header">
                    <h4 class="section-title">Staff List</h4>
                    <div class="table-search-box">
                        <input type="text" id="staffSearchInput" placeholder="Search Staff" onkeyup="fetchStaffList()" />
                    </div>
                </div>
            
                <table class="classes-table">
                    <thead>
                        <tr>
                            <th>Staff Name</th>
                            <th>Specialization</th>
                            <th>Action</th>
                        </tr>
                    </thead>
            
                    <tbody id="staffTableBody">
                        <tr>
                            <td colspan="3">Loading Staff...</td>
                        </tr>
                    </tbody>
                </table>
            
                <div class="pagination-controls">
                    <button id="staffPrevBtn" onclick="prevStaffPage()">Previous</button>
                    <span id="staffPageInfo"></span>
                    <button id="staffNextBtn" onclick="nextStaffPage()">Next</button>
                </div>
            </div>
            
            <div class="assignment-section">
                <div class="table-header">
                    <h4 class="section-title">Assignment Management</h4>
                    <div class="table-search-box">
                        <input type="text" id="assignmentSearchInput" placeholder="Search Assignments" onkeyup="handleAssignmentFilterChange()" />
                    </div>
            
                    <div class="assignment-filters">
                        <select id="assignmentTimeFilter" onchange="handleAssignmentFilterChange()">
                            <option value="">All Timings</option>
                        </select>
                        <button class="clear-filter-btn" onclick="clearAssignmentFilters()">Clear</button>
                    </div>
                </div>
            
                <table class="classes-table">
                    <thead>
                        <tr>
                            <th>Staff Name</th>
                            <th>Class Name</th>
                            <th>Timing</th>
                            <th>Assigned Date</th>
                            <th>Start Date</th>
                            <th>Limit</th>
                            <th>Class Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
            
                    <tbody id="classesTableBody">
                        <tr>
                            <td colspan="7">Loading Assignments...</td>
                        </tr>
                    </tbody>
                </table>
            
                <!-- PAGINATION -->
            
                <div class="pagination-controls">
                    <button id="assignmentPrevBtn" onclick="prevAssignmentPage()">Previous</button>
                    <span id="assignmentPageInfo"></span>
                    <button id="assignmentNextBtn" onclick="nextAssignmentPage()">Next</button>
                </div>
            </div>
            
            <!-- ASSIGN MODAL -->
            
            <div class="modal-overlay" id="assignModal">
                <div class="modal-box">
                    <div class="modal-header">
                        <h5>Assign Staff Timing</h5>
                        <span class="close-btn" onclick="closeAssignModal()">×</span>
                    </div>
            
                    <div class="modal-body">
                        <input type="hidden" id="assignStaffId" />
                        <input type="text" id="assignStaffName" disabled />
                        <select id="assignClassName">
                            <option value="">Select Class</option>
                        </select>
            
                        <select id="assignClassTime">
                            <option value="">Select Timing</option>
                            <option value="09 AM - 10 AM">09 AM - 10 AM</option>
                            <option value="10 AM - 11 AM">10 AM - 11 AM</option>
                            <option value="11 AM - 12 PM">11 AM - 12 PM</option>
                            <option value="12 PM - 01 PM">12 PM - 01 PM</option>
                            <option value="03 PM - 04 PM">03 PM - 04 PM</option>
                            <option value="04 PM - 05 PM">04 PM - 05 PM</option>
                            <option value="05 PM - 06 PM">05 PM - 06 PM</option>
                            <option value="06 PM - 07 PM">06 PM - 07 PM</option>
                            <option value="07 PM - 08 PM">07 PM - 08 PM</option>
                        </select>
                        <div class="notification-form-row">
                            <label>
                                Class Start Date
                            </label>
                            <input type="date" id="assignStartDate" min="${new Date().toISOString().split("T")[0]}">
            
                        </div>
                        <div class="notification-form-row">
                            <label> Student Limit </label>
                            <input type="number" id="studentLimit" value="50" min="1" />
                        </div>
                    </div>
            
                    <div class="modal-footer">
                        <button class="create-btn" onclick="assignStaff()">Assign</button>
                    </div>
                </div>
            </div>
            
            <!-- EDIT SPECIALIZATION MODAL -->
            
            <div class="modal-overlay" id="editSpecializationModal">
                <div class="modal-box">
                    <div class="modal-header">
                        <h5>Edit Specialization</h5>
                        <span class="close-btn" onclick="closeEditSpecializationModal()"> × </span>
                    </div>
            
                    <div class="modal-body">
                        <input type="hidden" id="editStaffId" />
                        <input type="text" id="editStaffName" disabled style = "cursor : not-allowed;"/>
                        <input type="text" id="editSpecialization" placeholder="Python, Django" />
                    </div>
            
                    <div class="modal-footer">
                        <button class="create-btn" onclick="updateSpecialization()">Update</button>
                    </div>
                </div>
            </div>
            
            <!-- UPDATE ASSIGNMENT MODAL -->
            
            <div class="modal-overlay" id="updateTimingModal">
                <div class="modal-box">
                    <div class="modal-header">
                        <h5>Update Assignment</h5>
                        <span class="close-btn" onclick="closeUpdateAssignmentModal()"> × </span>
                    </div>
            
                    <div class="modal-body">
                        <input type="hidden" id="updateStaffId" />
                        <input type="text" id="updateStaffName" disabled style = "cursor : not-allowed;"/>
                        <input type="text" id="updateClassName" disabled style = "cursor : not-allowed;"/>
                        <select id="updateClassTime">
                            <option value="">Select Timing</option>
                            <option value="09 AM - 10 AM">09 AM - 10 AM</option>
                            <option value="10 AM - 11 AM">10 AM - 11 AM</option>
                            <option value="11 AM - 12 PM">11 AM - 12 PM</option>
                            <option value="12 PM - 01 PM">12 PM - 01 PM</option>
                            <option value="03 PM - 04 PM">03 PM - 04 PM</option>
                            <option value="04 PM - 05 PM">04 PM - 05 PM</option>
                            <option value="05 PM - 06 PM">04 PM - 06 PM</option>
                            <option value="06 PM - 07 PM">06 PM - 07 PM</option>
                            <option value="07 PM - 08 PM">07 PM - 08 PM</option>
                        </select>
                        <div class="notification-form-row">
                            <label> Start Date </label>
                            <input type="date" id="updateStartDate" min="${new Date().toISOString().split("T")[0]}" />
                        </div>
            
                        <div class="notification-form-row">
                            <label> Student Limit </label>
                            <input type="number" id="updateStudentLimit" min="1" />
                        </div>
            
                        <div class="notification-form-row">
                            <label> Class Status </label>
                            <select id="updateClassStatus">
                                <option value="OPEN">OPEN</option>
                                <option value="ONGOING">ONGOING</option>
                                <option value="FULL">FULL</option>
                                <option value="COMPLETED">COMPLETED</option>
                            </select>
                        </div>
                    </div>
            
                    <div class="modal-footer">
                        <button class="create-btn" onclick="updateStaffAssignment()">Update Assignment</button>
                    </div>
                </div>
            </div>
            
        `;
        fetchStaffList();
        fetchClasses();
        loadTimingFilters();
    }

    if (tabName === "notifications") {
        content.innerHTML = `
            <div class="notification-page">
                <div class="notification-topbar">
                    <h3>Notifications Feed</h3>
                    <div class="notification-controls">
                        <input type="text" id="notificationSearch" placeholder="Search notifications..." onkeyup="handleNotificationFilterChange()" />
            
                        <select id="notificationCategoryFilter" onchange="handleNotificationFilterChange()">
                            <option value="">All Categories</option>
                            <option>New Batch</option>
                            <option>Institution Leave</option>
                            <option>Staff Meeting</option>
                            <option>Mock Assessment</option>
                            <option>Particular Staff Leave</option>
                            <option>Fee Reminder</option>
                            <option>Scheduled Interview</option>
                            <option>Other</option>
                        </select>
            
                        <button class="clear-filter-btn" onclick="clearNotificationFilters()">Clear</button>
            
                        <button class="add-notification-btn" onclick="openNotificationModal()">+ Add Notification</button>
                    </div>
                </div>
            
                <div id="notificationFeed">Loading...</div>
                <div id="notificationPagination"></div>
            </div>
            
            <!-- MODAL -->
            
            <div class="modal-overlay" id="notificationModal">
                <div class="modal-box">
                    <div class="modal-header">
                        <h5 id="notificationModalTitle">Add Notification</h5>
                        <span class="close-btn" onclick="closeNotificationModal()"> × </span>
                    </div>
            
                    <div class="modal-body">
                        <input type="hidden" id="notificationId" />
            
                        <!-- POSTED BY -->
                        <input type="text" id="notificationAdmin" disabled />
            
                        <!-- CATEGORY -->
                        <select id="notificationCategory" onchange="handleNotificationCategory()">
                            <option value="">Select Category</option>
                            <option>New Batch</option>
                            <option>Institution Leave</option>
                            <option>Staff Meeting</option>
                            <option>Mock Assessment</option>
                            <option>Particular Staff Leave</option>
                            <option>Fee Reminder</option>
                            <option>Scheduled Interview</option>
                            <option>Other</option>
                        </select>
            
                        <!-- DYNAMIC FIELDS -->
                        <div id="dynamicNotificationFields"></div>
            
                        <!-- DESCRIPTION -->
                        <textarea id="notificationContent" rows="3" placeholder="Description" oninput="validateNotificationContent()"></textarea>
                        <div id="notificationWordCount" class="notification-word-count">0 / 50 words</div>
            
                        <!-- PRIORITY -->
                        <select id="notificationPriority">
                            <option value="Normal">Normal</option>
                            <option value="Important">Important</option>
                        </select>
                    </div>
            
                    <div class="modal-footer">
                        <button id="publishNotificationBtn" class="create-btn" onclick="saveNotification()">Publish</button>
                    </div>
                </div>
            </div>
        `;
        loadNotifications();
    }

    if (tabName === "enrollments") { 
        content.innerHTML = `
            <div class="enrollment-main-container">
                <div class="enrollment-top-header">
                    <input type="text" id="enrollmentSearch" placeholder="Search Student or Class..." />
                    <button class="enrollment-add-btn" onclick="openEnrollmentModal()">Enroll Student</button>
                </div>

                <div class="enrollment-table-container">
                    <table class="enrollment-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Class</th>
                                <th>Trainer</th>
                                <th>Timing</th>
                                <th>Start Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody id="enrollmentTableBody">
                            <tr>
                                <td colspan="7" class="enrollment-no-data">No Enrollments Found</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="enrollment-pagination-container">
                    <button>Previous</button>
                    <span> Page 1 </span>
                    <button>Next</button>
                </div>
            </div>

            <!-- MODAL -->

            <div id="enrollmentModal" class="enrollment-modal-overlay" style="display: none">
                <div class="enrollment-modal-content">
                    <div class="enrollment-modal-header">
                        <h2>Enroll Student</h2>
                        <span class="enrollment-close-btn" onclick="closeEnrollmentModal()">×</span>
                    </div>

                    <div class="enrollment-form-row">
                        <label> Student </label>
                        <select id="enrollmentStudent">
                            <option value="">Select Student</option>
                        </select>
                    </div>

                    <div class="enrollment-form-row">
                        <label> Class </label>
                        <select id="enrollmentClass" onchange="showEnrollmentPreview()">
                            <option value="">Select Class</option>
                        </select>
                    </div>

                    <div class="enrollment-preview-container">
                        <p>
                            <strong> Trainer: </strong>
                            <span id="previewTrainer">
                                -
                            </span>
                        </p>

                        <p>
                            <strong> Timing: </strong>
                            <span id="previewTiming">
                                -
                            </span>
                        </p>

                        <p>
                            <strong> Start Date: </strong>
                            <span id="previewStartDate">
                                -
                            </span>
                        </p>

                        <p>
                            <strong> Available Slot: </strong>
                            <span id="previewSlot">
                                -
                            </span>
                        </p>
                    </div>

                    <div class="enrollment-modal-footer">
                        <button
                            class="enrollment-cancel-btn"
                            onclick="closeEnrollmentModal()"
                        >
                            Cancel
                        </button>
                        <button class="enrollment-create-btn" onclick="createEnrollment()">Enroll</button>
                    </div>
                </div>
            </div>
        `; 
        loadEnrollments();
    }

    document.querySelectorAll(".nav-link").forEach((tab) => {
        tab.classList.remove("active");
    });

    const clickedTab = document.querySelector(
        `[onclick="loadTab('${tabName}')"]`,
    );

    if (clickedTab) {
        clickedTab.classList.add("active");
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
    window.location.href = "/";
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

function fetchUsers() {
    const token = localStorage.getItem("access_token");

    fetch(`http://127.0.0.1:8000/user/get_all_users/?page=${currentPage}&limit=${limit}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
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
    document.getElementById("regRole").value = "ADMIN";
    toggleClassField();
    loadPurchasedCourses();
}

function closeRegisterModal() {
    const modal = document.getElementById("registerModal");
    modal.style.display = "none";
}

function openEditModal(id, username, email, phone, role, class_name, purchased_course_id) {
    document.getElementById("editUserId").value = id;
    document.getElementById("editUsername").value = username;
    document.getElementById("editEmail").value = email;
    document.getElementById("editPhone").value = phone;
    document.getElementById("editRole").value = role;
    document.getElementById("editClassName").value = class_name || "";
    loadPurchasedCoursesForEdit();
    toggleEditClassField();
    document.getElementById("editPurchasedCourse").disabled = false;
    document.getElementById("editRole").disabled = true;

    setTimeout(() => {
        if (role === "STUDENT") {
                document.getElementById("editPurchasedCourse").value = purchased_course_id || "";
                document.getElementById("editPurchasedCourse").disabled = true;
        }
    }, 300);

    if (role === "STAFF") {
        document.getElementById("editClassFieldContainer").style.display = "flex";
    }

    document.getElementById("editUserModal").style.display = "flex";
}

function closeEditModal() {
    document.getElementById("editUserModal").style.display = "none";
}

function toggleClassField() {
    const role = document.getElementById("regRole").value;
    const field = document.getElementById("classFieldContainer");
    const courseContainer = document.getElementById("purchasedCourseContainer");

    /* RESET BOTH */

    field.style.display = "none";
    courseContainer.style.display = "none";

    /* STUDENT */

    if (role === "STUDENT") {
        courseContainer.style.display = "flex";
    } 
    
    /* STAFF */

    else if (role === "STAFF") {
        field.style.display = "flex";
    }
}

function loadPurchasedCoursesForEdit() {
    const token = localStorage.getItem("access_token");

    fetch("http://127.0.0.1:8000/courses/get_course_dropdown/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            const dropdown = document.getElementById("editPurchasedCourse");

            dropdown.innerHTML = `
                <option value="">
                    Select Course
                </option>
            `;

            result.data.forEach((item) => {
                dropdown.innerHTML += `
                    <option value="${item.id}">
                        ${item.course_name}
                    </option>
                `;
            });
        });
}

function loadPurchasedCourses() {
    const token = localStorage.getItem("access_token");

    fetch("http://127.0.0.1:8000/courses/get_course_dropdown/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            console.log(result);
            const dropdown = document.getElementById("purchasedCourse");
            dropdown.innerHTML = `
                <option value="">
                    Select Course
                </option>
            `;

            result.data.forEach((item) => {
                dropdown.innerHTML += `
                    <option value="${item.id}">
                        ${item.course_name}
                    </option>
                `;
            });
        });
}

function toggleEditClassField() {
    const role = document.getElementById("editRole").value;
    const field = document.getElementById("editClassFieldContainer");
    const courseField = document.getElementById("editPurchasedCourseContainer");

    /* RESET BOTH */

    field.style.display = "none";
    courseField.style.display = "none";

    /* STAFF */

    if (role === "STAFF") {
        field.style.display = "flex";
    } 
    
    /* STUDENT */
    
    else if (role === "STUDENT") {
        courseField.style.display = "flex";
    }
}

function updateUser() {
    const token = localStorage.getItem("access_token");
    id = document.getElementById("editUserId").value.trim();
    username = document.getElementById("editUsername").value.trim();
    email = document.getElementById("editEmail").value.trim();
    phone = document.getElementById("editPhone").value.trim();
    role = document.getElementById("editRole").value.trim();
    class_name = document.getElementById("editClassName")?.value || "None";
    purchased_course_id = document.getElementById("editPurchasedCourse")?.value || "";

    if (!username || !email || !role || !phone || !class_name || !purchased_course_id) {
        alert("All fields are required");
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Enter a valid email address");
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

    const data = { id, username, email, phone, role, class_name, purchased_course_id };

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
	if(!result.data.length) { 
		tbody.innerHTML = `
            <tr>
                <td colspan="6">No Users Found</td>
            </tr>
        `; 
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
                    <button
                        class="action-btn edit-btn"
                        onclick="openEditModal(${user.id}, '${user.username}', '${user.email}', '${user.phone}', '${user.role}', '${user.class_name}', '${user.purchased_course_id || ""}')"
                    >
                        Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            </tr>
        `; }); 
		console.log("Total Records:", totalRecords); 
		renderPagination(); 
}

function renderPagination() {
    const totalPages = Math.ceil(totalRecords / limit);
    document.getElementById("pageInfo").innerText = `Page ${currentPage} of ${totalPages || 1}`;
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

/* HERE COURSE MODEL RELATED FUNCTIONS */

function openCourseModal() {
    document.getElementById("courseModal").style.display = "flex";
}

function closeCourseModal() {
    document.getElementById("courseModal").style.display = "none";
}

function validateCourseFields() {
    /* RELATED CLASS COUNT */

    function countRelatedClasses(text) {
        return text
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item).length;
    }

    /* DESCRIPTION COUNT */

    function countDescriptionWords(text) {
        return text
            .trim()
            .split(/\s+/)
            .filter((word) => word).length;
    }

    /* ======================
       ADD COURSE
    ====================== */

    const relatedClasses = document.getElementById("relatedClasses")?.value || "";
    const description = document.getElementById("courseDescription")?.value || "";
    const relatedCount = countRelatedClasses(relatedClasses);
    const descriptionCount = countDescriptionWords(description);
    const relatedCounter = document.getElementById("relatedClassesCount");
    const descriptionCounter = document.getElementById("courseDescriptionCount");
    const addBtn = document.getElementById("addCourseBtn");

    if (relatedCounter) {
        relatedCounter.innerText = `${relatedCount} / 15 words`;
    }

    if (descriptionCounter) {
        descriptionCounter.innerText = `${descriptionCount} / 15 words`;
    }

    if (addBtn) {
        const disableAdd = relatedCount > 15 || descriptionCount > 15;
        addBtn.disabled = disableAdd;
        addBtn.style.cursor = disableAdd ? "not-allowed" : "pointer";
        addBtn.style.opacity = disableAdd ? "0.6" : "1";
    }

    /* ======================
       EDIT COURSE
    ====================== */

    const editRelatedClasses = document.getElementById("editRelatedClasses")?.value || "";
    const editDescription = document.getElementById("editCourseDescription")?.value || "";
    const editRelatedCount = countRelatedClasses(editRelatedClasses);
    const editDescriptionCount = countDescriptionWords(editDescription);
    const editRelatedCounter = document.getElementById("editRelatedClassesCount");
    const editDescriptionCounter = document.getElementById("editCourseDescriptionCount");
    const updateBtn = document.getElementById("updateCourseBtn");

    if (editRelatedCounter) {
        editRelatedCounter.innerText = `${editRelatedCount} / 15 words`;
    }

    if (editDescriptionCounter) {
        editDescriptionCounter.innerText = `${editDescriptionCount} / 15 words`;
    }

    if (updateBtn) {
        const disableUpdate = editRelatedCount > 15 || editDescriptionCount > 15;
        updateBtn.disabled = disableUpdate;
        updateBtn.style.cursor = disableUpdate ? "not-allowed" : "pointer";
        updateBtn.style.opacity = disableUpdate ? "0.6" : "1";
    }
}

function addCourse() {
    const token = localStorage.getItem("access_token");

    const data = {
        course_name: document.getElementById("courseName").value,
        course_code: document.getElementById("courseCode").value,
        related_classes : document.getElementById("relatedClasses").value.trim(),
        description: document.getElementById("courseDescription").value,
        duration: document.getElementById("courseDuration").value,
        created_by: localStorage.getItem("username"),
    };

    if (!data.course_name || !data.course_code || !data.related_classes || !data.description || !data.duration) {
        alert("All fields are required");
        return;
    }

    fetch("http://127.0.0.1:8000/courses/add_course/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((result) => {
            if (result.status === "Success") {
                alert("Course Added Successfully");
                document.getElementById("courseName").value = "";
                document.getElementById("courseCode").value = "";
                document.getElementById("relatedClasses").value = "";
                document.getElementById("courseDescription").value = "";
                document.getElementById("courseDuration").value = "";
                closeCourseModal();
                fetchCourses();
            } else {
                alert(result.message);
            }
        });
}

function openEditCourseModal(id, name, code, related_classes, description, duration) {
    document.getElementById("editCourseModal").style.display = "flex";
    document.getElementById("editCourseId").value = id;
    document.getElementById("editCourseName").value = name;
    document.getElementById("editCourseName").disabled = true;
    document.getElementById("editRelatedClasses").value = related_classes || "";
    document.getElementById("editCourseCode").value = code;
    document.getElementById("editCourseCode").disabled = true;
    document.getElementById("editCourseDescription").value = description;
    document.getElementById("editCourseDuration").value = duration;
    setTimeout(() => {
        validateCourseFields();
    }, 100);
}

function closeEditCourseModal() {
    document.getElementById("editCourseModal").style.display = "none";
}

function updateCourse() {
    const token = localStorage.getItem("access_token");
    const data = {
        id: document.getElementById("editCourseId").value,
        course_name: document.getElementById("editCourseName").value,
        course_code: document.getElementById("editCourseCode").value,
        related_classes : document.getElementById("editRelatedClasses").value.trim(),
        description: document.getElementById("editCourseDescription").value,
        duration: document.getElementById("editCourseDuration").value,
        updated_by: localStorage.getItem("username"),
    };

    fetch("http://127.0.0.1:8000/courses/update_course/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((result) => {
            if (result.status === "Success") {
                alert("Course Updated Successfully");
                closeEditCourseModal();
                fetchCourses();
            } else {
                alert(result.message);
            }
        });
}

function deleteCourse(id) {
    const token = localStorage.getItem("access_token");
    const confirmDelete = confirm("Are you sure you want to delete this course?");

    if (!confirmDelete) {
        return;
    }
    fetch("http://127.0.0.1:8000/courses/delete_course/", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
    })
        .then((res) => res.json())
        .then((result) => {
            if (result.status === "Success") {
                alert("Course Deleted Successfully");
                fetchCourses();
            } else {
                alert(result.message);
            }
        });
}

function searchCourses() {
    currentCoursePage = 1;
    const token = localStorage.getItem("access_token");
    const course_name = document.getElementById("courseSearchInput").value;
    const duration = document.getElementById("courseFilter").value;
    fetch(
        `http://127.0.0.1:8000/courses/search_courses/?course_name=${course_name}&duration=${duration}&page=${currentCoursePage}&limit=${courseLimit}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then(renderCourses);
}

function renderCourses(result) {
	totalCourseRecords = result.total;
	const tbody = document.getElementById("coursesTableBody");
	tbody.innerHTML = "";
	if (!result.data.length) { 
		tbody.innerHTML = `
            <tr>
                <td colspan="6">No Courses Found</td>
            </tr>
        `; 
		renderCoursePagination(); 
		return; 
	} 
	result.data.forEach((course) => { 
        console.log(course);
		tbody.innerHTML += `
            <tr>
                <td>${course.id}</td>
                <td>${course.course_name}</td>
                <td>${course.course_code}</td>
                <td class="course-related-classes">
                    ${ course.related_classes ? ( course.related_classes .length > 40 ? course.related_classes .substring( 0, 40 ) +
                    "..." : course.related_classes ) : "-" }
                </td>
                <td>${course.duration}</td>
                <td class="course-description-cell">
                    ${ course.description ? ( course.description .length > 50 ? course.description .substring( 0, 50 ) + "..." :
                    course.description ) : "-" }
                </td>
                <td>
                    <button
                        class="action-btn edit-btn"
                        onclick="openEditCourseModal(
                                                    ${course.id},
                                                    '${course.course_name}',
                                                    '${course.course_code}',
                                                    '${course.related_classes || ""}',
                                                    '${course.description}',
                                                    '${course.duration}'
                                                )"
                    >
                        Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteCourse(${course.id})">Delete</button>
                </td>
            </tr>
		`; 
	}); 
	console.log(result); 
	renderCoursePagination(); 
}

function renderCoursePagination() {
    const totalPages = Math.ceil(totalCourseRecords / courseLimit);

    // NO COURSES FOUND
    if (totalCourseRecords === 0) {
        document.getElementById("coursePageInfo").innerText = "";
        document.getElementById("coursePrevBtn").style.display = "none";
        document.getElementById("courseNextBtn").style.display = "none";
        return;
    }

    // SHOW BUTTONS
    document.getElementById("coursePrevBtn").style.display = "inline-block";
    document.getElementById("courseNextBtn").style.display = "inline-block";
    document.getElementById("coursePageInfo").innerText = `Page ${currentCoursePage} of ${totalPages}`;
    document.getElementById("coursePrevBtn").disabled = currentCoursePage === 1;
    document.getElementById("courseNextBtn").disabled = currentCoursePage >= totalPages;
}

function nextCoursePage() {
    currentCoursePage++;
    searchOrFetchCourses();
}

function prevCoursePage() {
    if (currentCoursePage > 1) {
        currentCoursePage--;
        searchOrFetchCourses();
    }
}

function searchOrFetchCourses() {
    const search = document.getElementById("courseSearchInput").value;
    const filter = document.getElementById("courseFilter").value;

    if (search || filter) {
        searchCourses();
    } else {
        fetchCourses();
    }
}

function clearCourseSearch() {
    document.getElementById("courseSearchInput").value = "";
    document.getElementById("courseFilter").value = "";
    currentCoursePage = 1;
    fetchCourses();
}

function fetchCourses() {
    const token = localStorage.getItem("access_token");

    fetch(`http://127.0.0.1:8000/courses/get_all_courses/?page=${currentCoursePage}&limit=${courseLimit}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            const tbody = document.getElementById("coursesTableBody");
            console.log(result);
            tbody.innerHTML = "";
            result.data.forEach((course) => {
                tbody.innerHTML += `
                    <tr>
                        <td>${course.id}</td>
                        <td>${course.course_name}</td>
                        <td>${course.course_code}</td>
                        <td class="course-related-classes">
                            ${ course.related_classes ? ( course.related_classes .length > 40 ? course.related_classes .substring( 0, 40 ) +
                            "..." : course.related_classes ) : "-" }
                        </td>
                        <td>${course.duration}</td>
                        <td class="course-description-cell">
                            ${ course.description ? ( course.description .length > 50 ? course.description .substring( 0, 50 ) + "..." :
                            course.description ) : "-" }
                        </td>
                        <td>
                            <button
                                class="action-btn edit-btn"
                                onclick="openEditCourseModal(
                                                ${course.id},
                                                '${course.course_name}',
                                                '${course.course_code}',
                                                '${course.related_classes || ""}',
                                                '${course.description}',
                                                '${course.duration}'
                                            )"
                            >
                                Edit
                            </button>
                            <button class="action-btn delete-btn" onclick="deleteCourse(${course.id})">Delete</button>
                        </td>
                    </tr>
            	`;
            });
            renderCourses(result);
        });
}

/* Class Tab Functionality */

function loadTimingFilters() {
    const token = localStorage.getItem("access_token");

    fetch("http://127.0.0.1:8000/classes/get_assignment_timings/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            const dropdown = document.getElementById("assignmentTimeFilter");
            const currentValue = dropdown.value;
            dropdown.innerHTML = `
                <option value="">
                    All Timings
                </option>
            `;

            if (!result.data) return;

            result.data.forEach((time) => {
                dropdown.innerHTML += `
                    <option value="${time}">
                        ${time}
                    </option>
                `;
            });
            dropdown.value = currentValue;
        });
}

function fetchClasses() {
    const token = localStorage.getItem("access_token");
    const search = document.getElementById("assignmentSearchInput")?.value || "";
    const classTime = document.getElementById("assignmentTimeFilter")?.value || "";

    fetch(
        `http://127.0.0.1:8000/classes/get_all_assignments/?page=${currentAssignmentPage}&limit=${assignmentLimit}&search=${search}&class_time=${classTime}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then(renderClasses);
}

function handleAssignmentFilterChange() {
    currentAssignmentPage = 1;
    fetchClasses();
}

function clearAssignmentFilters() {
    document.getElementById("assignmentSearchInput").value = "";
    document.getElementById("assignmentTimeFilter").value = "";
    currentAssignmentPage = 1;
    fetchClasses();
}

function fetchStaffList() {
    const token = localStorage.getItem("access_token");
    const search = document.getElementById("staffSearchInput")?.value || "";

    fetch(
        `http://127.0.0.1:8000/classes/get_staff_list/?page=${currentStaffPage}&limit=${staffLimit}&search=${search}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => res.json())
        .then((result) => {
            totalStaffRecords = result.total;
            const tbody = document.getElementById("staffTableBody");
            tbody.innerHTML = "";
            if (!result.data.length) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="3">
                            No Staff Found
                        </td>
                    </tr>
                `;

                renderStaffPagination();
                return;
            }

            result.data.forEach((user) => {
                tbody.innerHTML += `
                    <tr>
                        <td>${user.username}</td>
                        <td>${user.class_name}</td>
                        <td>
                            <button class="assign-btn" onclick="openAssignModal(${user.id},'${user.username}','${user.class_name}')">
                                Assign
                            </button>
                            <button class="edit-btn" onclick="openEditSpecializationModal(${user.id},'${user.username}','${user.class_name}')">
                                Edit
                            </button>
                        </td>
                    </tr>
                `;
            });
            renderStaffPagination();
        });
}

function renderClasses(result) {
    totalAssignmentRecords = result.total;
    const tbody = document.getElementById("classesTableBody");
    tbody.innerHTML = "";

    if (!result.data || result.data.length === 0) {
        tbody.innerHTML = `
                <tr>
                    <td colspan="7">No Assignments Found</td>
                </tr>
        `;

        renderClassPagination();
        return;
    }

    result.data.forEach((item) => { 
        const actionBtn = `
            <button
                class="assign-btn"
                onclick="openUpdateAssignmentModal(
                                    ${item.id},
                                    '${item.staff_name}',
                                    '${item.class_name}',
                                    '${item.class_time}',
                                    '${item.class_start_date}',
                                    '${item.student_limit}',
                                    '${item.class_status}'
                                )"
            >
                Update Assignment
            </button>

            <button
                class="revoke-btn"
                onclick="revokeAssignment(
                                    ${item.id}
                                )"
            >
                Revoke
            </button>
        `; 
        tbody.innerHTML += `
            <tr>
                <td>${item.staff_name}</td>
                <td>${item.class_name}</td>
                <td>${item.class_time}</td>
                <td>${item.assigned_date || "-"}</td>
                <td>${item.class_start_date ? item.class_start_date : "-"}</td>
                <td>${item.student_limit}</td>
                <td>
                    <span class="class-status-badge"> ${item.class_status} </span>
                </td>
                <td>${actionBtn}</td>
            </tr>
        `; 
    });
    renderClassPagination();
}

function openClassModal() {
    document.getElementById("classModal").style.display = "flex";
}

function closeClassModal() {
    document.getElementById("classModal").style.display = "none";
}

function openAssignModal(id, username, specialization) {
    document.getElementById("assignModal").style.display = "flex";
    document.getElementById("assignStaffId").value = id;
    document.getElementById("assignStaffName").value = username;
    const dropdown = document.getElementById("assignClassName");

    dropdown.innerHTML = `
        <option value="">
            Select Class
        </option>
    `;

    const classes = specialization.split(",");

    classes.forEach((cls) => {
        dropdown.innerHTML += `
            <option value="${cls.trim()}">
                ${cls.trim()}
            </option>
        `;
    });
}

function closeAssignModal() {
    document.getElementById("assignModal").style.display = "none";
    document.getElementById("assignClassTime").value = "";
    document.getElementById("assignClassName").value = "";
    document.getElementById("assignStartDate").value = "";
}

function openUpdateAssignmentModal(id, username, className, classTime, classStartDate, studentLimit, classStatus) {
    document.getElementById("updateTimingModal").style.display = "flex";
    document.getElementById("updateStaffId").value = id;
    document.getElementById("updateStaffName").value = username;
    document.getElementById("updateClassName").value = className;
    document.getElementById("updateClassTime").value = classTime;
    document.getElementById("updateStartDate").value = classStartDate;
    document.getElementById("updateStudentLimit").value = studentLimit;
    document.getElementById("updateClassStatus").value = classStatus;
}

function closeUpdateAssignmentModal() {
    document.getElementById("updateTimingModal").style.display = "none";
}

function openEditSpecializationModal(id, username, specialization) {
    document.getElementById("editSpecializationModal").style.display = "flex";
    document.getElementById("editStaffId").value = id;
    document.getElementById("editStaffName").value = username;
    document.getElementById("editSpecialization").value = specialization;
}

function closeEditSpecializationModal() {
    document.getElementById("editSpecializationModal").style.display = "none";
}

function assignStaff() {
    const token = localStorage.getItem("access_token");

    const data = {
        staff_id: document.getElementById("assignStaffId").value,
        class_name: document.getElementById("assignClassName").value,
        class_time: document.getElementById("assignClassTime").value,
        class_start_date: document.getElementById("assignStartDate").value,
        student_limit: document.getElementById("studentLimit").value,
    };

    fetch("http://127.0.0.1:8000/classes/add_assignment/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((result) => {
            if (result.status === "Success") {
                alert("Assignment Created Successfully");
                document.getElementById("assignClassTime").value = "";
                document.getElementById("assignClassName").value = "";
                document.getElementById("assignStartDate").value = "";
                closeAssignModal();
                fetchClasses();
                loadTimingFilters();
            } else {
                alert(result.message);
            }
        });
}

function updateStaffAssignment() {
    const token = localStorage.getItem("access_token");
    const data = {
        id: document.getElementById("updateStaffId").value,
        class_time: document.getElementById("updateClassTime").value,
        class_start_date: document.getElementById("updateStartDate").value,
        student_limit: document.getElementById("updateStudentLimit").value,
        class_status: document.getElementById("updateClassStatus").value,
    };

    fetch("http://127.0.0.1:8000/classes/update_assignment_timing/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((result) => {
            if (result.status === "Success") {
                console.log(result);
                alert("Timing Updated Successfully");
                closeUpdateAssignmentModal();
                fetchClasses();
                loadTimingFilters();
            } else {
                alert(result.message);
            }
        });
}

function revokeAssignment(id) {
    const confirmAction = confirm("Are you sure to remove this assignment?");

    if (!confirmAction) return;
    const token = localStorage.getItem("access_token");

    fetch("http://127.0.0.1:8000/classes/revoke_assignment/", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
    })
        .then((res) => res.json())
        .then((result) => {
            if (result.status === "Success") {
                alert("Assignment Removed Successfully");
                
                // If last record removed from page
                const remainingRows = document.querySelectorAll("#classesTableBody tr").length;
                if (remainingRows === 1 && currentAssignmentPage > 1) {
                    currentAssignmentPage = 1;
                }

                fetchClasses();
                loadTimingFilters();
            } else {
                alert(result.message);
            }
        });
}

function updateSpecialization() {
    const token = localStorage.getItem("access_token");
    const data = {
        id: document.getElementById("editStaffId").value,
        class_name: document.getElementById("editSpecialization").value,
    };

    fetch("http://127.0.0.1:8000/classes/update_specialization/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((result) => {
            if (result.status === "Success") {
                alert("Specialization Updated Successfully");
                closeEditSpecializationModal();
                fetchStaffList();
            } else {
                alert(result.message);
            }
        });
}

function renderStaffPagination() {
    const totalPages = Math.ceil(totalStaffRecords / staffLimit);

    // NO STAFF FOUND
    if (totalStaffRecords === 0) {
        document.getElementById("staffPageInfo").innerText = "";
        document.getElementById("staffPrevBtn").style.display = "none";
        document.getElementById("staffNextBtn").style.display = "none";
        return;
    }

    // SHOW BUTTONS
    document.getElementById("staffPrevBtn").style.display = "inline-block";
    document.getElementById("staffNextBtn").style.display = "inline-block";
    document.getElementById("staffPageInfo").innerText = `Page ${currentStaffPage} of ${totalPages}`;
    document.getElementById("staffPrevBtn").disabled = currentStaffPage === 1;
    document.getElementById("staffNextBtn").disabled = currentStaffPage >= totalPages;
}

function nextStaffPage() {
    currentStaffPage++;
    fetchStaffList();
}

function prevStaffPage() {
    if (currentStaffPage > 1) {
        currentStaffPage--;
        fetchStaffList();
    }
}

function renderClassPagination() {
    const totalPages = Math.ceil(totalAssignmentRecords / assignmentLimit);

    // NO DATA
    if (totalAssignmentRecords === 0) {
        document.getElementById("assignmentPageInfo").innerText = "";
        document.getElementById("assignmentPrevBtn").style.display = "none";
        document.getElementById("assignmentNextBtn").style.display = "none";
        return;
    }

    // SHOW BUTTONS
    document.getElementById("assignmentPrevBtn").style.display = "inline-block";
    document.getElementById("assignmentNextBtn").style.display = "inline-block";
    document.getElementById("assignmentPageInfo").innerText = `Page ${currentAssignmentPage} of ${totalPages}`;
    document.getElementById("assignmentPrevBtn").disabled = currentAssignmentPage === 1;
    document.getElementById("assignmentNextBtn").disabled = currentAssignmentPage >= totalPages;
}

function nextAssignmentPage() {
    currentAssignmentPage++;
    fetchClasses();
}

function prevAssignmentPage() {
    if (currentAssignmentPage > 1) {
        currentAssignmentPage--;
        fetchClasses();
    }
}

/* Notification tab */

function openNotificationModal() {
    document.getElementById("notificationModal").style.display = "flex";
    document.getElementById("notificationAdmin").value = localStorage.getItem("username");
    setTimeout(() => {
        validateNotificationContent();
    }, 100);
}

function closeNotificationModal() {
    document.getElementById("notificationModal").style.display = "none";
    document.getElementById("notificationId").value = "";
    document.getElementById("notificationContent").value = "";
    document.getElementById("notificationCategory").value = "";
    document.getElementById("notificationPriority").value = "Normal";
    document.getElementById("dynamicNotificationFields").innerHTML = "";
    document.getElementById("notificationCategory").disabled = false;
}

function handleNotificationCategory() {
    const category = document.getElementById("notificationCategory").value;
    document.getElementById("notificationContent").value = "";

    /* RESET WORD COUNT */

    document.getElementById("notificationWordCount").innerText = "0 / 50 words";

    /* ENABLE BUTTON AGAIN */

    const publishBtn = document.getElementById("publishNotificationBtn");
    publishBtn.disabled = false;
    publishBtn.style.opacity = "1";
    publishBtn.style.cursor = "pointer";

    const container = document.getElementById("dynamicNotificationFields");
    container.innerHTML = "";

    if (category === "New Batch") {
        container.innerHTML = `
            <div class="notification-form-row">
                <label> Select Trainer* </label>
            
                <select id="trainerDropdown" onchange="loadTrainerClasses()">
                    <option value="">Select Trainer</option>
                </select>
            </div>
            
            <div class="notification-form-row">
                <label> Select Class* </label>
            
                <select id="trainerClassDropdown">
                    <option value="">Select Class</option>
                </select>
            </div>
            
            <div class="notification-form-row">
                <label> Batch Start Date* </label>
                <input type="date" id="batchStartDate" min="${new Date().toISOString().split(" T")[0]}">
            </div>
            
            <div class="notification-form-row">
                <label> Class Timing* </label>
            
                <select id="batchTiming">
                    <option value="">Select Timing</option>
                    <option value="09 AM - 10 AM">09 AM - 10 AM</option>
                    <option value="10 AM - 11 AM">10 AM - 11 AM</option>
                    <option value="11 AM - 12 PM">11 AM - 12 PM</option>
                    <option value="12 PM - 01 PM">12 PM - 01 PM</option>
                    <option value="03 PM - 04 PM">03 PM - 04 PM</option>
                    <option value="04 PM - 05 PM">04 PM - 05 PM</option>
                    <option value="05 PM - 06 PM">04 PM - 06 PM</option>
                    <option value="06 PM - 07 PM">06 PM - 07 PM</option>
                    <option value="07 PM - 08 PM">07 PM - 08 PM</option>
                </select>
            </div>
            
            <div class="generate-btn-wrapper">
                <button class="generate-btn" onclick="generateNewBatchTemplate()">Generate Feed</button>
            </div>

        `;
        loadTrainerDropdown();
    } else if (category === "Institution Leave") {
        container.innerHTML = `
            <div class="notification-form-row">
                <label>Leave From*</label>
                <input type="date" id="leaveFromDate" min="${new Date().toISOString().split(" T")[0]}" onchange="handleLeaveToDate()">
            </div>
            
            <div class="notification-form-row">
                <label>Leave To*</label>
                <input type="date" id="leaveToDate" min="${new Date().toISOString().split(" T")[0]}">
            </div>
            
            <div class="generate-btn-wrapper">
                <button class="generate-btn" onclick="generateInstitutionLeaveTemplate()">Generate Feed</button>
            </div>
        `;
    } else if (category === "Staff Meeting") {
        container.innerHTML = `
            <div class="notification-form-row">
                <label> Meeting Date </label>
                <input type="date" id="meetingDate" min="${new Date().toISOString().split(" T")[0]}" />
            </div>
            
            <div class="generate-btn-wrapper">
                <button class="generate-btn" onclick="generateStaffMeetingTemplate()">Generate Feed</button>
            </div>
        `;
    } else if (category === "Mock Assessment") {
        container.innerHTML = `
            <div class="notification-form-row">
                <label>Select Class*</label>
                <select id="mockClass">
                    <option value="">Select Class</option>
                </select>
            </div>
            
            <div class="notification-form-row">
                <label>Assessment Date*</label>
                <input type="date" id="mockDate" min="${new Date().toISOString().split(" T")[0]}">
            </div>
            
            <div class="generate-btn-wrapper">
                <button class="generate-btn" onclick="generateMockTemplate()">Generate Feed</button>
            </div>
        `;
        loadMockAssessmentClasses();
    } else if (category === "Particular Staff Leave") {
        container.innerHTML = `
            <div class="notification-form-row">
                <label>Select Staff*</label>
                <select id="leaveStaffDropdown">
                    <option value="">Select Staff</option>
                </select>
            </div>
            
            <div class="generate-btn-wrapper">
                <button class="generate-btn" onclick="generateStaffLeaveTemplate()">Generate Feed</button>
            </div>
        `;
        loadLeaveStaffDropdown();
    } else if (category === "Fee Reminder") {
        const textarea = document.getElementById("notificationContent");
        textarea.value = `Students are requested to complete pending fee payments before the due date. Contact the office for clarification.`;

        /* TRIGGER INPUT EVENT */

        textarea.dispatchEvent(new Event("input"));
    } else if (category === "Scheduled Interview") {
        container.innerHTML = `
            <div class="notification-form-row">
                <label> Select Course* </label>
                <select id="interviewCourse">
                    <option value="">Select Course</option>
                </select>
            </div>
            
            <div class="notification-form-row">
                <label>Interview Date*</label>
                <input type="date" id="interviewDate" min="${new Date().toISOString().split(" T")[0]}">
            </div>
            
            <div class="generate-btn-wrapper">
                <button class="generate-btn" onclick="generateInterviewTemplate()">Generate Feed</button>
            </div>
        `;
        loadInterviewCourses();
    } else if (category === "Other") {
        document.getElementById("notificationContent").value = "";
    }
}

function loadTrainerDropdown() {
    const token = localStorage.getItem("access_token");
    fetch(`http://127.0.0.1:8000/classes/get_staff_list/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            const dropdown = document.getElementById("trainerDropdown");
            result.data.forEach((item) => {
                dropdown.innerHTML += `
                    <option
                        value="${item.class_name}"
                        data-username="${item.username}">
                        ${item.username}
                    </option>
            	`;
            });
        });
}

function loadTrainerClasses() {
    const trainer = document.getElementById("trainerDropdown");
    const specialization = trainer.value;
    const classDropdown = document.getElementById("trainerClassDropdown");

    classDropdown.innerHTML = `
        <option value="">
            Select Class
        </option>
    `;

    specialization.split(",").forEach((item) => {
        classDropdown.innerHTML += `
            <option>
                ${item.trim()}
            </option>
        `;
    });
}

function loadLeaveStaffDropdown() {
    const token = localStorage.getItem("access_token");
    fetch(`http://127.0.0.1:8000/classes/get_staff_list/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            const dropdown = document.getElementById("leaveStaffDropdown");
            result.data.forEach((item) => {
                dropdown.innerHTML += `
                    <option>
                    	${item.username}
                    </option>
                `;
            });
        });
}

function generateNewBatchTemplate() {
    const trainer = document.getElementById("trainerDropdown");
    const trainerName = trainer.options[trainer.selectedIndex].text;
    const className = document.getElementById("trainerClassDropdown").value;
    const startDate = document.getElementById("batchStartDate").value;
    const timing = document.getElementById("batchTiming").value;

    if (!trainer || !trainerName || !className || !startDate || !timing) {
        alert("All fields are required");
        return;
    }

    const content = `A new ${className} batch is going to start from ${startDate}. Trainer ${trainerName} will handle the sessions during ${timing}. Students are requested to contact the office for further enrollment details.`;
    const textarea = document.getElementById("notificationContent");
    textarea.value = content;
    textarea.dispatchEvent(new Event("input"));
}

function handleLeaveToDate() {
    const fromDate = document.getElementById("leaveFromDate").value;
    const toDate = document.getElementById("leaveToDate");

    // ✅ To date cannot be before from date
    toDate.min = fromDate;
    if (toDate.value < fromDate) {
        toDate.value = "";
    }
}

function generateInstitutionLeaveTemplate() {
    const fromDate = document.getElementById("leaveFromDate").value;
    const toDate = document.getElementById("leaveToDate").value;

    if (!fromDate || !toDate) {
        alert("All fields are required");
        return;
    }

    if (fromDate === toDate) {
        content = `Institution leave has been declared on ${fromDate}. Students are requested to enjoy the holiday and regular classes will continue soon.`;
    } else {
        content = `Institution leave has been declared from ${fromDate} to ${toDate}. Students are requested to enjoy the holidays and we will reconnect soon with regular classes.`;
    }

    const textarea = document.getElementById("notificationContent");
    textarea.value = content;
    textarea.dispatchEvent(new Event("input"));
}

function generateStaffMeetingTemplate() {
    const date = document.getElementById("meetingDate").value;
    const content = `Staff meeting has been scheduled on ${date}. All trainers are requested to attend the meeting without fail.`;
    const textarea = document.getElementById("notificationContent");
    textarea.value = content;
    textarea.dispatchEvent(new Event("input"));
}

function loadMockAssessmentClasses() {
    const token = localStorage.getItem("access_token");
    fetch(`http://127.0.0.1:8000/classes/get_all_specializations/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            const dropdown = document.getElementById("mockClass");
            result.data.forEach((item) => {
                dropdown.innerHTML += `
                    <option>
                        ${item}
                    </option>
            	`;
            });
        });
}

function generateMockTemplate() {
    const className = document.getElementById("mockClass").value;
    const date = document.getElementById("mockDate").value;

    if (!className || !date) {
        alert("All fields are required");
        return;
    }

    const content = `Mock assessment has been scheduled for ${className} students on ${date}. Students are requested to prepare well and attend without fail.`;
    const textarea = document.getElementById("notificationContent");
    textarea.value = content;
    textarea.dispatchEvent(new Event("input"));
}

function generateStaffLeaveTemplate() {
    const staff = document.getElementById("leaveStaffDropdown").value;

    if (!staff) {
        alert("Staff fields are required");
        return;
    }

    const content = `${staff} trainer is on leave today. Students are requested to contact the office for schedule updates.`;
    const textarea = document.getElementById("notificationContent");

    textarea.value = content;
    textarea.dispatchEvent(new Event("input"));
}

function loadInterviewCourses() {
    const token = localStorage.getItem("access_token");
    fetch(`http://127.0.0.1:8000/courses/get_course_names/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            const dropdown = document.getElementById("interviewCourse");
            result.data.forEach((item) => {
                dropdown.innerHTML += `
                    <option>
                        ${item}
                    </option>
                `;
            });
        });
}

function generateInterviewTemplate() {
    const course = document.getElementById("interviewCourse").value;
    const date = document.getElementById("interviewDate").value;

    if (!course || !date) {
        alert("All fields are required");
        return;
    }

    const content = `${course} students have a scheduled interview on ${date}. If you have any doubts, contact the HR team immediately.`;
    const textarea = document.getElementById("notificationContent");
    textarea.value = content;
    textarea.dispatchEvent(new Event("input"));
}

function validateNotificationContent() {
    const textarea = document.getElementById("notificationContent");
    const counter = document.getElementById("notificationWordCount");
    const publishBtn = document.getElementById("publishNotificationBtn");

    if (!textarea || !counter || !publishBtn) return;

    const text = textarea.value.trim();
    let words = text === "" ? [] : text.split(/\s+/);
    let wordCount = words.length;

    /* LIMIT TO 50 WORDS */

    if (wordCount > 50) {
        words = words.slice(0, 50);
        textarea.value = words.join(" ");
        wordCount = 50;
    }

    /* UPDATE COUNT */

    counter.innerText = `${wordCount} / 50 words`;

    /* BUTTON CONTROL */

    if (wordCount >= 50) {
        publishBtn.disabled = true;
        publishBtn.style.opacity = "0.5";
        publishBtn.style.cursor = "not-allowed";
    } else {
        publishBtn.disabled = false;
        publishBtn.style.opacity = "1";
        publishBtn.style.cursor = "pointer";
    }
}

function saveNotification() {
    const token = localStorage.getItem("access_token");
    const notificationId = document.getElementById("notificationId").value;
    const data = {
        posted_by: document.getElementById("notificationAdmin").value,
        category: document.getElementById("notificationCategory").value,
        content: document.getElementById("notificationContent").value,
        priority: document.getElementById("notificationPriority").value,
    };
    let extraData = {};

    if (data.category === "New Batch") {
        extraData = {
            trainer: document.getElementById("trainerDropdown").value,
            class_name: document.getElementById("trainerClassDropdown").value,
            start_date: document.getElementById("batchStartDate").value,
            timing: document.getElementById("batchTiming").value,
        };
    } else if (data.category === "Institution Leave") {
        extraData = {
            from_date: document.getElementById("leaveFromDate").value,
            to_date: document.getElementById("leaveToDate").value,
        };
    } else if (data.category === "Staff Meeting") {
        extraData = {
            meeting_date: document.getElementById("meetingDate").value,
        };
    } else if (data.category === "Mock Assessment") {
        extraData = {
            class_name: document.getElementById("mockClass").value,
            assessment_date: document.getElementById("mockDate").value,
        };
    } else if (data.category === "Particular Staff Leave") {
        extraData = {
            staff_name: document.getElementById("leaveStaffDropdown").value,
        };
    } else if (data.category === "Scheduled Interview") {
        extraData = {
            course_name: document.getElementById("interviewCourse").value,
            interview_date: document.getElementById("interviewDate").value,
        };
    }

    data.extra_data = extraData;

    // VALIDATION FOR ALL FIELDS
    // CATEGORY
    if (!data.category) {
        alert("Please select category");
        return;
    }

    // DESCRIPTION
    if (!data.content || data.content.trim() === "") {
        alert("Description cannot be empty");
        return;
    }

    // NEW BATCH VALIDATION

    if (data.category === "New Batch") {
        if (!document.getElementById("trainerDropdown").value) {
            alert("Please select trainer");
            return;
        }

        if (!document.getElementById("trainerClassDropdown").value) {
            alert("Please select class");
            return;
        }

        if (!document.getElementById("batchStartDate").value) {
            alert("Please select start date");
            return;
        }

        if (!document.getElementById("batchTiming").value) {
            alert("Please select timing");
            return;
        }
    }

    // INSTITUTION VALIDATION
    if (data.category === "Institution Leave") {
        if (!document.getElementById("leaveFromDate").value) {
            alert("Please select from date");
            return;
        }

        if (!document.getElementById("leaveToDate").value) {
            alert("Please select to date");
            return;
        }
    }

    // STAFF MEETING VALIDATION
    if (data.category === "Staff Meeting") {
        if (!document.getElementById("meetingDate").value) {
            alert("Please select meeting date");
            return;
        }
    }

    // MOCK ASSESSMENT VALIDATION
    if (data.category === "Mock Assessment") {
        if (!document.getElementById("mockClass").value) {
            alert("Please select class");
            return;
        }

        if (!document.getElementById("mockDate").value) {
            alert("Please select assessment date");
            return;
        }
    }

    // STAFF LEAVE
    if (data.category === "Particular Staff Leave") {
        if (!document.getElementById("leaveStaffDropdown").value) {
            alert("Please select staff");
            return;
        }
    }

    // SCHEDULED INTERVIEW VALIDATION
    if (data.category === "Scheduled Interview") {
        if (!document.getElementById("interviewCourse").value) {
            alert("Please select course");
            return;
        }

        if (!document.getElementById("interviewDate").value) {
            alert("Please select interview date");
            return;
        }
    }

    let url = "http://127.0.0.1:8000/notifications/add_notification/";
    let method = "POST";

    if (notificationId) {
        data.id = notificationId;
        url = `http://127.0.0.1:8000/notifications/update_notification/`;
        method = "PUT";
    }

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((result) => {
            if (result.status === "Success") {
                alert(result.message);
                closeNotificationModal();
                loadNotifications();
            } else {
                alert(result.message);
            }
        });
}

function loadNotifications() {
    const token = localStorage.getItem("access_token");
    const search = document.getElementById("notificationSearch")?.value || "";
    const category = document.getElementById("notificationCategoryFilter")?.value || "";

    fetch(`http://127.0.0.1:8000/notifications/get_notifications/?search=${search}&category=${category}&page=${currentNotificationPage}&limit=${notificationLimit}`,
    {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    )
        .then((res) => res.json())
        .then((result) => {
            console.log(result);
            notificationData = result.data;
            totalNotificationRecords = result.total;
            if (result.status === "Error") {
                alert(result.message);
                return;
            }

            const container = document.getElementById("notificationFeed");
            container.innerHTML = "";

            if (!result.data || result.data.length === 0) {
                container.innerHTML = `
                    <p class="no-notification">
                        No Notifications Found
                    </p>
                `;
                document.getElementById("notificationPagination").innerHTML = "";
                return;
            }

            const currentUser = localStorage.getItem("username");

            result.data.forEach((item) => {
                let actions = "";
                if (item.posted_by === currentUser) { 
                    actions = `
                        <div class="notification-actions">
                            <button class="edit-btn" onclick="editNotification(${item.id})">Edit</button>
                            <button class="delete-btn" onclick="deleteNotification(${item.id})">Delete</button>
                        </div>
                    `; 
                }

                container.innerHTML += `
                    <div class="notification-card ${item.priority === "Important" ? "important-notification" : ""}">
                        <div class="notification-header">
                            <div class="notification-user">
                                <div class="notification-avatar">${item.posted_by.charAt(0)}</div>
                                    <div class="notification-user-info">
                                        <h4>
                                            ${item.posted_by}
                                            <span class="admin-label"> Admin </span>
                                        </h4>
                                        <p>${item.category}</p>
                                    </div>
                                </div>
                                <span class="priority-badge"> ${item.priority} </span>
                            </div>

                            <!-- CONTENT -->

                            <div class="notification-content-wrapper">
                                <p class="notification-content collapsed" id="content-${item.id}">${item.content}</p>

                                ${ item.content.length > 140 ? 
                                    `<span
                                        class="show-more-btn"
                                        onclick="toggleNotificationContent(
                                                                            ${item.id}
                                                                        )"
                                    >
                                        Show More </span
                                    >` : "" 
                                }
                            </div>

                            <!-- FOOTER -->

                            <div class="notification-footer">
                                <div class="notification-footer-left">
                                    <span> ${new Date(item.created_at).toLocaleString()} </span>
                                    ${item.edited ? `<span class="edited-label"> Edited </span>` : ""}
                                </div>
                                ${actions}
                            </div>
                        </div>
                `;
            });
            renderNotificationPagination(result.total);
        });
}

function editNotification(id) {

    const item = notificationData.find(
        notification => notification.id === id
    );

    if (!item) return;

    openNotificationModal();
    document.getElementById("notificationModalTitle").innerText = "Edit Notification";
    document.getElementById("notificationId").value = item.id;
    document.getElementById("notificationAdmin").value = item.posted_by;
    document.getElementById("notificationAdmin").style.cursor = "not-allowed";
    document.getElementById("notificationCategory").value = item.category;
    document.getElementById("notificationPriority").value = item.priority;

    // Load category fields
    handleNotificationCategory();

    // Delay for rendering
    setTimeout(() => {
        const extra = item.extra_data || {};

        if (item.category === "New Batch") {
            document.getElementById("batchStartDate").value = extra.start_date || "";
            document.getElementById("batchTiming").value = extra.timing || "";
            setTimeout(() => {
                document.getElementById("trainerDropdown").value = extra.trainer || "";
                loadTrainerClasses();
                setTimeout(() => {
                    document.getElementById("trainerClassDropdown").value = extra.class_name || "";
                }, 300);
            }, 300);
        } else if (item.category === "Institution Leave") {
            document.getElementById("leaveFromDate").value = extra.from_date || "";
            document.getElementById("leaveToDate").value = extra.to_date || "";
        } else if (item.category === "Staff Meeting") {
            document.getElementById("meetingDate").value = extra.meeting_date || "";
        } else if (item.category === "Mock Assessment") {
            setTimeout(() => {
                document.getElementById("mockClass").value = extra.class_name || "";
            }, 300);
            document.getElementById("mockDate").value = extra.assessment_date || "";
        } else if (item.category === "Particular Staff Leave") {
            setTimeout(() => {
                document.getElementById("leaveStaffDropdown").value = extra.staff_name || "";
            }, 300);
        } else if (item.category === "Scheduled Interview") {
            setTimeout(() => {
                document.getElementById("interviewCourse").value = extra.course_name || "";
            }, 300);
            document.getElementById("interviewDate").value = extra.interview_date || "";
        }

        document.getElementById("notificationContent").value = item.content;
        setTimeout(() => {
            validateNotificationContent();
        }, 100);
    }, 300);
}

function deleteNotification(id) {
    const confirmDelete = confirm("Delete this notification?");
    if (!confirmDelete) return;
    const token = localStorage.getItem("access_token");

    fetch(`http://127.0.0.1:8000/notifications/delete_notification/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
    })
        .then((res) => res.json())
        .then((result) => {
            if (result.status === "Success") {
                alert("Notification Deleted Successfully");
                adjustNotificationPageAfterDelete();
            } else {
                alert(result.message);
            }
        });
}

function adjustNotificationPageAfterDelete() {
    const totalPages = Math.ceil(
        (totalNotificationRecords - 1) / notificationLimit,
    );

    if (currentNotificationPage > totalPages && currentNotificationPage > 1) {
        currentNotificationPage--;
    }

    loadNotifications();
}

function renderNotificationPagination(total) {
    const container = document.getElementById("notificationPagination");
    container.innerHTML = "";
    const totalPages = Math.ceil(total / notificationLimit);

    if (totalPages <= 1) {
        container.innerHTML = "";
        return;
    }

    for (let i = 1; i <= totalPages; i++) {
        container.innerHTML += `
            <button class="${i === currentNotificationPage ? "active-page-btn" : "page-btn"}"
                onclick="
                    currentNotificationPage=${i};
                    loadNotifications();"
                >
                ${i}
            </button>
        `;
    }
}

function handleNotificationFilterChange() {
    currentNotificationPage = 1;
    loadNotifications();
}

function clearNotificationFilters() {
    document.getElementById("notificationSearch").value = "";
    document.getElementById("notificationCategoryFilter").value = "";
    currentNotificationPage = 1;
    loadNotifications();
}

function toggleNotificationContent(id) {
    const content = document.getElementById(`content-${id}`);
    const button = event.target;

    if (content.classList.contains("collapsed")) {
        content.classList.remove("collapsed");
        button.innerText = "Show Less";
    } else {
        content.classList.add("collapsed");
        button.innerText = "Show More";
    }
}

function loadDashboardCounts() {
    const token = localStorage.getItem("access_token");
    fetch("http://127.0.0.1:8000/dashboard/dashboard_counts/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            if (result.status === "Success") {
                document.getElementById("dashboardStudentCount").innerText = result.data.students;
                document.getElementById("dashboardStaffCount").innerText = result.data.staff;
                document.getElementById("dashboardCourseCount").innerText = result.data.courses;
                document.getElementById("dashboardClassCount").innerText = result.data.active_classes;
            }
        })
        .catch((error) => {
            console.log("Dashboard Count Error", error);
        });
}

function loadDashboardCharts() {
    /* STUDENT GROWTH */

    const studentCtx = document.getElementById("studentGrowthChart").getContext("2d");

    new Chart(studentCtx, {
        type: "line",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
                {
                    label: "Students",
                    data: [20, 35, 45, 60, 80, 95],
                    borderWidth: 3,
                    tension: 0.4,
                },
            ],
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
    });

    /* CLASS STATUS */

    const statusCtx = document.getElementById("classStatusChart").getContext("2d");

    new Chart(statusCtx, {
        type: "doughnut",
        data: {
            labels: ["OPEN", "ONGOING", "FULL", "COMPLETED"],

            datasets: [
                {
                    data: [12, 8, 4, 15],
                },
            ],
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
    });
}

function loadRecentClasses() {
    const token = localStorage.getItem("access_token");

    fetch("http://127.0.0.1:8000/dashboard/recent_classes/", {
            headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    .then((res) => res.json())
    .then((result) => {
        const container = document.getElementById("dashboardRecentClassList");
        if (!result.data.length) { 
            container.innerHTML = `
                <div class="dashboard-no-data">
                    No Classes Available
                </div>
            `; 
            return; 
        }
        container.innerHTML = `
            <div class="dashboard-class-table-wrapper">
                <table class="dashboard-recent-class-table">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Trainer</th>
                            <th>Start</th>
                            <th>Timing</th>
                            <th>Available Limit</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                </table>

                <div class="dashboard-class-scroll-body" id="dashboardClassScrollBody">
                    <table class="dashboard-recent-class-table">
                        <tbody id="dashboardClassTableBody"></tbody>
                    </table>
                </div>
            </div>
        `;
        const tbody = document.getElementById("dashboardClassTableBody");

        result.data.forEach((item) => {
            tbody.innerHTML += `
                <tr>
                    <td>${item.class_name}</td>
                    <td>${item.trainer}</td>
                    <td>${item.start_date}</td>
                    <td>${item.timing}</td>
                    <td>${item.available_slot}</td>
                    <td>
                        <button class="dashboard-table-join-btn">Join</button>
                        <button class="dashboard-table-view-btn">View</button>
                    </td>
                </tr>
            `;
        });
        setTimeout(() => {
            startRecentClassScroll();
        }, 100);
    });
}

function loadDashboardNotifications() {
    const token = localStorage.getItem("access_token");

    fetch("http://127.0.0.1:8000/dashboard/dashboard_notifications/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            const container = document.getElementById("dashboardNotificationContainer");
            container.innerHTML = "";
            if (!result.data.length) { 
                container.innerHTML = `
                    <div class="dashboard-no-data">No Notifications Found</div>
                `; 
                return; 
            }
            result.data.forEach((item) => {
                container.innerHTML += `
                <div class="dashboard-notification-card">
                    <p>${item.content}</p>
                    <span> ${item.category} • ${item.created_at} </span>
                </div>
            `;
            });

            setTimeout(() => {
                const contentHeight = container.scrollHeight;
                const maxHeight = 395;

                if (contentHeight > maxHeight) {
                    container.classList.add("dashboard-notification-scroll");
                    container.classList.remove("dashboard-notification-static");
                    container.innerHTML += container.innerHTML;
                    startNotificationAutoScroll();
                } else {
                    container.classList.add("dashboard-notification-static");
                    container.classList.remove("dashboard-notification-scroll");
                    container.scrollTop = 0;
                    clearInterval(notificationScrollInterval);
                }
            }, 50);
        });
}

let recentClassScrollInterval;

function startRecentClassScroll() {
    const container = document.getElementById("dashboardClassScrollBody");
    if (!container) return;

    clearInterval(recentClassScrollInterval);
    /* only scroll if overflow */

    if (container.scrollHeight <= container.clientHeight) {
        return;
    }

    /* duplicate tbody */

    container.innerHTML += container.innerHTML;

    function startScroll() {
        recentClassScrollInterval = setInterval(() => {
            container.scrollTop += 1;

            const halfHeight = container.scrollHeight / 2;

            if (container.scrollTop >= halfHeight) {
                container.scrollTop = 0;
            }
        }, 40);
    }

    function stopScroll() {
        clearInterval(recentClassScrollInterval);
    }

    startScroll();
    container.addEventListener("mouseenter", stopScroll);
    container.addEventListener("mouseleave", startScroll);
}

let notificationScrollInterval;

function startNotificationAutoScroll() {
    const container = document.getElementById("dashboardNotificationContainer");
    if (!container) return;
    clearInterval(notificationScrollInterval);

    function startScroll() {
        notificationScrollInterval = setInterval(() => {
            container.scrollTop += 1;
            const halfHeight = container.scrollHeight / 2;
            if (container.scrollTop >= halfHeight) {
                container.scrollTop = 0;
            }
        }, 40);
    }

    function stopScroll() {
        clearInterval(notificationScrollInterval);
    }

    startScroll();
    container.addEventListener("mouseenter", stopScroll);
    container.addEventListener("mouseleave", startScroll);
}

/* Enrollments Tab */

let availableClasses = [];

function openEnrollmentModal() {
    document.getElementById("enrollmentModal").style.display = "flex";
    loadEnrollmentStudents();
    loadEnrollmentClasses();
}

function closeEnrollmentModal() {
    document.getElementById("enrollmentModal").style.display = "none";
}

function loadEnrollmentStudents() {
    const token = localStorage.getItem("access_token");

    fetch("http://127.0.0.1:8000/enrollments/load_students/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((result) => {
            const dropdown = document.getElementById("enrollmentStudent");
            dropdown.innerHTML = `
                <option value="">
                    Select Student
                </option>
        	`;

            result.data.forEach((student) => {
                dropdown.innerHTML += `
                    <option value="${student.id}">
                        ${student.username}
                    </option>
                `;
            });
        });
}

function loadEnrollmentClasses() {
    const token = localStorage.getItem("access_token");

    fetch("http://127.0.0.1:8000/enrollments/load_available_classes/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())

        .then((result) => {
            availableClasses = result.data;
            const dropdown = document.getElementById("enrollmentClass");
            dropdown.innerHTML = `
                <option value="">
                    Select Class
                </option>
            `;

            result.data.forEach((item) => {
                dropdown.innerHTML += `
                    <option value="${item.id}">
                        ${item.class_name}
                    </option>
                `;
            });
        });
}

function loadEnrollments() {
    const token = localStorage.getItem("access_token");

    fetch("http://127.0.0.1:8000/enrollments/load_enrollments/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())

        .then((result) => {
            const tbody = document.getElementById("enrollmentTableBody");
            tbody.innerHTML = "";
            if (!result.data.length) {
                tbody.innerHTML = `
                    <tr>
                        <td
                            colspan="7"
                            class="
                            enrollment-no-data
                            "
                        >
                            No Enrollments Found
                        </td>
                    </tr>
            	`;
                return;
            }

            result.data.forEach((item) => {
                tbody.innerHTML += `
                    <tr>
                        <td>${item.student}</td>
                        <td>${item.class_name}</td>
                        <td>${item.trainer}</td>
                        <td>${item.timing}</td>
                        <td>${item.start_date}</td>
                        <td>${item.status}</td>
                        <td>
                            <button
                                class="
                                enrollment-view-btn
                                "
                            >
                                View
                            </button>
                        </td>
                    </tr>
            	`;
            });
		});
}

function showEnrollmentPreview() {
    const classId = document.getElementById("enrollmentClass").value;
    const selectedClass = availableClasses.find((item) => item.id == classId);

    if (!selectedClass) return;

    document.getElementById("previewTrainer").innerText = selectedClass.trainer;
    document.getElementById("previewTiming").innerText = selectedClass.timing;
    document.getElementById("previewStartDate").innerText = selectedClass.start_date;
    document.getElementById("previewSlot").innerText = selectedClass.available_slot;
}

function createEnrollment() {
    const studentId = document.getElementById("enrollmentStudent").value;
    const classId = document.getElementById("enrollmentClass").value;
    const adminId = localStorage.getItem("user_id");

    if (!studentId) {
        alert("Please select student");
        return;
    }

    if (!classId) {
        alert("Please select class");
        return;
    }

    const token = localStorage.getItem("access_token");

    fetch("http://127.0.0.1:8000/enrollments/create_enrollment/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
            student_id: studentId,
            class_id: classId,
            admin_id: adminId,
        }),
    })
        .then((res) => res.json())
        .then((result) => {
            alert(result.message);
            if (result.status === "Success") {
                closeEnrollmentModal();
                loadEnrollments();
            }
        })
        .catch((error) => {
            console.log(error);
            alert("Something went wrong");
        });
}