import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import { AuthProvider } from "../context/AuthContext";
import { AppProvider } from "../context/AppContext";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <AppProvider>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </AppProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
