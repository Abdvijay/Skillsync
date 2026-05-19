function registerUser() {
    const token = localStorage.getItem("access_token");
    const adminUsername = localStorage.getItem("username");

    const username = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const phone = document.getElementById("regPhone").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    const role = document.getElementById("regRole").value.trim();
    const class_name = document.getElementById("regClassName")?.value || "None";
    const purchased_course = document.getElementById("purchasedCourse")?.value || "None";

    if (!username || !email || !password || !phone || !role || !class_name || !purchased_course) {
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

    if (role === "STUDENT") {
        const confirmCreate = confirm(
            "Purchased course cannot be changed later because Student Unique ID will be generated based on this course.\n\nPlease confirm before creating the student."
        );

        if (!confirmCreate) {
            return;
        }
    }

    const data = {
        username,
        email,
        phone,
        password,
        role,
        created_by: adminUsername,
        class_name
    };

    if (role === "STUDENT") {
        data.purchased_course = document.getElementById("purchasedCourse").value;
    }

    fetch("http://127.0.0.1:8000/user/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((result) => {
            console.log(result);
            if (result.status === "Success") {
                alert("User Created Successfully");
                document.getElementById("regUsername").value = "";
                document.getElementById("regEmail").value = "";
                document.getElementById("regPhone").value = "";
                document.getElementById("regPassword").value = "";
                document.getElementById("regRole").value = "ADMIN";

                if (document.getElementById("regClassName")) {
                    document.getElementById("regClassName").value = "";
                }

                if (document.getElementById("purchasedCourse")) {
                    document.getElementById("purchasedCourse").value = "";
                }

                document.getElementById("classFieldContainer").style.display = "none";
                document.getElementById("purchasedCourseContainer").style.display = "none";
                closeRegisterModal();
                fetchUsers();
            } else {
                alert(result.message || result.error);
            }
        });
}

document.addEventListener("click", function (e) {
    if (e.target.id === "regPhone") {
        e.target.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, "");
        });
    }
});