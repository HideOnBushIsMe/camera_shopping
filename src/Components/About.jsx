import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Herobanner from "./Herobanner";

// Nhập ảnh từ thư mục assets/cameras
import bannerImg from "../assets/cameras/R100.jpg";
import img1 from "../assets/cameras/R.jpg";
import img2 from "../assets/cameras/R3.jpg";
import img3 from "../assets/cameras/R5.jpg";

export default function About() {
  return (
    <>
      <Herobanner />
      {/* Banner */}
      <div
        style={{
          backgroundImage: `url(${bannerImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textShadow: "2px 2px 4px rgba(0,0,0,0.7)"
        }}
      >
        <h1>About Us</h1>
      </div>

      <Container className="mt-5">
        {/* About Us */}
        <Row className="mb-5">
          <Col>
            <h2>Introduce</h2>
            <p>
              We specialize in providing modern, high-quality cameras with
              sophisticated designs suitable for any photography needs. Our goal is
              to bring quality and style to your life, helping you capture every precious moment.
            </p>
          </Col>
        </Row>

        {/* Mission & Vision */}
        <Row className="mb-5">
          <Col md={6}>
            <Card className="p-3 shadow">
              <h4>Mission</h4>
              <p>
                Providing quality camera products and accessories, helping customers
                preserve their best memories with the highest resolution and stunning details.
              </p>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="p-3 shadow">
              <h4>Vision</h4>
              <p>
                To become the leading camera and photography equipment brand in Vietnam
                with a diverse range of products and the best customer service.
              </p>
            </Card>
          </Col>
        </Row>

        {/* Why choose us */}
        <Row className="mb-5 text-center">
          <h2 className="mb-4">Why choose us?</h2>

          <Col md={4}>
            <Card className="p-3 shadow">
              <h5>High quality</h5>
              <p>All cameras are from top brands with guaranteed durability and performance.</p>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="p-3 shadow">
              <h5>Reasonable price</h5>
              <p>
                Competitive pricing, suitable for a wide range of customers from beginners to professionals.
              </p>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="p-3 shadow">
              <h5>Good warranty</h5>
              <p>Clear warranty policy and prompt technical support.</p>
            </Card>
          </Col>
        </Row>

        {/* Gallery */}
        <Row className="mb-5">
          <h2 className="mb-4 text-center">Gallery</h2>

          <Col md={4}>
            <img
              src={img1}
              alt="Camera 1"
              className="img-fluid rounded"
              style={{ height: "250px", width: "100%", objectFit: "cover" }}
            />
          </Col>

          <Col md={4}>
            <img
              src={img2}
              alt="Camera 2"
              className="img-fluid rounded"
              style={{ height: "250px", width: "100%", objectFit: "cover" }}
            />
          </Col>

          <Col md={4}>
            <img
              src={img3}
              alt="Camera 3"
              className="img-fluid rounded"
              style={{ height: "250px", width: "100%", objectFit: "cover" }}
            />
          </Col>
        </Row>

        {/* Contact */}
        <Row className="mb-5 text-center">
          <h2>Contact to Us</h2>
          <p>📍 Địa chỉ: Thủ Đức, Hồ Chí Minh</p>
          <p>📞 SĐT: 0939 685 582</p>
          <p>📧 Email: camerashopinfo@gmail.com</p>
        </Row>
      </Container>
    </>
  );
}
