# Phase 2 Migration Strategy: Dockerized Full-Stack

To transition from the Phase 1 Serverless architecture to a Dockerized Full-Stack environment, follow these steps:

## 1. Database Migration (Firestore to PostgreSQL)
- **Tooling:** Use Prisma or Drizzle ORM.
- **Schema Export:** Convert the Firestore NoSQL structure into a relational schema.
  - `employees` table with `id`, `user_id`, `first_name`, `last_name`, `email`, `department`, `job_title`, `dob`, `joined_date`, `status`, `metadata`.
  - `settings` table with `user_id`, `smtp_config` (JSONB), `teams_config` (JSONB), `telegram_config` (JSONB), `templates` (JSONB).
  - `notification_logs` table for audit trails.
- **Data Porting:** Write a one-time script using `firebase-admin` to read all Firestore docs and insert them into PostgreSQL.

## 2. Backend Extraction (Cloud Functions to Node.js/Express)
- **Porting Logic:** Extract the notification logic from `functions/src/index.ts` into an Express service.
- **Task Scheduling:** Replace `Cloud Scheduler` with `node-cron` or a robust worker like `BullMQ` (Redis-backed) to handle daily checks and alert retries.
- **Auth Proxy:** Replace Firebase Auth Client SDK with a backend middleware that verifies JWTs (using Firebase Admin SDK if keeping Firebase Auth, or transitioning to Lucide/Passport for custom auth).

## 3. Dockerization
- **Frontend Container:** Multi-stage build (Vite Build -> Nginx).
- **Backend Container:** Node.js container running the Express API.
- **Database:** PostgreSQL 15+ container with persistent volumes.
- **Orchestration:** Use `docker-compose.yml` to link the services and manage environment variables.

## 4. Deployment
- **Hosting:** Deploy to any Cloud provider (GCP Cloud Run, AWS ECS, or a VPS with Docker).
- **CI/CD:** Update GitHub Actions to build Docker images and push to a registry (GCR/ECR/DockerHub).
