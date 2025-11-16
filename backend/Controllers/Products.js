
import products from "../Schemas/ProductSchema.js";
import Cart from "../Schemas/Cart.js";
import fs from "fs";
import cloudinary from "../config/Cloudinary.js"

// Get all products
export async function getProduct(req, res) {
  try {
    const product = await products.find();
    res.status(200).json({
      message: "Products found",
      products: product,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}

// Add new product
export async function addProduct(req, res) {
  console.log(req.files);

  try {
    let imageUrl = [];
    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: "uploads" });
        imageUrl.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    }

    const newProduct = new products({
      productName: req.body.productName,
      productPrice: Number(req.body.productPrice),
      description: req.body.description,
      productCategory: req.body.productCategory,
      productImage: imageUrl,
      productCount: Number(req.body.productCount),
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.log("Product add error:", err);
    res.status(400).json({ error: err.message || "Failed to add product" });
  }
}

// Update product
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const existingProduct = await products.findById(id);
    // find puri collection , {id:user.
    // _}, findbyid 
    if (!existingProduct) return res.status(404).json({ message: "Product not found" });

    if (updatedData.productCount != null) {
      const totalInCarts = await Cart.aggregate([
        { $unwind: "$products" },
        { $match: { "products.item": existingProduct._id } },
        { $group: { _id: null, totalQty: { $sum: "$products.qty" } } }
        // grp  

        


      ]);
      const minCount = totalInCarts[0]?.totalQty || 0;

      if (updatedData.productCount < minCount) {
        return res.status(400).json({ 
          error: `Cannot reduce stock below ${minCount} (already in users' carts)` 
        });
      }
    }

    if (req.files && req.files.length > 0) {
      let imageUrl = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: "uploads" });
        imageUrl.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
      updatedData.productImage = imageUrl;
    }

    const updatedProduct = await products.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
}


export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const inCarts = await Cart.find({ "products.item": id });
    if (inCarts.length > 0) {
      return res.status(400).json({ error: "Cannot delete product, it's in users' carts" });
    }
 const deletedProduct = await products.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
     res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete product" });
  }
}
   


// {
//   name :"abc",
//   products:["soap", "shampoo"]
// }
// {
//   name:"abc",
//   products:"soap"
// }
// {
//   name:"abc",
//   products:"shampoo"
// }
