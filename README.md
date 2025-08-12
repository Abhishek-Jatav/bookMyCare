
# 📅 BookMyCare

BookMyCare is a **full-stack appointment booking platform** for customers and healthcare providers, built with **Next.js (frontend)**, **NestJS (backend)**, **PostgreSQL (Prisma)**, and **Jwt Authentication**.

---

## 🚀 Features

### **Authentication**
- User registration & login via JWT (stored in cookies)
- Role-based access: **Customer** & **Provider**
- Auto-fetch profile if token exists

### **Customer Dashboard**
- View list of available providers
- Search & filter providers
- View & manage bookings
- Cancel appointments

### **Provider Dashboard**
- Manage availability slots
- View appointments
- Cancel bookings

### **Booking Flow**
- Live provider availability
- Book appointments instantly
- Real-time UI updates (WebSocket-ready)

---

## 🛠 Tech Stack

**Frontend**
- Next.js (App Router) + TypeScript
- Tailwind CSS
- React Context API (Auth state)
- Axios API wrapper

**Backend**
- NestJS (TypeScript)
- Prisma ORM
- PostgreSQL
- JWT Authentication

**Dev Tools**
- Thunder Client / Postman for API testing
- ESLint & Prettier for code formatting

---

## 📂 Project Structure

```

bookmycare/
│
├── frontend/              # Next.js frontend
│   ├── app/               # Pages (App Router)
│   ├── components/        # UI components
│   ├── lib/               # API wrappers
│   └── context/           # Auth context
│
├── backend/               # NestJS backend
│   ├── src/               # Modules & controllers
│   ├── prisma/            # Prisma schema & migrations
│   └── package.json
│
└── README.md              # Project documentation

````

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/bookmycare.git
cd bookmycare
````

### 2️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update DATABASE_URL, JWT_SECRET in .env
npx prisma migrate dev
npm run start:dev
```

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env.local
# Update NEXT_PUBLIC_API_BASE to backend URL
npm run dev
```

---

## 🔑 Environment Variables

**Frontend (.env.local)**

```env
NEXT_PUBLIC_API_BASE=http://localhost:5000
```

**Backend (.env)**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/bookmycare
JWT_SECRET=your_jwt_secret
```

---

## 📌 API Endpoints

### **Auth**

* `POST /auth/register` — Register user
* `POST /auth/login` — Login user (returns token & user data)

### **Customer**

* `GET /providers` — List providers
* `GET /appointments/:userId` — Get bookings
* `POST /appointments` — Create booking
* `DELETE /appointments/:id` — Cancel booking

### **Provider**

* `GET /appointments/provider/:id` — Provider appointments
* `POST /availability` — Add availability
* `DELETE /availability/:id` — Remove availability

---

## 🖼 Screenshots

*(Add your project screenshots here once UI is complete)*

---

## 📜 License

MIT License — Free to use and modify.

---

## 💡 Future Improvements

* Add WebSocket-based real-time booking updates
* Payment integration (Stripe)
* Email/SMS notifications

```

