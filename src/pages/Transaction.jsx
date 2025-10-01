import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Shield, Truck, ExclamationTriangle } from 'react-bootstrap-icons';
import { getProductById } from '../service/ProductService';
import {createTransaction} from '../service/TransactionService';
import PayQrCode from '../assets/PayQrCode.jpeg';

const Transaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch product details on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (!id || id === 'undefined') {
          throw new Error('Invalid product ID');
        }

        const productResponse = await getProductById(id);
        setProduct(productResponse.data);
      } catch (err) {
        setError(err.message || 'Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Format price for display
  const formatPrice = (price) => {
    if (price == null || isNaN(price)) return "R 0.00";
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Handle purchase click
  const handlePurchase = async () => {
    try {
      setProcessing(true);

      // Get the current student ID from localStorage
      const studentId = localStorage.getItem("studentId");
      if (!studentId) {
        setError('You must be logged in to make a purchase');
        setProcessing(false);
        return;
      }

      // Call backend to create transaction (emails sent automatically)
      await createTransaction(id, studentId);

      // Show success message
      setSuccess(true);

      // Redirect home after 90 seconds
      setTimeout(() => navigate('/home'), 90000);
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) return <Loading productId={id} />;
  if (error) return <Error productId={id} message={error} />;
  if (success) return <Success />;

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <BackButton />
        <h1 className="h2 mb-4 text-primary">Complete Your Purchase</h1>
        <div className="row">
          <ItemDetails product={product} formatPrice={formatPrice} />
          <OrderSummary product={product} formatPrice={formatPrice} handlePurchase={handlePurchase} processing={processing} />
        </div>
      </div>
    </div>
  );
};

export default Transaction;

// --- Subcomponents ---

const Loading = ({ productId }) => (
  <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center">
    <div className="text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2 text-muted">Loading product details...</p>
      <p className="text-muted small">Product ID: {productId}</p>
    </div>
  </div>
);

const Error = ({ productId, message }) => (
  <div className="min-vh-100 bg-light">
    <div className="container py-4">
      <div className="mb-4">
        <Link to="/buy" className="btn btn-outline-secondary btn-sm">
          <ArrowLeft className="me-2" size={16} />
          Back to Marketplace
        </Link>
      </div>
      <div className="alert alert-danger d-flex align-items-center" role="alert">
        <ExclamationTriangle className="me-2" size={20} />
        <div>
          <h5>Error Loading Product</h5>
          <p className="mb-0">{message}</p>
          <small className="text-muted">Product ID: {productId}</small>
        </div>
      </div>
    </div>
  </div>
);

const Success = () => (
  <div className="min-vh-100 bg-light">
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center p-5">
              <div className="ratio ratio-1x1">
                <img src={PayQrCode} alt="QR Code" />
              </div>
              <p className="card-text mb-4">
                Thank you for your purchase. Emails have been sent to both buyer and seller.
                You will be redirected to the homepage shortly.
              </p>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Redirecting...</span>
              </div>
              <div className="mt-3">
                <Link to="/home" className="btn btn-outline-primary">
                  Return Home Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const BackButton = () => (
  <div className="mb-4">
    <Link to="/buy" className="btn btn-outline-secondary btn-sm">
      <ArrowLeft className="me-2" size={16} />
      Back to Marketplace
    </Link>
  </div>
);

const ItemDetails = ({ product, formatPrice }) => (
  <div className="col-lg-8">
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-white">
        <h3 className="h5 mb-0">Item Details</h3>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-5">
            <img
              src={product.imageData ? `data:${product.imageType};base64,${product.imageData}` : 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={product.productName}
              className="img-fluid rounded"
              onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image'}
            />
          </div>
          <div className="col-md-7">
            <h4 className="text-primary">{product.productName}</h4>
            <p className="text-muted">{product.productDescription}</p>
            <div className="mb-3">
              <span className="badge bg-secondary text-capitalize">
                {product.condition?.toLowerCase() || 'Good condition'}
              </span>
            </div>
            <h3 className="text-success">{formatPrice(product.price)}</h3>
            <p className="text-muted small">
              Sold by: {product.seller ? `${product.seller.firstName} ${product.seller.lastName}` : 'Unknown Seller'}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const OrderSummary = ({ product, formatPrice, handlePurchase, processing }) => (
  <div className="col-lg-4">
    <div className="card shadow-sm">
      <div className="card-header bg-white">
        <h3 className="h5 mb-0">Order Summary</h3>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between mb-2">
          <span>Item price:</span>
          <span>{formatPrice(product.price)}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>Platform fee:</span>
          <span>{formatPrice(product.price * 0.05)}</span>
        </div>
        <hr />
        <div className="d-flex justify-content-between mb-3">
          <strong>Total:</strong>
          <strong>{formatPrice(product.price * 1.05)}</strong>
        </div>

        <button
          className="btn btn-primary w-100 mb-3"
          onClick={handlePurchase}
          disabled={processing}
        >
          {processing ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Processing...
            </>
          ) : 'Confirm Purchase'}
        </button>

        <div className="bg-light p-3 rounded small">
          <div className="d-flex align-items-center mb-2">
            <Shield size={16} className="text-success me-2" />
            <span>Secure payment</span>
          </div>
          <div className="d-flex align-items-center mb-2">
            <Truck size={16} className="text-success me-2" />
            <span>Arrange pickup with seller</span>
          </div>
          <div className="d-flex align-items-center">
            <Clock size={16} className="text-success me-2" />
            <span>Usually completed within 24 hours</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
