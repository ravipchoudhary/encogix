-- CreateTable "admins"
CREATE TABLE IF NOT EXISTS "admins" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable "employees"
CREATE TABLE IF NOT EXISTS "employees" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "employee_id" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "designation" TEXT,
    "password" TEXT NOT NULL,
    "dob" TEXT,
    "join_date" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable "contacts"
CREATE TABLE IF NOT EXISTS "contacts" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "message" TEXT,
    "source" TEXT DEFAULT 'contact',
    "status" TEXT NOT NULL DEFAULT 'new',
    "assigned_employee_id" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "contacts_assigned_employee_id_fkey" FOREIGN KEY ("assigned_employee_id") REFERENCES "employees" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable "projects"
CREATE TABLE IF NOT EXISTS "projects" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "title" TEXT,
    "description" TEXT,
    "image" TEXT,
    "category" TEXT,
    "client" TEXT,
    "technologies" TEXT,
    "project_url" TEXT,
    "slug" TEXT UNIQUE,
    "industry" TEXT,
    "results" TEXT
);

-- CreateTable "blogs"
CREATE TABLE IF NOT EXISTS "blogs" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "title" TEXT,
    "content" TEXT,
    "author" TEXT,
    "image" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable "jobs"
CREATE TABLE IF NOT EXISTS "jobs" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "title" TEXT,
    "location" TEXT,
    "experience" TEXT,
    "description" TEXT
);

-- CreateTable "job_applications"
CREATE TABLE IF NOT EXISTS "job_applications" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "current_company" TEXT,
    "current_salary" TEXT,
    "expected_salary" TEXT,
    "experience" TEXT,
    "notice_period" TEXT,
    "resume" TEXT,
    "message" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable "internship_applications"
CREATE TABLE IF NOT EXISTS "internship_applications" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "internship_type" TEXT,
    "college" TEXT,
    "course" TEXT,
    "resume" TEXT,
    "message" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable "chatbot_settings"
CREATE TABLE IF NOT EXISTS "chatbot_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY,
    "data" TEXT
);

-- CreateTable "attendance"
CREATE TABLE IF NOT EXISTS "attendance" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "employee_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "punch_in" TIMESTAMP,
    "punch_out" TIMESTAMP,
    "punch_in_location" TEXT,
    "punch_out_location" TEXT,
    CONSTRAINT "attendance_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "attendance_unique" UNIQUE("employee_id", "date")
);

-- CreateTable "leave_requests"
CREATE TABLE IF NOT EXISTS "leave_requests" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "employee_id" INTEGER NOT NULL,
    "from_date" DATE,
    "to_date" DATE,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "leave_requests_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable "announcements"
CREATE TABLE IF NOT EXISTS "announcements" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "title" TEXT,
    "content" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable "greetings"
CREATE TABLE IF NOT EXISTS "greetings" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "from_employee_id" INTEGER NOT NULL,
    "to_employee_id" INTEGER NOT NULL,
    "occasion" TEXT,
    "message" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "greetings_from_employee_id_fkey" FOREIGN KEY ("from_employee_id") REFERENCES "employees" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "greetings_to_employee_id_fkey" FOREIGN KEY ("to_employee_id") REFERENCES "employees" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable "conversations"
CREATE TABLE IF NOT EXISTS "conversations" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable "conversation_participants"
CREATE TABLE IF NOT EXISTS "conversation_participants" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "conversation_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    CONSTRAINT "conversation_participants_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "conversation_participants_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "conversation_participant_unique" UNIQUE("conversation_id", "employee_id")
);

-- CreateTable "conversation_messages"
CREATE TABLE IF NOT EXISTS "conversation_messages" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "conversation_id" INTEGER NOT NULL,
    "from_employee_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "conversation_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "conversation_messages_from_employee_id_fkey" FOREIGN KEY ("from_employee_id") REFERENCES "employees" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable "testimonials"
CREATE TABLE IF NOT EXISTS "testimonials" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "designation" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "text" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable "services"
CREATE TABLE IF NOT EXISTS "services" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "icon" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "contacts_assigned_employee_id_idx" ON "contacts"("assigned_employee_id");
CREATE INDEX IF NOT EXISTS "attendance_employee_id_idx" ON "attendance"("employee_id");
CREATE INDEX IF NOT EXISTS "leave_requests_employee_id_idx" ON "leave_requests"("employee_id");
CREATE INDEX IF NOT EXISTS "greetings_from_employee_id_idx" ON "greetings"("from_employee_id");
CREATE INDEX IF NOT EXISTS "greetings_to_employee_id_idx" ON "greetings"("to_employee_id");
CREATE INDEX IF NOT EXISTS "conversation_participants_conversation_id_idx" ON "conversation_participants"("conversation_id");
CREATE INDEX IF NOT EXISTS "conversation_participants_employee_id_idx" ON "conversation_participants"("employee_id");
CREATE INDEX IF NOT EXISTS "conversation_messages_conversation_id_idx" ON "conversation_messages"("conversation_id");
CREATE INDEX IF NOT EXISTS "conversation_messages_from_employee_id_idx" ON "conversation_messages"("from_employee_id");
