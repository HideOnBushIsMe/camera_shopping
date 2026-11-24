import map from "../assets/map.jpg";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#0f172a", // dark navy
        color: "#e5e7eb",
        padding: "50px 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "40px",
        }}
      >
        {/* Logo + intro */}
        <div style={{ maxWidth: "300px" }}>
          <h2 style={{ color: "#f97316" }}>Camera</h2>
          <p>
            We offer modern, high-quality camera designs to suit any needs.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4>Product</h4>
          <p>Pricing</p>
          <p>Support</p>
          <p>Roadmap</p>
          <p>Release Notes</p>
        </div>

        {/* Company */}
        <div>
          <h4>Company</h4>
          <p>About</p>
          <p>Community</p>
          <p>Blog</p>
          <p>Feedback</p>
        </div>

        {/* Contact */}
        <div>
          <h4>Contact to Us</h4>
          <p>Thủ Đức, Hồ Chí Minh</p>
          <p>0939685582</p>
          <p>camerashopinfo@gmail.com</p>
        </div>

        {/* Map */}
        <div>
          <img
            src={map}
            alt="map"
            style={{
              width: "220px",
              borderRadius: "10px",
            }}
          />
        </div>
      </div>

      {/* Bottom */}
      <div
        style={{
          borderTop: "1px solid #334155",
          marginTop: "40px",
          paddingTop: "20px",
          textAlign: "center",
          fontSize: "14px",
        }}
      >
        © 2026 Camera Store - All rights reserved
      </div>
    </footer>
  );
}
