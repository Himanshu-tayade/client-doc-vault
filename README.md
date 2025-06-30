# client-doc-vault

The idea was simple — create a secure portal where:
- Clients can upload important documents
- Get automatic email reminders before they expire
- Admins can manage everything from one place

---

## 🚀 Features

- ✅ Client/Admin authentication (JWT-based)
- 📤 Document upload with expiry dates & metadata
- 📬 Automatic email reminders before deadline (via Nodemailer + Cron)
- 🧠 Admin dashboard to view, filter, and manually send reminders
- 🖼️ Clean, responsive UI built with **React + Bootstrap**
- 🗃️ MongoDB for document metadata + user management
- 🧾 Modern design with branded header, footer, and login/register pages

---

## ⚙️ Tech Stack

- **Frontend:** React.js, Bootstrap, Axios, React Router
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Multer
- **Email:** Nodemailer (via Gmail SMTP)
- **Scheduler:** node-cron for daily email reminders

---
