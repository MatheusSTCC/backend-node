const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;
const usuarioRoutes = require("./routes/usuarios");
const { connectToDatabase } = require("./config/bd");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/usuario", usuarioRoutes);

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Falha ao iniciar a aplicação:", err);
  });
