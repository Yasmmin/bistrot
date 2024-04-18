import { Link } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io';
import './novoEndereco.css'
import { useState } from 'react';
import axios from 'axios';

function NovoEndereco() {

    // monitora os campos
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
            console.log("Endereço salvo com sucesso:", response.data);
            // Aqui você pode redirecionar o usuário para outra página ou executar outras ações após salvar o endereço
        })
        .catch(error => {
            console.error("Erro ao salvar endereço:", error);
            // Trate o erro de acordo com sua necessidade
        });
    };

    return (
        <div className="container-fluid d-flex flex-column w-100">
            {/* Cabeçalho */}
            <div className='header d-flex align-items-center mt-4 mb-4'>
                <Link to='/finalizar'>
                    <button className='btn border-0'>
                        <IoIosArrowBack size={30} />
                    </button>
                </Link>
                <h5 className='ms-1 mb-2'>Novo endereco</h5>
            </div>

            <div className='formulario-endereco'>
                <div>
                    <label>bairro*</label>
                    <input type='text'
                        placeholder='Januária'
                        required
                        onChange={(e) => setBairro(e.target.value)}

                    />

                </div>

                <div>
                    <label>rua*</label>
                    <input type='text'
                        placeholder='Francisco Lummertz Júnior'
                        required
                        onChange={(e) => setRua(e.target.value)}
                    />
                </div>

                <div>
                    <label>Número da Residência*</label>
                    <input type='text'
                        placeholder='612'
                        required
                        onChange={(e) => setCasa(e.target.value)}
                    />
                </div>

                <div>
                    <label>Complemento</label>
                    <input type='text'
                        placeholder='apartamento 2'
                        onChange={(e) => setComplemento(e.target.value)}
                    />
                </div>
                <button className='salvar-endereco mt-2' onClick={handleSalvarEndereco}>salvar</button>
            </div>

        </div>
    )

}

export default NovoEndereco