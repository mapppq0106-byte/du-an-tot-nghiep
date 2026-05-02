import React, { useEffect, useState } from 'react';
import { Table, Button, Badge, Image, Spinner, Card, InputGroup, Form, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- State cho phân trang ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số lượng sản phẩm mỗi trang

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset về trang 1 khi người dùng tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/products');
      setProducts(res.data);
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm có ID: ${id}?`)) {
      try {
        await axios.delete(`http://localhost:3000/products/${id}`);
        alert("Xóa thành công!");
        fetchProducts();
      } catch (error) {
        alert("Xóa thất bại!");
      }
    }
  };

  // 1. Logic lọc sản phẩm theo tìm kiếm
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toString().includes(searchTerm)
  );

  // 2. Logic tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Hàm thay đổi trang
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="product-manager animate__animated animate__fadeIn px-3 py-4">
      
      {/* 1. HEADER & NÚT THÊM MỚI */}
      <Card className="border-0 shadow-sm mb-4 rounded-4">
        <Card.Body className="d-flex justify-content-between align-items-center p-4">
          <div>
            <h2 className="fw-bold mb-1 text-dark">Quản lý Sản phẩm</h2>
            <p className="text-muted mb-0 small">Hiển thị {currentItems.length} trên tổng số {filteredProducts.length} sản phẩm</p>
          </div>
          <Link to="/products/add">
            <Button 
              style={{ backgroundColor: '#ff5c28', borderColor: '#ff5c28' }} 
              className="rounded-pill px-4 py-2 shadow-sm text-white fw-bold"
            >
              + Thêm sản phẩm mới
            </Button>
          </Link>
        </Card.Body>
      </Card>

      {/* 2. THANH TÌM KIẾM */}
      <div className="mb-4">
        <InputGroup className="shadow-sm rounded-pill overflow-hidden border-0 bg-white p-1">
          <InputGroup.Text className="bg-white border-0 ps-4">
            <i className="bi bi-search text-muted"></i>
          </InputGroup.Text>
          <Form.Control
            placeholder="Tìm kiếm theo tên sản phẩm, mã ID hoặc danh mục..."
            className="border-0 py-2 shadow-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

      {/* 3. BẢNG DANH SÁCH SẢN PHẨM */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4">
        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0 custom-table">
              <thead className="bg-light text-muted small">
                <tr className="text-uppercase text-nowrap">
                  <th className="py-3 ps-4" style={{ width: '80px' }}>STT</th>
                  <th style={{ width: '100px' }}>Hình ảnh</th>
                  <th style={{ minWidth: '180px' }}>Tên sản phẩm</th>
                  <th style={{ minWidth: '220px' }}>Mô tả</th>
                  <th>Giá</th>
                  <th>Danh mục</th>
                  <th>Trạng thái</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="small">
                {currentItems.length > 0 ? (
                  currentItems.map((p, index) => (
                    <tr key={p.id} className="border-bottom-0">
                      <td className="ps-4 text-muted fw-medium">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td>
                        <Image 
                          src={p.image} 
                          rounded 
                          style={{ width: '48px', height: '48px', objectFit: 'cover' }} 
                          className="border shadow-sm" 
                        />
                      </td>
                      <td className="fw-bold text-dark">{p.name}</td>
                      <td className="text-muted">
                        <div className="text-truncate" style={{ maxWidth: '220px' }}>{p.description}</div>
                      </td>
                      <td className="fw-bold text-dark">${Number(p.price).toFixed(2)}</td>
                      <td>
                        <Badge bg="light" text="dark" className="border px-2 py-1 fw-normal text-muted">
                          {p.category}
                        </Badge>
                      </td>
                      <td>
                        <Badge 
                          bg={p.status === 'Available' ? 'success-subtle' : 'secondary-subtle'} 
                          className={`${p.status === 'Available' ? 'text-success' : 'text-secondary'} px-3 py-2 rounded-pill border-0 fw-bold`}
                          style={{ fontSize: '0.7rem' }}
                        >
                          {p.status === 'Available' ? '● AVAILABLE' : '○ UNAVAILABLE'}
                        </Badge>
                      </td>
                      <td className="text-center text-nowrap">
                        <Link 
                            to={`/products/edit/${p.id}`} 
                            className="text-muted p-0 me-3 hover-orange"
                        >
                          <i className="bi bi-pencil-square fs-5"></i>
                        </Link>
                        <Button 
                            variant="link" 
                            className="text-danger p-0 border-0 shadow-none"
                            onClick={() => handleDelete(p.id)}
                        >
                          <i className="bi bi-trash3 fs-5"></i>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted">
                      <i className="bi bi-search fs-1 d-block mb-2"></i>
                      Không tìm thấy sản phẩm nào phù hợp!
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      {/* 4. ĐIỀU KHIỂN PHÂN TRANG */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination className="custom-pagination shadow-sm">
            <Pagination.Prev 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item 
                key={index + 1} 
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}

      <style>{`
        .hover-orange:hover { color: #ff5c28 !important; }
        .rounded-4 { border-radius: 1rem !important; }
        .bg-success-subtle { background-color: #e8f5e9 !important; }
        .bg-secondary-subtle { background-color: #f5f5f5 !important; }
        .custom-table thead th { font-weight: 700; letter-spacing: 0.5px; border-bottom: 1px solid #eee; }
        .table > :not(caption) > * > * { border-bottom-width: 1px; border-color: #f8f9fa; }
        
        /* Custom Pagination Style */
        .custom-pagination .page-item.active .page-link {
          background-color: #ff5c28;
          border-color: #ff5c28;
          color: white;
        }
        .custom-pagination .page-link {
          color: #ff5c28;
          border-radius: 8px;
          margin: 0 3px;
        }
      `}</style>
    </div>
  );
};

export default ProductManager;