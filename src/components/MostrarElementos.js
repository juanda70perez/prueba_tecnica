import React,{useEffect,useState} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import { show_alerta } from '../funciones/funciones';
const MostrarElementos = () => {
    const url='https://localhost:7268/api/elementos';
    const [elementos,setElementos] = useState([]);
    const [id,setId] = useState('');
    const [nombre,setNombre] =  useState('');
    const [peso,setPeso] = useState('');
    const [calorias,setCalorias] = useState('');
    const [operacion,setOperacion] = useState(1);
    const [titulo,setTitulo] = useState('');
    useEffect(() =>{
        getElementos();
    },[]);
    
    const getElementos = async () => {
        await axios.get(url,).then((response) => {
            setElementos(response.data);
        })
        .catch((error) => {
            // Error
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                // console.log(error.response.data);
                // console.log(error.response.status);
                // console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the 
                // browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
        
    }
    const openModal = (op,id, nombre, peso, calorias) =>{
        setId('');
        setNombre('');
        setPeso('');
        setCalorias('');
        setOperacion(op);
        if(op === 1){
            setTitulo('Registrar Producto');
        }
        else if(op === 2){
            setTitulo('Editar Producto');
            setId(id);
            setNombre(nombre);
            setPeso(peso);
            setCalorias(calorias);
        }
        window.setTimeout(function(){
            document.getElementById('nombre').focus();
        },500);
    }
    const validar = () => {
        var parametros;
        var metodo;
        if(nombre.trim() === ''){
            show_alerta('Escribe el nombre del elemento','warning');
        }
        else if(peso === ''){
            show_alerta('Escribe el peso del elemento','warning');
        }
        else if(calorias === ''){
            show_alerta('Escribe las calorias del elemento','warning');
        }
        else{
            if(operacion === 1){
                parametros= {nombre:nombre,peso:parseInt(peso),calorias:parseInt(calorias)};
                metodo= 'POST';
            }
            else{
                parametros={id:id,Nombre:nombre,peso: parseInt(peso),calorias:parseInt(calorias)};
                metodo= 'PUT';
            }
            envarSolicitud(metodo,parametros);
        }
    }
    const envarSolicitud = async(metodo,parametros) => {
        console.log(JSON.stringify(parametros));
        await axios({ method:metodo, url: url, data:JSON.stringify(parametros), headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }}).then(function(){
                document.getElementById('btnCerrar').click();
                getElementos();   
        })
        .catch(function(error){
            show_alerta('Error en la solicitud','error');
            console.log(error);
        });
    }
    const deleteProduct= (id,name) =>{
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title:'¿Seguro de eliminar el elemento '+name+' ?',
            icon: 'question',text:'No se podrá dar marcha atrás',
            showCancelButton:true,confirmButtonText:'Si, eliminar',cancelButtonText:'Cancelar'
        }).then((result) =>{
            if(result.isConfirmed){
                setId(id);
                var parametros={id: parseInt(id), nombre:'',peso:0,calorias:0};
                envarSolicitud('DELETE',parametros);
            }
            else{
                show_alerta('El elemento NO fue eliminado','info');
            }
        });
    }


    /*
    const getElementos = () => {
        fetch(url,{
            mode: 'no-cors'
        })
         .then((response) => response.json())
         .then((data) => {
            console.log(data);
            setElementos(data);
         })
         .catch((err) => {
            console.log(err.message);
         });
    };*/
    

  return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className='col-md-4 offset-4'>
                    <div className='d-grid mx-auto'>
                        <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalElementos'>
                            <i className='fa-solid fa-circle-plus'></i> Añadir
                        </button>
                    </div>
                </div>
            </div>
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
                            {elementos.map((elemento,i) =>(
                                <tr key={elemento.id}>
                                <td>{i+1}</td>
                                <td>{elemento.nombre}</td>
                                <td>{elemento.peso}</td>
                                <td>{elemento.calorias}</td>
                                <td>
                                    <button onClick={() => openModal(2,elemento.id,elemento.nombre,elemento.peso,elemento.calorias)}
                                     className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalElementos'>
                                        <i className='fa-solid fa-edit'></i>
                                    </button>
                                    &nbsp;
                                    <button onClick={() => deleteProduct(elemento.id,elemento.nombre)}
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
                            onChange={(e)=> setNombre(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>
                            <i className='fa-solid fa-gift'></i>
                            </span>
                            <input type='text' id='peso' className='form-control' placeholder='Peso' value={peso}
                            onChange={(e)=> setPeso(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>
                            <i className='fa-solid fa-gift'></i>
                            </span>
                            <input type='text' id='calorias' className='form-control' placeholder='Calorias' value={calorias}
                            onChange={(e)=> setCalorias(e.target.value)}></input>
                        </div>
                        <div className='d-grid col-6 mx-auto'>
                            <button onClick={() => validar()} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i> Guardar
                            </button>
                        </div>
                    </div> 
                    <div className='modal-footer'>
                        <button id='btnCerrar' type= 'button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                    </div>
                 </div>
            </div>
        </div>
    </div>
  )
}

export default MostrarElementos