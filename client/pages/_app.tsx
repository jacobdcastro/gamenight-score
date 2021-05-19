import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import setAuthToken from '../lib/setAuthToken';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'tailwindcss/tailwind.css';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;
