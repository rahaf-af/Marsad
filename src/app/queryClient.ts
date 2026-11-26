import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // The data only changes once a quarter, so a fetched file never goes stale in a session.
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});