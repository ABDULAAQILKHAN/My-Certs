# 🎓 Safe-Pramaan

**Safe-Pramaan** is a modern certificate management web application built with **React**, **Next.js**, **Redux Toolkit**, and **RTK Query**. It helps users securely upload, manage, and share their certifications — all wrapped in a sleek, responsive UI with dark/light theme support.

![Safe-Pramaan Banner](public/Landing%20page.png) <!-- optional banner -->

---

## 🚀 Features

- **Certificate Store & Upload:** Securely upload and store your certifications in one centralized location. The platform supports seamless file uploads, ensuring your achievements are always accessible and safely backed up.
- **Certificate Sharing:** Effortlessly share individual certificates with employers, peers, or on social media. Each certificate can generate a unique, professional link that highlights your achievement with an authenticity badge.
- **Toggle Certificate Visibility:** Maintain complete control over your privacy. You can easily toggle individual certificates between public and private modes, deciding exactly who gets to see your credentials.
- **Create Certificate Groups:** Organize your certificates logically by creating custom groups. Whether it's by skill, technology, or domain, grouping allows you to bundle related certifications together.
- **Share Groups via Links:** Instead of sending multiple links, you can share an entire group of certificates using a single, unique URL. This provides a unified and professional viewing experience for the recipient.
- **Toggle Group Visibility:** Just like individual certificates, you can control the visibility of entire groups. Keep them private while you're organizing them, and make them public when you're ready to share.
- **Resume-Ready Domain Groups:** Grouping features are tailored for job seekers. You can curate specific sets of certificates for particular domains or job roles, making them perfect to embed directly into your resume or portfolio.

### 🛠 Tech Stack
- **Next.js App Router** (React Framework)
- **NestJS** - Backend API
- **AUTH-PRO** - Custom developed microservice for authentication, using **Cloudflare R2** for storage and **Neon DB** for user storage
- **Neon DB** - App's native database
- **RTK Query** – API fetching and caching
- **Redux Toolkit** – State management
- **Tailwind CSS** – Beautiful styling with Sky Blue theming
- **TypeScript** – Fully typed and safe
- **Dark/Light Theme** – Easily switchable UI modes

---

## 🧩 Core Functionality

### 🔐 Authentication
- Secure Login/Signup with validation
- Forgot Password functionality

### 📁 Certificate Management
- Upload certificates with drag-and-drop
- Add skills/tags, descriptions, and privacy settings
- Public/Private toggle for certificate visibility

### 🏠 Dashboard
- Grid view of all certificates
- Search and filter capabilities
- Quick upload button

### 🔍 Certificate Preview
- Fullscreen certificate viewer
- Download and share options
- Public view with verification badge

### 🙍 Profile Page
- Edit profile and upload profile picture
- View statistics and activity logs

### 🌍 Public Certificate Pages
- Clean, professional layout
- Unique sharable link
- Verification badge for authenticity
