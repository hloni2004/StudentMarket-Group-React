import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Modal, Form, Image } from "react-bootstrap";
import Header from "../components/Header";
import { getStudentById, updateStudent } from "../service/StudentService";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import { deleteProduct } from "../service/ProductService";


const residenceAddresses = {
  "President House": {
    streetNumber: "22",
    streetName: "Barrack Street",
    suburb: "Cape Town City Center",
    city: "Cape Town",
    province: "Western Cape",
    postalCode: "8001"
  },
  "New Market Junction": {
    streetNumber: "45",
    streetName: "New Market Street",
    suburb: "Woodstock",
    city: "Cape Town",
    province: "Western Cape",
    postalCode: "8005"
  },
  "Plein House": {
    streetNumber: "10",
    streetName: "Plein Street",
    suburb: "Central",
    city: "Cape Town",
    province: "Western Cape",
    postalCode: "8001"
  }
};

const Profile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
        lastName: "",
        email: "",
        residenceName: "",
        roomNumber: "",
        floorNumber: 0,
        building: "",
        streetNumber: "",
        streetName: "",
        suburb: "",
        city: "",
        province: "",
        postalCode: ""
  });
  const [residenceId, setResidenceId] = useState(null);
  const [addressId, setAddressId] = useState(null);
const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const navigate = useNavigate();
  const handleLogout = () => {
    
    localStorage.removeItem("user");
    navigate("/"); 
  };
   const getProfileImageUrl = () => {
        if (student?.profileImage) {
            // Handle both Base64 strings and full URLs
            if (student.profileImage.startsWith('data:image')) {
                return student.profileImage;
            }
            return `data:image/jpeg;base64,${student.profileImage}`; 
        }
        return "/images/default-avatar.png";
    };
const studentId = localStorage.getItem("studentId");  
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await getStudentById(studentId);
        const data = response.data;
        setStudent(data);

        const residenceName = data.residence?.residenceName;
        const addressInfo = residenceAddresses[residenceName] || data.residence?.address || {};

        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          residenceName: residenceName ,
          roomNumber: data.residence?.roomNumber,
          floorNumber: data.residence?.floorNumber || 0,
          building: data.residence?.buildingName ,
          streetNumber: addressInfo.streetNumber ,
          streetName: addressInfo.streetName ,
          suburb: addressInfo.suburb,
          city: addressInfo.city ,
          province: addressInfo.province,
          postalCode: addressInfo.postalCode ,
        });
        setResidenceId(data.residence?.residenceId || null);
      setAddressId(data.residence?.address?.addressId || null);

      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    if (studentId) fetchStudent();
}, [studentId]);

  const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedImageFile(file);
        
        // Create a local URL for image preview
        if (file) {
            setImagePreviewUrl(URL.createObjectURL(file));
        } else {
            setImagePreviewUrl(null);
        }
    };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleResidenceChange = (e) => {
    const residenceName = e.target.value;
    const addressInfo = residenceAddresses[residenceName] ;
    setFormData(prev => ({
      ...prev,
      residenceName,
      streetNumber: addressInfo.streetNumber ,
      streetName: addressInfo.streetName ,
      suburb: addressInfo.suburb ,
      city: addressInfo.city,
      province: addressInfo.province ,
      postalCode: addressInfo.postalCode 
    }));
  };

