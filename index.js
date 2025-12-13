// Importar módulos usando ESM
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import errorMiddleware from './middlewares/error.middleware.js';

// Configurar variables de entorno
dotenv.config();

// Crear la app de Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());



// Exportar la app (si quieres importarla en server.js)



app.get("/", (req, res) => {

    res.send("Hola, api funcionando");
});

app.use(errorMiddleware);

app.use("/agro/usuarios", userRoutes);

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
