import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Card, Container, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Thêm Link vào đây

const Login = () => {
  // Quản lý Validation bằng useForm
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();
  
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Lấy danh sách users từ json-server
      const res = await axios.get(`http://localhost:3000/users`);
      const allUsers = res.data;

      // Tìm user khớp cả EMAIL và password
      const loggedInUser = allUsers.find(
        (u) => u.email === data.email && u.password === data.password
      );

      if (loggedInUser) {
        // Lưu thông tin user vào localStorage
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        alert(`Đăng nhập thành công! Xin chào, ${loggedInUser.username || loggedInUser.email}`);
        
        // Điều hướng dựa trên quyền (Role)
        if (loggedInUser.role === "Admin") {
          navigate('/'); // Admin vào Thống kê
        } else {
          navigate('/products'); // Nhân viên vào Sản phẩm
        }
        
        window.location.reload(); 
      } else {
        alert("Email hoặc mật khẩu không chính xác!");
      }
    } catch (error) {
      alert("Không thể kết nối đến server (Hãy chắc chắn json-server đang chạy port 3000)!");
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Card className="shadow-lg border-0 rounded-4 p-4 animate__animated animate__zoomIn" style={{ maxWidth: '420px', width: '100%' }}>
        <Card.Body>
          <div className="text-center mb-4">
            <div className="bg-primary d-inline-block p-3 rounded-circle mb-3 shadow-sm">
              <i className="bi bi-shield-lock-fill text-white fs-2"></i>
            </div>
            <h2 className="fw-bold text-dark mb-1">Hệ thống <span style={{ color: '#ff5c28' }}>7-11</span></h2>
            <p className="text-muted small">Vui lòng đăng nhập để quản lý hệ thống</p>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small">Địa chỉ Email</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text className="bg-white border-end-0">
                  <i className="bi bi-envelope text-muted"></i>
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  className="border-start-0 ps-0 shadow-none"
                  isInvalid={!!errors.email}
                  {...register("email", { 
                    required: "Email là bắt buộc",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Địa chỉ email không hợp lệ"
                    }
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            {/* Password Field */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold small">Mật khẩu</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text className="bg-white border-end-0">
                  <i className="bi bi-key text-muted"></i>
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Nhập mật khẩu..."
                  className="border-start-0 ps-0 shadow-none"
                  isInvalid={!!errors.password}
                  {...register("password", { required: "Mật khẩu là bắt buộc" })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Button 
              type="submit" 
              className="w-100 py-2 fw-bold rounded-pill shadow-sm border-0 transition-all mb-3"
              style={{ backgroundColor: '#5d87ff' }}
            >
              ĐĂNG NHẬP NGAY
            </Button>
            
            <div className="text-center">
              <p className="small text-muted mb-1">Chưa có tài khoản?</p>
              <Link to="/register" className="btn btn-outline-primary w-100 py-2 fw-bold rounded-pill shadow-sm transition-all">
                ĐĂNG KÝ TÀI KHOẢN MỚI
              </Link>
            </div>

            <div className="text-center mt-4 border-top pt-3">
              <small className="text-muted">Quên mật khẩu? Liên hệ Admin hệ thống</small>
            </div>
          </Form>
        </Card.Body>
      </Card>
      
      <style>{`
        .transition-all { transition: all 0.3s ease; }
        .transition-all:hover { transform: translateY(-2px); opacity: 0.9; }
        .form-control:focus { border-color: #dee2e6; box-shadow: none; }
      `}</style>
    </Container>
  );
};

export default Login;