const handleRemove = async (productId) => {
  if (!window.confirm("Are you sure you want to remove this item?")) return;

  try {
    await deleteProduct(productId);

    // Update UI after successful deletion
    setStudent((prev) => ({
      ...prev,
      productForSale: prev.productForSale.filter(
        (p) => p.productId !== productId
      ),
    }));

    alert("Item removed successfully!");
  } catch (err) {
    console.error("Error removing product:", err);
    alert("Failed to remove item. Please try again.");
  }
};


  const handleSave = async () => {
  if (!student) return;

  try {
   
    const updatedStudent = {
      studentId: student.studentId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: student.password, 
      residence: {
        residenceId: residenceId,
        residenceName: formData.residenceName,
        roomNumber: formData.roomNumber,
        floorNumber: formData.floorNumber,
        buildingName: formData.building,
        address: {
          addressId: addressId,
          streetNumber: formData.streetNumber,
          streetName: formData.streetName,
          suburb: formData.suburb,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
        }
      }
    };
     const multipartData = new FormData();
        multipartData.append(
            "student",
            new Blob([JSON.stringify(updatedStudent)], { type: "application/json" })
        );

        if (selectedImageFile) {
            multipartData.append("profileImage", selectedImageFile);
        }
  
    const response = await updateStudent(student.studentId, multipartData);
    
    setStudent(response.data);
    setShowModal(false);
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    document.getElementById("profileImageInput").value = null;
    toast.success("Profile updated successfully!");

  } catch (err) {
    console.error("Profile update error:", err);
    toast.error("Failed to update profile. Please try again.");
  }
};

  if (loading) return <p>Loading student profile...</p>;
  if (!student) return <p>No student data found.</p>;

  return (
    <>
      <Header />

      <div className="container mt-4">

    
       < div className="border rounded shadow-sm p-4 mb-4 d-flex justify-content-between align-items-start">
  
<div>
  <h3>{student.firstName}  {student.lastName}</h3>
  <p>Email: {student.email}</p>
  <p>Residence: {student.residence?.residenceName}</p>
  <p>Floor: {student.residence?.floorNumber}</p>
  {student.residence?.address && (
    <p>
      Address: {student.residence.address.streetNumber}{" "}
      {student.residence.address.streetName}, {student.residence.address.suburb},{" "}
      {student.residence.address.city}, {student.residence.address.postalCode}
    </p>
  )}
   <div className="mt-auto">
      <Button variant="danger" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  </div>
  

  
  <div className="d-flex flex-column align-items-end">
    <Button onClick={() => setShowModal(true)}>Edit Profile</Button>
     <Image 
        src={getProfileImageUrl()} 
        roundedCircle 
        style={{ width: '150px', height: '150px', objectFit: 'cover', border: '2px solid #ccc' }}
        alt="Profile Avatar"
        onError={(e) => {
        e.target.src = "/images/default-avatar.png";
      }}
    />
  </div>
</div>
    
    
        <div className="row g-4">

    
        <div className="col-md-4">
  <div
    className="border rounded shadow-sm p-4"
    style={{ backgroundColor: "#f8f9fa", minHeight: "500px" }}
  >
    <h4 className="text-secondary">Active Listings</h4>
    <span className="badge bg-primary">
      {student?.productForSale?.length || 0} items
    </span>

    <div className="overflow-auto mt-3" style={{ maxHeight: "420px" }}>
      {student?.productForSale?.length > 0 ? (
        student.productForSale.map((product) => (
          <div key={product.productId} className="card mb-3 shadow-sm">
            <img
              src={
                product.imageData
                  ? `data:${product.imageType};base64,${product.imageData}`
                  : "/images/placeholder.png"
              }
              className="card-img-top"
              alt={product.productName}
            />

            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{product.productName}</h5>
              <p className="card-text">R{product.price}</p>

              <div className="mt-auto d-flex justify-content-between">
                
               

                {/* Remove Button */}
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleRemove(product.productId)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No active listings.</p>
      )}
    </div>
  </div>
</div>

  


         
          <div className="col-md-4">
            <div className="border rounded shadow-sm p-4" style={{ backgroundColor: "#e9f7ef", minHeight: "500px" }}>
              <h4 className="text-success">Sold Items</h4>
              <span className="badge bg-success">{student?.soldProducts?.length || 0} items</span>
              <div className="overflow-auto mt-3" style={{ maxHeight: "420px" }}>
                {student?.soldProducts?.length > 0 ? (
                  student.soldProducts.map(item => (
                    <div key={item.id} className="card mb-3 shadow-sm">
                      <img src={item.image || ""} className="card-img-top" alt={item.name} />
                      <div className="card-body">
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text">Sold for: R{item.price}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No sold items.</p>
                )}
              </div>
            </div>
          </div>


         
          <div className="col-md-4">
            <div className="border rounded shadow-sm p-4" style={{ backgroundColor: "#fff3cd", minHeight: "500px" }}>
              <h4 className="text-warning">Past Purchases</h4>
              <span className="badge bg-warning text-dark">{student?.purchases?.length || 0} items</span>
              <div className="overflow-auto mt-3" style={{ maxHeight: "420px" }}>
                {student?.purchases?.length > 0 ? (
                  student.purchases.map(purchase => (
                    <div key={purchase.id} className="card mb-3 shadow-sm">
                      <img src={purchase.image || ""} className="card-img-top" alt={purchase.name} />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{purchase.name}</h5>
                        <p className="card-text">From: {purchase.sellerName}</p>
                        <p className="card-text">Price: R{purchase.price}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No past purchases.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
 <Footer />
      
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Edit Profile</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Residence</Form.Label>
              <Form.Select name="residenceName" value={formData.residenceName} onChange={handleResidenceChange} required>
                <option value="">Select Residence</option>
                {Object.keys(residenceAddresses).map(res => <option key={res} value={res}>{res}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>Room Number</Form.Label><Form.Control type="text" name="roomNumber" value={formData.roomNumber} onChange={handleInputChange} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Floor Number</Form.Label><Form.Control type="number" name="floorNumber" value={formData.floorNumber} onChange={handleInputChange} /></Form.Group>
          </Form>
          <div className="p-3 mb-4 border rounded mt-4" style={{ backgroundColor: '#f8f9fa' }}>
                        <h5 className="mb-3">Update Profile Picture</h5>
                        <div className="d-flex align-items-center">
                            {/* Current or Preview Image Display */}
                            <Image 
                                src={imagePreviewUrl || getProfileImageUrl()} 
                                roundedCircle 
                                style={{ width: '60px', height: '60px', objectFit: 'cover', border: '1px solid #ccc' }}
                            
                                className="me-3"
                                onError={(e) => {
                                    e.target.src = "/images/default-avatar.png";
                                }}
                            />
                            
                            {/* File Input and Upload Button */}
                            <div className="flex-grow-1">
                                <Form.Group controlId="profileImageInput" className="mb-2">
                                    <Form.Control 
                                        type="file" 
                                        onChange={handleFileChange} 
                                        accept="image/*" 
                                        size="sm"
                                    />
                                </Form.Group>
                                <small className="d-block text-muted">
                                    {selectedImageFile
                                    ? `Selected: ${selectedImageFile.name}`
                                    : 'Choose an image to upload.'}
                                </small>
                            </div>
                        </div>
                    </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Profile;
