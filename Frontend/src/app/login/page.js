"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Toast from "../components/Toast";
import styles from "../styles/Authentication.module.css";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const savedToast = localStorage.getItem("toastMessage");
    if (savedToast) {
      setToast(JSON.parse(savedToast));
      localStorage.removeItem("toastMessage"); // clear after showing
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setToast({
          type: "success",
          message: "Login successful! Redirecting...",
        });

        setTimeout(() => {
          if (data?.user?.id) {
            window.location.href = `/${data.user.id}/dashboard`; // ✅ redirect to user dashboard
          } else {
            window.location.href = "/"; // fallback if no id
          }
        }, 1500);
      } else {
        setToast({
          type: "error",
          message: data.error || "Invalid credentials",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Something went wrong" });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Login
        </button>
        <p className={styles.signupText}>
          Don't have an account?{" "}
          <Link href="/signup" className={styles.signupLink}>
            Signup
          </Link>
        </p>
      </form>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
