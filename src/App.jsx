import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'animate.css';
import './App.css';

// Import các Components Layout
import Sidebar from './layouts/Sidebar';
import TopBar from './layouts/TopBar';

// Import các trang chức năng
import Dashboard from './dashboard/Dashboard';
import ProductManager from './products/ProductManager';
import ProductForm from './products/ProductForm';
import OrderManager from './orders/OrderManager';
import CustomerManager from './customers/CustomerManager';
import CustomerForm from './customers/CustomerForm';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  // 1. Kiểm tra trạng thái đăng nhập từ localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <Routes>
        {/* --- ROUTES CÔNG KHAI (Login & Register) --- */}
        {/* Nếu đã đăng nhập (!user là false), Navigate về trang chủ "/" */}
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register /> : <Navigate to="/" />} 
        />

        {/* --- ROUTES QUẢN TRỊ (Được bảo vệ) --- */}
        <Route
          path="/*"
          element={
            user ? (
              <div className="bg-light min-vh-100 overflow-hidden">
                <Row className="g-0">
                  {/* Cột Sidebar: Hiển thị trên màn hình lớn (lg) */}
                  <Col lg={2} className="d-none d-lg-block">
                    <Sidebar />
                  </Col>

                  {/* Cột Nội dung chính bên phải */}
                  <Col lg={10} className="vh-100 overflow-auto">
                    <TopBar />
                    <Container fluid className="p-4 p-lg-5">
                      <Routes>
                        {/* 1. Trang chủ/Thống kê: Chỉ dành cho Admin. Employee sẽ bị đẩy về /products */}
                        <Route 
                          path="/" 
                          element={user.role === "Admin" ? <Dashboard /> : <Navigate to="/products" />} 
                        />

                        {/* 2. Quản lý sản phẩm: Cả Admin và Employee đều truy cập được */}
                        <Route path="/products" element={<ProductManager />} />
                        <Route path="/products/add" element={<ProductForm />} />
                        <Route path="/products/edit/:id" element={<ProductForm />} />

                        {/* 3. Quản lý đơn hàng: Cả Admin và Employee đều truy cập được */}
                        <Route path="/orders" element={<OrderManager />} />

                        {/* 4. Quản lý khách hàng: Chỉ dành cho Admin. Employee bị đẩy về /products */}
                        <Route 
                          path="/customers" 
                          element={user.role === "Admin" ? <CustomerManager /> : <Navigate to="/products" />} 
                        />
                        <Route 
                          path="/customers/add" 
                          element={user.role === "Admin" ? <CustomerForm /> : <Navigate to="/products" />} 
                        />
                        <Route 
                          path="/customers/edit/:id" 
                          element={user.role === "Admin" ? <CustomerForm /> : <Navigate to="/products" />} 
                        />

                        {/* 5. Route dự phòng: Nếu gõ sai path, quay về Dashboard (đối với Admin) hoặc Products (đối với Staff) */}
                        <Route path="*" element={<Navigate to="/" />} />
                      </Routes>
                    </Container>
                  </Col>
                </Row>
              </div>
            ) : (
              // Nếu chưa đăng nhập mà truy cập bất kỳ link nào => Ép về trang Login
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;