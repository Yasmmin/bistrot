import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from 'react-icons/io';
import { IoMdPricetags } from 'react-icons/io';
import { FaPen } from 'react-icons/fa';

import { MdOutlineChecklist } from 'react-icons/md';
import { FaRuler } from 'react-icons/fa';
import { GoAlert } from 'react-icons/go';
import { SlPicture } from 'react-icons/sl';

function EditarProdutos() {
    const { id } = useParams();
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [precoOriginal, setPrecoOriginal] = useState('');
    const [descricao, setDescricao] = useState('');
    const [categoria, setCategoria] = useState('');
    const [tamanho, setTamanho] = useState('');
    const [restricaoalergica, setRestricaoalergica] = useState('');
    const [foto, setFoto] = useState('');
    const [novaImagem, setNovaImagem] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:6969/edit/${id}`)
            .then(res => {
                setNome(res.data[0].nome);
                setPreco(res.data[0].preco);
                setPrecoOriginal(res.data[0].preco);
                setDescricao(res.data[0].descricao);
                setCategoria(res.data[0].categoria);
                setTamanho(res.data[0].tamanho);
                setRestricaoalergica(res.data[0].restricaoalergica);
                setFoto(res.data[0].foto);
            })
            .catch(err => console.error(err));
    }, [id]);

    const [newTamanhoOptions, setNewTamanhoOptions] = useState([]);

    useEffect(() => {
        if (categoria === 'bebida') {
            setNewTamanhoOptions([
                { value: '200ml', label: '200ml' },
                { value: '290ml', label: '290ml' },
                { value: '350ml', label: '350ml' },
                { value: '473ml', label: '473ml' },
                { value: '500ml', label: '500ml' },
                { value: '510ml', label: '510ml' },
                { value: '1L', label: '1L' },
                { value: '2L', label: '2L' },
            ]);
        } else if (categoria === 'Marmita') {
            setNewTamanhoOptions([
                { value: 'Pequena', label: 'Pequena' },
                { value: 'Média', label: 'Média' },
                { value: 'Grande', label: 'Grande' },
            ]);
        } else if (categoria === 'Porção') {
            setNewTamanhoOptions([
                { value: 'Pequena', label: 'Pequena - 100g' },
                { value: 'Média', label: 'Média - 500g' },
                { value: 'Grande', label: 'Grande - 1kg' },
            ]);
        }
    }, [categoria]);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('preco', preco);
        formData.append('descricao', descricao);
        formData.append('categoria', categoria);
        formData.append('tamanho', tamanho);
        formData.append('restricaoalergica', restricaoalergica);

        // Check if novaImagem is provided, if not, use the existing image (foto)
        if (novaImagem) {
            formData.append('novaImagem', novaImagem);
        } else {
            formData.append('foto', foto);
        }

        axios
            .put(`http://localhost:6969/edit/${id}`, formData)
            .then((res) => {
                if (res.data.atualizado) {
                    navigate('/produtos');
                } else {
                    alert('Erro ao atualizar');
                }
            });
    };

    const [precoFormatado, setPrecoFormatado] = useState('');
    const handlePrecoChange = (event) => {
        const inputPreco = event.target.value.replace(/[^\d]/g, '');
        const precoNumerico = parseFloat(inputPreco) / 100;
        const precoFormatado = precoNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL',minimumFractionDigits: 2 });

        setPreco(precoNumerico);
        setPrecoFormatado(precoFormatado);
    };

    return (
        <div className="d-flex vh-100 justify-content-center mt-5">
            <div className="w-100 bg-white rounded p-3">
                {/* Botão para voltar pra tela de produtos */}
                <div className="d-flex align-items-center mt-2 mx-5 mb-4">
                    <Link to="/produtos">
                        <button className="btn border-0">
                            <IoIosArrowBack size={32} />
                        </button>
                    </Link>
                    <h2 className="ms-2">Editar produto</h2>
                </div>

                <div className="container">
                    <form onSubmit={handleSubmit}>
                        <div className="row mx">
                            <div className="mb-2 col-sm coluna-esquerda">

                                {/* Campo nome do produto */}
                                <div className="input-group mb-4 ">
                                    <span className="input-group-text linha-lateral-icon" style={{ backgroundColor: '#ffff' }}>
                                        <FaPen className='icon-pen' />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Nome"
                                        className="form-control linha-lateral-form"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                    />
                                </div>

                                {/* Campo preço de venda do produto */}
                                <div className="input-group mb-4">
                                    <span className="input-group-text" style={{ backgroundColor: '#ffff' }}>
                                        <IoMdPricetags className='icons' />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Preço"
                                        className="form-control "
                                        value={precoFormatado || precoOriginal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        onChange={handlePrecoChange}
                                    />
                                </div>

                                {/* Campo descrição do produto */}
                                <div className="input-group mb-4">
                                    <div style={{ position: 'relative', width: '36rem' }}>
                                        <textarea
                                            type="text-area"
                                            placeholder="Descricao"
                                            className="form-control text-area"
                                            value={descricao}
                                            onChange={(e) => setDescricao(e.target.value)}
                                            maxLength={150}
                                            rows={4}
                                        />
                                        <div className="position-absolute bottom-0 end-0 text-secondary p-2" style={{ fontSize: '10px' }}>
                                            {descricao.length}/150
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="mb-2 col-sm coluna-direita">
                                {/* Campo categoria */}
                                <div className="input-group mb-4">
                                    <span className="input-group-text" style={{ backgroundColor: '#ffff' }}>
                                        <MdOutlineChecklist />
                                    </span>
                                    <select
                                        type="text"
                                        placeholder="Categoria"
                                        className="form-select "
                                        value={categoria}
                                        onChange={(e) => setCategoria(e.target.value)}
                                    >
                                        <option disabled value="">
                                            Categoria
                                        </option>
                                        <option value="bebida">Bebida</option>
                                        <option value="Marmita">Marmita</option>
                                        <option value="Porção">Porção</option>
                                    </select>
                                </div>

                                {/* Campo tamanho */}
                                <div className="input-group mb-4">
                                    <span className="input-group-text" style={{ backgroundColor: '#ffff' }}>
                                        <FaRuler />
                                    </span>
                                    <select
                                        className="form-select "
                                        value={tamanho}
                                        onChange={(e) => setTamanho(e.target.value)}
                                    >
                                        <option disabled value="">
                                            Tamanho
                                        </option>
                                        {newTamanhoOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Campo restricao alergica */}
                                <div className="input-group mb-4">
                                    <span className="input-group-text" style={{ backgroundColor: '#ffff' }}>
                                        <GoAlert />
                                    </span>
                                    <select
                                        className="form-select"
                                        value={restricaoalergica}
                                        onChange={(e) => setRestricaoalergica(e.target.value)}
                                    >
                                        <option disabled selected>
                                            restrição alérgica
                                        </option>
                                        <option value="Nenhuma">Nenhuma</option>
                                        <option value="Amendoim">Contém Amendoim</option>
                                        <option value="Gluten">Contém Glúten</option>
                                        <option value="Leite">Contém Leite</option>
                                        <option value="Ovo">Contém Ovos</option>
                                        <option value="Peixe/crustáceos">Contém Peixes/crustáceos</option>
                                        <option value="soja">Contém soja</option>
                                    </select>
                                </div>

                                {/* Campo foto */}
                                <div className="input-group mb-4 w-100">
                                    <div className="col-md-6 mb-3 w-100">
                                        <div className="input-group mb-4">
                                            <label className="input-group-text" htmlFor="inputGroupFile01">
                                                <SlPicture />
                                            </label>
                                            <input type="file" className="form-control" onChange={(e) => setNovaImagem(e.target.files[0])} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <button className="btn btn-success w-100 mb-2">Atualizar</button>
                        <Link to="/produtos">
                            <button className="btn btn-primary w-100">Descartar</button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditarProdutos;
