const dns = require("dns");

// MongoDB Atlas SRV DNS fix
dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });

// Student Schema
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    course: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        trim: true
    }
});

const Student = mongoose.model("Student", studentSchema);

// Home Route
app.get("/", (req, res) => {
    res.send("Student Management System Backend is Running!");
});

// Get All Students
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find().sort({ _id: -1 });

        res.json(students);

    } catch (error) {
        console.error("Error fetching students:", error);

        res.status(500).json({
            message: "Error fetching students"
        });
    }
});

// Add Student
app.post("/api/students", async (req, res) => {
    try {

        const { name, email, course, phone } = req.body;

        // Check empty fields
        if (!name || !email || !course || !phone) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check duplicate email
        const existingStudent = await Student.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingStudent) {
            return res.status(409).json({
                message: "A student with this email already exists"
            });
        }

        // Create student
        const student = new Student({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            course: course.trim(),
            phone: phone.trim()
        });

        // Save to MongoDB
        const savedStudent = await student.save();

        res.status(201).json(savedStudent);

    } catch (error) {

        console.error("Error adding student:", error);

        res.status(400).json({
            message: "Error adding student",
            error: error.message
        });
    }
});

// Update Student
app.put("/api/students/:id", async (req, res) => {
    try {

        const { name, email, course, phone } = req.body;

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            {
                name: name?.trim(),
                email: email?.toLowerCase().trim(),
                course: course?.trim(),
                phone: phone?.trim()
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(updatedStudent);

    } catch (error) {

        console.error("Error updating student:", error);

        res.status(400).json({
            message: "Error updating student",
            error: error.message
        });
    }
});

// Delete Student
app.delete("/api/students/:id", async (req, res) => {
    try {

        const deletedStudent = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!deletedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });

    } catch (error) {

        console.error("Error deleting student:", error);

        res.status(500).json({
            message: "Error deleting student"
        });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});