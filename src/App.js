import React, {useState} from 'react';
import Formulario from "./Componentes/Formulario";
import Usuarios from "./Componentes/Usuarios";
import {ContextUsers} from './Context'

function App() {

    const [usersEdit, setUsersEdit] = useState('')

    //funcion por context
    let editUsersFun = (items) => {
        setUsersEdit(items)
    }

    return (
        <ContextUsers.Provider value={{editUsersFun}}>
            <div className="container2 mt-5">
                <h2 className="text-center mb-4 text-secondary">Crud con Firebase y Reactjs</h2>
                <div className="row">
                    <div className="col">
                        <Formulario dataForEdit={usersEdit}/>
                    </div>
                    <div className="col">
                        <Usuarios/>
                    </div>
                </div>
            </div>
        </ContextUsers.Provider>
    );
}

export default App;
