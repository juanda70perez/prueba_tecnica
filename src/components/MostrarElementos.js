import React,{useEffect,useState} from 'react'
import axios from 'axios';
import swal from 'sweetalert2';
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
    const ob = {
        Nombre:"E12",
        peso:"13",
        calorias:"14"
    }
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
                    <div className='d-grid mx-autp'>
                        <button className='btn btn-dark' data-bs-toogle='modal' data-bs-target="#modalElementos">
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
                            {elementos.map((elemento,id) =>(
                                <tr key={elemento.id}>
                                <td>{elemento.id}</td>
                                <td>{elemento.nombre}</td>
                                <td>{elemento.peso}</td>
                                <td>{elemento.calorias}</td>
                                <td>
                                    <button className='btn btn-warning'>
                                        <i className='fa-solid fa-edit'></i>
                                    </button>
                                    &nbsp;
                                    <button className='btn btn-dabger'>
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
        <div id='modalElementos' className='Modal fade' aria-hidden='true'>
            
        </div>
    </div>
  )
}

export default MostrarElementos