# 🏆 Sports Registration System - Frontend Pages Specification

> **Based on backend analysis** - Complete frontend pages and features required

---

## 📋 Table of Contents

1. [Public Pages](#public-pages)
2. [Authentication Pages](#authentication-pages)
3. [Participant Dashboard](#participant-dashboard)
4. [Registration Flow](#registration-flow)
5. [Payment Flow](#payment-flow)
6. [Admin Dashboard](#admin-dashboard)
7. [Shared Components](#shared-components)

---

## 🌐 Public Pages

### 1. Landing Page (`/`)

**Purpose**: Main entry point, overview of the sports fest

**Features**:
- [ ] Hero section with event branding and countdown timer
- [ ] Featured sports carousel with images
- [ ] Quick stats (total participants, sports count, colleges)
- [ ] Call-to-action buttons (Register Now, View Sports)
- [ ] Event schedule overview
- [ ] Testimonials/highlights from past events
- [ ] FAQ accordion section
- [ ] Contact information footer
- [ ] Responsive design for mobile

**API Endpoints Used**:
- `GET /sports?is_open=true&limit=6` - Featured sports
- `GET /settings` - Site configuration

---

### 2. Sports Listing Page (`/sports`)

**Purpose**: Browse all available sports events

**Features**:
- [ ] Grid/List view toggle
- [ ] Category filter tabs (Indoor, Outdoor, E-Sports, Athletics)
- [ ] Search bar with debounced search
- [ ] Sort options (Deadline, Name, Fees, Popularity)
- [ ] Registration status badges (Open, Closed, Full, Coming Soon)
- [ ] Sport cards showing:
  - Sport image
  - Name and category
  - Team/Individual indicator
  - Registration deadline (with countdown if < 7 days)
  - Fees (with early bird indicator)
  - Available spots / Waitlist status
  - Quick register button
- [ ] Pagination or infinite scroll
- [ ] Empty state for no results
- [ ] Loading skeletons

**API Endpoints Used**:
- `GET /sports?category=&is_open=&search=&sort=&page=&limit=`

---

### 3. Sport Details Page (`/sports/[slug]`)

**Purpose**: Detailed information about a specific sport

**Features**:
- [ ] Sport hero image banner
- [ ] Sport name, category badge, team size info
- [ ] Description with markdown rendering
- [ ] Rules section (collapsible)
- [ ] Schedule information:
  - Registration period (start - deadline)
  - Event dates
  - Venue with map link
- [ ] Pricing section:
  - Regular fees
  - Early bird fees with deadline
  - Team vs Individual pricing
- [ ] Capacity information:
  - Max participants
  - Current registration count
  - Available spots progress bar
  - Waitlist status
- [ ] Register button (or login prompt if not authenticated)
- [ ] Eligibility check result (if logged in)
- [ ] Share buttons (social media)
- [ ] Related sports section
- [ ] Back to sports list

**API Endpoints Used**:
- `GET /sports/:slug`
- `GET /registrations/check/:sport_id` (if authenticated)

---

## 🔐 Authentication Pages

### 4. Login Page (`/login`)

**Purpose**: User authentication

**Features**:
- [ ] Email input with validation
- [ ] Password input with show/hide toggle
- [ ] "Remember me" checkbox
- [ ] Forgot password link
- [ ] Login button with loading state
- [ ] Divider with "or"
- [ ] Google OAuth button (if enabled)
- [ ] Sign up link for new users
- [ ] Error messages display
- [ ] Redirect to dashboard after success
- [ ] Redirect to intended page (if came from protected route)

**API Endpoints Used**:
- Supabase Auth: `signInWithPassword`

---

### 5. Signup Page (`/signup`)

**Purpose**: New user registration

**Features**:
- [ ] Form fields:
  - Full Name (required)
  - Email (required, validated)
  - Phone (required, Indian format validation)
  - College (required, autocomplete from list)
  - Password (required, min 8 chars, strength indicator)
  - Confirm Password
- [ ] Terms & conditions checkbox
- [ ] Privacy policy link
- [ ] Register button with loading state
- [ ] Already have account? Login link
- [ ] Form validation with real-time feedback
- [ ] Success message with email verification prompt

**API Endpoints Used**:
- `POST /auth/signup`
- `GET /colleges` (for autocomplete)

---

### 6. Forgot Password Page (`/forgot-password`)

**Purpose**: Password recovery

**Features**:
- [ ] Email input
- [ ] Send reset link button
- [ ] Success message
- [ ] Back to login link

**API Endpoints Used**:
- Supabase Auth: `resetPasswordForEmail`

---

### 7. Reset Password Page (`/reset-password`)

**Purpose**: Set new password from reset link

**Features**:
- [ ] New password input with strength indicator
- [ ] Confirm password input
- [ ] Update password button
- [ ] Success redirect to login

**API Endpoints Used**:
- Supabase Auth: `updateUser`

---

## 👤 Participant Dashboard

### 8. Dashboard Home (`/dashboard`)

**Purpose**: User's main dashboard with overview

**Features**:
- [ ] Welcome message with user name
- [ ] Quick stats cards:
  - Active registrations count
  - Pending payments count
  - Upcoming events count
  - Unread notifications
- [ ] Recent registrations list (last 5)
- [ ] Upcoming events timeline
- [ ] Action buttons:
  - Browse Sports
  - View All Registrations
  - Complete Pending Payments
- [ ] Notification bell with unread count

**API Endpoints Used**:
- `GET /auth/profile`
- `GET /registrations/me?limit=5`
- `GET /notifications/unread-count`

---

### 9. My Registrations Page (`/dashboard/registrations`)

**Purpose**: View all user's registrations

**Features**:
- [ ] Status filter tabs (All, Confirmed, Pending, Waitlist, Cancelled)
- [ ] Registration cards showing:
  - Registration number
  - Sport name and image
  - Status badge (color-coded)
  - Registration date
  - Amount paid
  - Team name (if team event)
- [ ] Actions per registration:
  - View details
  - Complete payment (if pending)
  - Download receipt (if paid)
  - Cancel registration
- [ ] Empty state for no registrations
- [ ] Link to browse sports

**API Endpoints Used**:
- `GET /registrations/me?status=`

---

### 10. Registration Details Page (`/dashboard/registrations/[id]`)

**Purpose**: Detailed view of a single registration

**Features**:
- [ ] Registration number (copy to clipboard)
- [ ] Status with timeline/progress indicator
- [ ] Sport details summary
- [ ] Team information (if team event):
  - Team name
  - Team members list with roles
  - Edit team button (if pending)
- [ ] Payment information:
  - Amount
  - Payment method
  - Transaction ID
  - Receipt download
- [ ] Dates:
  - Registered at
  - Confirmed at
  - Event date
- [ ] Actions:
  - Complete payment (if pending)
  - Edit team (if pending team event)
  - Cancel/Withdraw registration
- [ ] QR code for event check-in

**API Endpoints Used**:
- `GET /registrations/:id`
- `PATCH /registrations/:id/team`
- `POST /registrations/:id/cancel`

---

### 11. Profile Page (`/dashboard/profile`)

**Purpose**: View and edit user profile

**Features**:
- [ ] Avatar upload with crop
- [ ] Profile information display
- [ ] Edit mode toggle
- [ ] Editable fields:
  - Name
  - Phone
  - College
- [ ] Email (read-only, verified badge)
- [ ] Change password section
- [ ] Account statistics:
  - Total registrations
  - Events participated
  - Member since
- [ ] Save changes button
- [ ] Cancel button

**API Endpoints Used**:
- `GET /auth/profile`
- `PATCH /auth/profile`
- Supabase Storage: Avatar upload

---

### 12. Notifications Page (`/dashboard/notifications`)

**Purpose**: View all notifications

**Features**:
- [ ] Notification list with:
  - Icon based on type
  - Title
  - Message
  - Timestamp (relative)
  - Read/unread indicator
- [ ] Filter by type (All, Registration, Payment, Announcement)
- [ ] Mark all as read button
- [ ] Mark individual as read on click
- [ ] Click to navigate to related item
- [ ] Infinite scroll or pagination
- [ ] Empty state

**API Endpoints Used**:
- `GET /notifications?unread_only=&limit=`
- `POST /notifications/mark-read`

---

### 13. Payment History Page (`/dashboard/payments`)

**Purpose**: View all payment transactions

**Features**:
- [ ] Transaction list with:
  - Receipt number
  - Amount
  - Sport name
  - Payment date
  - Status badge
  - Payment method
- [ ] Download receipt button (PDF)
- [ ] Filter by status
- [ ] Search by receipt number
- [ ] Empty state

**API Endpoints Used**:
- `GET /payments/me`
- `GET /payments/:id/receipt`

---

## 📝 Registration Flow

### 14. Registration Page (`/register/[sport-slug]`)

**Purpose**: Multi-step registration process

**Step 1: Review Sport**
- [ ] Sport summary (name, fees, deadline)
- [ ] Eligibility check result
- [ ] Already registered warning (if applicable)
- [ ] Continue button

**Step 2: Team Details (if team event)**
- [ ] Team name input
- [ ] Team size indicator (min/max)
- [ ] Add team member form:
  - Member name (required)
  - Email (optional)
  - Phone (optional)
  - Captain checkbox
- [ ] Member list with remove option
- [ ] Validation for team size
- [ ] Continue button

**Step 3: Review & Confirm**
- [ ] Registration summary
- [ ] Fees breakdown:
  - Base fees
  - Early bird discount (if applicable)
  - Convenience fee
  - Total
- [ ] Terms acceptance checkbox
- [ ] Confirm registration button

**Step 4: Payment (or Success)**
- [ ] Redirect to payment page, OR
- [ ] Success message for free events
- [ ] Registration confirmation

**Features**:
- [ ] Step indicator/progress bar
- [ ] Back navigation between steps
- [ ] Save draft functionality
- [ ] Form persistence (don't lose data on back)
- [ ] Loading states
- [ ] Error handling

**API Endpoints Used**:
- `GET /registrations/check/:sport_id`
- `POST /registrations`

---

## 💳 Payment Flow

### 15. Payment Page (`/payment/[registration-id]`)

**Purpose**: Complete payment for registration

**Features**:
- [ ] Order summary:
  - Sport name
  - Registration number
  - Participant/Team name
- [ ] Amount breakdown:
  - Base amount
  - Convenience fee
  - Total amount
- [ ] Payment countdown timer (24 hours)
- [ ] Razorpay checkout button
- [ ] Offline payment option (if enabled):
  - Bank details
  - UPI ID
  - Instructions
- [ ] Payment processing overlay
- [ ] Success page redirect
- [ ] Failure handling with retry

**API Endpoints Used**:
- `POST /payments/create-order`
- `POST /payments/verify`

---

### 16. Payment Success Page (`/payment/success`)

**Purpose**: Confirm successful payment

**Features**:
- [ ] Success animation/icon
- [ ] Confirmation message
- [ ] Registration number
- [ ] Receipt number
- [ ] Amount paid
- [ ] Download receipt button
- [ ] View registration button
- [ ] Share buttons
- [ ] Return to dashboard

**API Endpoints Used**:
- Passed via URL params or state

---

### 17. Payment Failed Page (`/payment/failed`)

**Purpose**: Handle failed payment

**Features**:
- [ ] Error icon
- [ ] Error message
- [ ] Retry payment button
- [ ] Contact support information
- [ ] Return to dashboard

---

## 👨‍💼 Admin Dashboard

### 18. Admin Dashboard Home (`/admin`)

**Purpose**: Admin overview with key metrics

**Features**:
- [ ] Stats cards:
  - Total registrations
  - Confirmed registrations
  - Pending payments
  - Waitlisted
  - Total revenue
  - Today's revenue
  - Active sports
  - Total participants
  - Colleges count
- [ ] Revenue chart (daily/weekly/monthly)
- [ ] Registration trends chart
- [ ] Recent registrations table
- [ ] Recent payments table
- [ ] Quick actions:
  - Create sport
  - Export data
  - Send announcement

**API Endpoints Used**:
- `GET /analytics/dashboard`
- `GET /analytics/trends`
- `GET /analytics/revenue`

---

### 19. Admin Sports Management (`/admin/sports`)

**Purpose**: Manage all sports events

**Features**:
- [ ] Sports table with:
  - Name
  - Category
  - Registration status (Open/Closed)
  - Current/Max participants
  - Revenue
  - Actions
- [ ] Create sport button
- [ ] Filters (category, status)
- [ ] Search
- [ ] Bulk actions
- [ ] Actions per sport:
  - Edit
  - View registrations
  - Toggle registration
  - Duplicate
  - Archive

**API Endpoints Used**:
- `GET /sports` (with admin access)
- `GET /analytics/sports`

---

### 20. Create/Edit Sport Page (`/admin/sports/new` or `/admin/sports/[id]/edit`)

**Purpose**: Create or edit sport event

**Features**:
- [ ] Form sections:
  - **Basic Info**: Name, Category, Description, Rules
  - **Media**: Image upload
  - **Team Config**: Is team event, Min/Max size
  - **Pricing**: Fees, Early bird fees & deadline
  - **Schedule**: Registration start/end, Event start/end, Venue
  - **Capacity**: Max participants, Waitlist enabled, Max waitlist
- [ ] Preview mode
- [ ] Save as draft
- [ ] Publish button
- [ ] Validation
- [ ] Image upload to storage

**API Endpoints Used**:
- `POST /sports`
- `PATCH /sports/:id`
- Supabase Storage: Image upload

---

### 21. Admin Registrations (`/admin/registrations`)

**Purpose**: Manage all registrations

**Features**:
- [ ] Advanced filters:
  - Sport
  - Status
  - Payment status
  - College
  - Date range
- [ ] Search by name, email, registration number
- [ ] Registrations table with:
  - Registration number
  - Participant name
  - Sport
  - College
  - Status
  - Amount
  - Date
  - Actions
- [ ] Bulk actions:
  - Confirm selected
  - Cancel selected
  - Export selected
- [ ] Actions per registration:
  - View details
  - Update status
  - Verify offline payment
  - Process refund
- [ ] Export to CSV/Excel

**API Endpoints Used**:
- `GET /admin/registrations`
- `PATCH /admin/registrations/:id`
- `POST /admin/registrations/bulk-update`
- `GET /admin/registrations/export`

---

### 22. Admin Registration Details (`/admin/registrations/[id]`)

**Purpose**: Detailed admin view of registration

**Features**:
- [ ] All registration details
- [ ] Participant profile link
- [ ] Full payment history
- [ ] Status update dropdown
- [ ] Add admin notes
- [ ] Verify offline payment form
- [ ] Process refund form
- [ ] Audit log for this registration
- [ ] Communication log

**API Endpoints Used**:
- `GET /registrations/:id`
- `PATCH /admin/registrations/:id`
- `POST /admin/payments/verify-offline`
- `POST /admin/payments/:id/refund`

---

### 23. Admin Payments (`/admin/payments`)

**Purpose**: View all payment transactions

**Features**:
- [ ] Payments table with:
  - Receipt number
  - User
  - Sport
  - Amount
  - Method
  - Status
  - Date
- [ ] Filters (status, method, date range)
- [ ] Revenue summary
- [ ] Export functionality
- [ ] Refund action

**API Endpoints Used**:
- Admin view of payments (RLS allows admin)

---

### 24. Admin Analytics (`/admin/analytics`)

**Purpose**: Detailed analytics and reports

**Features**:
- [ ] Date range selector
- [ ] Revenue analytics:
  - Daily/Weekly/Monthly chart
  - Total revenue
  - Average per registration
- [ ] Sports analytics:
  - Registrations per sport chart
  - Revenue per sport
  - Capacity utilization
- [ ] College analytics:
  - Participation by college
  - Top colleges
  - College-wise revenue
- [ ] Registration trends:
  - Daily registrations chart
  - Conversion funnel
  - Status breakdown
- [ ] Export reports

**API Endpoints Used**:
- `GET /analytics/sports`
- `GET /analytics/colleges`
- `GET /analytics/revenue`
- `GET /analytics/trends`

---

### 25. Admin Audit Logs (`/admin/audit-logs`)

**Purpose**: View system audit trail

**Features**:
- [ ] Audit logs table with:
  - Timestamp
  - User
  - Action
  - Entity type
  - Entity ID
  - Old/New values (expandable)
- [ ] Filters:
  - User
  - Action
  - Entity type
  - Date range
- [ ] Search
- [ ] Pagination

**API Endpoints Used**:
- `GET /admin/audit-logs`

---

### 26. Admin Settings (`/admin/settings`)

**Purpose**: System configuration

**Features**:
- [ ] General settings:
  - Site name
  - Contact email
  - Contact phone
- [ ] Registration settings:
  - Global registration toggle
  - Payment methods (online/offline)
  - Convenience fee
- [ ] Event dates:
  - Event start date
  - Event end date
- [ ] Email settings:
  - Email templates preview
- [ ] Save settings button

**API Endpoints Used**:
- `GET /admin/settings`
- `PATCH /admin/settings`

---

### 27. Admin Colleges (`/admin/colleges`)

**Purpose**: Manage colleges list

**Features**:
- [ ] Colleges table
- [ ] Add college form
- [ ] Edit college
- [ ] Delete college (soft delete)
- [ ] Import from CSV
- [ ] Export to CSV

**API Endpoints Used**:
- `GET /admin/colleges`
- `POST /admin/colleges`
- `PATCH /admin/colleges/:id`
- `DELETE /admin/colleges/:id`

---

### 28. Admin Announcements (`/admin/announcements`)

**Purpose**: Send broadcast notifications

**Features**:
- [ ] Create announcement form:
  - Title
  - Message
  - Priority
  - Target audience (All, Specific sport, Specific college)
  - Send email option
- [ ] Preview
- [ ] Send button
- [ ] Past announcements list

**API Endpoints Used**:
- `POST /admin/notifications/broadcast`

---

## 🧩 Shared Components

### Navigation Components
- [ ] **Navbar**: Logo, nav links, auth buttons, user dropdown, notification bell
- [ ] **Sidebar**: Admin navigation
- [ ] **Footer**: Links, contact, social media
- [ ] **Breadcrumbs**: Page navigation trail
- [ ] **Mobile Menu**: Responsive hamburger menu

### UI Components
- [ ] **Button**: Primary, secondary, outline, loading variants
- [ ] **Card**: Sport card, stat card, registration card
- [ ] **Badge**: Status badges, category badges
- [ ] **Modal**: Confirmation dialogs, forms
- [ ] **Toast**: Success, error, info notifications
- [ ] **Alert**: Warning messages, info banners
- [ ] **Form Elements**: Input, select, checkbox, radio, textarea
- [ ] **Table**: Sortable, filterable, paginated
- [ ] **Tabs**: Category tabs, status tabs
- [ ] **Dropdown**: User menu, action menus
- [ ] **Avatar**: User avatar with fallback
- [ ] **Progress**: Progress bar, step indicators
- [ ] **Skeleton**: Loading placeholders
- [ ] **Empty State**: No data illustrations

### Feature Components
- [ ] **Sport Card**: Reusable sport display card
- [ ] **Registration Card**: Registration status card
- [ ] **Payment Summary**: Amount breakdown component
- [ ] **Team Member Form**: Add/edit team member
- [ ] **Stats Card**: Dashboard metric card
- [ ] **Chart Components**: Line, bar, pie charts
- [ ] **Countdown Timer**: Registration deadline
- [ ] **File Upload**: Image/document upload
- [ ] **Search Bar**: With debounce

### Layout Components
- [ ] **Page Layout**: Header, main, footer
- [ ] **Dashboard Layout**: Sidebar, content area
- [ ] **Auth Layout**: Centered card layout
- [ ] **Section**: Content sections with headers

---

## 🔒 Route Protection

### Public Routes
- `/`
- `/sports`
- `/sports/[slug]`
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`

### Protected Routes (Require Authentication)
- `/dashboard/*`
- `/register/*`
- `/payment/*`

### Admin Routes (Require Admin Role)
- `/admin/*`

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| Mobile | < 640px | Phones |
| Tablet | 640px - 1024px | Tablets |
| Desktop | > 1024px | Laptops/Desktops |

---

## 🎨 Design Guidelines

### Color Scheme
- **Primary**: Purple/Indigo gradient (`#667eea` → `#764ba2`)
- **Success**: Green (`#48bb78`)
- **Warning**: Orange (`#ed8936`)
- **Error**: Red (`#f56565`)
- **Info**: Blue (`#4299e1`)

### Typography
- **Headings**: Inter or Poppins (Bold)
- **Body**: Inter (Regular)
- **Monospace**: JetBrains Mono (for codes)

### Spacing
- Use consistent 4px base unit
- Section padding: 24px - 48px
- Card padding: 16px - 24px
- Button padding: 12px 24px

---

## 📊 State Management

### Global State
- User authentication state
- Current user profile
- Unread notification count
- Theme preference

### Local State
- Form values
- Filter/sort preferences
- Modal open/close
- Loading states

---

## 🔄 API Integration Patterns

### Data Fetching
- Use SWR or React Query for caching
- Implement loading states
- Handle errors gracefully
- Show optimistic updates

### Authentication
- Store session in Supabase
- Auto-refresh tokens
- Protected route middleware
- Logout on token expiry

---

## ✅ Testing Checklist

- [ ] All pages render correctly
- [ ] Forms validate properly
- [ ] API calls handle errors
- [ ] Loading states work
- [ ] Mobile responsive
- [ ] Accessibility (a11y)
- [ ] Cross-browser testing
- [ ] Performance optimization

---

*Document Version: 1.0*
*Generated: January 2026*
*Based on: devbackend.xml specification*
