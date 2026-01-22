# Sports Registration System - Backend

A comprehensive backend API for sports event registration and management, built with Supabase.

## Tech Stack

- **Runtime**: Supabase Edge Functions (Deno)
- **Database**: PostgreSQL (Supabase Database)
- **Authentication**: Supabase Auth
- **Payment Gateway**: Razorpay
- **Email Service**: Resend
- **File Storage**: Supabase Storage
- **Realtime**: Supabase Realtime
- **Scheduling**: pg_cron

## Project Structure

```
backend/
├── supabase/
│   ├── migrations/          # Database migrations (run in order)
│   │   ├── 00001_create_extensions.sql
│   │   ├── 00002_create_utility_functions.sql
│   │   ├── 00003_create_profiles_table.sql
│   │   ├── 00004_create_sports_table.sql
│   │   ├── 00005_create_registrations_table.sql
│   │   ├── 00006_create_team_members_table.sql
│   │   ├── 00007_create_payments_table.sql
│   │   ├── 00008_create_notifications_table.sql
│   │   ├── 00009_create_audit_logs_table.sql
│   │   ├── 00010_create_colleges_settings_tables.sql
│   │   ├── 00011_create_analytics_functions.sql
│   │   ├── 00012_create_scheduled_jobs.sql
│   │   └── 00013_create_storage_buckets.sql
│   └── functions/           # Edge Functions
│       ├── _shared/         # Shared utilities
│       │   ├── supabase.ts
│       │   ├── response.ts
│       │   ├── validation.ts
│       │   ├── razorpay.ts
│       │   └── email.ts
│       ├── auth/            # Authentication endpoints
│       ├── sports/          # Sports management
│       ├── registrations/   # Registration flow
│       ├── payments/        # Payment processing
│       ├── notifications/   # User notifications
│       ├── analytics/       # Dashboard analytics
│       └── admin/           # Admin utilities
├── types/
│   └── database.ts          # TypeScript type definitions
├── .env.example             # Environment variables template
├── config.toml              # Supabase config
├── tsconfig.json            # TypeScript configuration
└── README.md
```

## Setup Instructions

### 1. Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Deno](https://deno.land/) (for local development)
- Supabase project
- Razorpay account
- Resend account (for emails)

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

### 3. Database Setup

Run migrations in your Supabase project:

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Run migrations
supabase db push
```

Or run migrations manually in the SQL Editor in Supabase Dashboard.

### 4. Enable Extensions

In Supabase Dashboard → Database → Extensions, enable:
- `pg_cron` (for scheduled jobs)
- `uuid-ossp` (usually enabled by default)

### 5. Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy auth
supabase functions deploy sports
supabase functions deploy registrations
supabase functions deploy payments
supabase functions deploy notifications
supabase functions deploy analytics
supabase functions deploy admin

# Set secrets
supabase secrets set RAZORPAY_KEY_ID=your_key_id
supabase secrets set RAZORPAY_KEY_SECRET=your_key_secret
supabase secrets set RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
supabase secrets set RESEND_API_KEY=your_resend_key
supabase secrets set EMAIL_FROM=noreply@yourdomain.com
supabase secrets set FRONTEND_URL=https://yourfrontend.com
```

### 6. Configure Razorpay Webhook

In Razorpay Dashboard, add webhook URL:
```
https://YOUR_PROJECT.supabase.co/functions/v1/payments/webhook
```

Events to subscribe:
- `payment.captured`
- `payment.failed`
- `refund.processed`

## API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/signup` | User registration | Public |
| GET | `/auth/profile` | Get user profile | Authenticated |
| PATCH | `/auth/profile` | Update profile | Authenticated |

### Sports
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/sports` | List all sports | Public |
| GET | `/sports/:id` | Get sport details | Public |
| POST | `/sports` | Create sport | Admin |
| PATCH | `/sports/:id` | Update sport | Admin |
| POST | `/sports/:id/toggle-registration` | Open/close registration | Admin |
| POST | `/sports/:id/duplicate` | Duplicate sport | Admin |
| POST | `/sports/:id/archive` | Archive sport | Admin |

### Registrations
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/registrations/check/:sport_id` | Check eligibility | Authenticated |
| POST | `/registrations` | Register for sport | Authenticated |
| GET | `/registrations/me` | Get my registrations | Authenticated |
| GET | `/registrations/:id` | Get registration details | Authenticated |
| PATCH | `/registrations/:id/team` | Update team members | Authenticated |
| POST | `/registrations/:id/cancel` | Cancel registration | Authenticated |

### Payments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/payments/create-order` | Create Razorpay order | Authenticated |
| POST | `/payments/verify` | Verify payment | Authenticated |
| POST | `/payments/webhook` | Razorpay webhook | Public |
| GET | `/payments/me` | Get my payments | Authenticated |

### Notifications
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/notifications` | Get notifications | Authenticated |
| POST | `/notifications/mark-read` | Mark as read | Authenticated |
| GET | `/notifications/unread-count` | Get unread count | Authenticated |

### Analytics (Admin)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/analytics/dashboard` | Dashboard stats | Admin |
| GET | `/analytics/sports` | Sports analytics | Admin |
| GET | `/analytics/colleges` | College participation | Admin |
| GET | `/analytics/revenue` | Revenue breakdown | Admin |
| GET | `/analytics/trends` | Registration trends | Admin |

### Admin Utilities
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/admin/registrations` | List all registrations | Admin |
| GET | `/admin/audit-logs` | View audit logs | Admin |
| GET/POST/DELETE | `/admin/colleges` | Manage colleges | Admin |
| GET/PATCH | `/admin/settings` | System settings | Admin |
| POST | `/admin/payments/verify-offline` | Verify offline payment | Admin |

## Database Schema

### Tables
1. **profiles** - User profiles (extends auth.users)
2. **sports** - Sports/events available for registration
3. **registrations** - Registration records
4. **team_members** - Team member details
5. **payments** - Payment transactions
6. **notifications** - User notifications
7. **audit_logs** - Audit trail
8. **colleges** - Predefined colleges list
9. **settings** - System configuration

### Key Features
- Row Level Security (RLS) on all tables
- Automatic profile creation on signup
- Auto-generated registration numbers
- Waitlist management with auto-promotion
- Payment status synchronization
- Comprehensive audit logging

## Scheduled Jobs

| Job | Schedule | Description |
|-----|----------|-------------|
| auto-close-expired-registrations | Every 15 min | Close expired registrations |
| auto-open-registrations | Every 15 min | Open scheduled registrations |
| expire-pending-payments | Every hour | Expire 24h old pending payments |
| cleanup-expired-notifications | Daily | Delete expired notifications |
| send-registration-reminders | Daily 9 AM | Send event reminders |

## Security

- JWT-based authentication
- Row Level Security on all tables
- Role-based access (participant, coordinator, admin)
- Razorpay signature verification
- Input validation on all endpoints
- Audit logging for admin actions

## License

MIT

> Last Updated: January 2026
