import axios from "axios";


const REST_API_BASE_URL = 'http://localhost:8080/api/product';

//saving to the db
export const capturedProductDetails = (formData) => {
  return axios.post(REST_API_BASE_URL + "/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};


//get all products and display them : Buy page
export const getAllProducts = () => {
  return axios.get(REST_API_BASE_URL + '/getAllProducts');
}

// Get product by ID
export const getProductById = (id) => {
  return axios.get(REST_API_BASE_URL + `/read/${id}`);
};

//delete product 
export const deleteProduct = (productId) => {
  return axios.delete(REST_API_BASE_URL + `/delete/${productId}`);
};


//making payment
export const payForProduct = (product) => {
  return axios.post(REST_API_BASE_URL + `/checkout` + product);
};