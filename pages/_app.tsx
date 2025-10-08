import "@/styles/main.scss";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { Authority } from "@/lib/hook/authority";
import Swal from "sweetalert2";
import { LoadingProvider } from "@/lib/hook/loading";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const pathname = usePathname();

  const authorityCheck = (role?: string) => {
    if (pathname === "/admin" && Authority(role || "") !== "admin") {
      return false;
    } else if (pathname === "/manage" && Authority(role || "") !== "manage") {
      return false;
    } else if (pathname === "/user" && Authority(role || "") !== "user") {
      return false;
    } else {
      return true;
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const useRole = String(sessionStorage.getItem("user_role"));

      if (
        (!sessionStorage.getItem("google_token") &&
          !sessionStorage.getItem("token")) &&
        (pathname !== "/login" && pathname !== "/sign-up")
      ) {
        router.push("/login");
      }

      if (!authorityCheck(useRole)) {
        Swal.fire({
          title: "請重新登入",
          text: "您沒有權限進入此頁面",
          icon: "error",
          confirmButtonText: "確定"
        }).then(() => router.push('/login'))
      }
    }
  }, [pathname, router]);

  return (
    <LoadingProvider>
      <SessionProvider>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
        >
          <Component {...pageProps} />
          <ToastContainer />
        </GoogleOAuthProvider>
      </SessionProvider>
    </LoadingProvider>
  );
}
