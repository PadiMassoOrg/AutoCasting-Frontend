# Changelog

## 2026-09-18

- Versión: `1.3.0`
- Perfil público: en Características/Habilidades/Créditos/Formación (paneles del InfoCarousel), en pantallas menores a `lg` cada panel ahora toma la misma altura que Características (calculada dinámicamente), con scroll interno cuando el contenido excede esa altura — antes cada panel tenía su propia altura natural.
- Créditos: el separador entre categorías ya no se renderiza después de la última categoría.
- Galería de fotos: PhotoZoom (ampliar imagen) ahora también está disponible en mobile, no solo en desktop.
- CI: nuevo workflow de GitHub Actions (lint, build, test) en push/PR a `main`, `develop` y `release/**`.
- Tests: nuevas suites de tests unitarios (Vitest) cubriendo `CastingBasicInfoForm`/`CastingRoleForm`, el checkout de castings del employer, y `useCastingOverflowMenuItems`/`siteMetadataUtils`.
- Consume `autocasting-ui-library-padimasso@^1.7.10`.

## 2026-09-17

- Versión: `1.2.1`
- Fix: en la vista de postulantes del employer (bulk actions), el link "mailto" de la barra de acciones masivas solo incluía los emails de los postulantes visibles en la página actual, no de todos los seleccionados entre múltiples páginas. Ahora los emails seleccionados se capturan al momento de la selección y persisten al cambiar de página.

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
