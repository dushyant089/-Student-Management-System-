// ======================================================
// STUDENT MANAGEMENT SYSTEM
// FRONTEND JAVASCRIPT
// ======================================================

const API_URL =
    "https://student-management-system-r5qx.onrender.com/api/students";


// ======================================================
// GLOBAL VARIABLES
// ======================================================

const modal = document.getElementById("studentModal");
const form = document.getElementById("studentForm");

let students = [];
let studentToDelete = null;


// ======================================================
// UPDATE COURSE FILTER
// ======================================================

function updateCourseFilter() {

    const courseFilter =
        document.getElementById("courseFilter");

    if (!courseFilter) return;

    const currentValue = courseFilter.value;

    const courses = [
        ...new Set(
            students
                .map(student => student.course)
                .filter(Boolean)
        )
    ];

    courseFilter.innerHTML = `
        <option value="all">All Courses</option>
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

    if (
        currentValue &&
        courses.includes(currentValue)
    ) {

        courseFilter.value = currentValue;

    } else {

        courseFilter.value = "all";

    }

}


// ======================================================
// LOAD STUDENTS
// ======================================================

async function loadStudents() {

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );

        }

        students =
            await response.json();

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
// CLOSE ADD STUDENT MODAL
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

                name,
                email,
                course,
                phone

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


                form.reset();

                closeForm();

                showToast(
                    "Student added successfully! 🎉"
                );

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


    // ==================================================
    // DASHBOARD STATISTICS
    // ==================================================

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

    }


    if (activeStudents) {

        activeStudents.textContent =
            students.length;

    }


    const courses = [
        ...new Set(
            students
                .map(student => student.course)
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


    // ==================================================
    // EMPTY TABLE
    // ==================================================

    if (
        !data ||
        data.length === 0
    ) {

        table.innerHTML = `
            <tr>

                <td
                    colspan="6"
                    class="empty">

                    <div>🎓</div>

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


    // ==================================================
    // CREATE TABLE ROWS
    // ==================================================

    table.innerHTML = data
        .map(
            (student, index) => {

                const initials =
                    String(student.name || "")
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map(
                            word => word[0]
                        )
                        .join("")
                        .toUpperCase();


                return `
                    <tr>

                        <td>
                            ${index + 1}
                        </td>


                        <td>

                            <div class="student-name">

                                <div class="avatar">
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

                            <span class="course-badge">

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

                            <div class="action-wrap">

                                <button
                                    type="button"
                                    class="edit-btn"
                                    onclick="editStudent('${student._id}')">

                                    ✎ Edit

                                </button>


                                <button
                                    type="button"
                                    class="delete-btn"
                                    onclick="deleteStudent('${student._id}')">

                                    🗑 Delete

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

function editStudent(id) {

    const student =
        students.find(
            item => item._id === id
        );


    if (!student) {

        alert(
            "Student not found."
        );

        return;

    }


    const idInput =
        document.getElementById(
            "editStudentId"
        );

    const nameInput =
        document.getElementById(
            "editName"
        );

    const emailInput =
        document.getElementById(
            "editEmail"
        );

    const courseInput =
        document.getElementById(
            "editCourse"
        );

    const phoneInput =
        document.getElementById(
            "editPhone"
        );


    if (idInput)
        idInput.value = student._id;

    if (nameInput)
        nameInput.value = student.name || "";

    if (emailInput)
        emailInput.value = student.email || "";

    if (courseInput)
        courseInput.value = student.course || "";

    if (phoneInput)
        phoneInput.value = student.phone || "";


    const editModal =
        document.getElementById(
            "editStudentModal"
        );


    if (editModal) {

        editModal.classList.add("active");

    }

}


// ======================================================
// CLOSE EDIT MODAL
// ======================================================

function closeEditForm() {

    const editModal =
        document.getElementById(
            "editStudentModal"
        );


    if (editModal) {

        editModal.classList.remove(
            "active"
        );

    }

}


// ======================================================
// UPDATE STUDENT
// ======================================================

const editForm =
    document.getElementById(
        "editStudentForm"
    );


if (editForm) {

    editForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const id =
                document.getElementById(
                    "editStudentId"
                ).value;


            const updatedStudent = {

                name:
                    document.getElementById(
                        "editName"
                    ).value.trim(),

                email:
                    document.getElementById(
                        "editEmail"
                    ).value.trim(),

                course:
                    document.getElementById(
                        "editCourse"
                    ).value.trim(),

                phone:
                    document.getElementById(
                        "editPhone"
                    ).value.trim()

            };


            if (
                !updatedStudent.name ||
                !updatedStudent.email ||
                !updatedStudent.course ||
                !updatedStudent.phone
            ) {

                alert(
                    "All fields are required."
                );

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


                closeEditForm();

                await loadStudents();

                showToast(
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

        }
    );

}


// ======================================================
// DELETE STUDENT
// ======================================================

function deleteStudent(id) {

    const student = students.find(
        item => item._id === id
    );

    if (!student) {

        alert("Student NOT FOUND");

        return;

    }

    studentToDelete = student;

    const deleteModal =
        document.getElementById("deleteStudentModal");

    const message =
        document.getElementById("deleteStudentMessage");

    if (message) {

        message.textContent =
            `Are you sure you want to delete ${student.name}?`;

    }

    if (!deleteModal) {

        alert("DELETE MODAL NOT FOUND");

        return;

    }

    // IMPORTANT
    deleteModal.style.display = "flex";

    deleteModal.classList.add("active");

}
// ======================================================
// CLOSE DELETE MODAL
// ======================================================

function closeDeleteModal() {

    console.log("CLOSE DELETE MODAL");

    const deleteModal =
        document.getElementById("deleteStudentModal");

    if (deleteModal) {

    deleteModal.classList.add("active");
    deleteModal.style.display = "flex";

}

        // Force hide
        deleteModal.style.display = "none";
    }

    studentToDelete = null;
}

// ======================================================
// SEARCH STUDENTS
// ======================================================

function searchStudents() {

    const input =
        document.getElementById(
            "searchInput"
        );


    if (!input) return;


    const search =
        input.value
            .toLowerCase()
            .trim();


    const filtered =
        students.filter(
            student => {

                const name =
                    String(
                        student.name || ""
                    ).toLowerCase();

                const email =
                    String(
                        student.email || ""
                    ).toLowerCase();

                const course =
                    String(
                        student.course || ""
                    ).toLowerCase();

                const phone =
                    String(
                        student.phone || ""
                    ).toLowerCase();


                return (
                    name.includes(search) ||
                    email.includes(search) ||
                    course.includes(search) ||
                    phone.includes(search)
                );

            }
        );


    displayStudents(filtered);

}


// ======================================================
// FILTER BY COURSE
// ======================================================

function filterStudents() {

    const filter =
        document.getElementById(
            "courseFilter"
        );


    if (!filter) return;


    const value =
        filter.value;


    if (value === "all") {

        displayStudents(
            students
        );

        return;

    }


    const filtered =
        students.filter(
            student =>
                student.course === value
        );


    displayStudents(
        filtered
    );

}


// ======================================================
// SORT STUDENTS
// ======================================================

function sortStudents() {

    const sortFilter =
        document.getElementById(
            "sortFilter"
        );


    if (!sortFilter) return;


    const value =
        sortFilter.value;


    let sorted =
        [...students];


    if (value === "nameAsc") {

        sorted.sort(
            (a, b) =>
                String(a.name)
                    .localeCompare(
                        String(b.name)
                    )
        );

    }


    if (value === "nameDesc") {

        sorted.sort(
            (a, b) =>
                String(b.name)
                    .localeCompare(
                        String(a.name)
                    )
        );

    }


    if (value === "courseAsc") {

        sorted.sort(
            (a, b) =>
                String(a.course)
                    .localeCompare(
                        String(b.course)
                    )
        );

    }


    if (value === "courseDesc") {

        sorted.sort(
            (a, b) =>
                String(b.course)
                    .localeCompare(
                        String(a.course)
                    )
        );

    }


    displayStudents(
        sorted
    );

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    return String(value ?? "")

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


// ======================================================
// CLOSE ADD MODAL OUTSIDE CLICK
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

            closeEditForm();

            closeDeleteModal();

        }

    }
);


// ======================================================
// TOAST
// ======================================================

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );

    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    if (
        !toast ||
        !toastMessage
    ) {

        return;

    }


    toastMessage.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );

}


// ======================================================
// START APPLICATION
// ======================================================

loadStudents();