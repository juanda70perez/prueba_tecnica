import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import { show_alerta } from '../funciones/funciones';
const MostrarElementos = () => {
    const urlOptima = 'https://localhost:7268/api/Optimo?';
    const [elementos,setElementos] = useState([]);
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [peso, setPeso] = useState('');
    const [calorias, setCalorias] = useState('');
    const [operacion, setOperacion] = useState(1);
    const [titulo, setTitulo] = useState('');
    const pesoMaximo = 10;
    const caloriasMinima = 15;
    const [mochila, setMochila] = useState([]);

    useEffect(() => {
       
    }, [elementos]);

    const isNumber = n => (typeof(n) === 'number' || n instanceof Number);
    const openModal = (op, id, nombre, peso, calorias) => {
        setId('');
        setNombre('');
        setPeso('');
        setCalorias('');
        setOperacion(op);
        if (op === 1) {
            setTitulo('Registrar Producto');
        }
        else if (op === 2) {
            setTitulo('Editar Producto');
            setId(id);
            setNombre(nombre);
            setPeso(peso);
            setCalorias(calorias);
        }
        window.setTimeout(function () {
            document.getElementById('nombre').focus();
        }, 500);
    }
    const validar = () => {
        var parametros;
        if (nombre.trim() === '') {
            show_alerta('Escribe el nombre del elemento', 'warning');
        }
        else if (peso === ''|| parseInt(peso) < 0  || isNaN(parseInt(peso)) ) {
            console.log(isNumber(peso) );
            show_alerta('Escribe el peso del elemento y que no sea negativo', 'warning');
        }
        else if (calorias === '' || parseInt(calorias) < 1 || isNaN(parseInt(calorias)) ) {
            show_alerta('Escribe las calorias del elemento y que no sea negativo o cero', 'warning');
        }
        else {
            if (operacion === 1) {
                let id;
                if(elementos.length !==0 ){
                     id =elementos[elementos.length-1].id  + 1;
                }
                else{
                    id = elementos.length +1 ;
                }
                parametros = { id: id, nombre: nombre, peso: parseInt(peso), calorias: parseInt(calorias) };
                setElementos(elementos => [...elementos, parametros]);
            document.getElementById('btnCerrar').click();
            }
            else {

                parametros = { id: id, nombre: nombre, peso: parseInt(peso), calorias: parseInt(calorias) };
                let newArr = [...elementos];
                newArr[id-1] = parametros;
                setElementos(newArr);
                document.getElementById('btnCerrar').click();

            }
        }
    }
    const validar2 = () => {

        if (pesoMaximo === '') {
            show_alerta('Escribe el peso máximo', 'warning');
        }
        else if (caloriasMinima === '') {
            show_alerta('Escribe las calorias mínimo', 'warning');
        }
        else {

            enviarSolicitud2(parseInt(pesoMaximo), parseInt(caloriasMinima));
        }
    }
    const enviarSolicitud2 = async (peso, calorias) => {
        console.log(urlOptima + 'PesoMaximo=' + peso + '&' + 'CaloriasMinima=' + calorias);
        await axios({
            method: 'post', url: urlOptima, data: JSON.stringify(elementos), headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            setMochila(response.data);

        })
            .catch(function (error) {
                show_alerta('Error en la solicitud', 'error');
        });
    }

    const deleteProduct = (id, name) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Seguro de eliminar el elemento ' + name + ' ?',
            icon: 'question', text: 'No se podrá dar marcha atrás',
            showCancelButton: true, confirmButtonText: 'Si, eliminar', cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setElementos(elementos.filter(item => item.id !== id));
                document.getElementById('btnCerrar').click();
        
            }
            else {
                show_alerta('El elemento NO fue eliminado', 'info');
            }
        });
    }



    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-4 '>
                        <div className='d-grid mx-auto'>
                            <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalElementos'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <div className='my-3 container-fluid text-center text-'>
                <p>Mochila con capacidad máxima: {pesoMaximo} y con calorías mínima de: {caloriasMinima}</p>
            </div>
            <div className='row mt-3'>
                <div className='col-12 col-lg-8 offseet-0 offset-lg-2'>
                    <div className='table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <tr><th>#</th><th>NOMBRE</th><th>PESO</th><th>CALORIAS</th><th></th>
                                </tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {elementos.map((elemento, i) => (
                                    <tr key={elemento.id}>
                                        <td>{i + 1}</td>
                                        <td>{elemento.nombre}</td>
                                        <td>{elemento.peso}</td>
                                        <td>{elemento.calorias}</td>
                                        <td>
                                            <button onClick={() => openModal(2, elemento.id, elemento.nombre, elemento.peso, elemento.calorias)}
                                                className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalElementos'>
                                                <i className='fa-solid fa-edit'></i>
                                            </button>
                                            &nbsp;
                                            <button onClick={() => deleteProduct(elemento.id, elemento.nombre)}
                                                className='btn btn-danger'>
                                                <i className='fa-solid fa-trash'></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div id='modalElementos' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{titulo}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id'></input>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>
                                    <i className='fa-solid fa-gift'></i>
                                </span>
                                <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>
                                    <i className='fa-solid fa-gift'></i>
                                </span>
                                <input type='text' id='peso' className='form-control' placeholder='Peso' value={peso}
                                    onChange={(e) => setPeso(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>
                                    <i className='fa-solid fa-gift'></i>
                                </span>
                                <input type='text' id='calorias' className='form-control' placeholder='Calorias' value={calorias}
                                    onChange={(e) => setCalorias(e.target.value)}></input>
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <button onClick={() => validar()} className='btn btn-success'>
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </button>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button id='btnCerrar' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalOptimo' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content dg-info'>
                        <div className='modal-header'>
                            <label className='h5'>Conjunto óptimo</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id'></input>
                            
                            <div className='d-grid col-6 mx-auto'>
                                <button onClick={() => validar2()} className='btn btn-success'>
                                    <i className='fa-solid fa-floppy-disk'></i> Calcular
                                </button>
                            </div>
                            <div>
                                <span>Peso total: {mochila.peso} Calorias totales: {mochila.calorias} con el conjunto óptimo:
                                    <div className='table-responsive'>
                                        <table className='table table-bordered'>
                                            <thead>
                                                <tr><th>#</th><th>NOMBRE</th><th>PESO</th><th>CALORIAS</th>
                                                </tr>
                                            </thead>
                                            <tbody className='table-group-divider'>
                                                {mochila.elements !== undefined &&
                                                mochila.elements.map((datos, i) => (
                                                <tr key={datos.id}>
                                                    <td>{i + 1}</td>
                                                    <td>{datos.nombre}</td>
                                                    <td>{datos.peso}</td>
                                                    <td>{datos.calorias}</td>
                                               </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                </span>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button id='btnCerrar2' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-4 offset-4 '>
                <div className='d-grid mx-auto'>
                    <button className='btn btn-info' data-bs-toggle='modal' data-bs-target='#modalOptimo'>
                        <i className='fa-solid fa-circle-plus'></i> Óptimo
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MostrarElementos