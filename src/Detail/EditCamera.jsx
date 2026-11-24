import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CameraContext } from "../CameraApi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Button } from "react-bootstrap";
import "./EditCamera.css";

export default function EditCamera() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cameras, handleUpdate } = useContext(CameraContext);

  const item = cameras.find((s) => String(s.id) === String(id));

  const formik = useFormik({
    initialValues: {
      name: item?.name || "",
      price: item?.price || "",
      color: item?.color || "",
      description: item?.description || "",
      image: item?.image || "",
    },
    enableReinitialize: true,
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
      await handleUpdate(id, {
        ...values,
        price: Number(values.price),
      });
      navigate("/detail");
    },
  });

  return (
    <div className="edit-container">
      <div className="edit-card">
        {/* LEFT */}
        <div className="edit-left">
          <h2>Edit Camera</h2>
          <p className="sub">Update your camera information</p>

          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "14px", fontWeight: 500 }}>Name</Form.Label>
              <Form.Control
                name="name"
                placeholder="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                isInvalid={formik.touched.name && Boolean(formik.errors.name)}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "14px", fontWeight: 500 }}>Price (VND)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                placeholder="Price"
                value={formik.values.price}
                onChange={formik.handleChange}
                isInvalid={formik.touched.price && Boolean(formik.errors.price)}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.price}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "14px", fontWeight: 500 }}>Color</Form.Label>
              <Form.Control
                name="color"
                placeholder="Color"
                value={formik.values.color}
                onChange={formik.handleChange}
                isInvalid={formik.touched.color && Boolean(formik.errors.color)}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.color}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: "14px", fontWeight: 500 }}>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                isInvalid={formik.touched.description && Boolean(formik.errors.description)}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: "14px", fontWeight: 500 }}>Image URL</Form.Label>
              <Form.Control
                name="image"
                placeholder="Image URL"
                value={formik.values.image}
                onChange={formik.handleChange}
                isInvalid={formik.touched.image && Boolean(formik.errors.image)}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.image}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button type="submit" variant="dark" style={{ padding: "10px" }}>
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => navigate("/detail")}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>

        {/* RIGHT */}
        <div className="edit-right">
          <img
            src={formik.values.image || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80"}
            alt="camera"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80";
            }}
          />
        </div>
      </div>
    </div>
  );
}
