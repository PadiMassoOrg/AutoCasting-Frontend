export type DeepNullableExceptId<T> = T extends (...args: any[]) => any
  ? T
  : T extends Array<infer U>
    ? Array<DeepNullableExceptId<U>> | null
    : T extends object
      ? {
          [K in keyof T]: K extends 'id' ? NonNullable<T[K]> : DeepNullableExceptId<T[K]> | null;
        }
      : T | null;
