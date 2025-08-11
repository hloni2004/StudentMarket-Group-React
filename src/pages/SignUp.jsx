import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { captureStudentDetails } from '../service/StudentService';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    streetNumber: "",
    streetName: "",
    suburb: "",
    city: "",
    province: "",
    postalCode: "",
    roomNumber: "",
    floorNumber: "",
    residenceName: "",
    building: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match.");
      setIsLoading(false);
      return;
    }
    
    try {
      const studentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        residence: {
          residenceName: formData.residenceName,
          roomNumber: formData.roomNumber,
          floorNumber: parseInt(formData.floorNumber),
          buildingName: formData.building,
          address: {
            streetNumber: formData.streetNumber,
            streetName: formData.streetName,
            suburb: formData.suburb,
            city: formData.city,
            province: formData.province,
            postalCode: parseInt(formData.postalCode)
          }
        },
        productForSale: [],
        purchases: [],
        requestSent: []
      };

      await captureStudentDetails(studentData);

      toast.success("Welcome to Student Trade Hub.");

      localStorage.setItem("user", JSON.stringify({
        email: formData.email,
        name: formData.firstName
      }));

      navigate("/home");
    } catch (error) {
      console.error(error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">
      <div className="card w-100" style={{ maxWidth: "500px" }}>
        <div className="card-header text-center bg-white border-0">
          <h2 className="card-title text-primary mb-1">Join Student Trade Hub</h2>
          <p className="card-text text-muted">Create your account to start trading</p>
        </div>
        <div className="card-body">
          <form onSubmit={handleSignUp}>
            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label htmlFor="firstName" className="form-label">First Name(s)</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="form-control"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="form-control"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Student Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="your.email@student.edu"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Address Information */}
            <div className="mb-4">
              <h5 className="mb-3">Address Information</h5>
              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label htmlFor="streetNumber" className="form-label">Street Number</label>
                  <input
                    id="streetNumber"
                    name="streetNumber"
                    type="text"
                    className="form-control"
                    placeholder="123"
                    value={formData.streetNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="streetName" className="form-label">Street Name</label>
                  <input
                    id="streetName"
                    name="streetName"
                    type="text"
                    className="form-control"
                    placeholder="Main Street"
                    value={formData.streetName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="suburb" className="form-label">Suburb</label>
                <input
                  id="suburb"
                  name="suburb"
                  type="text"
                  className="form-control"
                  placeholder="Suburb"
                  value={formData.suburb}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label htmlFor="city" className="form-label">City</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    className="form-control"
                    placeholder="Cape Town"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="province" className="form-label">Province</label>
                  <input
                    id="province"
                    name="province"
                    type="text"
                    className="form-control"
                    placeholder="Western Cape"
                    value={formData.province}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="postalCode" className="form-label">Postal Code</label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  className="form-control"
                  placeholder="8001"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Residence Information */}
            <div className="mb-4">
              <h5 className="mb-3">Residence Information</h5>
              <div className="mb-3">
                <label htmlFor="residenceName" className="form-label">Residence Name</label>
                <input
                  id="residenceName"
                  name="residenceName"
                  type="text"
                  className="form-control"
                  placeholder="Student Village"
                  value={formData.residenceName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label htmlFor="roomNumber" className="form-label">Room Number</label>
                  <input
                    id="roomNumber"
                    name="roomNumber"
                    type="text"
                    className="form-control"
                    placeholder="A101"
                    value={formData.roomNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="floorNumber" className="form-label">Floor Number</label>
                  <input
                    id="floorNumber"
                    name="floorNumber"
                    type="text"
                    className="form-control"
                    placeholder="1"
                    value={formData.floorNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="building" className="form-label">Building</label>
                <input
                  id="building"
                  name="building"
                  type="text"
                  className="form-control"
                  placeholder="Building A"
                  value={formData.building}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating account...
                </>
              ) : "Create Account"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-muted">
              Already have an account?{" "}
              <Link to="/login" className="text-primary text-decoration-none fw-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;