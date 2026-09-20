# Changelog

## 2026-09-20

- Versión: `1.3.1`
- Fix: pantallas con fetch que podía fallar en silencio (postulantes del employer en tabla/galería/agrupado, aplicaciones del talent, catálogo de talentos, catálogo de castings) ahora muestran feedback en error en vez de quedarse colgadas — mensaje inline (`CastingDatabasePage`, `TalentDatabasePage`, aplicaciones) o toast cerrable e infinito con id estable para evitar apilamiento (postulantes del employer, catálogo de castings).
- Fix: el catálogo de talentos y el catálogo de castings dejaron de cachear por hasta 60s — ahora siempre refetchean al montar. Un talento que subía/borraba su foto de cara o cuerpo entero no reflejaba el cambio de visibilidad en catálogo hasta un reload completo de la página.
- Fix: subir/borrar una foto de perfil de talento ahora también invalida la cache del catálogo público (antes solo invalidaba la cache del propio perfil), cubriendo el caso de una pestaña del catálogo ya abierta en paralelo.
- Fix: uploads a Supabase Storage que quedaban huérfanos si el PATCH posterior fallaba ahora se limpian; fallos al borrar el archivo anterior ya no se silencian (log + toast de aviso).
- Fix: `EmployerCastingApplicantsPage` (tabla y galería) ya no dispara `GET /api/v1/talent` (403) para un usuario en modo employer — ese fetch solo es relevante para el flujo de aplicar como talent.
- Fix: se remueve el row "Cintura" del panel de características del perfil público — el campo no tiene ningún input correspondiente en el formulario de edición.
- Fix: los talles de indumentaria (remera, pantalón, vestido, calzado) ahora se pasan a mayúsculas mientras se escriben.
- Fix: Créditos y Formación — título del curso, nombre del proyecto y rol ahora se capitalizan palabra por palabra siempre (no solo si el texto estaba en mayúsculas); institución y director/productor mantienen la regla anterior (solo si estaba en mayúsculas).
- Tests: nuevas suites de Vitest cubriendo las reglas de capitalización de formSchema, el fix de `useCommittedText`, la omisión de "Cintura" en `CharacteristicsPanel`, el layout de `FetchErrorState`, y la invalidación de cache del catálogo en las mutaciones de media.

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
