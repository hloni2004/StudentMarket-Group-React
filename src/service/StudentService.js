import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api';

//create a student when signing up: Sign up
export const captureStudentDetails = (student) => {
  return axios.post(REST_API_BASE_URL + '/student/create', student);
  
}

//get all student for administrator: Student mangement
export const listRegisteredStudents = () => {
    return axios.get(REST_API_BASE_URL + '/student/getAll');
}

// Login function - authenticate student/admin
export const authenticateUser = (loginData) => {
  return axios.get(REST_API_BASE_URL + '/student/login',{params: loginData});
}



