import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:7090/api';

//get all products and display them : Buy page
export const getAllProducts = () => {
  return axios.get(REST_API_BASE_URL + '/product/getAllProducts');
}

