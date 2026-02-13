# Maintenance Runbook

## Continuous Checks
- CI workflow: `.github/workflows/ci.yml`
- Runs on push/PR: `npm run lint`, `npm run build`

## Weekly
- Review failed deployments and CI runs.
- Verify recent form submissions in admin tabs.
- Review Supabase auth users and `public.admin_users` allow-list.

## Monthly
- Rotate admin passwords and audit allowed admin emails.
- Export Supabase schema/data backup.
- Validate `robots.txt` and `sitemap.xml` site URL values are correct.

## Production Config Checklist
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
