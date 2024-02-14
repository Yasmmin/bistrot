import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaPen, FaPhoneAlt } from 'react-icons/fa';
import { SlPicture } from 'react-icons/sl';
import { MdEmail, MdWork } from "react-icons/md";

import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AddFuncionarios() {
    const { id } = useParams();
    const [file, setFile] = useState(null);
    const [nome, setNome] = useState("");
    const [funcao, setFuncao] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [novaImagem, setNovaImagem] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:6969/EditFuncionarios/${id}`)
            .then(res => {
                const funcionario = res.data[0];
                setNome(funcionario.nome);
                setFuncao(funcionario.funcao);
                setEmail(funcionario.email);
                setTelefone(funcionario.telefone);
                setFile(funcionario.foto);
            })
            .catch(err => console.error(err));
    }, [id]);

    const navigate = useNavigate();

    const handleEditFuncionarios = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('funcao', funcao);
        formData.append('email', email);
        formData.append('telefone', telefone);
        if (novaImagem) {
            formData.append('novaImagem', novaImagem); // Alterado de 'foto' para 'novaImagem'
        } else {
            formData.append('foto', file); // Mantido 'foto' quando não há nova imagem
        }
    
        axios
            .put(`http://localhost:6969/EditFuncionarios/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                if (res.data.atualizado) {
                    navigate('/funcionarios');
                } else {
                    console.error('Erro ao atualizar: ', res.data.error);
                    alert('Erro ao atualizar');
                }
            })
            .catch(err => {
                console.error('Erro ao atualizar: ', err);
                alert('Erro ao atualizar');
            });
    };

    const formatPhoneNumber = (input) => {
        const onlyDigits = input.replace(/\D/g, '');
        let formattedValue = '';
        if (onlyDigits.length > 0) {
            formattedValue = '(' + onlyDigits.substring(0, 2);
            if (onlyDigits.length > 2) {
                formattedValue += ') ' + onlyDigits.substring(2, 7);
                if (onlyDigits.length > 7) {
                    formattedValue += '-' + onlyDigits.substring(7, 11);
                }
            }
        }
        return formattedValue;
    };

    const handleTelefoneChange = (event) => {
        const formattedValue = formatPhoneNumber(event.target.value);
        setTelefone(formattedValue);
    };

    return (
        <div className="container-fluid d-flex">
            <div className="d-flex flex-column w-100 ml-2">
                <div className="d-flex vh-100 justify-content-center mt-5">
                    <div className="w-100 bg-white rounded p-3">
                        <div className="d-flex align-items-center mt-2 mx-5 mb-4">
                            <Link to="/funcionarios" className="btn border-0">
                                <IoIosArrowBack size={32} />
                            </Link>
                            <h2 className="ms-2">Adicionar Funcionário</h2>
                        </div>

                        <div className="container">
                            <form onSubmit={handleEditFuncionarios}>
                                <div className="row mx">
                                    <div className="mb-2 col-sm coluna-esquerda">
                                        <div className="input-group mb-4 ">
                                            <span
                                                className="input-group-text linha-lateral-icon"
                                                style={{ backgroundColor: "#ffff" }}
                                            >
                                                <FaPen className="icon-pen" />
                                            </span>
                                            <input
                                                type="text"
                                                placeholder="Nome"
                                                className="form-control linha-lateral-form"
                                                value={nome}
                                                onChange={(e) => setNome(e.target.value)}
                                            />
                                        </div>

                                        <div className="input-group mb-4 ">
                                            <span
                                                className="input-group-text linha-lateral-icon"
                                                style={{ backgroundColor: "#ffff" }}
                                            >
                                                <MdEmail />
                                            </span>
                                            <input
                                                type="text"
                                                placeholder="Email"
                                                className="form-control linha-lateral-form"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>

                                        <div className="input-group mb-4 ">
                                            <span
                                                className="input-group-text linha-lateral-icon"
                                                style={{ backgroundColor: "#ffff" }}>
                                                <FaPhoneAlt />
                                            </span>
                                            <input
                                                type="text"
                                                placeholder="Telefone"
                                                className="form-control linha-lateral-form"
                                                value={telefone}
                                                onChange={handleTelefoneChange}
                                            />
                                        </div>

                                        <div className="input-group mb-4">
                                            <span className="input-group-text" style={{ backgroundColor: '#ffff' }}>
                                                <MdWork />
                                            </span>
                                            <select
                                                type="text"
                                                placeholder="Função Desempenhada"
                                                className="form-select"
                                                value={funcao}
                                                onChange={(e) => setFuncao(e.target.value)}
                                            >
                                                <option disabled value="funcao">
                                                    Função Desempenhada
                                                </option>
                                                <option value="Gerente">Gerente</option>
                                                <option value="Recepcionista">Recepcionista</option>
                                                <option value="Garçom">Garçom</option>
                                                <option value="Cozinheiro(a)">Cozinheiro(a)</option>
                                                <option value="aux. de cozinha">aux. de cozinha</option>
                                                <option value="aux. de limpeza">aux. de limpeza</option>
                                            </select>
                                        </div>

                                    </div>

                                    <div className="mb-2 col-sm coluna-direita">
                                        <div className="input-group mb-4 w-100">
                                            <div className="col-md-6 mb-3 w-100">
                                                <div className="input-group mb-4">
                                                    <label className="input-group-text" htmlFor="inputGroupFile01">
                                                        <SlPicture />
                                                    </label>
                                                    <input type="file" className="form-control"
                                                        onChange={(e) => setNovaImagem(e.target.files[0])}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-success w-100 mb-2 mt-5">Atualizar</button>
                                <Link to="/funcionarios">
                                    <button className="btn btn-primary w-100">Descartar</button>
                                </Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddFuncionarios;
