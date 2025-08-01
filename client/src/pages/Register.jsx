import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/register.css";
import axios from "axios";
import toast from "react-hot-toast";

// Set axios base URL
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Register() {
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confpassword: "",
  });

  const navigate = useNavigate();

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  // const onUpload = async (element) => {
  //   setLoading(true);

  //   if (element.type === "image/jpeg" || element.type === "image/png") {
  //     const data = new FormData();
  //     data.append("file", element);
  //     data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
  //     data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);

  //     fetch(process.env.REACT_APP_CLOUDINARY_BASE_URL, {
  //       method: "POST",
  //       body: data,
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data.url) {
  //           setFile(data.url.toString());
  //         } else {
  //           toast.error("Image upload failed");
  //           console.error("Cloudinary upload error:", data);
  //         }
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         console.error("Upload error:", err);
  //         toast.error("Upload failed");
  //         setLoading(false);
  //       });
  //   } else {
  //     setLoading(false);
  //     toast.error("Please select a jpeg or png image");
  //   }
  // };


  const onUpload = async (element) => {
    setLoading(true);

    if (element && (element.type === "image/jpeg" || element.type === "image/png")) {
      const data = new FormData();
      data.append("file", element);
      data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);

      console.log("Uploading with preset:", process.env.REACT_APP_CLOUDINARY_PRESET);
      console.log("Sending file:", element);
      console.log("Cloudinary URL:", process.env.REACT_APP_CLOUDINARY_BASE_URL);

      fetch(process.env.REACT_APP_CLOUDINARY_BASE_URL, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.url) {
            setFile(data.url.toString());
          } else {
            console.error("Cloudinary upload error:", data); // shows full response
            toast.error(`Image upload failed: ${data?.error?.message || "Unknown error"}`);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Upload failed:", err);
          toast.error("Upload failed");
          setLoading(false);
        });
    } else {
      setLoading(false);
      toast.error("Please select a JPEG or PNG image");
    }
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    if (loading) return toast("Image is still uploading...");
    if (!file) return toast.error("Please upload a profile picture");

    const { firstname, lastname, email, password, confpassword } = formDetails;

    if (!firstname || !lastname || !email || !password || !confpassword) {
      return toast.error("Input fields should not be empty");
    } else if (firstname.length < 3) {
      return toast.error("First name must be at least 3 characters long");
    } else if (lastname.length < 3) {
      return toast.error("Last name must be at least 3 characters long");
    } else if (password.length < 5) {
      return toast.error("Password must be at least 5 characters long");
    } else if (password !== confpassword) {
      return toast.error("Passwords do not match");
    }

    try {
      await toast.promise(
        axios.post("/user/register", {
          firstname,
          lastname,
          email,
          password,
          pic: file,
        }),
        {
          loading: "Registering user...",
          success: "User registered successfully",
          error: "Unable to register user",
        }
      );
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <section className="register-section flex-center">
      <div className="register-container flex-center">
        <h2 className="form-heading">Sign Up</h2>
        <form onSubmit={formSubmit} className="register-form">
          <input
            type="text"
            name="firstname"
            className="form-input"
            placeholder="Enter your first name"
            value={formDetails.firstname}
            onChange={inputChange}
          />
          <input
            type="text"
            name="lastname"
            className="form-input"
            placeholder="Enter your last name"
            value={formDetails.lastname}
            onChange={inputChange}
          />
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
            value={formDetails.email}
            onChange={inputChange}
          />
          <input
            type="file"
            name="profile-pic"
            className="form-input"
            onChange={(e) => onUpload(e.target.files[0])}
          />
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Enter your password"
            value={formDetails.password}
            onChange={inputChange}
          />
          <input
            type="password"
            name="confpassword"
            className="form-input"
            placeholder="Confirm your password"
            value={formDetails.confpassword}
            onChange={inputChange}
          />
          <button
            type="submit"
            className="btn form-btn"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Sign Up"}
          </button>
        </form>
        <p>
          Already a user?{" "}
          <NavLink className="login-link" to="/login">
            Log in
          </NavLink>
        </p>
      </div>
    </section>
  );
}

export default Register;
