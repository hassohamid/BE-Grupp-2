const supabase = require("../../config/supabase");
async function addProduct(req, res) {
  const {
    name,
    price,
    description,
    priceUnit,
    stockQuantity,
    category,
    imageUrl,
  } = req.body;

  const userId = req.user.userId;
  console.log(userId);

  console.log(req.body);

  try {
    const productData = {
      name,
      description,
      price,
      stock_quantity: stockQuantity,
      category_id: category,
      unit: priceUnit,
      image_url: imageUrl,
    };
    const { error } = await supabase.from("products").insert(productData);
    if (error) {
      if (error.code === "23505") {
        return res
          .status(409)
          .json({ error: "En produkt med samma namn finns redan" });
      }
      return res.status(400).json({
        error: "Det gick inte att lägga till produkt",
        details: error.message,
      });
    }
    return res.status(200).json({ message: `${name} har lagts till` });
  } catch (error) {
    return res.status(500).json({ error: "Server fel" });
  }
}

async function updateProduct(req, res) {
  const {
    name,
    description,
    price,
    stock_quantity,
    category_id,
    product_id,
    unit,
    image_url,
  } = req.body;
  console.log(req.body);

  try {
    const updatedProduct = {
      category_id,
    };

    if (name !== null) updatedProduct.name = name;
    if (description !== null) updatedProduct.description = description;
    if (price !== null) updatedProduct.price = price;
    if (stock_quantity !== null) updatedProduct.stock_quantity = stock_quantity;
    if (unit !== null) updatedProduct.unit = unit;
    if (image_url !== null) updatedProduct.image_url = image_url;

    const { error } = await supabase
      .from("products")
      .update(updateProduct)
      .eq("id", product_id)
      .single();

    if (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }

    return res
      .status(200)
      .json({ message: `${name}, (${product_id}) har uppdaterats` });
  } catch (error) {
    return res.status(500).json({ error: "Server fel" });
  }
}

async function getProducts(_, res) {
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (error)
      return res
        .status(400)
        .json({ message: "Gick inte att hämta produkter ", error });
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Server fel" });
  }
}

async function getCategories(req, res) {
  try {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) {
      return res
        .status(400)
        .json({ message: "Fel vid hämtning av produktkategorier", error });
    }
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Server fel" });
  }
}

module.exports = { addProduct, updateProduct, getProducts, getCategories };
