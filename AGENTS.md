# AutoCasting-Frontend - Agent Instructions

Estas reglas aplican a cualquier cambio dentro de `AutoCasting-Frontend`.

## 1) Buscar contexto antes de escribir codigo

Antes de crear helpers, hooks, utils o patrones nuevos, revisar primero:

- `src/app/shared`
- `src/app/features/talent`

Referencias obligatorias para formularios y flujos comunes:

- `src/app/shared/utils/formUtils.ts`
- `src/app/shared/utils/formatUtils.ts`
- `src/app/features/talent/talent-profile-edit/components/Form`
- `src/app/features/talent/talent-profile-edit/hooks`

Si ya existe una solucion equivalente o suficientemente cercana, reutilizarla o extenderla. No duplicar por comodidad.

## 2) Evitar helpers inline en pages y components

No dejar mapeos, normalizadores, request builders o transformaciones grandes embebidas dentro de pages/components salvo que sean triviales y estrictamente locales.

Prioridad:

1. Reutilizar `shared`.
2. Reutilizar ejemplos consolidados de `talent`.
3. Extraer al feature en `hooks/`, `utils/` o `services/` solo si no existe nada reutilizable.

## 3) Formularios: seguir patrones existentes

Para formularios, tomar como base los flujos ya implementados en `talent` y `employer-profile-edit`.

Preferir:

- helpers compartidos de `shared/utils/formUtils.ts`
- schemas existentes
- hooks de `react-hook-form` o patrones ya usados en el modulo comparable

Evitar crear handlers ad hoc si el mismo patron ya existe en `shared`.

## 4) Criterio de implementacion

Antes de agregar una abstraccion nueva, validar:

- si resuelve un caso repetido real
- si ya hay un archivo del proyecto donde deberia vivir
- si reduce complejidad en vez de moverla de lugar sin necesidad

Si no supera ese filtro, no crearla.

## 5) Validacion obligatoria

Luego de cada cambio de codigo ejecutar:

```bash
npm run format
npm run lint
```
