const express = require("express");
const app = express ();
const cors = require("cors");
require("dotenv").config();


app.use(express.json());

app.get("/", (req, res) => {

    res.send("Hola, api funcionando");
});


app.use("/agro/usuarios", usuariosRoutes);

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
