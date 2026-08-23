// ======================================================
// STUDENT MANAGEMENT SYSTEM
// Frontend JavaScript
// ======================================================

// IMPORTANT:
// Ye tumhara existing Render backend hai.
// Isko change mat karna.

const API_URL =
    "https://student-management-system-r5qx.onrender.com/api/students";


const modal = document.getElementById("studentModal");
const form = document.getElementById("studentForm");

let students = [];

// ======================================================
// UPDATE COURSE FILTER
// ======================================================

function updateCourseFilter() {

    const courseFilter =
        document.getElementById("courseFilter");

    if (!courseFilter) return;


    const currentValue =
        courseFilter.value;


    const courses = [
        ...new Set(
            students
                .map(student => student.course)
                .filter(Boolean)
        )
    ];


    courseFilter.innerHTML = `
        <option value="all">
            All Courses
        </option>
    `;


    courses
        .sort()
        .forEach(course => {

            const option =
                document.createElement("option");

            option.value = course;

            option.textContent = course;

            courseFilter.appendChild(option);

        });


    // Keep previously selected course
    if (
        currentValue &&
        courses.includes(currentValue)
    ) {

        courseFilter.value =
            currentValue;

    } else {

        courseFilter.value = "all";

    }

}


// ======================================================
// LOAD STUDENTS FROM BACKEND
// ======================================================

async function loadStudents() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                `Server error: ${response.status}`
            );
        }

        students = await response.json();

        console.log(
            "Students loaded:",
            students
        );

        updateCourseFilter();

        displayStudents();

    } catch (error) {

        console.error(
            "Backend connection error:",
            error
        );

        const table =
            document.getElementById("studentTable");

        if (table) {

            table.innerHTML = `
                <tr>
                    <td colspan="6" class="empty">

                        <div>⚠️</div>

                        <strong>
                            Unable to load students
                        </strong>

                        <span>
                            Please check your backend connection.
                        </span>

                    </td>
                </tr>
            `;

        }

    }

}


// ======================================================
// SHOW ADD STUDENT MODAL
// ======================================================

function showForm() {

    if (!modal) return;

    modal.style.display = "flex";

}


// ======================================================
// CLOSE MODAL
// ======================================================

function closeForm() {

    if (!modal) return;

    modal.style.display = "none";

}


// ======================================================
// ADD STUDENT
// ======================================================

if (form) {

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const course =
                document
                    .getElementById("course")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();


            if (
                !name ||
                !email ||
                !course ||
                !phone
            ) {

                alert(
                    "Please fill all fields."
                );

                return;

            }


            const student = {

                name: name,

                email: email,

                course: course,

                phone: phone

            };


            try {

                const response =
                    await fetch(
                        API_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(student)
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    alert(
                        result.message ||
                        "Unable to add student."
                    );

                    return;

                }


                showToast(
    "Student added successfully!"
);


                form.reset();

                closeForm();

                await loadStudents();


            } catch (error) {

                console.error(
                    "Add student error:",
                    error
                );

                alert(
                    "Backend connection failed."
                );

            }

        }
    );

}


// ======================================================
// DISPLAY STUDENTS
// ======================================================

