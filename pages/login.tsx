import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import { FaGoogle } from "react-icons/fa";
import { SubmitHandler, useForm } from "react-hook-form";
import { loginFields, IFormInputs } from "@/lib/data/signUpdata";
import { Card } from "@mui/material";
import styles from "@/styles/pages/Login.module.scss";
import { useRouter } from "next/router";
import { auth, provide } from "@/config/firebase";
import { signInWithPopup } from "firebase/auth";

export default function Login() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    console.log(data);
    alert("註冊資料已提交！");
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provide);
      console.log(result)
      sessionStorage.setItem('token', result.user.accessToken)
      router.push('/')
    } catch {
      console.log('登入失敗!!')
    }
  }

  return (
    <section className={styles.container}>
      <Card className={styles.content}>
        <h1>登入</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.fields}>
            {loginFields.map((item, index) => (
              <div key={index} className={styles.fieldWrap}>
                <FormLabel htmlFor={item.name} className={styles.label}>
                  {item.label}{" "}
                  {errors[item.name as keyof IFormInputs] && (
                    <span className={styles.errorMessage}>
                      *
                      {errors[
                        item.name as keyof IFormInputs
                      ]?.message?.toString()}
                    </span>
                  )}
                </FormLabel>
                <TextField
                  sx={{ marginBottom: "1rem" }}
                  type={item.type}
                  className={styles.textField}
                  id={item.name}
                  variant="outlined"
                  autoFocus={item.autoFocus}
                  error={!!errors[item.name as keyof IFormInputs]}
                  {...register(item.name as keyof IFormInputs, item.validation)}
                />
              </div>
            ))}
          </div>

          <Button type="submit" className={styles.submitButton}>
            登入
          </Button>
        </form>

        <Divider sx={{ margin: "1.5rem 0" }}>或</Divider>

        <Button
          fullWidth
          variant="outlined"
          onClick={() => googleLogin()}
          startIcon={<FaGoogle />}
          sx={{
            borderRadius: "4px",
            textTransform: "none",
          }}
        >
          使用 Google 登入
        </Button>

        <p style={{ marginTop: "1.5rem", textAlign: "center" }}>
          還沒有註冊嗎?{" "}
          <Link href="/sign-up" variant="body2" sx={{ alignSelf: "center" }}>
            註冊
          </Link>
        </p>
      </Card>
    </section>
  );
}
