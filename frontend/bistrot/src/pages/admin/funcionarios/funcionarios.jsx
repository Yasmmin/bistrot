import Sidebar from '../../../components/sidebar/sidebar';
import { IoIosAddCircleOutline } from 'react-icons/io'; // Importe o ícone IoIosAddCircleOutline
import { Link } from 'react-router-dom';
// Defina a função Filter e handleAdicionarProdutoClick, caso não tenham sido definidas

function Funcionarios() {

    return (
        <div className="container-fluid d-flex">
            <Sidebar />
            <div className="d-flex flex-column w-100 ml-2">
                <div className="d-flex justify-content-between align-items-center mt-3 mx-4">
                    <form className="d-flex w-100 ">
                        {/*campo de pesquisa com icone dentro*/}
                        <div className="input-group">
                            <input
                                className="form-control flex-grow-1 mr-2 mb-3"
                                type="search"
                                placeholder="pesquisar"
                                style={{ borderRight: "none", height: '3rem' }}
                            />
                        </div>
                        {/*Botão de add*/}
                        <Link to={'/AddFuncionarios'}><button className="btn mx-1" type="submit" style={{ whiteSpace: 'nowrap', background: '#1BAC4B', color: 'white', height: '3rem' }}>
                            <IoIosAddCircleOutline size={20} /> Adicionar funcionarios
                        </button> </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Funcionarios;