# Changelog

## 2026-09-28 (2)

- Versión: `1.4.2`
- Fix (AI-68): toda imagen subida a Supabase (fotos del talento, logo del employer, foto de referencia del rol) se guarda siempre en WebP: ya no se sube el archivo original cuando el WebP resulta más pesado, los formatos que no se pueden convertir (p. ej. SVG) se rechazan, y en navegadores sin codificación WebP nativa (p. ej. Safari antiguo) se usa `@jsquash/webp` (WASM, cargado solo cuando hace falta). Las imágenes ya subidas no se migran.
- Dependencias: `@jsquash/webp` `^1.5.0`; `vite.config.ts` lo excluye de `optimizeDeps`.
- Tests: Vitest para `optimizeImageForUpload` (WebP nativo, fallback WASM, rechazo de formatos no convertibles).

## 2026-09-28

- Versión: `1.4.1`
- Fix (AI-65): el onboarding de employer pasa a 2 pasos — el primero solo pide el nombre de la empresa (se quita el CUIT/CUIL) y se elimina el paso de foto/logo.
- Fix (AI-65): en el perfil del employer el CUIT/CUIL es opcional (vacío se guarda como `null`) y la foto se puede borrar (`useEmployerLogoDelete`: primero limpia `imageUrl` en el backend, después borra el archivo en Supabase, con aviso si falla la limpieza).
- Fix (AI-65): si el employer no tiene foto, la tarjeta de postulaciones del talento y el recuadro del employer en el detalle del casting ya no muestran una imagen rota.
- Fix (AI-65): "Finalizar y Publicar" se habilita con al menos un rol guardado aunque el formulario de "Nuevo Rol" (que se abre solo al guardar un rol) tenga valores por defecto; solo lo bloquean cambios sin guardar en un rol existente (`canPublishCasting`).
- Textos: `voice_talent` pasa a "Locución/Actor de voz".
- Tests: Vitest para `useEmployerLogoDelete`, el schema del paso de onboarding, el schema de datos básicos del employer y `canPublishCasting`.

## 2026-09-27

- Versión: `1.4.0`
- Feature (AI-55, AI-57): página de proposal `/proposal/:token` fuera del shell de la app, con listado y detalle de roles y banner "Reclamar casting". Al reclamar se cierra la sesión activa y se piden credenciales; la proposal pendiente (2 h) se resuelve después de registro, login u onboarding, con el wizard iniciando en el modo requerido y un toast con el resultado del claim. Las limpiezas automáticas de sesión ya no descartan la proposal pendiente.
- Feature (AI-57): paginación del lado del cliente (5 por página) del listado de roles en la página pública del casting y en la preview de la proposal.
- Feature (AI-55): sitemetadata extendida para proposals y labels traducidos en los dropdowns de selección múltiple.
- Fix (AI-63): el título del casting en la página pública del casting (encabezado lateral en desktop y tarjeta en mobile) se muestra completo en varias líneas, sin elipsis.
- Fix (AI-63): un link a un casting que ya no está disponible (finalizado, pausado o eliminado) redirige al catálogo de castings con un toast de error, en vez de mostrar la página de error; lo mismo para un perfil de talento no disponible, que redirige al catálogo de talentos. Los errores reales del servidor siguen mostrando la página de error.
- Fix (AI-61): "Finalizar y Publicar" solo se habilita si el casting es publicable según el backend (completo y con fecha límite vigente), la información básica es válida (la regla "la fecha límite no puede ser anterior a hoy" ahora vive en el schema de Zod) y no hay cambios sin guardar en la información básica ni en los roles.
- Fix: "Copiar link" en el listado de castings del employer solo está habilitado para castings publicados (antes también para pausados, cuyo link público ya no existe).
- Dependencias: `autocasting-ui-library-padimasso` `^1.8.0` (estados deshabilitados de inputs, indicador de orden en tablas).

## 2026-09-24

- Versión: `1.3.3`
- Fix: Add Photo Zoom to details view.

## 2026-09-23

- Versión: `1.3.2`
- Feature: foto de referencia para roles de casting — selector con preview local en el formulario de rol (solo se sube/borra de Supabase al guardar el rol, nunca en la sola selección), mostrada en la página pública de detalle del casting junto a Habilidades.
- Fix: el título del casting rechazaba `:` por validación de Zod aunque igual se guardaba correctamente en el backend — se removió la regex restrictiva del schema.
- Feature: filtro de Casting Database por rango de fechas de rodaje (desde/hasta), mismo componente de calendario que en Información Básica del casting.
- Fix: el panel de Habilidades del formulario de rol ahora tiene scroll interno y coincide en altura con la foto de referencia (antes tenía altura mínima libre).
- Fix: el tipo de tarifa "A convenir" ahora deshabilita los inputs de moneda/monto y no exige un monto, igual que "No remunerado" — antes se comportaba como un rol pago.
- Fix: se remueve el límite de 255 caracteres en el website URL del employer, ya sin motivo tras el ajuste de columna en el backend.
- Tests: nueva suite de Vitest cubriendo el default de tipo de tarifa/moneda al abrir un rol (rol pago mantiene su moneda guardada, roles sin monto fijo completan ARS, borrador nuevo arranca en No remunerado + ARS).

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
