import { useFormik } from "formik";
import * as Yup from "yup";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CameraContext } from "../CameraApi";
import { Form, Button } from "react-bootstrap";

export default function CreateCamera() {
  const { handleCreate } = useContext(CameraContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      color: "",
      description: "",
      image: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .required("Name is required")
        .min(5, "Name must be at least 5 characters")
        .max(100, "Name too long")
        .matches(/^(?!\s*$).+/, "Name cannot be empty spaces"),

      price: Yup.number()
        .typeError("Price must be a number")
        .required("Price is required")
        .min(1, "Price must be greater than 0")
        .max(1000000000, "Price too large"),

      color: Yup.string()
        .trim()
        .required("Color is required")
        .matches(
          /^(#([0-9A-Fa-f]{3}){1,2}|[a-zA-Z]+)$/,
          "Color must be HEX (#fff or #ffffff) or valid color text",
        ),

      description: Yup.string()
        .trim()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description too long"),

      image: Yup.string()
        .trim()
        .required("Image URL is required")
        .url("Must be a valid URL"),
    }),
    onSubmit: async (values) => {
      await handleCreate({
        ...values,
        price: Number(values.price),
      });
      navigate("/detail");
    },
  });

  return (
    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 15px",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          width: "100%",
          display: "flex",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          background: "#fff",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT FORM */}
        <div
          style={{
            flex: "1 1 450px",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2 style={{ fontWeight: 700, marginBottom: "6px" }}>Create Camera</h2>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>
            Add new camera product to the shop
          </p>

          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: "14px", fontWeight: 500 }}>Name</Form.Label>
              <Form.Control
                placeholder="Canon EOS R..."
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                isInvalid={formik.touched.name && Boolean(formik.errors.name)}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            {/* PRICE */}
            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: "14px", fontWeight: 500 }}>Price (VND)</Form.Label>
              <Form.Control
                type="number"
                placeholder="25000000"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                isInvalid={formik.touched.price && Boolean(formik.errors.price)}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.price}
              </Form.Control.Feedback>
            </Form.Group>

            {/* COLOR */}
            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: "14px", fontWeight: 500 }}>Color</Form.Label>
              <Form.Control
                placeholder="#000000 or black"
                name="color"
                value={formik.values.color}
                onChange={formik.handleChange}
                isInvalid={formik.touched.color && Boolean(formik.errors.color)}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.color}
              </Form.Control.Feedback>
            </Form.Group>

            {/* DESCRIPTION */}
            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: "14px", fontWeight: 500 }}>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Chi tiết tính năng máy ảnh..."
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.description && Boolean(formik.errors.description)
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            {/* IMAGE */}
            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: "14px", fontWeight: 500 }}>Image URL</Form.Label>
              <Form.Control
                placeholder="https://..."
                name="image"
                value={formik.values.image}
                onChange={formik.handleChange}
                isInvalid={formik.touched.image && Boolean(formik.errors.image)}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.image}
              </Form.Control.Feedback>
            </Form.Group>

            {/* PREVIEW */}
            {formik.values.image && (
              <div className="mb-3">
                <span style={{ fontSize: "12px", color: "#64748b" }}>Image Preview:</span>
                <img
                  src={formik.values.image}
                  alt="preview"
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginTop: "4px",
                    border: "1px solid #e2e8f0",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* BUTTON */}
            <div className="d-grid gap-2 mt-4">
              <Button variant="dark" type="submit" style={{ padding: "10px" }}>
                Create Product
              </Button>

              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => navigate("/detail")}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>

        {/* RIGHT IMAGE */}
        <div style={{ flex: "1 1 350px", minHeight: "300px" }}>
          <img
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80"
            alt="camera gear"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    </div>
  );
}
