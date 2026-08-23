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


                alert(
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

    const student =
        students.find(
            item =>
                item._id === id
        );


    if (!student) {

        alert(
            "Student not found."
        );

        return;

    }


    const name =
        prompt(
            "Student Name:",
            student.name
        );


    if (name === null) return;


    const email =
        prompt(
            "Email:",
            student.email
        );


    if (email === null) return;


    const course =
        prompt(
            "Course:",
            student.course
        );


    if (course === null) return;


    const phone =
        prompt(
            "Phone:",
            student.phone
        );


    if (phone === null) return;


    if (
        !name.trim() ||
        !email.trim() ||
        !course.trim() ||
        !phone.trim()
    ) {

        alert(
            "All fields are required."
        );

        return;

    }


    const updatedStudent = {

        name:
            name.trim(),

        email:
            email.trim(),

        course:
            course.trim(),

        phone:
            phone.trim()

    };


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


        alert(
            "Student updated successfully!"
        );


        await loadStudents();


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


// ======================================================
// DELETE STUDENT
// ======================================================

async function deleteStudent(id) {

    const student =
        students.find(
            item =>
                item._id === id
        );


    const studentName =
        student
            ? student.name
            : "this student";


    const confirmed =
        confirm(
            `Are you sure you want to delete ${studentName}?`
        );


    if (!confirmed) return;


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


        alert(
            "Student deleted successfully!"
        );


        await loadStudents();


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
// SEARCH STUDENTS
// ======================================================

function searchStudents() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const courseFilter =
        document.getElementById(
            "courseFilter"
        );


    if (!searchInput) return;


    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedCourse =
        courseFilter
            ? courseFilter.value
            : "all";


    const filtered =
        students.filter(
            student => {


                const name =
                    String(
                        student.name || ""
                    )
                    .toLowerCase();


                const email =
                    String(
                        student.email || ""
                    )
                    .toLowerCase();


                const course =
                    String(
                        student.course || ""
                    )
                    .toLowerCase();


                const phone =
                    String(
                        student.phone || ""
                    )
                    .toLowerCase();


                const matchesSearch =

                    name.includes(search) ||

                    email.includes(search) ||

                    course.includes(search) ||

                    phone.includes(search);


                const matchesCourse =

                    selectedCourse ===
                        "all" ||

                    student.course ===
                        selectedCourse;


                return (
                    matchesSearch &&
                    matchesCourse
                );

            }
        );


    displayStudents(filtered);

}


// ======================================================
// UPDATE COURSE FILTER
// ======================================================

function updateCourseFilter() {

    const courseFilter =
        document.getElementById(
            "courseFilter"
        );


    if (!courseFilter) return;


    const currentValue =
        courseFilter.value;


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


    courses.sort();


    courseFilter.innerHTML = `

        <option value="all">
            All Courses
        </option>

        ${courses
            .map(
                course => `

                    <option
                        value="${escapeAttribute(course)}">

                        ${escapeHTML(course)}

                    </option>

                `
            )
            .join("")}

    `;


    if (
        courses.includes(
            currentValue
        )
    ) {

        courseFilter.value =
            currentValue;

    }

}


// ======================================================
// COURSE FILTER
// ======================================================

function filterStudents() {

    searchStudents();

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
                a.name.localeCompare(
                    b.name
                )
        );

    }


    else if (value === "nameDesc") {

        sorted.sort(
            (a, b) =>
                b.name.localeCompare(
                    a.name
                )
        );

    }


    else if (value === "courseAsc") {

        sorted.sort(
            (a, b) =>
                a.course.localeCompare(
                    b.course
                )
        );

    }


    else if (value === "courseDesc") {

        sorted.sort(
            (a, b) =>
                b.course.localeCompare(
                    a.course
                )
        );

    }


    displayStudents(sorted);

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
// START APPLICATION
// ======================================================

loadStudents();