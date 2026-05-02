import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Badge, Modal, Card, Row, Col, InputGroup } from 'react-bootstrap';
import axios from 'axios';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/orders');
      setOrders(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật trực tiếp kết quả đơn hàng (Hoàn thành / Hủy)
  const handleUpdateStatus = async (order, newValue) => {
    try {
      // Gửi yêu cầu PUT để cập nhật đè giá trị status
      await axios.put(`http://localhost:3000/orders/${order.id}`, { ...order, status: newValue });
      fetchOrders();
    } catch (error) {
      alert("Cập nhật thất bại!");
    }
  };

  // Logic 2: Cập nhật Trạng thái Thanh toán kèm theo ràng buộc tự động
  const handleUpdatePaymentStatus = async (order, newValue) => {
    // Tạo bản sao dữ liệu đơn hàng và cập nhật Trạng thái thanh toán mới
    let updatedOrder = { ...order, paymentStatus: newValue };

    if (newValue === "Đã xử lý") {
      updatedOrder.status = "Hoàn Thành"; // Tự động Hoàn thành khi đã xử lý xong thanh toán
    } else if (newValue === "Hoàn tiền") {
      updatedOrder.status = "Hủy đơn"; // Tự động Hủy khi hoàn tiền
    } else if (newValue === "Đang giao" || newValue === "Đang xử lý") {// Để các nút hiển thị outline (Hoàn thành/Hủy)
      updatedOrder.status = ""; // Reset trạng thái đơn khi đang trong quy trình
    }

    try {
      // Gửi toàn bộ đối tượng đã được xử lý logic lên Server
      await axios.put(`http://localhost:3000/orders/${order.id}`, updatedOrder);
      fetchOrders();// Cập nhật lại giao diện
    } catch (error) {
      alert("Cập nhật thất bại!");
    }
  };
// --- HÀM MỞ MODAL XEM CHI TIẾT ---
  const openDetail = (order) => {
    setSelectedOrder(order);
    setShowDetail(true);// Hiển thị Modal lên màn hình
  };

  const filteredOrders = orders.filter(o =>
    // Tìm theo tên khách hàng 
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    // Tìm theo trạng thái (nếu có)
    (o.status && o.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
    // Tìm theo mã ID (hỗ trợ cả việc gõ "ORD" hoặc chỉ gõ số)
    o.id.toString().includes(searchTerm.replace('ORD', ''))
  );

  return (
    <div className="order-manager animate__animated animate__fadeIn px-3 py-4">
      
      {/* 1. HEADER (Giữ nguyên) */}
      <Card className="border-0 shadow-sm mb-4 rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold mb-1">Quản lý Đơn hàng</h2>
            <p className="text-muted small mb-0">Theo dõi quy trình thanh toán và vận hành chi tiết</p>
          </div>
        </div>
      </Card>

      {/* 2. THỐNG KÊ (Giữ nguyên) */}
      <Row className="mb-4 g-3">
        <Col md={3}><Card className="border-0 shadow-sm text-center py-3 rounded-4 bg-white"><div className="text-muted small fw-bold text-uppercase">Tổng số đơn</div><h4 className="fw-bold m-0 text-primary">{orders.length}</h4></Card></Col>
        <Col md={3}><Card className="border-0 shadow-sm text-center py-3 rounded-4 bg-white"><div className="text-muted small fw-bold text-uppercase">Chờ xử lý</div><h4 className="fw-bold m-0 text-warning">{orders.filter(o => !o.status || o.status === "").length}</h4></Card></Col>
        <Col md={3}><Card className="border-0 shadow-sm text-center py-3 rounded-4 bg-white"><div className="text-muted small fw-bold text-uppercase">Hoàn thành</div><h4 className="fw-bold m-0 text-success">{orders.filter(o => o.status === 'Hoàn Thành').length}</h4></Card></Col>
        <Col md={3}><Card className="border-0 shadow-sm text-center py-3 rounded-4 bg-white"><div className="text-muted small fw-bold text-uppercase">Doanh thu</div><h4 className="fw-bold m-0 text-danger">${orders.filter(o => o.status === 'Hoàn Thành').reduce((sum, o) => sum + o.products.reduce((s, p) => s + (p.price * p.quantity), 0), 0).toFixed(1)}</h4></Card></Col>
      </Row>

      {/* 3. TÌM KIẾM */}
      <div className="mb-4">
        <InputGroup className="shadow-sm rounded-pill overflow-hidden border-0 bg-white p-1">
          <InputGroup.Text className="bg-white border-0 ps-4"><i className="bi bi-search text-muted"></i></InputGroup.Text>
          <Form.Control placeholder="Tìm kiếm đơn hàng..." className="border-0 py-2 shadow-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </InputGroup>
      </div>

      {/* 4. BẢNG DANH SÁCH (Đầy đủ các cột theo image_db3b62.png) */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <Table hover className="align-middle mb-0 custom-table">
            <thead className="bg-light text-muted small fw-bold border-bottom">
              <tr className="text-uppercase">
                <th className="ps-4 py-3">Mã đơn</th>
                <th>Khách hàng</th>
                <th>Sản phẩm đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái thanh toán</th>
                <th>Trạng thái đơn hàng</th>
                <th className="text-center pe-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-bottom-0">
                    <td className="ps-4 fw-bold text-primary">#ORD00{order.id}</td>
                    <td>
                      <div className="fw-bold">{order.customerName}</div>
                      <small className="text-muted">Khách hàng hệ thống</small>
                    </td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '180px' }}>
                        {order.products.map(p => p.name).join(", ")}
                      </div>
                    </td>
                    <td className="fw-bold">${order.products.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(1)}</td>
                    
                    {/* CỘT THANH TOÁN (Logic tự động & Màu sắc theo image_db3b62.png) */}
                    <td>
                      <Form.Select 
                        size="sm" 
                        value={order.paymentStatus}
                        onChange={(e) => handleUpdatePaymentStatus(order, e.target.value)}
                        className={`rounded-pill border-0 fw-bold small px-3 py-2 ${
                          order.paymentStatus === 'Đã xử lý' ? 'bg-warning-subtle text-warning' : 
                          order.paymentStatus === 'Hoàn tiền' ? 'bg-info-subtle text-info' : 'bg-light text-dark'
                        }`}
                        style={{ width: '160px' }}
                      >
                        <option value="Đang xử lý">ĐANG XỬ LÝ</option>
                        <option value="Đã xử lý">ĐÃ XỬ LÝ</option>
                        <option value="Đang giao">ĐANG GIAO</option>
                        <option value="Hoàn tiền">HOÀN TIỀN</option>
                      </Form.Select>
                    </td>

                    {/* CỘT TRẠNG THÁI ĐƠN HÀNG (Logic khóa nút chặt chẽ) */}
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          size="sm" 
                          disabled={order.paymentStatus === 'Hoàn tiền' || order.status === 'Hoàn Thành'}
                          variant={order.status === 'Hoàn Thành' ? "success" : "outline-success"}
                          className="rounded-pill fw-bold px-3"
                          style={{ fontSize: '0.65rem' }}
                          // onClick={() => handleUpdateStatus(order, 'Hoàn Thành')}
                        >
                          HOÀN THÀNH
                        </Button>
                        <Button 
                          size="sm" 
                          disabled={order.paymentStatus === 'Đã xử lý' || order.status === 'Hủy đơn'}
                          variant={order.status === 'Hủy đơn' ? "danger" : "outline-danger"}
                          className="rounded-pill fw-bold px-3"
                          style={{ fontSize: '0.65rem' }}
                          // onClick={() => handleUpdateStatus(order, 'Hủy đơn')}
                        >
                          HỦY
                        </Button>
                      </div>
                    </td>

                    <td className="text-center pe-4">
                      <Button variant="link" className="text-muted p-0 me-3 shadow-none" onClick={() => openDetail(order)}><i className="bi bi-eye-fill fs-5"></i></Button>
                      <i className="bi bi-pencil-square fs-5 text-primary cursor-pointer"></i>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="text-center py-5 text-muted">Không tìm thấy đơn hàng!</td></tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* MODAL CHI TIẾT (Giữ nguyên) */}
      <Modal show={showDetail} onHide={() => setShowDetail(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 px-4 pt-4"><Modal.Title className="fw-bold">Hóa đơn chi tiết</Modal.Title></Modal.Header>
        <Modal.Body className="px-4 pb-4">
          {selectedOrder && (
            <Table borderless responsive className="align-middle">
              <thead><tr className="text-muted small border-bottom"><th>SẢN PHẨM</th><th className="text-center">SL</th><th className="text-end">GIÁ</th><th className="text-end">TỔNG</th></tr></thead>
              <tbody>
                {selectedOrder.products.map((p, i) => (
                  <tr key={i}><td>{p.name}</td><td className="text-center">{p.quantity}</td><td className="text-end">${p.price}</td><td className="text-end fw-bold">${(p.price * p.quantity).toFixed(1)}</td></tr>
                ))}
                <tr className="border-top"><td colSpan="3" className="text-end fw-bold py-3">THÀNH TIỀN:</td><td className="text-end text-danger fw-bold fs-5 py-3">${selectedOrder.products.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(1)}</td></tr>
              </tbody>
            </Table>
          )}
        </Modal.Body>
      </Modal>

      <style>{`
        .bg-warning-subtle { background-color: #fff8e1 !important; color: #fbc02d !important; }
        .bg-info-subtle { background-color: #e0f7fa !important; color: #00838f !important; }
        .cursor-pointer { cursor: pointer; }
        .custom-table thead th { border-bottom: 1px solid #eee; padding: 15px 10px; background: #fdfdfd; }
      `}</style>
    </div>
  );
};

export default OrderManager;