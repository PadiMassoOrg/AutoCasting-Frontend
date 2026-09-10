# Changelog

## 2026-09-10

- Versión: `1.2.0`
- Auth: refresh-token flow (silent access-token renewal, single-flight, password + Google OAuth2 sessions), `/auth/logout` revocation.
- Talent applications: infinite scroll.
- Settings: talent/employer settings pages merged into one shared page.
- Castings: archived-casting warning on apply.
- Maintenance warning banner now driven by a shared Supabase `app_config` row (replaces `public/config.json`).
- Media: HEIC image handling fix.
- Legal: Terms & Privacy 3.6.0 re-acceptance (backend-published; adds mobile-app coverage).

## 2026-08-05

- Versión: `1.0.3`
- Bugfixes: copyLink icon in details view and formatText before commiting to db.

## 2026-06-23

- Versión: `1.0.2`
- Update copyright of site meta data

## 2026-06-19

- Versión: `1.0.1`
- Backend Error handling
- Se usan 404 Page y 500 Page.

## 2026-06-17

- Versión: `1.0.0`
- MVP 1
- Primera versión funcional de la plataforma.
- Publicación inicial de los términos legales y la política de privacidad.
- Base preparada para el flujo de aceptación legal y versionado.
