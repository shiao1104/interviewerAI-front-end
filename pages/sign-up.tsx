import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import { FaGoogle } from "react-icons/fa";
import { SubmitHandler, useForm } from "react-hook-form";
import { formFields, IFormInputs } from "@/lib/data/signUpdata";
import { Card, Checkbox, FormControlLabel } from "@mui/material";
import styles from "@/styles/pages/Login.module.scss";
import { useEffect, useRef, useState } from "react";

// 驗證碼組件
const Captcha = ({ onChange }: { onChange: (value: string) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captchaValue = useRef<string>("");
  const [, setRefresh] = useState<number>(0);

  // 生成隨機驗證碼
  const generateCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // 清除畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 設置背景色
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 生成隨機字符
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let captcha = "";
    
    for (let i = 0; i < 4; i++) {
      const index = Math.floor(Math.random() * chars.length);
      captcha += chars[index];
    }
    
    captchaValue.current = captcha;
    onChange(captcha);
    
    // 繪製驗證碼
    for (let i = 0; i < captcha.length; i++) {
      ctx.font = `${18 + Math.random() * 10}px Arial`;
      ctx.fillStyle = `rgb(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100})`;
      ctx.textBaseline = "middle";
      
      // 隨機旋轉角度
      const x = 15 + i * 25;
      const y = 20 + Math.random() * 8;
      const deg = (Math.random() - 0.5) * 30 * Math.PI / 180;
      
      ctx.translate(x, y);
      ctx.rotate(deg);
      ctx.fillText(captcha[i], 0, 0);
      ctx.rotate(-deg);
      ctx.translate(-x, -y);
    }
    
    // 添加干擾線
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgb(${Math.random() * 200}, ${Math.random() * 200}, ${Math.random() * 200})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
    
    // 添加干擾點
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    setRefresh(prev => prev + 1);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <div className={styles.captchaContainer}>
      <canvas
        ref={canvasRef}
        width={120}
        height={40}
        className={styles.captchaCanvas}
      />
      <Button
        variant="text"
        size="small"
        className={styles.refreshButton}
        onClick={generateCaptcha}
      >
        重新整理
      </Button>
    </div>
  );
};

// 更新表單輸入類型
interface IFormInputsWithCaptcha extends IFormInputs {
  captcha: string;
}

export default function SignUp() {
  const [captchaValue, setCaptchaValue] = useState<string>("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputsWithCaptcha>({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const handleCaptchaChange = (value: string) => {
    setCaptchaValue(value);
  };

  const onSubmit: SubmitHandler<IFormInputsWithCaptcha> = (data) => {
    if (data.captcha.toLowerCase() !== captchaValue.toLowerCase()) {
      alert("驗證碼錯誤，請重新輸入");
      return;
    }
    console.log(data);
    alert("註冊資料已提交！");
  };

  return (
    <section className={styles.container}>
      <Card className={styles.content}>
        <h1>註冊</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.fields}>
            <div className={styles.fieldsGrid}>
              {formFields.map((item, index) => (
                <div key={index} className={styles.fieldWrap}>
                  <FormLabel htmlFor={item.name} className={styles.label}>
                    {item.label}{" "}
                    {errors[item.name as keyof IFormInputsWithCaptcha] && (
                      <span className={styles.errorMessage}>
                        *
                        {errors[
                          item.name as keyof IFormInputsWithCaptcha
                        ]?.message?.toString()}
                      </span>
                    )}
                  </FormLabel>
                  <TextField
                    type={item.type}
                    className={styles.textField}
                    id={item.name}
                    variant="outlined"
                    autoFocus={item.autoFocus}
                    error={!!errors[item.name as keyof IFormInputsWithCaptcha]}
                    {...register(
                      item.name as keyof IFormInputsWithCaptcha,
                      item.validation
                    )}
                  />
                </div>
              ))}
            </div>
            
            <div className={styles.fieldWrap}>
              <FormLabel htmlFor="captcha" className={styles.label}>
                驗證碼 {errors.captcha && (
                  <span className={styles.errorMessage}>
                    *{errors.captcha?.message?.toString()}
                  </span>
                )}
              </FormLabel>
              <div className={styles.captchaField}>
                <TextField
                  type="text"
                  className={styles.captchaInput}
                  id="captcha"
                  variant="outlined"
                  error={!!errors.captcha}
                  {...register("captcha", {
                    required: "請輸入驗證碼",
                  })}
                />
                <Captcha onChange={handleCaptchaChange} />
              </div>
            </div>
            
            <div className={styles.checkboxWrap}>
              <FormControlLabel
                control={
                  <Checkbox
                    id="termsAgreed"
                    {...register("termsAgreed", {
                      required: "您必須同意服務條款和隱私政策才能繼續",
                    })}
                  />
                }
                label={
                  <span>
                    我已閱讀並同意<Link href="#">服務條款</Link>和
                    <Link href="#">隱私政策</Link>
                    {errors.termsAgreed && (
                      <span className={styles.errorMessage}>
                        *{errors.termsAgreed?.message?.toString()}
                      </span>
                    )}
                  </span>
                }
              />
            </div>
          </div>

          <Button type="submit" className={styles.submitButton}>
            註冊
          </Button>
        </form>

        <Divider sx={{ margin: "1.5rem 0" }}>或</Divider>

        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert("Sign in with Google")}
          startIcon={<FaGoogle />}
          sx={{
            borderRadius: "4px",
            textTransform: "none",
          }}
        >
          使用 Google 登入
        </Button>

        <p style={{ marginTop: "1.5rem", textAlign: "center" }}>
          已經有帳號了嗎?{" "}
          <Link href="/login" variant="body2" sx={{ alignSelf: "center" }}>
            登入
          </Link>
        </p>
      </Card>
    </section>
  );
}