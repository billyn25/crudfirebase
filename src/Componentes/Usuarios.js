import React, {useEffect, useState, useContext} from 'react';
import firebase from '../Firebase.js'
import {ContextUsers} from '../Context'
import '../main.css'

function Usuarios() {

    let {editUsersFun} = useContext(ContextUsers)
    const [users, setUsers] = useState('')

    useEffect(() => {
            const itemsRef = firebase.database().ref('users');
            itemsRef.on('value', (snapshot) => {
                let items = snapshot.val();
                let newState = [];
                for (let item in items) {
                    newState.push({
                        id: item,
                        nombre: items[item].nombre,
                        apellidos: items[item].apellidos,
                        username: items[item].user,
                        email: items[item].email,
                        telefono: items[item].telefono,
                        pass: items[item].password,
                    });
                }
                setUsers(newState)
            });
        },
        [],
    );

    let borrarUser = (e) => {
        const itemRef = firebase.database().ref(`/users/${e}`);
        itemRef.remove();
    }

    let editarUser = (id, nombre, apellidos, email, username, phone, pass) => {

        const items = {
            id: id,
            nombre: nombre,
            apellidos: apellidos,
            mail: email,
            user: username,
            telefono: phone,
            password: pass,
        }
        editUsersFun(items)
    }

    return (
        <React.Fragment>
            <h3 className="text-center btn-dark p-2">Usuarios</h3>
            <div className="list-group pt-3">
                {Object.keys(users).length > 0 ?
                    Object.keys(users).map((item, index) => {
                        return (
                            <a key={users[index]} href="#"
                               className="list-group-item list-group-item-action rounded border-secondary mb-2">
                                <div className="d-flex flex-wrap">
                                    <p><span className="text-danger">id:</span> {users[item].id}</p>
                                    <p><span className="text-danger">nombre:</span> {users[item].nombre}</p>
                                    <p><span className="text-danger">apellidos:</span> {users[item].apellidos}</p>
                                    <p><span className="text-danger">username:</span> {users[item].username}</p>
                                    <p><span className="text-danger">em@il:</span> {users[item].email}</p>
                                    <p><span className="text-danger">teléfono:</span> {users[item].telefono}</p>
                                </div>
                                <button type="button" className="btn btn-warning mr-3"
                                        onClick={() => editarUser(users[item].id, users[item].nombre, users[item].apellidos, users[item].email, users[item].username, users[item].telefono, users[item].pass)}>Editar
                                </button>
                                <button type="button" className="btn btn-danger"
                                        onClick={() => borrarUser(users[item].id)}>Borrar
                                </button>
                            </a>
                        )
                    }) : <p className="text-center">No hay usuarios registrados</p>}
            </div>
        </React.Fragment>
    );
}

export default Usuarios;
