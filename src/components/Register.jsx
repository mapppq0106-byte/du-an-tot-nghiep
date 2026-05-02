import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Card, Container, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  // Quản lý Validation bằng useForm
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm();
  
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // 1. Kiểm tra xem email đã tồn tại chưa
      const checkRes = await axios.get(`http://localhost:3000/users?email=${data.email}`);
      if (checkRes.data.length > 0) {
        alert("Email này đã được đăng ký! Vui lòng sử dụng email khác.");
        return;
      }

      // 2. Chuẩn bị dữ liệu đăng ký
      const newUser = {
        username: data.username,
        email: data.email,
        password: data.password,
        // Tự động tạo avatar theo tên nếu người dùng không nhập link ảnh
        avatar: data.avatar || `https://ui-avatars.com/api/?name=${data.username}&background=random`,
        role: "Employee", // Mặc định luôn là nhân viên
      };

      // 3. Gửi dữ liệu lên json-server (id sẽ tự động tạo nếu server được config đúng)
      await axios.post('http://localhost:3000/users', newUser);
      
      alert("Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.");
      navigate('/login'); // Chuyển hướng về trang đăng nhập
    } catch (error) {
      alert("Lỗi kết nối server! Vui lòng thử lại sau.");
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Card className="shadow-lg border-0 rounded-4 p-4 animate__animated animate__fadeIn" style={{ maxWidth: '450px', width: '100%' }}>
        <Card.Body>
          <div className="text-center mb-4">
            <div className="bg-success d-inline-block p-3 rounded-circle mb-3 shadow-sm">
              <i className="bi bi-person-plus-fill text-white fs-2"></i>
            </div>
            <h2 className="fw-bold text-dark mb-1">Đăng ký <span style={{ color: '#ff5c28' }}>7-11</span></h2>
            <p className="text-muted small">Tạo tài khoản dành cho nhân viên hệ thống</p>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Username Field */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small">Họ và tên</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text className="bg-white border-end-0">
                  <i className="bi bi-person text-muted"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Nhập họ tên của bạn..."
                  className="border-start-0 ps-0 shadow-none"
                  isInvalid={!!errors.username}
                  {...register("username", { required: "Vui lòng nhập họ tên" })}
                />
                <Form.Control.Feedback type="invalid">{errors.username?.message}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

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
                      message: "Email không đúng định dạng"
                    }
                  })}
                />
                <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            {/* Avatar URL Field */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small">Link ảnh đại diện (Tùy chọn)</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0">
                  <i className="bi bi-image text-muted"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="https://link-anh.com/avatar.jpg"
                  className="border-start-0 ps-0 shadow-none"
                  {...register("avatar")}
                />
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
                  placeholder="Nhập mật khẩu (ít nhất 6 ký tự)..."
                  className="border-start-0 ps-0 shadow-none"
                  isInvalid={!!errors.password}
                  {...register("password", { 
                    required: "Mật khẩu là bắt buộc",
                    minLength: { value: 6, message: "Mật khẩu phải từ 6 ký tự" }
                  })}
                />
                <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Button 
              type="submit" 
              className="w-100 py-2 fw-bold rounded-pill shadow-sm border-0 mb-3 transition-all"
              style={{ backgroundColor: '#28a745' }}
            >
              TẠO TÀI KHOẢN NGAY
            </Button>
            
            <div className="text-center">
              <small className="text-muted">
                Đã có tài khoản? <Link to="/login" className="text-primary fw-bold text-decoration-none">Đăng nhập</Link>
              </small>
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

export default Register;