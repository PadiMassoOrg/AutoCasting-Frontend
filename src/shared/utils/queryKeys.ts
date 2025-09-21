export function normalizeFilters(f?: TalentFiltersQS) {
  if (!f) return f;
  const clone: any = { ...f };

  // elimina vacíos
  Object.keys(clone).forEach((k) => {
    const v = clone[k];
    const isEmptyArr = Array.isArray(v) && v.length === 0;
    const isEmptyStr = v === '' || v === null || v === undefined;
    if (isEmptyArr || isEmptyStr) delete clone[k];
  });

  // ordena arrays para estabilidad
  if (clone.professionId) clone.professionId = [...clone.professionId].sort();
  if (clone.skillId) clone.skillId = [...clone.skillId].sort();
  if (clone.genderIds) clone.genderIds = [...clone.genderIds].sort();

  return clone;
}
