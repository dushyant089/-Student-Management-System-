const API_URL = "http://localhost:5000/api/students";

const modal = document.getElementById("studentModal");
const form = document.getElementById("studentForm");

let students = [];

// ================================
// LOAD STUDENTS
// ================================

async function loadStudents() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch students");
        }

        students = await response.json();

        updateCourseFilter();
        displayStudents();

    } catch (error) {
        console.error("Error loading students:", error);
        alert("Backend se connection nahi ho raha.");
    }
}


// ================================
// OPEN / CLOSE FORM
// ================================

function showForm() {
    modal.style.display = "flex";
}

function closeForm() {
    modal.style.display = "none";
}


// ================================
// ADD STUDENT
// ================================

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const course = document.getElementById("course").value.trim();
    const phone = document.getElementById("phone").value.trim();

    // Empty field validation
    if (!name || !email || !course || !phone) {
        alert("Please fill all fields.");
        return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Phone validation
    if (!/^\d{10}$/.test(phone)) {
        alert("Phone number must contain exactly 10 digits.");
        return;
    }

    const student = {
        name: name,
        email: email,
        course: course,
        phone: phone
    };

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || "Student add nahi ho raha.");
            return;
        }

        form.reset();

        closeForm();

        await loadStudents();

        alert("Student successfully added!");

    } catch (error) {

        console.error("Error adding student:", error);

        alert("Backend se connection nahi ho raha.");
    }
});


// ================================
// DISPLAY STUDENTS
// ================================

function displayStudents(data = students) {

    const table = document.getElementById("studentTable");

    // Total students
    document.getElementById("studentCount").textContent =
        students.length;

    // Total courses
    const courses = [
        ...new Set(
            students.map(student => student.course)
        )
    ];

    document.getElementById("courseCount").textContent =
        courses.length;

    // Latest student
    document.getElementById("latestStudent").textContent =
        students.length > 0
            ? students[students.length - 1].name
            : "-";


    if (data.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    No students found.
                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML = data.map((student, index) => `

        <tr>

            <td>${index + 1}</td>

            <td>${student.name}</td>

            <td>${student.email}</td>

            <td>${student.course}</td>

            <td>${student.phone}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editStudent('${student._id}')">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStudent('${student._id}')">
                    Delete
                </button>

            </td>

        </tr>

    `).join("");
}


// ================================
// EDIT STUDENT
// ================================

async function editStudent(id) {

    const student = students.find(
        s => s._id === id
    );

    if (!student) {
        alert("Student not found.");
        return;
    }


    const name = prompt(
        "Enter student name:",
        student.name
    );

    if (name === null) return;


    const email = prompt(
        "Enter email:",
        student.email
    );

    if (email === null) return;


    const course = prompt(
        "Enter course:",
        student.course
    );

    if (course === null) return;


    const phone = prompt(
        "Enter phone:",
        student.phone
    );

    if (phone === null) return;


    // Validation

    if (!name.trim() ||
        !email.trim() ||
        !course.trim() ||
        !phone.trim()) {

        alert("All fields are required.");
        return;
    }


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        alert("Please enter a valid email.");

        return;
    }


    if (!/^\d{10}$/.test(phone)) {

        alert("Phone number must contain exactly 10 digits.");

        return;
    }


    const updatedStudent = {

        name: name.trim(),

        email: email.trim().toLowerCase(),

        course: course.trim(),

        phone: phone.trim()

    };


    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(updatedStudent)
            }
        );


        const result = await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Student update nahi ho raha."
            );

            return;
        }


        await loadStudents();

        alert("Student updated successfully!");

    } catch (error) {

        console.error(
            "Error updating student:",
            error
        );

        alert(
            "Backend se connection nahi ho raha."
        );
    }
}


// ================================
// DELETE STUDENT
// ================================

async function deleteStudent(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );


        const result = await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Student delete nahi ho raha."
            );

            return;
        }


        await loadStudents();

        alert("Student deleted successfully!");

    } catch (error) {

        console.error(
            "Error deleting student:",
            error
        );

        alert(
            "Backend se connection nahi ho raha."
        );
    }
}


// ================================
// SEARCH STUDENTS
// ================================

function searchStudents() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    const selectedCourse =
        document
            .getElementById("courseFilter")
            .value;


    const filtered =
        students.filter(student => {

            const matchesSearch =
                student.name
                    .toLowerCase()
                    .includes(search) ||

                student.email
                    .toLowerCase()
                    .includes(search) ||

                student.course
                    .toLowerCase()
                    .includes(search);


            const matchesCourse =
                selectedCourse === "all" ||

                student.course === selectedCourse;


            return (
                matchesSearch &&
                matchesCourse
            );
        });


    displayStudents(filtered);
}


// ================================
// COURSE FILTER
// ================================

function updateCourseFilter() {

    const courseFilter =
        document.getElementById("courseFilter");


    const courses = [
        ...new Set(
            students.map(student => student.course)
        )
    ];


    courseFilter.innerHTML = `

        <option value="all">
            All Courses
        </option>

        ${courses.map(course => `

            <option value="${course}">
                ${course}
            </option>

        `).join("")}

    `;
}


function filterStudents() {

    searchStudents();
}


// ================================
// SORT STUDENTS
// ================================

function sortStudents() {

    const sortValue =
        document
            .getElementById("sortFilter")
            .value;


    let sorted =
        [...students];


    if (sortValue === "nameAsc") {

        sorted.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    }


    if (sortValue === "nameDesc") {

        sorted.sort((a, b) =>
            b.name.localeCompare(a.name)
        );

    }


    if (sortValue === "courseAsc") {

        sorted.sort((a, b) =>
            a.course.localeCompare(b.course)
        );

    }


    if (sortValue === "courseDesc") {

        sorted.sort((a, b) =>
            b.course.localeCompare(a.course)
        );

    }


    displayStudents(sorted);
}


// ================================
// CLOSE MODAL
// ================================

window.onclick = function (event) {

    if (event.target === modal) {
        closeForm();
    }

};


// ================================
// START APPLICATION
// ================================

loadStudents();