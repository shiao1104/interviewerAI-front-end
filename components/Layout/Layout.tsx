import Head from "next/head";

import styles from "@/styles/components/layout/Layout.module.scss";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>AI面試官</title>
        <meta charSet="UTF-8" />
        <meta name="description" content="NTUB IMD BIRC CMS" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <main className={styles.layout}>
        <Navbar />
        <article className={styles.chill}>{children}</article>
      </main>
    </>
  );
}
