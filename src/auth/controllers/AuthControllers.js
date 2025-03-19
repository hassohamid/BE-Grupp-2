const supabase = require("../../config/supabase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { password, email } = req.body;
  const salt = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = {
      password: hashedPassword,
      email,
    };
    const { error } = await supabase.from("users").insert(userData);
    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({ error: "Email är redan registrerat" });
      }
      return res.status(400).json({ message: "Fel vid registrering", error });
    }
    console.log("användare skapad");
    return res.status(201).json({ message: "Användare registrerad" });
  } catch (error) {
    return res.status(500).json({ error: "Server fel" });
  }
}

async function signIn(req, res) {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
    console.log(error);

    if (error) return res.status(401).json({ error: "Obehörig" });
    console.log(error);
    const validPassword = await bcrypt.compare(password, user.password);
    console.log(validPassword);
    if (!validPassword) return res.status(401).json({ error: "Obehörig" });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Inloggning lyckades",
      token,
      user: { id: user.id, email: user.email, metadata: user.metadata },
    });
  } catch (error) {
    return res.status(500).json({ error: "Server fel" });
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) return res.sendStatus(403);
    (req.user = user), next();
  });
}

async function verifyToken(req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token saknas" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, created_at, metadata")
      .eq("id", decoded.userId)
      .single();

    if (error) {
      return res.status(404).json({ error: "Användaren hittades inte" });
    }
    res.json({
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        metadata: user.metadata,
      },
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token har utgått" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Ogiltig token" });
    }
    console.error("Verifieringsfel:", error);
    res.status(500).json({ error: "Serverfel vid verifiering" });
  }
}

async function admin() {
  const { error } = await supabase
    .from("users")
    .update({
      metadata: {
        admin: true,
      },
    })
    .eq("id", 8)
    .single();
}
module.exports = { register, signIn, authenticateToken, verifyToken, admin };
