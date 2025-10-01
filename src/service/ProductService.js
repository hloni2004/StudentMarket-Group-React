import axios from "axios";

const PRODUCT_API_BASE_URL = 'http://localhost:8181/api/product';
// const TRANSACTION_API_BASE_URL = 'http://localhost:8181/api/transaction';

export const capturedProductDetails = (formData) => {
  return axios.post(PRODUCT_API_BASE_URL + "/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

// Get all products and display them: Buy page
export const getAllProducts = () => {
  return axios.get(PRODUCT_API_BASE_URL + '/getAllProducts');
}

export const deleteProduct = (productId) => {
  return axios.delete(`${PRODUCT_API_BASE_URL}/delete/${productId}`);
};

// Get product by ID
export const getProductById = (id) => {
  return axios.get(`${PRODUCT_API_BASE_URL}/read/${id}`);
};

// // Create transaction
// export const createTransaction = (productId, buyerId) => {
//   return axios.post(`${TRANSACTION_API_BASE_URL}/create`, null, {
//     params: { 
//       productId: productId, 
//       buyerId: buyerId 
//     }
//   });
// };