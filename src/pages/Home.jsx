import React from 'react'
import Header from "../components/Header.jsx";
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';

const Home = () => {
  return (
    <>
    <Header />
  <br />
   <div className="container my-5">
  <div className="row row-cols-2 align-items-center">
    <div className="container">
      <h1>Buy & Sell <small className="text-muted"><br />
      within your residence</small></h1>
<p className="lead" >A safe trusted marketplace for CPUT students <br />where you can get great deals or turn your unused items into cash,<br /> without having to leave your respective residence</p>

<a className="btn btn-primary btn-lg me-5" href="/Buy" role="button">Buy items</a>
<a className="btn btn-primary btn-lg" href="/Sell" role="button">Sell items</a>

</div>

<div id="carouselSlide" className="carousel slide" data-bs-ride="carousel" data-bs-interval="2000" style={{ maxWidth: "700px" }}>
 <div className="carousel-inner">
<div className="carousel-item active">
      <img src={img2} className="d-block w-100" alt="Slide 1" />
  </div>
<div className="carousel-item">
    <img src={img2} className="d-block w-100" alt="Slide 2" />
  </div>
  <div className="carousel-item">
    <img src={img3} className="d-block w-100" alt="Slide 3" />
  </div>

</div>


 </div>
 </div>
</div>





</>
  )
}

export default Home