import { useContext, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Login.css";
import camera from "../assets/camerabg.jpg";
import { AuthContext } from "../AuthContext";
import userApi from "../userApi";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(3, "Full name must be at least 3 characters")
        .required("Full name cannot be empty"),
      username: Yup.string()
        .trim()
        .required("Email username cannot be empty")
        .matches(/@.*\.com$/, "Email must contain @ and end with .com"),
      password: Yup.string()
        .required("Password cannot be empty")
        .min(6, "Password must be at least 6 characters")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)/,
          "Password must contain both letters and numbers",
        ),
      confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMessage("");

      try {
        // 1. Check if username/email already exists on MockAPI
        const checkRes = await userApi.get("/");
        const emailExists = (checkRes.data || []).some(
          (u) =>
            u.username.trim().toLowerCase() ===
            values.username.trim().toLowerCase(),
        );

        if (emailExists) {
          setErrorMessage("This email is already registered! Please choose another email.");
          setLoading(false);
          return;
        }

        // 2. Post new user with role="customer"
        const newUser = {
          name: values.name.trim(),
          username: values.username.trim().toLowerCase(),
          password: values.password,
          role: "customer",
        };

        const createRes = await userApi.post("/", newUser);
        const registeredUser = createRes.data || newUser;

        // 3. Automatically log in the new user
        login(registeredUser);
        alert(`Welcome ${registeredUser.name}! Registration successful.`);

        // 4. Check if returning to a product detail popup
        const returnId =
          location.state?.returnToDetailId ||
          sessionStorage.getItem("returnToDetailId");

        if (returnId) {
          sessionStorage.removeItem("returnToDetailId");
          navigate("/", {
            state: { returnToDetailId: returnId },
            replace: true,
          });
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("Register API error:", err);
        setErrorMessage(
          "Unable to connect to the authentication server. Please try again!",
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <form className="login-form" onSubmit={formik.handleSubmit}>
          <h2>Create Account</h2>
          <p>Register a new customer account</p>

          {errorMessage && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                color: "#b91c1c",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "13px",
                marginBottom: "14px",
                border: "1px solid #fecaca",
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Full Name (e.g. John Doe)"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name ? (
            <div
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "-10px",
                marginBottom: "10px",
                textAlign: "left",
              }}
            >
              {formik.errors.name}
            </div>
          ) : null}

          {/* USERNAME */}
          <input
            type="text"
            name="username"
            placeholder="Email (e.g. user@system.com)"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username ? (
            <div
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "-10px",
                marginBottom: "10px",
                textAlign: "left",
              }}
            >
              {formik.errors.username}
            </div>
          ) : null}

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password (at least 6 characters, letters and numbers)"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password ? (
            <div
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "-10px",
                marginBottom: "10px",
                textAlign: "left",
              }}
            >
              {formik.errors.password}
            </div>
          ) : null}

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "-10px",
                marginBottom: "10px",
                textAlign: "left",
              }}
            >
              {formik.errors.confirmPassword}
            </div>
          ) : null}

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>

          <div
            style={{
              marginTop: "16px",
              textAlign: "center",
              fontSize: "14px",
              color: "#64748b",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              state={location.state}
              style={{
                color: "#f97316",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Login now
            </Link>
          </div>

          <button
            type="button"
            onClick={handleBackToHome}
            style={{
              marginTop: "12px",
              backgroundColor: "#f1f5f9",
              color: "#334155",
            }}
          >
            Back to Home Page
          </button>
        </form>

        <div className="login-image">
          <img src={camera} alt="camera" />
        </div>
      </div>
    </div>
  );
}
