-- SewaSetu Production-Grade PostgreSQL Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- ENUM DEFINITIONS
-- ==========================================
CREATE TYPE user_role AS ENUM ('citizen', 'officer');
CREATE TYPE priority_enum AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE status_enum AS ENUM ('pending', 'in_progress', 'escalated', 'resolved');


-- ==========================================
-- TABLES
-- ==========================================

-- 2️⃣ departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sla_hours INT NOT NULL DEFAULT 48,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1️⃣ users (Supports both citizens and department officers)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL, -- Nullable for citizens
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1️⃣1️⃣ duplicate_clusters (For grouping similar complaints)
CREATE TABLE duplicate_clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3️⃣ complaints (Core Table)
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    priority_level priority_enum NOT NULL DEFAULT 'medium',
    status status_enum NOT NULL DEFAULT 'pending',
    escalation_level INT NOT NULL DEFAULT 0,
    upvote_count INT NOT NULL DEFAULT 0,
    is_duplicate BOOLEAN NOT NULL DEFAULT false,
    cluster_id UUID REFERENCES duplicate_clusters(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4️⃣ complaint_upvotes (Tracks which citizens upvoted which complaint)
CREATE TABLE complaint_upvotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (complaint_id, user_id) -- Prevents duplicate upvotes
);

-- 5️⃣ complaint_ai_analysis
CREATE TABLE complaint_ai_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100),
    sentiment_score DECIMAL(3, 2) NOT NULL, -- e.g., -1.00 to 1.00
    risk_score INT NOT NULL, -- e.g., 0 to 100
    escalation_score INT NOT NULL, -- e.g., 0 to 100
    extracted_keywords JSONB,
    ai_summary TEXT NOT NULL,
    suggested_action TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6️⃣ complaint_status_history (Tracks lifecycle)
CREATE TABLE complaint_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    status status_enum NOT NULL,
    changed_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7️⃣ resolution_reports
CREATE TABLE resolution_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    resolved_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    resolution_notes TEXT NOT NULL,
    cost_estimate DECIMAL(12, 2),
    resolved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8️⃣ attachments (For complaint and resolution images)
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9️⃣ escalations (Tracks automatic escalation events)
CREATE TABLE escalations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    escalation_level INT NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 🔟 notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- INDEXES
-- ==========================================

-- Performance indexes for 'complaints' table
CREATE INDEX idx_complaints_department_id ON complaints(department_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_location ON complaints(latitude, longitude);
CREATE INDEX idx_complaints_upvote_count ON complaints(upvote_count DESC);
CREATE INDEX idx_complaints_cluster_id ON complaints(cluster_id);

-- Performance indexes for other tables
CREATE INDEX idx_users_department_id ON users(department_id);
CREATE INDEX idx_upvotes_complaint_id ON complaint_upvotes(complaint_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_history_complaint_id ON complaint_status_history(complaint_id);

-- ==========================================
-- TRIGGERS (Auto-update updated_at)
-- ==========================================

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_complaints_modtime
    BEFORE UPDATE ON complaints
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();
