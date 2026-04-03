# Secure File Hosting Web Application

## 📌 Project Overview
In this project, I built a secure full-stack web application that allows users to:
- Register and log in
- Upload files
- View uploaded files
- Delete their own files

The application follows a frontend → backend → database structure. The frontend never directly accesses the database or filesystem.

---

## 🛠️ Technologies Used
- Node.js
- Express.js
- MongoDB (Mongoose)
- HTML, CSS, JavaScript
- JWT (Authentication)
- Multer (File Uploads)
- Bcrypt (Password Hashing)

---

## 📁 Project Structure
secure-file-hosting-project/

backend/
server.js
models/
routes/
middleware/
uploads/

frontend/
register.html
login.html
upload.html
downloads.html
my-files.html

.env
package.json
README.md

---

## ⚙️ How to Run the Project (Step-by-Step)

1. Open the project folder in VS Code

2. Install dependencies:
npm install

3. Create a .env file and add:
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/fileapp
JWT_SECRET=mysecret123

4. Start MongoDB:
sudo service mongod start

5. Start server:
npm start

6. Open:
http://localhost:3000

---

## 🔐 Features
- User registration & login
- JWT authentication
- File upload (.pdf, .mp4, max 20MB)
- View all files (Downloads)
- View own files (My Files)
- Delete own files only

---

## 🎥 Demo Steps
1. Register user
2. Login
3. Upload file
4. Check downloads
5. Register second user
6. Login second user
7. Upload second file
8. Delete file
9. Confirm deletion

---

## 🧠 What I Learned
- Backend/frontend communication
- JWT authentication
- File handling
- MongoDB usage

---

## ✅ Conclusion
This is a beginner-friendly full-stack project demonstrating authentication, file handling, and database integration.
