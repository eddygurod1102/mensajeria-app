const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let conexion;

const app = express();
const puerto = 3000;

app.use(express.json());
app.use(cors());

app.listen(puerto, () => {
    console.log('Backend en ejecución');
});

app.get('/', async (request, response) => {
    conexion = abrirConexion();

    try {
        const coleccion = getColeccion(conexion, 'redsocial', 'usuarios');
        const usuarios = await coleccion.find();

        for await (usuario of usuarios) {
            console.log(usuario);
        }
    } catch (error) {
        console.error(error);
    } finally {
        conexion.close();
    }
});

// Abre una conexión a MongoDB.
const abrirConexion = () => {
    const url = 'mongodb://127.0.0.1:27017';
    const cliente = new MongoClient(url);

    return cliente;
};

// Establece la base de datos, para luego escoger la colección a la cuál nos queremos conectar.
const getColeccion = (conexion, nombreBd, nombreColeccion) => {
    const bd = conexion.db(nombreBd);
    const coleccion = bd.collection(nombreColeccion);

    return coleccion;
};