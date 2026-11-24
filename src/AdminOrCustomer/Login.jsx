import { useContext, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
// IMPORT FORMIK & YUP
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Login.css";
import camera from "../assets/camerabg.jpg";
import { AuthContext } from "../AuthContext";
import userApi from "../userApi";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // FORMIK INITIALIZATION
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },

    validationSchema: Yup.object({
      username: Yup.string()
        .trim()
        .required("Username cannot be empty")
        .matches(/@.*\.com$/, "Username must contain @ and end with .com"),
      password: Yup.string()
        .required("Password cannot be empty")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)/,
          "Password must contain both letters and numbers",
        ),
    }),

    onSubmit: async (values) => {
      setLoading(true);
      setErrorMessage("");

      try {
        // Query account credentials from MockAPI
        const res = await userApi.get("/");
        const matchedUser = res.data.find(
          (u) =>
            u.username.trim().toLowerCase() ===
              values.username.trim().toLowerCase() &&
            String(u.password) === String(values.password),
        );

        if (matchedUser) {
          // Save role & user information to AuthContext and localStorage
          login(matchedUser);

          if (matchedUser.role === "admin") {
            navigate("/detail");
          } else {
            // Check if returning to a product detail popup
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
          }
        } else {
          setErrorMessage("Invalid username or password! Please try again.");
        }
      } catch (err) {
        console.error("Login API error:", err);
        setErrorMessage(
          "Unable to connect to the authentication server. Please check your connection!",
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
        {/* FORMIK FORM */}
        <form className="login-form" onSubmit={formik.handleSubmit}>
          <h2>Welcome</h2>
          <p>Login to your account</p>

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

          {/* USERNAME INPUT */}
          <input
            type="text"
            name="username"
            placeholder="Username (e.g. user@system.com)"
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

          {/* PASSWORD INPUT */}
          <input
            type="password"
            name="password"
            placeholder="Password"
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

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div
            style={{
              marginTop: "16px",
              textAlign: "center",
              fontSize: "14px",
              color: "#64748b",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              state={location.state}
              style={{
                color: "#f97316",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Register now
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