function displayStudents(data = students) {

    const table =
        document.getElementById(
            "studentTable"
        );


    if (!table) return;


    // --------------------------------------------------
    // DASHBOARD STATISTICS
    // --------------------------------------------------

    const studentCount =
        document.getElementById(
            "studentCount"
        );

    const activeStudents =
        document.getElementById(
            "activeStudents"
        );

    const courseCount =
        document.getElementById(
            "courseCount"
        );

    const latestStudent =
        document.getElementById(
            "latestStudent"
        );


    if (studentCount) {

        studentCount.textContent =
            students.length;
            console.log("Total Students:", students.length);

    }


    if (activeStudents) {

        activeStudents.textContent =
            students.length;

    }


    const courses = [

        ...new Set(

            students

                .map(
                    student =>
                        student.course
                )

                .filter(Boolean)

        )

    ];


    if (courseCount) {

        courseCount.textContent =
            courses.length;

    }


    if (latestStudent) {

        latestStudent.textContent =
            students.length > 0
                ? students[0].name
                : "-";

    }


    // --------------------------------------------------
    // EMPTY TABLE
    // --------------------------------------------------

    if (
        !data ||
        data.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty">

                    <div>
                        🎓
                    </div>

                    <strong>
                        No students found
                    </strong>

                    <span>
                        Add your first student to get started.
                    </span>

                </td>

            </tr>

        `;

        return;

    }


    // --------------------------------------------------
    // CREATE STUDENT ROWS
    // --------------------------------------------------

    table.innerHTML = data
        .map(
            (student, index) => {


                // Student initials

                const initials =
                    student.name
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map(
                            word =>
                                word[0]
                        )
                        .join("")
                        .toUpperCase();


                return `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>


                        <td>

                            <div
                                class="student-name">

                                <div
                                    class="avatar">

                                    ${initials}

                                </div>


                                <strong>

                                    ${escapeHTML(
                                        student.name
                                    )}

                                </strong>

                            </div>

                        </td>


                        <td>

                            ${escapeHTML(
                                student.email
                            )}

                        </td>


                        <td>

                            <span
                                class="course-badge">

                                ${escapeHTML(
                                    student.course
                                )}

                            </span>

                        </td>


                        <td>

                            ${escapeHTML(
                                student.phone
                            )}

                        </td>


                        <td>

                            <div
                                class="action-wrap">


                                <button
                                    class="edit-btn"
                                    onclick="editStudent('${student._id}')">

                                    ✎ Edit

                                </button>


                                <button
                                    class="delete-btn"
                                    onclick="deleteStudent('${student._id}')">

                                    Delete

                                </button>


                            </div>

                        </td>

                    </tr>

                `;

            }
        )
        .join("");

}


// ======================================================
// EDIT STUDENT
// ======================================================

async function editStudent(id) {

    const student = students.find(
        item => item._id === id
    );

    if (!student) {
        alert("Student not found.");
        return;
    }

    // Fill edit modal with existing student data
    document.getElementById("editStudentId").value = student._id;
    document.getElementById("editName").value = student.name || "";
    document.getElementById("editEmail").value = student.email || "";
    document.getElementById("editCourse").value = student.course || "";
    document.getElementById("editPhone").value = student.phone || "";

    // Show edit modal
    const modal = document.getElementById("editStudentModal");

    if (modal) {
        modal.classList.add("active");
    }
}


// ======================================================
// CLOSE EDIT STUDENT MODAL
// ======================================================

function closeEditForm() {

    const modal =
        document.getElementById("editStudentModal");

    if (modal) {
        modal.classList.remove("active");
    }

}


// ======================================================
// UPDATE STUDENT
// ======================================================

document
    .getElementById("editStudentForm")
    ?.addEventListener("submit", async function (event) {

        event.preventDefault();

        const id =
            document.getElementById("editStudentId").value;

        const updatedStudent = {

            name:
                document.getElementById("editName").value.trim(),

            email:
                document.getElementById("editEmail").value.trim(),

            course:
                document.getElementById("editCourse").value.trim(),

            phone:
                document.getElementById("editPhone").value.trim()

        };


        if (
            !updatedStudent.name ||
            !updatedStudent.email ||
            !updatedStudent.course ||
            !updatedStudent.phone
        ) {

            alert("All fields are required.");

            return;

        }


        try {

            const response =
                await fetch(
                    `${API_URL}/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                updatedStudent
                            )
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                alert(
                    result.message ||
                    "Unable to update student."
                );

                return;

            }


            // Close modal
            closeEditForm();

            // Refresh student list
            await loadStudents();

            alert(
                "Student updated successfully! 🎉"
            );


        } catch (error) {

            console.error(
                "Update error:",
                error
            );

            alert(
                "Backend connection failed."
            );

        }

    });

    // ======================================================
// DELETE STUDENT MODAL
// ======================================================

let studentToDelete = null;


function deleteStudent(id) {

    const student = students.find(
        item => item._id === id
    );

    if (!student) {

        alert("Student not found.");

        return;

    }


    studentToDelete = student;


    const message =
        document.getElementById(
            "deleteStudentMessage"
        );


    if (message) {

        message.textContent =
            `Are you sure you want to delete ${student.name}?`;

    }


    const deleteModal =
        document.getElementById(
            "deleteStudentModal"
        );
     console.log("Delete clicked:", id);
console.log("Delete modal:", deleteModal);

    if (deleteModal) {

        deleteModal.classList.add("active");

    }

}


// ======================================================
// CLOSE DELETE MODAL
// ======================================================

function closeDeleteModal() {

    const deleteModal =
        document.getElementById(
            "deleteStudentModal"
        );


    if (deleteModal) {

        deleteModal.classList.remove("active");

    }


    studentToDelete = null;

}


// ======================================================
// CONFIRM DELETE STUDENT
// ======================================================

async function confirmDeleteStudent() {

    if (!studentToDelete) {

        return;

    }


    const id =
        studentToDelete._id;


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Unable to delete student."
            );

            return;

        }


        closeDeleteModal();


        await loadStudents();


        showToast(
            "Student deleted successfully!"
        );


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            "Backend connection failed."
        );

    }

}

// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeAttribute(value) {

    return String(value)

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ======================================================
// CLOSE MODAL BY CLICKING OUTSIDE
// ======================================================

window.addEventListener(
    "click",
    function (event) {

        if (
            event.target === modal
        ) {

            closeForm();

        }

    }
);


// ======================================================
// ESC KEY
// ======================================================

window.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeForm();

        }

    }
); 

// ======================================================
// TOAST NOTIFICATION
// ======================================================

function showToast(message) {

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}

// ======================================================
// START APPLICATION
// ======================================================

loadStudents();