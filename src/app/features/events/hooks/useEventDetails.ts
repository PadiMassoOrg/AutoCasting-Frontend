import { useQuery } from '@tanstack/react-query';
import { EVENT_DETAILS_CACHE_KEY, getEventBySlug } from '../services/eventsService';
import type { EventDetailsResponse } from '../types/events.types';

export const useEventDetails = (slug?: string | null) => {
  return useQuery<EventDetailsResponse>({
    queryKey: [...EVENT_DETAILS_CACHE_KEY, slug ?? 'no-slug'],
    queryFn: () => getEventBySlug(slug!),
    enabled: !!slug,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
  });
};
