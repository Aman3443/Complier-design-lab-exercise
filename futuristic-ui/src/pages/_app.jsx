import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import { AuthProvider } from "@/context/AuthContext";
import "@/styles/globals.css";

const queryClient = new QueryClient();

export default function App({ Component, pageProps, router }) {
  useEffect(() => {
    const lenis = new Lenis({ smoothWheel: true, duration: 1.2 });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AnimatePresence mode="wait">
            <motion.div
              key={router.route}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}