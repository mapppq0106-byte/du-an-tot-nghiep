import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [allCustomers, setAllCustomers] = useState([]);

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      gender: "Nam"
    }
  });

  useEffect(() => {
    // 1. Lấy danh sách tất cả khách hàng để kiểm tra trùng SĐT
    axios.get('http://localhost:3000/customers')
      .then(res => setAllCustomers(res.data))
      .catch(err => console.error("Không thể lấy danh sách khách hàng", err));

    if (isEdit) {
      // 2. Nếu là chế độ sửa, lấy dữ liệu chi tiết của khách hàng đó
      axios.get(`http://localhost:3000/customers/${id}`)
        .then(res => reset(res.data))
        .catch(() => {
          alert("Không tìm thấy khách hàng!");
          navigate('/customers');
        });
    }
  }, [id, reset, isEdit, navigate]);

  const onSubmit = async (data) => {
    
    const isPhoneExisted = allCustomers.some(
      (c) => c.phone === data.phone && String(c.id) !== String(id)
    );

    if (isPhoneExisted) {
      alert("Lỗi: Số điện thoại này đã được đăng ký bởi một khách hàng khác!");
      return;
    }

    try {
      if (isEdit) {
        await axios.put(`http://localhost:3000/customers/${id}`, data);
        alert("Cập nhật thông tin khách hàng thành công!");
      } else {
        await axios.post('http://localhost:3000/customers', data);
        alert("Thêm mới khách hàng thành công!");
      }
      navigate('/customers');
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <Card className="shadow-sm border-0 mx-auto animate__animated animate__fadeIn" style={{ maxWidth: '750px' }}>
      <Card.Body className="p-4">
        <h3 className="mb-4 fw-bold text-primary">
          {isEdit ? "Chỉnh sửa khách hàng" : "Đăng ký khách hàng mới"}
        </h3>
        <hr />

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Họ và tên</Form.Label>
                <Form.Control 
                  type="text"
                  placeholder="Nhập tên khách hàng..."
                  isInvalid={!!errors.name}
                  {...register("name", { required: "Họ tên không được để trống" })}
                />
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Ngày sinh</Form.Label>
                <Form.Control 
                  type="date" 
                  isInvalid={!!errors.birthday}
                  {...register("birthday", { required: "Vui lòng chọn ngày sinh" })}
                />
                <Form.Control.Feedback type="invalid">{errors.birthday?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Số điện thoại</Form.Label>
                <Form.Control 
                  type="text"
                  placeholder="Ví dụ: 0905123456"
                  isInvalid={!!errors.phone}
                  {...register("phone", { 
                    required: "Vui lòng nhập số điện thoại",
                    pattern: { value: /^[0-9]{10,11}$/, message: "SĐT phải từ 10-11 chữ số" }
                  })}
                />
                <Form.Control.Feedback type="invalid">{errors.phone?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold d-block">Giới tính</Form.Label>
            <div className="p-2 border rounded bg-light d-inline-block px-3">
              <Form.Check inline label="Nam" type="radio" value="Nam" id="g-male" {...register("gender")} />
              <Form.Check inline label="Nữ" type="radio" value="Nữ" id="g-female" {...register("gender")} />
              <Form.Check inline label="Khác" type="radio" value="Khác" id="g-other" {...register("gender")} />
            </div>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Địa chỉ liên hệ</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={2}
              placeholder="Nhập địa chỉ..."
              isInvalid={!!errors.address}
              {...register("address", { required: "Vui lòng nhập địa chỉ" })}
            />
            <Form.Control.Feedback type="invalid">{errors.address?.message}</Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex gap-2 justify-content-end">
            <Button variant="outline-secondary" onClick={() => navigate('/customers')} className="px-4">
              Hủy bỏ
            </Button>
            <Button variant="primary" type="submit" className="px-4 shadow-sm">
              <i className="bi bi-check2-circle me-2"></i>
              {isEdit ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CustomerForm;