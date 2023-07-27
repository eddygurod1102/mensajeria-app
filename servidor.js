const express = require('express');
const cors = require('cors');
const encryptPassword = require('encrypt-password');
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

// Obtener los mensajes de un usuario.
app.get('/id/:id/usuario/:usuario', async (request, response) => {
    conexion = abrirConexion();
    let listaConversaciones = [];

    try {
        // Obtener las conversaciones en las que el usuario participa.
        const coleccionUsuariosConversaciones = getColeccion(conexion, 'redsocial', 'usuarios_conversaciones');
        const coleccionConversacionesMensajes = getColeccion(conexion, 'redsocial', 'conversaciones_mensajes');

        const conversaciones = await coleccionUsuariosConversaciones.find({
            usuarios_fk: {
                _id: new mongodb.ObjectId(request.params.id),
                usuario: request.params.usuario,
            }
        });

        // Por cada conversación, obtener los usuarios con los que el usuario principal conversa.
        for await (let conversacion of conversaciones) {
            const usuarios = await coleccionUsuariosConversaciones.find({
                conversaciones_fk: conversacion['conversaciones_fk'],
            });

            for await (let us of usuarios) {
                // Por cada usuario que no sea el principal, obtenemos los últimos mensajes enviados a la conversación.
                if (us['usuarios_fk']['usuario'] !== request.params.usuario) {
                    const mensajes = await coleccionConversacionesMensajes.aggregate([
                        {
                            $group: {
                                _id: '$conversaciones_fk',
                                ultimoMensaje: {
                                    $last: '$mensajes_fk'
                                }
                            }
                        }
                    ]);
    
                    // Agregar un objeto con los datos de interés de la conversación:
                    // id: el id del usuario con el que el usuario principal se está comunicando.
                    // conversacion_con: el nombre del usuario con el que el usuario principal se comunica.
                    // mensaje: el último mensaje enviado a la conversación.
                    // lo_envio: el usuario que envió el último mensaje.
                    for await (let mensaje of mensajes) {
                        let objeto = {
                            id: us['usuarios_fk']['_id'],
                            conversacion_con: us['usuarios_fk']['usuario'],
                            mensaje: mensaje['ultimoMensaje']['cuerpo'],
                            lo_envio: mensaje['ultimoMensaje']['usuarios_fk']['usuario']
                        };
    
                        listaConversaciones.push(objeto);
                    }  
                }              
            }
        }

        response.send(listaConversaciones);
    } catch (error) {
        console.error(error);
    } finally {
        conexion.close();
    }
});

// Obtiene un usuario mediante un inicio de sesión.
app.post('/obtener_usuario', async (request, response) => {
    conexion = abrirConexion();

    try {
        const coleccion = getColeccion(conexion, 'redsocial', 'usuarios');
        const usuario = await coleccion.findOne({
            usuario: request.body.usuario,
            contrasena: encryptPassword(request.body.contrasena),
        });

        const respuesta = {
            id: usuario['_id'],
            nombre: usuario['nombre'],
            apellido: usuario['apellido'],
            usuario: usuario['usuario'],
        };

        response.send(respuesta);
    } catch (error) {
        console.error(error);
    } finally {
        conexion.close();
    }
});

// Agregar un usuario a la base de datos.
app.post('/', async (request, response) => {
    conexion = abrirConexion();

    try {
        const coleccion = getColeccion(conexion, 'redsocial', 'usuarios');
        const documento = await coleccion.insertOne({
            nombre: request.body.nombre,
            apellido: request.body.apellido,
            fecha_nacimiento: request.body.fechaNacimiento,
            sexo: request.body.sexo,
            numero_telefono: request.body.numeroTelefono,
            correo: request.body.correo,
            usuario: request.body.usuario,
            contrasena: encryptPassword(request.body.contrasena),
        });
    } catch (error) {
        console.error(error);
    } finally {
        conexion.close();
    }
});

// Obtener los mensajes de una conversación.
app.get('/id1/:id1/id2/:id2', async (request, response) => {
    conexion = abrirConexion();
    let listaMensajes = [];
    let objetoMensaje;
    let objetoConversacion = {
        id: '',
        mensajes: null
    };

    try {
        const conversacionesMensajes = getColeccion(conexion, 'redsocial', 'conversaciones_mensajes');
        const conversacion = await conversacionesMensajes.find({
            $or: [
                {
                    'mensajes_fk.usuarios_fk._id': new mongodb.ObjectId(request.params.id1),
                },
                {
                    'mensajes_fk.usuarios_fk._id': new mongodb.ObjectId(request.params.id2),
                }
            ]
        });

        for await (let mensaje of conversacion) {
            objetoMensaje = {
                mensaje: mensaje['mensajes_fk']['cuerpo'],
                lo_envio: mensaje['mensajes_fk']['usuarios_fk']['usuario']
            };

            objetoConversacion['id'] = mensaje['conversaciones_fk']['_id'];
            listaMensajes.push(objetoMensaje);
        }

        objetoConversacion['mensajes'] = listaMensajes;
        response.send(objetoConversacion);
    } catch (error) {
        console.error(error);
    } finally {
        conexion.close();
    }
});

// Enviar un mensaje a una conversación.
app.post('/conversacion/:id', async(request, response) => {
    conexion = abrirConexion();

    try {
        const coleccionConversacionesMensajes = getColeccion(conexion, 'redsocial', 'conversaciones_mensajes');
        const coleccionUsuarios = getColeccion(conexion, 'redsocial', 'usuarios');

        const remitente = await coleccionUsuarios.findOne({ _id: new mongodb.ObjectId(request.body.lo_envia) });

        const documento = await coleccionConversacionesMensajes.insertOne({
            conversaciones_fk: {
                _id: new mongodb.ObjectId(request.params.id),
            },
            mensajes_fk: {
                cuerpo: request.body.mensaje,
                usuarios_fk: {
                    _id: remitente['_id'],
                    usuario: remitente['usuario']
                }
            }
        });
    } catch (error) {
        console.error(error);
    } finally {
        conexion.close();
    }
});

// ------------------------------------------------------------------------------

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