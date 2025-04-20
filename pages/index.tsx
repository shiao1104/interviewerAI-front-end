import styles from "@/styles/pages/Home.module.scss";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('');
  
  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'user') {
      router.push('/user');
    } else if (selectedRole === 'interviewer') {
      router.push('/interviewer');
    }
  };

  return (
    <section className={styles.container}>
      <form className={styles.wrap} onSubmit={handleSubmit}>
        <h1>選擇登入身分</h1>
        <div className={styles.buttonWrap}>
          <Button 
            className={selectedRole === 'user' ? styles.selectedButton : ''}
            onClick={() => handleRoleSelect('user')}
            type="button"
          >
            面試者身分
          </Button>
          <Button 
            className={selectedRole === 'interviewer' ? styles.selectedButton : ''}
            onClick={() => handleRoleSelect('interviewer')}
            type="button"
          >
            面試官身分
          </Button>
        </div>
        <Button 
          className={styles.submitButton} 
          type="submit"
          disabled={!selectedRole}
        >
          確認
        </Button>
      </form>
    </section>
  );
}