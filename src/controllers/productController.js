import Product from "../config/models/Products.js"

export const createProduct = async (req, res) => {
  try {
    let product = await Product.create(req.body);

    // Populate before sending back
    product = await Product.findById(product._id)
      .populate('category')
      .populate('seller', 'name avatar location address');

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { category, seller } = req.query;
    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    if (seller) {
      query.seller = seller;
    }
    const products = await Product.find(query)
      .populate('category')
      .populate('seller', 'name avatar location address');
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Busca el producto por ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne(); // elimina el producto

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Direct update without ownership check (as requested)
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true })
      .populate('category')
      .populate('seller', 'name avatar location address');

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate({
        path: "seller",
        select: "name phone avatar location address" // Include location and address
      });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
