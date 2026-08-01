# Equipment Maintenance Tracker - Development Roadmap

## Database Architecture, Auth & Basic Infrastructure 

### Session 1: Database & Auth Setup 
- [x] **Supabase Schema Design**
  - [x] Create `user_profiles` table (`id`, `name`, `role`, `created_at`)
  - [x] Create `repair_tickets` table (`id`, `user_id`, `title`, `description`, `status`, `priority`, `created_at`)
- [x] **Database Trigger**
  - [x] Implement `handle_new_user` trigger to auto-insert profiles upon signup
- [x] **Configure RLS Policies (Core Security)**
  - [x] `repair_tickets` SELECT: Users read own tickets; Admins read all tickets
  - [x] `repair_tickets` INSERT: Authenticated users only (`user_id` bound to `auth.uid()`)
  - [x] `repair_tickets` UPDATE: Users edit own pending tickets; Admins update any ticket status
- [ ] **Frontend Initialization**
  - [x] Initialize Vite + React + Tailwind CSS + shadcn/ui
  - [x] Install `@supabase/supabase-client` & configure `.env`

### Session 2: AuthContext & Essential Pages
- [x] **Implement AuthContext**
  - [x] Encapsulate `session` and `user_profiles` fetching logic
- [x] **Login / Signup Pages**
  - [x] Build auth form using shadcn/ui (`Card`, `Input`, `Button`)
- [x] **Test RLS Enforcement**
  - [x] Register two distinct roles (`user` & `admin`) to verify access control flow

---

## Core Features, UI Integration & E2E Testing 

### Session 1: Feature Implementation & UI Integration 
- [x] **Create Ticket Form**
  - [x] Embed form inside a shadcn `Dialog` (Modal)
  - [x] Auto-bind `user_id` to current authenticated user
- [x] **Tickets Table**
  - [x] Render tickets list using shadcn `Table`
  - [x] Display ticket status using shadcn `Badge` (e.g., Green for "Completed", Yellow for "In Progress")
- [x] **Role-Based UI Control**
  - [x] **User View**: View own tickets only + "Create Ticket" button
  - [x] **Admin View**: View all tickets + inline status toggle (`Select` component for Pending -> In Progress -> Completed)

### Session 2: Analytics, Testing & Deployment 
- [x] **Dashboard Metric Cards**
  - [x] Display ticket metrics using shadcn `Card`: "Pending", "In Progress", "Completed"
  - [ ] Calculate counts via Supabase aggregate queries or client-side filtering
- [ ] **End-to-End (E2E) Flow Testing**
  - [ ] Verify full workflow: User creates ticket ➔ Admin updates status ➔ User sees real-time updates
  - [ ] Test privilege escalation resistance (Verify unauthorized API mutations are blocked by RLS)
- [ ] **Deployment (Optional)**
  - [ ] Deploy frontend to Vercel or Netlify