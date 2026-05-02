import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const navigate = useNavigate();

  // 1. Lấy thông tin tài khoản đã đăng nhập từ localStorage (Yêu cầu hiển thị Header - 1đ)
  const user = JSON.parse(localStorage.getItem('user'));

  // 2. Chức năng Đăng xuất (Yêu cầu Đăng xuất - 1đ)
  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
      localStorage.removeItem('user'); // Xóa dữ liệu phiên đăng nhập
      navigate('/login'); // Quay lại trang đăng nhập
      window.location.reload(); // Làm mới trạng thái ứng dụng
    }
  };

  return (
    <Navbar bg="white" expand="lg" className="px-4 py-3 border-bottom sticky-top shadow-sm">
      <Container fluid className="p-0">
        <div className="d-flex align-items-center justify-content-between w-100">
          
          {/* Lời chào hiển thị linh hoạt */}
          <div className="d-none d-md-block">
            <h5 className="mb-0 fw-bold text-dark small">
              Chào mừng quay trở lại, <span className="text-primary">{user?.username}</span>!
            </h5>
          </div>

          <Nav className="ms-auto d-flex align-items-center gap-3">
            {/* Nút thông báo */}
            <Button variant="light" className="rounded-circle border-0 bg-light p-2" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-bell text-muted"></i>
            </Button>

            {/* Thông tin User & Đăng xuất */}
            <div className="d-flex align-items-center border-start ps-3 ms-2 gap-3">
              <div className="text-end d-none d-sm-block">
                {/* Hiển thị username động (1đ) */}
                <p className="fw-bold mb-0 text-dark" style={{ fontSize: '13px' }}>
                  {user?.username}
                </p>
                <small className="text-muted d-block" style={{ fontSize: '10px' }}>
                  {user?.role === "Admin" ? "Quản trị viên" : "Nhân viên"}
                </small>
              </div>

              {/* Hiển thị Avatar động (1đ) */}
              <div className="position-relative">
                <img 
                  src={user?.avatar || "https://ui-avatars.com/api/?name=Guest"} 
                  alt="avatar" 
                  className="rounded-circle border p-1 shadow-sm" 
                  width="42" 
                  height="42"
                  style={{ objectFit: 'cover' }}
                />
                <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: '12px', height: '12px' }}></span>
              </div>

              {/* Nút Đăng xuất (1đ) */}
              <Button 
                variant="outline-danger" 
                size="sm" 
                className="rounded-pill border-0 px-2 ms-1" 
                onClick={handleLogout}
                title="Đăng xuất"
              >
                <i className="bi bi-box-arrow-right fs-5"></i>
              </Button>
            </div>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};

export default TopBar;