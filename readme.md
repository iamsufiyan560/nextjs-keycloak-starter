# Keycloak Starter Template with Next.js and Node.js

This repository provides a **starter template** for integrating **Keycloak authentication** with a **Next.js frontend** and a **Node.js + Express + MongoDB backend**. It also includes role-based access control (RBAC) setup.

---

## 🚀 Step 1: Run Keycloak with Docker

Make sure you have **Docker Desktop** installed and running.

Run the following command in your terminal (PowerShell, CMD, or bash):

```bash
docker run -d -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:26.0.0 start-dev
```

After running this command:

- Open [http://localhost:8080](http://localhost:8080) in your browser.
- Log in with:

  - Username: `admin`
  - Password: `admin`

---

## ⚙️ Step 2: Configure Realm in Keycloak

1. Go to **[http://localhost:8080](http://localhost:8080)** → Login with admin credentials.
2. Click **Create Realm** → Name it `myrealm`.
3. Inside the realm, go to **Clients** → Click **Create client**.

   - **Client ID**: `next-app`
   - **Client Authentication**: **On** (confidential client)
   - **Standard Flow**: Enabled
   - **Direct Access Grants**: Enabled
   - **Root URL**: `http://localhost:3000`
   - **Valid Redirect URIs**: `http://localhost:3000/*`
   - **Web Origins**: `*`

### 🔑 Enable Google Login in Keycloak

To enable the **Google login button** on your Keycloak login page:

1. Go to the **Google Cloud Console** → create a new project.
2. Enable **OAuth 2.0 Client ID** under **APIs & Services → Credentials**.
3. Configure the **Authorized Redirect URI** in Google to point to your Keycloak realm callback URL:

4. Copy the generated **Client ID** and **Client Secret**.
5. In **Keycloak Admin Console** → **Identity Providers**, choose **Google**.
6. Paste the **Client ID** and **Client Secret**.
7. Save — now the **Google login button** will automatically appear on your Keycloak login page 🎉.

> ⚡ You don’t need extra UI work — Keycloak renders the Google button out of the box once it’s configured.

---

## ✉️ Step 3: (Optional) Enable Email Verification & Forgot Password

If you want to enable email verification, signup emails, and forgot password:

1. Go to **Realm Settings → Login**:

   - Enable: `User registration`, `Email as username`, `Forgot password`, `Verify email`.

2. Go to **Realm Settings → Email**:

   - **From**: `your-email@gmail.com`
   - **Host**: `smtp.gmail.com`
   - **Port**: `587`
   - **Encryption**: StartTLS
   - **Authentication**: Enabled
   - **Username**: your Gmail
   - **Password**: Gmail **App Password** (not your real Gmail password).

👉 To generate an app password in Gmail: Google Account → Security → App Passwords → Generate new.

---

## 💻 Step 4: Backend Setup (Node.js + Express + MongoDB)

### Environment Variables (`.env` in backend):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/keycloak_rbac
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=myrealm
KEYCLOAK_CLIENT_ID=next-app
KEYCLOAK_CLIENT_SECRET=your-client-secret-here

FRONTEND_URL=http://localhost:3000
```

### Run backend:

```bash
cd backend
npm install
npm run dev
```

Backend will start at [http://localhost:5000](http://localhost:5000).

---

## 🌐 Step 5: Frontend Setup (Next.js)

### Environment Variables (`.env.local` in frontend):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=myrealm
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=next-app
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend will start at [http://localhost:3000](http://localhost:3000).

---

## 🔑 Authentication Flow

1. User visits frontend → redirected to **Keycloak login**.
2. After login, Keycloak redirects back to frontend with authorization code.
3. Frontend exchanges code with backend → backend verifies with Keycloak.
4. Backend stores user info in MongoDB (first-time signup) or updates last login.
5. Backend issues its own JWT for session management.
6. Frontend stores session (cookie/localStorage).
7. Logout → clears both backend session and Keycloak SSO session.

---

## 🛂 Role-Based Access Control (RBAC)

- User roles are stored and managed in **MongoDB**, not in Keycloak.
- When a user logs in, backend ensures a record exists in MongoDB and attaches default role.
- Backend issues JWT including the role.

---

## ✅ Summary

You now have a **complete base setup**:

- **Keycloak** (Auth)
- **Node.js + Express + MongoDB backend** (session, API, persistence, RBAC)
- **Next.js frontend** (UI, role indicators)

From here, you can build your application features on top of this authentication + authorization flow.
