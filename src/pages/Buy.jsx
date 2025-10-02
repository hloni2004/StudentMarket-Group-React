import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "react-bootstrap-icons";
import { getAllProducts } from "../service/ProductService";
import Footer from "../components/footer";

const Buy = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const formatPrice = (price) => {
    if (price == null) return "";
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
    }).format(price);
  };

  useEffect(() => {
    getAllProducts()
      .then((response) => {
        const apiProductsResponse = response.data.map((product) => ({
          productName: product.productName,
          description: product.productDescription,
          status: (() => {
            if (!product.productCondition) return "good";
            const c = product.productCondition.toLowerCase();
            if (c.includes("like new")) return "like-new";
            if (c.includes("new")) return "new";
            if (c.includes("good")) return "good";
            if (c.includes("fair")) return "fair";
            if (c.includes("poor")) return "poor";
            return "secondary";
          })(),
          price: product.price,
          category: product.productCategory?.toLowerCase() || "misc",
          seller: product.seller

            ? `${product.seller.firstName} ${product.seller.lastName}`
            : "Unknown Seller",
          image: product.imageData
            ? `data:${product.imageType};base64,${product.imageData}`
            : "https://via.placeholder.com/500x300?text=No+Image",
        }));

        setProducts(apiProductsResponse);
        setFilteredProducts(apiProductsResponse);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "success";
      case "like-new":
        return "primary";
      case "good":
        return "warning";
      case "fair":
        return "secondary";
      case "poor":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-4">
        <div className="mb-4">
          <Link to="/home" className="btn btn-outline-secondary btn-sm">
            <ArrowLeft className="me-2" size={16} />
            Back to Home
          </Link>
        </div>

        <h1 className="h2 mb-4 text-primary">Student Marketplace</h1>

      
        <div className="row g-3 mb-4">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search for items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="laptops">Laptops</option>
              <option value="cellphones">Cell Phones</option>
              <option value="appliances">Appliances</option>
              <option value="textbooks">Textbooks</option>
              <option value="furniture">Furniture</option>
              <option value="electronics">Electronics</option>
              <option value="screens">Screens</option>
            </select>
          </div>
        </div>

      
        {loading ? (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            Loading products...
          </div>
        ) : (
          <>
            <div className="row g-4">
              {filteredProducts.map((product) => (
                <div className="col-md-6 col-lg-4" key={product.id}>
                  <div className="card h-100 shadow-sm">
                    {product.image && (
                      <div className="ratio ratio-16x9">
                        <img
                          src={product.image}
                          alt={product.productName}
                          className="card-img-top object-fit-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&h=300&fit=crop";
                          }}
                        />
                      </div>
                    )}
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between mb-2">
                        <h5 className="card-title mb-0">
                          {product.productName}
                        </h5>
                        <span
                          className={`badge bg-${getStatusColor(
                            product.status
                          )} text-capitalize`}
                        >
                          {product.status.replace("-", " ")}
                        </span>
                      </div>
                      <p className="card-text text-muted small flex-grow-1">
                        {product.description
                          ? product.description.length > 100

                            ? `${product.description.substring(0, 100)}...`

                            : product.description
                          : "No description available"}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="h5 text-success mb-0">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-muted small">
                          by {product.seller}
                        </span>
                      </div>
                      <Link
                        to={`/transaction/${product.id}`}
                        className="btn btn-primary w-100"
                      >
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          
            {filteredProducts.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted">No items found matching your criteria.</p>
                <p className="text-muted small">
                  Try adjusting your search or category filter.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Buy;