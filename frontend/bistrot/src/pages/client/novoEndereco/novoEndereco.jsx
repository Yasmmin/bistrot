import { Link } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import './novoEndereco.css';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function NovoEndereco() {
    const [bairro, setBairro] = useState('');
    const [rua, setRua] = useState('');
    const [casa, setCasa] = useState('');
    const [complemento, setComplemento] = useState('');

    const handleSalvarEndereco = () => {
        const endereco = {
            bairro: bairro,
            rua: rua,
            casa: casa,
            complemento: complemento
        };
        axios.post('http://localhost:6969/endereco', endereco)
        .then(response => {
            Swal.fire({
                icon: 'success',
                title: 'Endereço Salvo!',
                text: response.data.message, // Exibe a mensagem retornada pelo servidor
                confirmButtonText: 'OK',
            });
            // Aqui você pode redirecionar o usuário para outra página ou executar outras ações após salvar o endereço
        })
        .catch(error => {
            console.error("Erro ao salvar endereço:", error);
            Swal.fire({
                icon: 'error',
                title: 'Erro ao salvar endereço',
                text: 'Ocorreu um erro ao salvar o endereço. Por favor, tente novamente.',
                confirmButtonText: 'OK',
            });
        });
    };

    return (
        <div className="container-fluid d-flex flex-column w-100">
            <div className='header d-flex align-items-center mt-4 mb-4'>
                <Link to='/finalizar'>
                    <button className='btn border-0'>
                        <IoIosArrowBack size={30} />
                    </button>
                </Link>
                <h5 className='ms-1 mb-2'>Novo endereço</h5>
            </div>

            <div className='formulario-endereco'>
                <div>
                    <label>Bairro*</label>
                    <input type='text'
                        placeholder='Januária'
                        required
                        value={bairro}
                        onChange={(e) => setBairro(e.target.value)}
                    />
                </div>

                <div>
                    <label>Rua*</label>
                    <input type='text'
                        placeholder='Francisco Lummertz Júnior'
                        required
                        value={rua}
                        onChange={(e) => setRua(e.target.value)}
                    />
                </div>

                <div>
                    <label>Número da Residência*</label>
                    <input type='text'
                        placeholder='612'
                        required
                        value={casa}
                        onChange={(e) => setCasa(e.target.value)}
                    />
                </div>

                <div>
                    <label>Complemento</label>
                    <input type='text'
                        placeholder='Apartamento 2'
                        value={complemento || ''} // Garante que o valor seja uma string, mesmo que seja undefined
                        onChange={(e) => setComplemento(e.target.value)}
                    />
                </div>
                <button className='salvar-endereco mt-2' onClick={handleSalvarEndereco}>Salvar</button>
            </div>
        </div>
    );
}

export default NovoEndereco;
