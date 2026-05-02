import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // 1. Lấy thông tin tài khoản đã đăng nhập từ localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // 2. Định nghĩa tất cả các menu
  const allMenuItems = [
    { name: 'Thống kê', path: '/', icon: 'bi bi-grid-1x2-fill', roles: ['Admin'] },
    { name: 'Sản phẩm', path: '/products', icon: 'bi bi-box-seam-fill', roles: ['Admin', 'Employee'] },
    { name: 'Đơn hàng', path: '/orders', icon: 'bi bi-cart-fill', roles: ['Admin', 'Employee'] },
    { name: 'Khách hàng', path: '/customers', icon: 'bi bi-people-fill', roles: ['Admin'] },
  ];

  // 3. Lọc menu dựa trên Role của tài khoản (Yêu cầu Phân quyền - 1đ)
  const filteredMenuItems = allMenuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <div className="sidebar shadow-sm h-100 py-4 bg-white border-end">
      {/* Logo Shop 7-11 */}
      <div className="px-4 mb-5">
        <h4 className="fw-bold m-0" style={{ letterSpacing: '1px' }}>
          <span style={{ color: '#ff5c28' }}>Shop</span> 7-11
        </h4>
        <div className="badge bg-primary-subtle text-primary mt-2 rounded-pill px-3 py-1" style={{ fontSize: '0.7rem' }}>
           {user?.role} Portal
        </div>
      </div>

      <Nav className="flex-column px-3">
        {filteredMenuItems.map((item, index) => (
          <Nav.Link
            key={index}
            as={Link}
            to={item.path}
            className={`d-flex align-items-center rounded-3 mb-2 py-3 px-3 transition-all ${
              isActive(item.path) 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-secondary hover-light fw-medium'
            }`}
            style={isActive(item.path) ? { backgroundColor: '#5d87ff', border: 'none' } : {}}
          >
            <i className={`${item.icon} me-3 fs-5`}></i>
            <span style={{ fontSize: '0.95rem' }}>{item.name}</span>
          </Nav.Link>
        ))}
      </Nav>

      <style>{`
        .hover-light:hover {
          background-color: #f8f9fa;
          color: #5d87ff !important;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
        .sidebar {
          min-width: 240px;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;