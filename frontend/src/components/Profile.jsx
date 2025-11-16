import { useEffect, useState } from "react";
import "../stylesheets/Profile.css";
import { MdCameraEnhance } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaUser } from "react-icons/fa";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
    picture: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [lockTime, setLockTime] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
    picture: null,
  });

 
  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await fetch("http://localhost:3000/user/getProfile", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setIsLoggedIn(true);
          setLoggedInUser(data.user);
          dispatch({
            type: "user-login",
            payload: {
              id: data.user._id,
              name: data.user.firstName + " " + data.user.lastName,
              email: data.user.email,
            },
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
    checkLogin();
  }, [dispatch]);

  const validatePassword = (value) => {
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    if (!strongPassword.test(value)) {
      setPasswordError(
        " Password must include uppercase, lowercase, number & special char"
      );
    } else {
      setPasswordError("");
    }
  };

  const handleSignup = async () => {
    if (passwordError) {
      alert("Please enter a strong password before signing up!");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", form.firstName);
    formData.append("lastName", form.lastName);
    formData.append("userName", form.userName);
    formData.append("password", form.password);
    if (form.picture) {
      formData.append("picture", form.picture);
    }

    try {
      const res = await fetch("http://localhost:3000/user/signup", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();

      if (res.status === 201) {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setShowSignup(false);
          alert(data.message || "Signup successful!");
          setLoggedInUser(data.user);
          dispatch({
            type: "user-login",
            payload: {
              id: data.user._id,
              name: data.user.firstName + " " + data.user.lastName,
              email: data.user.email,
            },
          });
        }, 2000);
      } else {
        alert(data.error || data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please check your connection.");
    }
  };

  const handleLogin = async () => {
    if (lockTime && Date.now() - lockTime < 2 * 60 * 1000) {
      alert("Too many failed attempts. Please try again after 2 minutes.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userName: form.userName,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAttempts(0);
        setIsLoggedIn(true);

        if (data.isAdmin) {
          dispatch({
            type:"admin",
            payload:true 
          })
          navigate("/admin");
          return;
        }

        const profileRes = await fetch(
          "http://localhost:3000/user/getProfile",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const profileData = await profileRes.json();
        setLoggedInUser(profileData.user);

        dispatch({
          type: "user-login",
          payload: {
            id: profileData.user._id,
            name: profileData.user.firstName + " " + profileData.user.lastName,
            email: profileData.user.email,
          },
        });
      } else {
        setAttempts((prev) => prev + 1);
        if (attempts + 1 >= 3) {
          setLockTime(Date.now());
          alert("Too many failed attempts! Try again in 2 minutes.");
          return;
        }
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please check your connection.");
    }
  };



  
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/user/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setIsLoggedIn(false);
        setLoggedInUser(null);
        setForm({
          firstName: "",
          lastName: "",
          userName: "",
          password: "",
          picture: null,
        });
        setShowSignup(true);
        dispatch({
          type: "user-login",
          payload: { id: null, name: "", email: "" },
        });

         dispatch({
          type:"productAdd",
          payload:{
        isAdding:true
      }
         })
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = async () => {
    const updatedForm = new FormData();
    updatedForm.append(
      "firstName",
      editForm.firstName || loggedInUser.firstName
    );
    updatedForm.append("lastName", editForm.lastName || loggedInUser.lastName);
    updatedForm.append("userName", editForm.userName || loggedInUser.userName);
    if (editForm.password) updatedForm.append("password", editForm.password);
    if (editForm.picture) updatedForm.append("picture", editForm.picture);

    try {
      const res = await fetch("http://localhost:3000/user/updateProfile", {
        method: "PUT",
        credentials: "include",
        body: updatedForm,
      });
      const data = await res.json();

      if (res.ok) {
        alert("Profile updated successfully!");
        setLoggedInUser(data.user);
        dispatch({
          type: "user-login",
          payload: {
            id: data.user._id,
            name: data.user.firstName + " " + data.user.lastName,
            email: data.user.email,
          },
        });
        setEditMode(false);
        setEditForm({
          firstName: "",
          lastName: "",
          userName: "",
          password: "",
          picture: null,
        });
      } else {
        alert(data.message || data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-panel">
            {loading ? (
              <>
                <div className="small-muted">⏳ Creating your account...</div>
                <div className="loader">
                  <i />
                </div>
              </>
            ) : (
              <>
                {showSignup && (
                  <div className="form-block">
                    <h2>Signup</h2>
                    <div className="form-grid">
                      <input
                        className="input"
                        placeholder="First Name"
                        onChange={(e) =>
                          setForm({ ...form, firstName: e.target.value })
                        }
                      />
                      <input
                        className="input"
                        placeholder="Last Name"
                        onChange={(e) =>
                          setForm({ ...form, lastName: e.target.value })
                        }
                      />
                      <input
                        className="input"
                        placeholder="Username"
                        onChange={(e) =>
                          setForm({ ...form, userName: e.target.value })
                        }
                      />
                      <div style={{ position: "relative" }}>
                        <input
                          className="input"
                          placeholder="Password"
                          type={showPassword ? "text" : "password"}
                          onChange={(e) => {
                            setForm({ ...form, password: e.target.value });
                            validatePassword(e.target.value);
                          }}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "rgba(250,250,250,0.6)",
                          }}
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </span>
                      </div>
                      {passwordError && (
                        <p
                          style={{
                            color: "red",
                            fontSize: "12px",
                            marginTop: "4px",
                          }}
                        >
                          {passwordError}
                        </p>
                      )}
                      <div className="profile-pic">
                        <label>Profile:</label>
                        <input
                          type="file"
                          onChange={(e) =>
                            setForm({ ...form, picture: e.target.files[0] })
                          }
                        />
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={handleSignup}
                      >
                        Signup
                      </button>
                    </div>
                  </div>
                )}

                <div className="hr" />

                <div className="form-block">
                  <h2>Login</h2>
                  <div className="form-grid">
                    <input
                      className="input"
                      placeholder="Username"
                      onChange={(e) =>
                        setForm({ ...form, userName: e.target.value })
                      }
                    />
                    <div style={{ position: "relative" }}>
                      <input
                        className="input"
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          color: "rgba(250,250,250,0.6)",
                        }}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </span>
                    </div>
                    <div className="row">
                      <button className="btn btn-primary" onClick={handleLogin}>
                        Login
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ✅ PROFILE SECTION
  return (
    <div className="auth-page">
      <div className="profile-card">
        <div className="welcome-card">
          <div style={{ display: "flex", gap: "20px" }}>
            <button
              style={{ color: "white" }}
              onClick={() => navigate("/orders")}
            >
              my orders
            </button>
            <button
              style={{ color: "white" }}
              onClick={() => navigate("/cart")}
            >
              my cart
            </button>
            <button
              style={{ color: "white" }}
              onClick={() => setEditMode(true)}
            >
              edit profile
            </button>
          </div>

          <div className="picture-div">
            <FaUser />
            <img src={loggedInUser?.picture} alt="" className="picture" />
            <button className="edit-icon">
              <MdCameraEnhance />
            </button>
          </div>

          <h2>
            Welcome {loggedInUser?.firstName} {loggedInUser?.lastName}
          </h2>
          <p className="small-muted">Username: {loggedInUser?.userName}</p>

          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {editMode && (
        <div className="edit-modal">
          <div className="edit-card">
            <h2>Edit Profile</h2>
            <input
              className="input"
              placeholder="First Name"
              value={editForm.firstName || loggedInUser.firstName}
              onChange={(e) =>
                setEditForm({ ...editForm, firstName: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="Last Name"
              value={editForm.lastName || loggedInUser.lastName}
              onChange={(e) =>
                setEditForm({ ...editForm, lastName: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="Username"
              value={editForm.userName || loggedInUser.userName}
              onChange={(e) =>
                setEditForm({ ...editForm, userName: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="New Password (optional)"
              type="password"
              value={editForm.password}
              onChange={(e) =>
                setEditForm({ ...editForm, password: e.target.value })
              }
            />
            <div className="profile-pic">
              <label>Update Picture:</label>
              <input
                type="file"
                onChange={(e) =>
                  setEditForm({ ...editForm, picture: e.target.files[0] })
                }
              />
            </div>
            <div className="btn-row">
              <button className="btn btn-primary" onClick={handleUpdateProfile}>
                Save
              </button>
              <button
                className="btn"
                onClick={() => {
                  setEditMode(false);
                  setEditForm({
                    firstName: "",
                    lastName: "",
                    userName: "",
                    password: "",
                    picture: null,
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
