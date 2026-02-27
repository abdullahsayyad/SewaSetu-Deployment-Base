# 🏛️ SewaSetu: Grievance Intelligence System

![SewaSetu Banner](./public/banner.png)

SewaSetu is a modern, AI-powered public grievance management portal designed for smart cities and forward-thinking governments. It provides dual-sided platforms for **Citizens** to intuitively report civic issues and **Government Departments** to intelligently route, triage, and resolve those issues at scale.

## ✨ Key Features

### 👤 For Citizens
*   **Intuitive Reporting:** File grievances with rich media attachments (photos, geolocation).
*   **National Secure Gateway Mock:** Secure OTP-based authentication simulation.
*   **Interactive Maps:** View a dynamic Mapbox/Leaflet based map pinning the locations of issues.
*   **Live Tracking:** Monitor the real-time status of reported issues via a personal Grievance Ledger.

### 🏢 For Departments (Nodal Officers)
*   **AI-Driven Triage:** Automated Risk Assessment and Escalation Scoring powered by simulated NLP models.
*   **Smart Routing:** Incoming petitions are automatically categorized (Roads, Sanitation, Electricity, etc.) and pushed to the relevant department queue.
*   **Analytics Dashboard:** Gain insights via real-time Recharts visualizations detailing ticket velocity, SLA adherence, and core issue clusters.
*   **Efficient Resolution:** Streamlined workflow to review full AI analysis reports and resolve incidents, instantaneously keeping citizens informed.

## 🛠️ Tech Stack

*   **Frontend:** [Next.js 14](https://nextjs.org/) (App Router), React, Tailwind CSS
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/), Lucide Icons
*   **Mapping:** Leaflet, React-Leaflet
*   **Charts:** Recharts
*   **Backend / Database:** Server Actions, Prisma ORM, PostgreSQL (Neon/Supabase)

## 🚀 Getting Started

To run the SewaSetu portal locally, follow these steps:

### Prerequisites
*   Node.js 18+
*   PostgreSQL Database instance

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/sewasetu.git
    cd sewasetu
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add your database URL:
    ```env
    DATABASE_URL="postgres://user:password@hostname:port/db_name"
    ```

4.  **Run Database Migrations:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Start the Development Server:**
    ```bash
    npm run dev
    ```

6.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 💡 Usage Scenarios

*   **Citizen Portal:** Navigate to `/citizen/login`. Use any active number/email and OTP (e.g., `9998887776` / `123456`) mapped in your database to log in and report an issue.
*   **Department Portal:** Navigate to `/department/login`. Select a specific department (e.g., "Electricity") to view securely filtered incoming intelligence and analytics dashboards.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
