import { useMutation } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../shared/lib/routes';
import { createEmptyCasting } from '../services/employerCastingService';

let createEmptyCastingPending = false;
const listeners = new Set<() => void>();

const emitPendingChange = () => {
  listeners.forEach((listener) => listener());
};

const setCreateEmptyCastingPending = (next: boolean) => {
  if (createEmptyCastingPending === next) return;
  createEmptyCastingPending = next;
  emitPendingChange();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => createEmptyCastingPending;

export const useCreateEmptyCastingMutation = () => {
  const navigate = useNavigate();
  const sharedPending = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const mutation = useMutation<string>({
    mutationFn: () => createEmptyCasting(),
    onMutate: () => {
      setCreateEmptyCastingPending(true);
    },
    onSuccess: (slug) => {
      navigate(`${ROUTES.EMPLOYER_CASTING}/${slug}/editor`);
    },
    onSettled: () => {
      setCreateEmptyCastingPending(false);
    },
  });

  return {
    ...mutation,
    isPending: mutation.isPending || sharedPending,
    mutate: () => {
      if (createEmptyCastingPending) return;
      mutation.mutate();
    },
  };
};
