import Herobanner from "../Components/Herobanner";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { CameraContext } from "../CameraApi";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function Detail() {
  const { cameras, handleDelete } = useContext(CameraContext);
  const navigate = useNavigate();

  return (
    <>
      <Herobanner />

      <div className="cards py-4">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 style={{ fontWeight: 600, color: "#1e293b", margin: 0 }}>
              Camera Management
            </h4>
            <button
              style={{
                borderRadius: "8px",
                backgroundColor: "#047c91",
                color: "white",
                padding: "8px 18px",
                border: "none",
                fontWeight: 500,
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onClick={() => navigate("/create")}
            >
              + Create new camera
            </button>
          </div>

          <Row className="gx-4 gy-4">
            {cameras.map((s) => (
              <Col key={s.id} md={4} sm={6} xs={12}>
                <Card className="camera-card h-100 shadow-sm">
                  <div className="color-dots">
                    <span
                      className="dot"
                      style={{ backgroundColor: s.color }}
                    ></span>
                  </div>
                  <Card.Img
                    variant="top"
                    src={s.image}
                    style={{ height: "220px", objectFit: "cover" }}
                  />

                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <h6 style={{ fontWeight: 600 }}>{s.name}</h6>
                      <h6 className="mb-2">
                        Price:{" "}
                        <span style={{ color: "orange", fontWeight: 600 }}>
                          {Number(s.price).toLocaleString("vi-VN")} VND
                        </span>
                      </h6>
                      <p
                        className="text-muted"
                        style={{
                          fontSize: "14px",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {s.description}
                      </p>
                    </div>

                    <div className="pt-2 border-top d-flex gap-2">
                      {/* UPDATE */}
                      <button
                        style={{
                          background: "#16a34a",
                          color: "white",
                          borderRadius: "6px",
                          padding: "6px 14px",
                          border: "none",
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                        onClick={() => navigate(`/detail/${s.id}`)}
                      >
                        Update
                      </button>

                      {/* DELETE */}
                      <button
                        style={{
                          background: "#dc2626",
                          color: "white",
                          borderRadius: "6px",
                          padding: "6px 14px",
                          border: "none",
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                        onClick={() => {
                          if (window.confirm(`Bạn có chắc muốn xóa "${s.name}"?`)) {
                            handleDelete(s.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </>
  );
}
