import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api';

//create a student when signing up: Sign up
export const captureStudentDetails = (student) => {
  return axios.post(REST_API_BASE_URL + '/students/create', student);
  
}

//get all student for administrator: Student mangement
export const listRegisteredStudents = () => {
    return axios.get(REST_API_BASE_URL + '/students/getAllStudents');
}

// Login function - authenticate student
export const authenticateStudent = (loginData) => {
  return axios.get(REST_API_BASE_URL + '/students/login', loginData);
}



