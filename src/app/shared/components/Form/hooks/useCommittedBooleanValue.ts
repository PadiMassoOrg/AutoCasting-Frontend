import { useCallback, useEffect, useState } from 'react';

export function useCommittedNullableBooleanValue(initial: boolean | null, commit: (next: boolean | null) => void) {
  const [value, setValue] = useState<boolean | null>(initial);

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  const onChange = useCallback(
    (next: boolean | null) => {
      setValue(next);
      commit(next);
    },
    [commit]
  );

  return { value, onChange };
}
