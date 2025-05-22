import "@/styles/main.scss";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (
      (!sessionStorage.getItem("google_token") &&
        !sessionStorage.getItem("token")) &&
      pathname !== "/login"
    ) {
      router.push("/login");
    }
  }, [pathname, router]);

  return (
    <SessionProvider>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
      >
        <Component {...pageProps} />
        <ToastContainer />
      </GoogleOAuthProvider>
    </SessionProvider>
  );
}
