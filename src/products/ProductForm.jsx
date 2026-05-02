import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    watch,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      status: "Available",
      category: "Món chính",
      image: ""
    }
  });

  const currentImageUrl = watch("image");

  useEffect(() => {
    if (isEdit) {
      axios.get(`http://localhost:3000/products/${id}`)
        .then(res => {
          reset(res.data);
        })
        .catch(err => {
          console.error("Lỗi lấy chi tiết sản phẩm:", err);
          alert("Không tìm thấy sản phẩm!");
          navigate('/products');
        });
    }
  }, [id, reset, isEdit, navigate]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await axios.put(`http://localhost:3000/products/${id}`, data);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        await axios.post('http://localhost:3000/products', data);
        alert("Thêm mới sản phẩm thành công!");
      }
      navigate('/products');
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      alert("Có lỗi xảy ra, vui lòng kiểm tra lại kết nối JSON Server!");
    }
  };

  return (
    <Card className="shadow-sm border-0 mx-auto animate__animated animate__fadeIn" style={{ maxWidth: '900px', borderRadius: '15px' }}>
      <Card.Body className="p-4">
        <h3 className="mb-4 fw-bold text-primary">
          {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        </h3>
        <hr className="mb-4" />

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            {/* Cột trái: Nhập liệu */}
            <Col md={7}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Tên sản phẩm</Form.Label>
                <Form.Control 
                  type="text"
                  placeholder="Nhập tên sản phẩm..."
                  isInvalid={!!errors.name}
                  {...register("name", { required: "Tên không được để trống" })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Đường dẫn ảnh (URL)</Form.Label>
                <Form.Control 
                  type="text"
                  placeholder="Dán link ảnh tại đây..."
                  isInvalid={!!errors.image}
                  {...register("image", { required: "Vui lòng dán link ảnh" })}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Giá sản phẩm (VNĐ)</Form.Label>
                    <Form.Control 
                      type="number"
                      placeholder="15"
                      isInvalid={!!errors.price}
                      {...register("price", { required: "Vui lòng dán link ảnh" })} 
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Danh mục</Form.Label>
                    <Form.Select {...register("category")}>
                      <option value="Món chính">Món chính</option>
                      <option value="Đồ uống">Đồ uống</option>
                      <option value="Tráng miệng">Tráng miệng</option>
                      <option value="Khai vị">Khai vị</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold d-block">Trạng thái</Form.Label>
                <div className="p-3 border rounded bg-light d-flex gap-3" style={{ width: 'fit-content' }}>
                  {/* Nút "Hoạt động" tương ứng với giá trị "Available" trong database */}
                  <Form.Check 
                    inline 
                    type="radio" 
                    label="Hoạt động" 
                    value="Available" 
                    id="status-active" 
                    {...register("status")} 
                  />
                  {/* Chỉnh sửa: Đảm bảo value là "Unavailable" để khớp chính xác với db.json */}
                  <Form.Check 
                    inline 
                    type="radio" 
                    label="Không hoạt động" 
                    value="Unavailable" 
                    id="status-inactive" 
                    {...register("status")} 
                  />
                </div>
              </Form.Group>
            </Col>

            {/* Cột phải: Xem trước ảnh 100% */}
            <Col md={5} className="text-center d-flex flex-column border-start ps-4">
              <Form.Label className="fw-semibold mb-3">Xem trước hình ảnh</Form.Label>
              <div className="image-preview-wrapper border rounded-3 bg-white d-flex align-items-center justify-content-center overflow-hidden shadow-sm" 
                   style={{ width: '100%', height: '280px', border: '1px solid #dee2e6' }}>
                {currentImageUrl ? (
                  <Image 
                    src={currentImageUrl} 
                    alt="Preview" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain', // Hiển thị 100% nội dung ảnh không bị cắt
                      backgroundColor: '#f8f9fa' 
                    }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200?text=Link+ảnh+lỗi";
                    }}
                  />
                ) : (
                  <div className="text-muted py-5">
                    <i className="bi bi-image fs-1 opacity-25 d-block mb-2"></i>
                    <small>Chưa có hình ảnh</small>
                  </div>
                )}
              </div>
              <small className="text-muted mt-2 fst-italic">Ảnh sẽ hiển thị khi link đúng định dạng</small>
            </Col>
          </Row>

          <Form.Group className="mb-4 mt-3">
            <Form.Label className="fw-semibold">Mô tả chi tiết</Form.Label>
            <Form.Control as="textarea" rows={4} placeholder="Nhập mô tả..." {...register("description")} />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="primary" type="submit" className="px-4 py-2 fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-save"></i> Cập nhật ngay
            </Button>
            <Button variant="outline-secondary" className="px-4" onClick={() => navigate('/products')}>
              Hủy bỏ
            </Button>
          </div>
        </Form>
      </Card.Body>
      
      <style>{`
        .image-preview-wrapper {
          transition: all 0.3s ease;
          background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                            linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                            linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                            linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
        .form-control:focus, .form-select:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1);
        }
      `}</style>
    </Card>
  );
};

export default ProductForm;