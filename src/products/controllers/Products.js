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
      return res
        .status(400)
        .json({ message: "Det gick inte att lägga till produkt ", error });
    }
    return res.status(200).json({ message: `` });
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

module.exports = { addProduct, getProducts, getCategories };
