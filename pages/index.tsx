import styles from "@/styles/pages/Home.module.scss";
import { Button } from "@mui/material";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  
  return (
    <section className={styles.container}>
      <div className={styles.wrap}>
        <h1>選擇登入身分</h1>
        <div className={styles.buttonWrap}>
          <Button onClick={() => router.push('/user')}>面試者身分</Button>
          <Button>面試官身分</Button>
        </div>
        <Button className={styles.submitButton}>確認</Button>
      </div>
    </section>
  );
}
