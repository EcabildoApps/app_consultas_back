const port = process.env.PORT || 3001;
const express = require('express');
const app = express();
//const https = require('https');
//const fs = require('fs');
const db = require('./models');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const path = require('path');
require('dotenv').config();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());

// Rutas
app.use('/api/consulta', authRoutes);

app.use((req, res, next) => {
    console.log('Received request:', req.method, req.url);
    next();
});

app.listen(port, () => {
    console.log(`Servidor HTTP corriendo en puerto: ${port} en modo ${process.env.NODE_ENV}`);
});

// Conectar con la base de datos
db.sequelize
    .sync({ force: false })
    .then(() => {
        console.log('Conexión establecida correctamente.');
    })
    .catch(err => {
        console.error('No se puede conectar a la base de datos:', err);
    });
