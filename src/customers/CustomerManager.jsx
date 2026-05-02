import React, { useEffect, useState } from 'react';
import { Table, Button, Badge, Card, InputGroup, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CustomerManager = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/customers');
      setCustomers(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khách hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khách hàng: ${name}?`)) {
      try {
        await axios.delete(`http://localhost:3000/customers/${id}`);
        alert("Xóa khách hàng thành công!");
        fetchCustomers();
      } catch (error) {
        alert("Xóa thất bại!");
      }
    }
  };

  const renderAvatar = (name) => {
    const firstLetter = name ? name.charAt(0).toUpperCase() : '?';
    const colors = ['#dbeafe', '#dcfce7', '#fef3c7', '#f3e8ff'];
    const textColors = ['#1e40af', '#166534', '#92400e', '#6b21a8'];
    const index = firstLetter.charCodeAt(0) % colors.length;

    return (
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        backgroundColor: colors[index], color: textColors[index],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold', fontSize: '16px'
      }}>
        {firstLetter}
      </div>
    );
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm) ||
    c.id.toString().includes(searchTerm.replace('CUS', ''))
  );

  return (
    <div className="customer-manager animate__animated animate__fadeIn px-3 py-4">
      
      {/* HEADER */}
      <Card className="border-0 shadow-sm mb-4 rounded-4">
        <Card.Body className="d-flex justify-content-between align-items-center p-4">
          <div>
            <h2 className="fw-bold mb-1 text-dark">Quản lý Khách hàng</h2>
            <p className="text-muted mb-0 small">Hệ thống lưu trữ thông tin và phân tích thói quen mua sắm</p>
          </div>
          <Link to="/customers/add">
            <Button 
              style={{ backgroundColor: '#ff5c28', borderColor: '#ff5c28' }} 
              className="rounded-pill px-4 py-2 shadow-sm text-white fw-bold"
            >
              + Thêm khách hàng mới
            </Button>
          </Link>
        </Card.Body>
      </Card>

      {/* SEARCH BAR */}
      <div className="mb-4 d-flex align-items-center bg-white shadow-sm rounded-pill overflow-hidden border p-1">
        <InputGroup className="border-0">
          <InputGroup.Text className="bg-white border-0 ps-4">
            <i className="bi bi-search text-muted"></i>
          </InputGroup.Text>
          <Form.Control
            placeholder="Tìm theo tên khách hàng, số điện thoại hoặc mã định danh (CUS...)"
            className="border-0 py-2 shadow-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        <Button variant="link" className="text-muted text-decoration-none px-4" onClick={() => setSearchTerm('')}>Xóa lọc</Button>
      </div>

      {/* CUSTOMER TABLE */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <Table hover className="align-middle mb-0 custom-table">
            <thead className="bg-light text-muted small border-bottom">
              <tr className="text-uppercase text-nowrap">
                <th className="py-3 ps-4">Khách hàng</th>
                <th>Ngày sinh</th>
                <th>Thông tin liên hệ</th>
                <th>Địa chỉ</th>
                <th>Giới tính</th>
                <th className="text-center pe-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filteredCustomers.length > 0 ? (
                filteredCustomers.map((item) => (
                  <tr key={item.id} className="border-bottom-0">
                    {/* Cột 1: Khách hàng */}
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        {renderAvatar(item.name)}
                        <div>
                          <div className="fw-bold text-dark">{item.name}</div>
                          <div className="text-muted small">ID: CUS00{item.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Cột 2: Ngày sinh (Thay cho Lượt mua) */}
                    <td>
                      <div className="fw-medium text-dark">
                        <i className="bi bi-calendar3 me-2 text-primary small"></i>
                        {item.birthday}
                      </div>
                    </td>

                    {/* Cột 3: Thông tin liên hệ */}
                    <td>
                      <div className="fw-bold">{item.phone}</div>
                      <div className="text-muted small">Đã xác thực</div>
                    </td>

                    {/* Cột 4: Địa chỉ */}
                    <td>
                      <div className="text-muted small">
                        <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                        {item.address}, Việt Nam
                      </div>
                    </td>

                    {/* Cột 5: Giới tính */}
                    <td>
                      <Badge 
                        bg={item.gender === 'Nam' ? 'primary-subtle' : item.gender === 'Nữ' ? 'danger-subtle' : 'info-subtle'} 
                        className={`${item.gender === 'Nam' ? 'text-primary' : item.gender === 'Nữ' ? 'text-danger' : 'text-info'} px-3 py-2 rounded-pill border-0 fw-bold`}
                        style={{ fontSize: '0.75rem' }}
                      >
                        {item.gender?.toUpperCase()}
                      </Badge>
                    </td>

                    {/* Cột 6: Hành động */}
                    <td className="text-center pe-4 text-nowrap">
                      <Link to={`/customers/edit/${item.id}`} className="text-muted me-3">
                        <i className="bi bi-clock-history fs-5"></i>
                      </Link>
                      <Button 
                        variant="link" 
                        className="text-danger p-0 border-0 shadow-none" 
                        onClick={() => handleDelete(item.id, item.name)}
                      >
                        <i className="bi bi-trash3 fs-5"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    {loading ? "Đang tải dữ liệu..." : "Không tìm thấy khách hàng nào!"}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      <style>{`
        .custom-table thead th { font-weight: 700; letter-spacing: 0.5px; }
        .rounded-4 { border-radius: 1rem !important; }
        .table > :not(caption) > * > * { border-bottom-width: 1px; border-color: #f1f3f5; }
        .bg-primary-subtle { background-color: #eef2ff !important; }
        .bg-danger-subtle { background-color: #fff1f2 !important; }
        .bg-info-subtle { background-color: #f0f9ff !important; }
      `}</style>
    </div>
  );
};

export default CustomerManager;