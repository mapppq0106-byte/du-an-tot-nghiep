import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, ListGroup, Badge } from 'react-bootstrap';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, ArcElement, Title, Tooltip, Filler, Legend
);

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resOrders, resProducts] = await Promise.all([
          axios.get('http://localhost:3000/orders'),
          axios.get('http://localhost:3000/products')
        ]);
        setOrders(resOrders.data);
        setProducts(resProducts.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu thống kê:", error);
      }
    };
    fetchData();
  }, []);

  // 1. Dữ liệu Top bán chạy (Biểu đồ Doughnut)
  const topSellingData = products.map(p => {
    const totalSold = orders.reduce((sum, o) => {
      const item = o.products.find(prod => prod.id === p.id);
      return sum + (item ? Number(item.quantity) : 0);
    }, 0);
    return { name: p.name, soldCount: totalSold };
  }).sort((a, b) => b.soldCount - a.soldCount).slice(0, 4);

  const topSellingChartData = {
    labels: topSellingData.map(item => item.name),
    datasets: [{
      data: topSellingData.map(item => item.soldCount),
      backgroundColor: ['#5d87ff', '#13deb9', '#ffcc00', '#fa5a7d'],
      borderWidth: 0,
    }],
  };

  // 2. Dữ liệu Doanh thu (Biểu đồ Bar)
  const totalRevenue = orders
    .filter(o => o.status === "Hoàn Thành")
    .reduce((acc, o) => acc + o.products.reduce((sum, p) => sum + (p.price * p.quantity), 0), 0);

  const revenueData = {
    labels: orders.slice(-7).map(o => o.createdDate),
    datasets: [{
      label: 'Doanh thu ($)',
      data: orders.slice(-7).map(o => o.products.reduce((sum, p) => sum + (p.price * p.quantity), 0)),
      backgroundColor: '#5d87ff',
      borderRadius: 6,
    }],
  };

  // 3. Tình trạng đơn hàng
  const statusChartData = {
    labels: ["Hoàn Thành", "Đang xử lý", "Hủy đơn"],
    datasets: [{
      data: [
        // 1. Giữ nguyên Hoàn Thành
        orders.filter(o => o.status === "Hoàn Thành").length,

        // 2. CẬP NHẬT: Lọc những đơn có status rỗng hoặc đúng chữ "Đang xử lý"
        orders.filter(o => o.status === "Đang xử lý" || o.status === "" || !o.status).length,

        // 3. Cập nhật Hủy đơn (lưu ý db.json của bạn dùng "Hủy đơn")
        orders.filter(o => o.status === "Hủy đơn").length,
      ],
      backgroundColor: ['#13deb9', '#ffa117', '#fa5a7d'],
      borderWidth: 0,
    }],
  };

  // 4. Món mới nhập kho (4 món cuối danh sách)
  const latestProducts = [...products].reverse().slice(0, 4);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { 
      x: { grid: { display: false }, ticks: { font: { size: 10 } } }, 
      y: { beginAtZero: true, grid: { borderDash: [5, 5], drawBorder: false }, ticks: { font: { size: 10 } } } 
    },
  };

  return (
    <div className="dashboard-wrapper animate__animated animate__fadeIn">
      {/* Header gọn gàng */}
      <Card className="border-0 shadow-sm mb-4" style={{ borderLeft: '6px solid #ff5c28', borderRadius: '12px' }}>
        <Card.Body className="d-flex justify-content-between align-items-center p-4">
          <div>
            <h2 className="fw-bold mb-1 text-dark">Tổng quan hệ thống</h2>
            <p className="text-muted mb-0 small">Phân tích tình hình kinh doanh của <strong>Shop 7-11</strong></p>
          </div>
          <div className="text-end border-start ps-4">
            <h3 className="fw-bold text-success mb-0">${totalRevenue.toLocaleString()}</h3>
            <small className="text-muted text-uppercase fw-bold" style={{fontSize: '10px'}}>Doanh thu thực nhận</small>
          </div>
        </Card.Body>
      </Card>

      {/* Hàng 1: 3 Biểu đồ chính */}
      <Row className="g-4 mb-4">
        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4 h-100 rounded-4">
            <h6 className="text-muted fw-bold small text-uppercase mb-4">
              <i className="bi bi-bar-chart-line text-primary me-2"></i>Doanh thu 7 đơn gần nhất
            </h6>
            <div style={{ height: '180px' }}>
              <Bar data={revenueData} options={chartOptions} />
            </div>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4 h-100 rounded-4">
            <h6 className="text-muted fw-bold small text-uppercase mb-4">
              <i className="bi bi-pie-chart text-warning me-2"></i>trạng thái thanh toán
            </h6>
            <div style={{ height: '180px' }} className="d-flex justify-content-center">
              <Doughnut data={statusChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: { size: 10 } } } } }} />
            </div>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4 h-100 rounded-4">
            <h6 className="text-muted fw-bold small text-uppercase mb-4">
              <i className="bi bi-star-fill text-danger me-2"></i>Cơ cấu món bán chạy
            </h6>
            <div style={{ height: '180px' }} className="d-flex justify-content-center">
              <Doughnut data={topSellingChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: { size: 10 } } } } }} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Hàng 2: Bảng đơn hàng và Sản phẩm mới */}
      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Header className="bg-white border-0 pt-4 px-4">
              <h5 className="fw-bold m-0"><i className="bi bi-clock-history me-2 text-warning"></i>Giao dịch mới nhất</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover responsive className="mb-0 align-middle">
                <thead className="bg-light-subtle text-muted small text-uppercase">
                  <tr>
                    <th className="ps-4 py-3">Khách hàng</th>
                    <th>Ngày đặt</th>
                    <th>Giá trị</th>
                    <th className="pe-4 text-end">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {orders.slice(-5).reverse().map((order) => (
                    <tr key={order.id}>
                      <td className="ps-4 py-3 fw-bold">{order.customerName}</td>
                      <td className="text-muted">{order.createdDate}</td>
                      <td className="fw-bold text-dark">
                        ${order.products.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2)}
                      </td>
                      <td className="text-end pe-4">
                        {order.status === "Hoàn Thành" ? (
                          <Badge bg="success" className="rounded-pill px-3 py-2 fw-normal">
                            Hoàn Thành
                          </Badge>
                        ) : order.status === "Hủy đơn" ? (
                          <Badge bg="danger" className="rounded-pill px-3 py-2 fw-normal">
                            Hủy đơn
                          </Badge>
                        ) : (
                          /* Nếu status rỗng hoặc null, hiển thị Đang xử lý với màu vàng (warning) */
                          <Badge bg="warning" className="rounded-pill px-3 py-2 fw-normal text-dark">
                            Đang xử lý
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Header className="bg-white border-0 pt-4 px-4">
              <h5 className="fw-bold m-0"><i className="bi bi-tag-fill text-success me-2"></i>Món mới cập nhật</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {latestProducts.map((item, idx) => (
                  <ListGroup.Item key={idx} className="d-flex align-items-center border-0 mb-3 p-0 bg-transparent">
                    <img src={item.image} alt={item.name} className="rounded-3 shadow-sm border me-3" style={{width: '50px', height: '50px', objectFit: 'cover'}}/>
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-0 small text-dark">{item.name}</h6>
                      <div className="text-muted" style={{fontSize: '11px'}}>{item.category}</div>
                    </div>
                    <div className="fw-bold text-success small">${item.price}</div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <div className="mt-2 text-center">
                <small className="text-muted fw-bold">Dữ liệu thời gian thực</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;