import { useFormik } from "formik";
import * as Yup from "yup";
import { useContext } from "react";
import {
  FormControlLabel,
  MenuItem,
  TextField,
  Select,
  Switch,
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { CartContext } from "../ShoppingCart/Cart";

export default function Form() {
  const { state, dispatch } = useContext(CartContext);
  const totalQuantity = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const totalPrice = state.items.reduce(
    (sum, item) => sum + Number(item.totalprice),
    0,
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      adrress: "",
      cod: "",
      diliver: "",
      agree: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().min(3, "Tên phải có ít nhất 3 ký tự").required("Vui lòng nhập họ tên"),
      email: Yup.string().email("Email không đúng định dạng").required("Vui lòng nhập email"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Số điện thoại phải gồm đúng 10 chữ số")
        .required("Vui lòng nhập số điện thoại"),
      adrress: Yup.string().trim().required("Vui lòng nhập địa chỉ nhận hàng"),
      cod: Yup.string().required("Vui lòng chọn phương thức thanh toán"),
      diliver: Yup.string().required("Vui lòng chọn hình thức giao hàng"),
      agree: Yup.boolean().oneOf([true], "Bạn cần đồng ý với điều khoản mua hàng"),
    }),
    onSubmit: (values, { resetForm }) => {
      dispatch({
        type: "CLEAR",
      });
      const orderInfo = {
        customer: values,
        totalQuantity: totalQuantity,
        totalPrice: totalPrice,
      };

      alert(
        "Đặt hàng thành công!\n\nChi tiết đơn hàng:\n" +
          JSON.stringify(orderInfo, null, 2),
      );
      resetForm();
    },
  });

  return (
    <div
      style={{
        maxWidth: "600px",
        width: "100%",
        margin: "40px auto",
        padding: "36px",
        borderRadius: "16px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      }}
    >
      <h3
        style={{
          fontWeight: 700,
          color: "#0f172a",
          marginBottom: "8px",
          textAlign: "center",
        }}
      >
        Thông tin đặt hàng
      </h3>
      <p
        style={{
          color: "#64748b",
          fontSize: "14px",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        Vui lòng điền thông tin để chúng tôi xác nhận và giao hàng nhanh chóng
      </p>

      <form
        id="checkout-form"
        onSubmit={formik.handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "18px" }}
      >
        <TextField
          fullWidth
          size="small"
          label="Họ và tên"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />

        <TextField
          fullWidth
          size="small"
          type="email"
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <TextField
          fullWidth
          size="small"
          type="tel"
          label="Số điện thoại"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
        />

        <TextField
          fullWidth
          size="small"
          label="Địa chỉ giao hàng"
          name="adrress"
          value={formik.values.adrress}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.adrress && Boolean(formik.errors.adrress)}
          helperText={formik.touched.adrress && formik.errors.adrress}
        />

        <FormControl
          fullWidth
          size="small"
          error={formik.touched.cod && Boolean(formik.errors.cod)}
        >
          <InputLabel id="cod-label">Phương thức thanh toán</InputLabel>
          <Select
            labelId="cod-label"
            label="Phương thức thanh toán"
            name="cod"
            value={formik.values.cod}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <MenuItem value="cash">Thanh toán bằng tiền mặt khi nhận hàng (COD)</MenuItem>
            <MenuItem value="banking">Chuyển khoản ngân hàng</MenuItem>
          </Select>
          {formik.touched.cod && formik.errors.cod && (
            <FormHelperText>{formik.errors.cod}</FormHelperText>
          )}
        </FormControl>

        <FormControl
          fullWidth
          size="small"
          error={formik.touched.diliver && Boolean(formik.errors.diliver)}
        >
          <InputLabel id="deliver-label">Hình thức nhận hàng</InputLabel>
          <Select
            labelId="deliver-label"
            label="Hình thức nhận hàng"
            name="diliver"
            value={formik.values.diliver}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <MenuItem value="delivery">Giao hàng tận nơi (Toàn quốc)</MenuItem>
            <MenuItem value="pickup">Đến nhận trực tiếp tại showroom</MenuItem>
          </Select>
          {formik.touched.diliver && formik.errors.diliver && (
            <FormHelperText>{formik.errors.diliver}</FormHelperText>
          )}
        </FormControl>

        <div>
          <FormControlLabel
            control={
              <Switch
                name="agree"
                checked={Boolean(formik.values.agree)}
                onChange={formik.handleChange}
              />
            }
            label="Tôi đồng ý với chính sách và điều khoản mua hàng"
          />
          {formik.touched.agree && formik.errors.agree && (
            <div style={{ color: "#d32f2f", fontSize: "12px", marginTop: "4px" }}>
              {formik.errors.agree}
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="contained"
          size="large"
          style={{
            backgroundColor: "#0f172a",
            color: "white",
            padding: "12px",
            fontWeight: 600,
            borderRadius: "8px",
            marginTop: "10px",
          }}
        >
          Hoàn tất đặt hàng ({totalPrice.toLocaleString("vi-VN")} VND)
        </Button>
      </form>
    </div>
  );
}
