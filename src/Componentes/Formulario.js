import React, {useState, useEffect} from 'react';
import firebase from '../Firebase'
import Swal from 'sweetalert2'

function Formulario({dataForEdit}) {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [pass, setPass] = useState('');
    const [phone, setPhone] = useState('')
    const [botonForm, setBotonForm] = useState("Registro")
    const [editar, setEditar] = useState(0)
    const [emailCheck, setEmailCheck] = useState(0)
    const [passCheck, setPassCheck] = useState(0)
    const [errors, setErrors] = useState(0)

    const {id, nombre, apellidos, mail, user, telefono, password} = dataForEdit

    //crear objeto para subir a firebase
    const items = {
        nombre: firstName,
        apellidos: lastName,
        email: email,
        user: username,
        password: pass,
        telefono: phone
    }

    useEffect(() => {

            //only if edit data for context
            if (dataForEdit) {
                setErrors('')
                setEditar(1)
                setFirstName(nombre)
                setLastName(apellidos)
                setEmail(mail)
                setUsername(user)
                setPhone(telefono)
                setPass(password)
                setBotonForm("Actualizar")
                checkEmail(mail)
                checkPass(password)
            }
        },
        [dataForEdit],
    );
    //funcion para añadir o editar users en firebase
    let submitData = (e) => {
        e.preventDefault();
        setErrors('')

        if ((editar && email !== mail) || !editar) {
            //check if email exist
            let rootRef = firebase.database().ref();
            rootRef
                .child('users')
                .orderByChild('email')
                .equalTo(email)
                .once('value')
                .then(snapshot => {
                    if (snapshot.exists()) {
                        console.log('email existe');
                        setErrors('El email ya existe')
                    } else {
                        console.log('email no se encuentra');
                        if (passCheck === "is-valid" && emailCheck === "is-valid") {

                            if (editar) {
                                const ref = firebase.database().ref(`/users/${id}`);
                                ref.update(items);
                                Swal.fire(
                                    'Mensaje',
                                    'Actualizado correctamente',
                                    'success'
                                )
                            } else {
                                const ref = firebase.database().ref('users');
                                ref.push(items);
                                Swal.fire(
                                    'Mensaje',
                                    'Gracias por tu registro',
                                    'success'
                                )
                            }
                            cancelEdit()
                        }
                    }
                });
        } else {

            if (passCheck === "is-valid" && emailCheck === "is-valid") {

                if (editar) {
                    const ref = firebase.database().ref(`/users/${id}`);
                    ref.update(items);
                    Swal.fire(
                        'Mensaje',
                        'Actualizado correctamente',
                        'success'
                    )
                } else {
                    const ref = firebase.database().ref('users');
                    ref.push(items);
                    Swal.fire(
                        'Mensaje',
                        'Gracias por tu registro',
                        'success'
                    )
                }
                cancelEdit()
            }
        }
    }

    let checkEmail = (e) => {

        let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (regexEmail.test(e)) {
            setEmailCheck("is-valid")
        } else {
            setEmailCheck("is-invalid")
        }
    }

    let checkPass = (e) => {

        let regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

        if (regexPass.test(e)) {
            setPassCheck("is-valid")
        } else {
            setPassCheck("is-invalid")
        }
    }

    let cancelEdit = () => {

        //resetear form y estado
        setEditar(0)
        setBotonForm("Registro")
        setFirstName('')
        setLastName('')
        setEmail('')
        setUsername('')
        setPass('')
        setPhone('')
        setPassCheck('')
        setEmailCheck('')
        setErrors('')
    }

    return (
        <React.Fragment>
            <h3 className="mb-4 text-center btn-dark p-2">Registro</h3>
            <form className="text-center border-secondary rounded p-4" onSubmit={submitData}>
                <div className="form-row mb-4">
                    <div className="col">
                        <input type="text" id="FirstName" class="form-control" placeholder="Nombre"
                               value={firstName}
                               onChange={e => setFirstName(e.target.value)} required/>
                    </div>
                    <div className="col">
                        <input type="text" id="LastName" class="form-control" placeholder="Apellidos" value={lastName}
                               onChange={e => setLastName(e.target.value)} required/>
                    </div>
                </div>
                <input type="email" id="Email" className={`form-control ${emailCheck}`} placeholder="Em@il"
                       value={email}
                       onChange={e => setEmail(e.target.value)} onKeyUp={(e) => checkEmail(e.target.value)} required/>
                <div className={errors ? "text-danger bolder mt-1" : "d-none"}><strong>{errors}</strong></div>
                <input type="text" id="Username" className="form-control mb-4 mt-4" placeholder="Username"
                       value={username}
                       onChange={e => setUsername(e.target.value)} required/>
                <input type="password" id="Password" className={`form-control ${passCheck}`} placeholder="Password"
                       aria-describedby="defaultRegisterFormPasswordHelpBlock" value={pass}
                       onChange={e => setPass(e.target.value)} onKeyUp={(e) => checkPass(e.target.value)} required/>
                <small id="defaultRegisterFormPasswordHelpBlock" className="form-text text-muted mb-4">
                    Al menos 8 caracteres, 1 mayuscula y 1 dígito
                </small>
                <input type="text" id="defaultRegisterPhonePassword" className="form-control" placeholder="Teléfono"
                       aria-describedby="defaultRegisterFormPhoneHelpBlock" value={phone}
                       onChange={e => setPhone(e.target.value)}/>
                <small id="defaultRegisterFormPhoneHelpBlock" className="form-text text-muted mb-4">
                    Opcional
                </small>
                <button
                    className={editar ? "btn btn-outline-warning my-4 btn-block" : "btn btn-outline-primary my-4 btn-block"}
                    type="submit">{botonForm}</button>
                <button type="button" onClick={() => cancelEdit()}
                        className={editar ? "btn btn-outline-dark btn-block" : "btn btn-secondary btn-block d-none"}>Cancelar
                    edición
                </button>
            </form>
        </React.Fragment>
    );
}

export default Formulario;
