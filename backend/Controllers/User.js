// import User from "../Schemas/UserSchema.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import validator from "validator";
// import cloudinary from "../config/Cloudinary.js"
// import fs from "fs";
// export async function signup(req, res) {
//   const { firstName, lastName, userName, password , Cartvalue} = req.body;

//   try {
//     if (!password) {
//       return res.status(400).json({
//         message: "Password not added",
//       });
//     }
//     if (!validator.isStrongPassword(password)) {
//       return res.status(400).json({
//         message:
//           "Password must be strong (include uppercase, lowercase, number & special char)",
//       });
//     }
//     let pictureUrl = "";
//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: "uploads",
//       });
//       pictureUrl = result.secure_url;

//       fs.unlink(req.file.path, (err) => {
//         console.log(err);
//       });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//       firstName,
//       lastName,
//       userName,
//       password: hashedPassword,
//       picture: pictureUrl,
//       Cartvalue 
//     });

//     await user.save();
//     res.status(201).json({ message: "new user added" });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// }

// // export async function login(req, res) {
// //   let { user } = req.body;
// //   try {
// //     let token = await jwt.sign({ id: user._id }, process.env.secret_key, {
// //       expiresIn: "1d",
// //     });
// //     res
// //       .cookie("token", token, {
// //         secure: false,
// //       })
// //       .json({
// //         message: "loggedin successfully ",
// //         isAdmin: false,
// //         user: {
// //           id: user._id,
// //           firstName: user.firstName,
// //           lastName: user.lastName,
// //           userName: user.userName,
// //         },
// //       });
// //   } catch (error) {
// //     res.send(error);
// //   }
// // }

// export async function login(req, res) {
//   let { user } = req.body;
//   try {
//     let token = await jwt.sign({ id: user._id }, process.env.secret_key, {
//       expiresIn: "1d",
//     });
//     res.cookie("token", token,{
//       secure:true,
//       sameSite:"none",
//     })
//       .json({
//         message: "loggedin successfully ",
//         isAdmin: false,
//         user: {
//           id: user._id,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           userName: user.userName,
//           Cartvalue:user.Cartvalue
//         },
//       });
//   } catch (error) {
//     res.send(error);
//   }
// }


// export async function getProfile(req, res) {
//   console.log("Cookies received:", req.cookies);

//   try {
//     const token = req.cookies.token;
//     console.log(token);

//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "please login first to continue" });
//     }

//     const decodedUser =  jwt.verify(token, process.env.secret_key);

//     const user = await User.findById(decodedUser.id).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({
//       user,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// }

// export async function logout(req, res) {
//   try {
//     res.clearCookie("token",{
//       secure:true,
//       sameSite:"None"
//     });

//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Something went wrong", error: error.message });
//   }
// }

// export async function updateProfile(req, res) {
//   try {
//     const token = req.cookies.token;
//     if (!token) return res.status(401).json({ message: "Please login first" });

//     const decoded = jwt.verify(token, process.env.secret_key);
//     const user = await User.findById(decoded.id);

//     if (!user) return res.status(404).json({ message: "User not found" });

//     const { firstName, lastName, userName, password } = req.body;

//     if (firstName) user.firstName = firstName;
//     if (lastName) user.lastName = lastName;
//     if (userName) user.userName = userName;

//     if (password) {
//       if (!validator.isStrongPassword(password)) {
//         return res.status(400).json({
//           message:
//             "Password must be strong (include uppercase, lowercase, number & special char)",
//         });
//       }
//       user.password = await bcrypt.hash(password, 10);
//     }

//     let pictureUrl = user.picture;
//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: "uploads",
//       });
//       pictureUrl = result.secure_url;
//       user.picture = pictureUrl;

//       fs.unlink(req.file.path, (err) => {
//         if (err) console.log(err);
//       });
//     }

//     await user.save();

//     res.status(200).json({
//       message: "Profile updated successfully",
//       user: {
//         _id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         userName: user.userName,
//         picture: user.picture,
//         Cartvalue:user.Cartvalue
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// }











import User from "../Schemas/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import cloudinary from "../config/cloudinary.js";  // ✅ FIXED
import fs from "fs";

export async function signup(req, res) {
  const { firstName, lastName, userName, password, Cartvalue } = req.body;

  try {
    if (!password) {
      return res.status(400).json({ message: "Password not added" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be strong (include uppercase, lowercase, number & special char)",
      });
    }

    let pictureUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "uploads",
      });
      pictureUrl = result.secure_url;

      fs.unlink(req.file.path, (err) => console.log(err));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      userName,
      password: hashedPassword,
      picture: pictureUrl,
      Cartvalue,
    });

    await user.save();
    res.status(201).json({ message: "new user added" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function login(req, res) {
  let { user } = req.body;
  try {
    let token = await jwt.sign({ id: user._id }, process.env.secret_key, {
      expiresIn: "1d",
    });
    res
      .cookie("token", token, {
        secure: true,
        sameSite: "none",
      })
      .json({
        message: "loggedin successfully ",
        isAdmin: false,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          Cartvalue: user.Cartvalue,
        },
      });
  } catch (error) {
    res.send(error);
  }
}

export async function getProfile(req, res) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "please login first to continue" });
    }

    const decodedUser = jwt.verify(token, process.env.secret_key);

    const user = await User.findById(decodedUser.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("token", {
      secure: true,
      sameSite: "None",
    });
    return res.json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

export async function updateProfile(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Please login first" });

    const decoded = jwt.verify(token, process.env.secret_key);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const { firstName, lastName, userName, password } = req.body;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (userName) user.userName = userName;

    if (password) {
      if (!validator.isStrongPassword(password)) {
        return res.status(400).json({
          message:
            "Password must be strong (include uppercase, lowercase, number & special char)",
        });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    let pictureUrl = user.picture;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "uploads",
      });
      pictureUrl = result.secure_url;
      user.picture = pictureUrl;

      fs.unlink(req.file.path, (err) => {
        if (err) console.log(err);
      });
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        picture: user.picture,
        Cartvalue: user.Cartvalue,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
