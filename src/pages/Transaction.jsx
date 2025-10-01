import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExclamationTriangle, Clock, Shield, Truck } from 'react-bootstrap-icons';
import { getProductById } from '../service/ProductService';
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51S6IAIKvzaquBxnBmz1NTRBTJPfw5eTwRYKekVDxShaMSzPKGBpaKQ9lAcyBtDHGix7PPaLuvQJbvgPWZlLwYohF00USTba4Xm");

const Transaction = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  
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

  const formatPrice = (price) => {
    if (price == null || isNaN(price)) return "R 0.00";
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
    }).format(price );
  };

const handlePurchase = async () => {
  try {
    setProcessing(true);

    if (!product) {
      setError("No product loaded");
      setProcessing(false);
      return;
    }

 
    const response = await fetch(`http://localhost:8080/api/product/checkout/${product.productId}`, {
      method: "POST",
    });

    const data = await response.json();
    console.log("Stripe session response:", data);

    if (data.status !== "Success" || !data.sessionId) {
      throw new Error(data.message || "Failed to create Stripe session");
    }

   
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });

    if (error) {
      console.error("Stripe checkout error:", error);
      setError(error.message);
      setProcessing(false);
    }
  } catch (err) {
    console.error("Purchase failed:", err);
    setError(err.message || "Payment failed. Please try again.");
    setProcessing(false);
  }
};



  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading product details...</p>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-vh-100 bg-light">
        <div className="container py-4">
          <Link to="/buy" className="btn btn-outline-secondary btn-sm mb-3">
            <ArrowLeft className="me-2" size={16} /> Back to Marketplace
          </Link>
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <ExclamationTriangle className="me-2" size={20} />
            <div>
              <h5>Error Loading Product</h5>
              <p className="mb-0">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <Link to="/buy" className="btn btn-outline-secondary btn-sm mb-3">
          <ArrowLeft className="me-2" size={16} /> Back to Marketplace
        </Link>

        <h1 className="h2 mb-4 text-primary">Complete Your Purchase</h1>

        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4 shadow-sm">
              <div className="card-body d-flex">
                <div className="col-md-5">
                  <img
                    src={product.imageData ? `data:${product.imageType};base64,${product.imageData}` : 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={product.productName}
                    className="img-fluid rounded"
                  />
                </div>
                <div className="col-md-7 ps-3">
                  <h4 className="text-primary">{product.productName}</h4>
                  <p className="text-muted">{product.productDescription}</p>
                  <h3 className="text-success">{formatPrice(product.price)}</h3>
                  <p className="text-muted small">
                    Sold by: {product.seller ? `${product.seller.firstName} ${product.seller.lastName}` : 'Unknown Seller'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm">
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
                      Redirecting...
                    </>
                  ) : (
                    'Confirm Purchase'
                  )}
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
        </div>
      </div> 
    </div>
  );
};

export default Transaction;
