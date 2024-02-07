import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import logo from '../../../assets/logoCadastro.svg';
import './cadastro'

// import de icones
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa6';
import { IoIosLock } from 'react-icons/io';
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { MdAttachEmail } from "react-icons/md";

function Cadastro() {
    const navigate = useNavigate();

    const [values, setValues] = useState({
        nome: '',
        email: '',
        senha: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('http://localhost:8081/cadastro', { ...values, role: 'cliente' })
            .then(res => {
                console.log(res.data); // Log the response data
                if (res.data.Status === "Sucesso!") {
                    navigate('/login');
                } else {
                    alert("Erro");
                }
            })
            .catch(err => {
                console.log(err);
                alert("Erro ao cadastrar. Verifique o console para mais detalhes.");
            });
    }

    return (
        <div className="container-fluid d-flex flex-column align-items-center justify-content-start bg-white">
            <div className="d-flex flex-column align-items-center mb-4 mt-5">
                <img src={logo} alt="Logo de cadastro" className="img-fluid no-select mb-2 mt-" />
                <h2 className="text-center">Crie uma conta</h2>
            </div>

            <form onSubmit={handleSubmit} className="w-100">
                <div className="mb-3 input-group">
                    <span className="input-group-text input-addon icon-container">
                        <FaUser />
                    </span>
                    <input
                        type="text"
                        placeholder="Nome completo"
                        name="nome"
                        className="form-control rounded-0"
                        style={{ backgroundColor: '#F5F5F5', borderLeft: 'none' }}
                        onChange={(e) => {
                            setValues({ ...values, nome: e.target.value });
                            e.target.setCustomValidity('');
                        }}
                        pattern=".{3,}"
                        required
                        title="Mínimo 3 caracteres"
                    />
                </div>

                <div className="mb-3 input-group">
                    <span className="input-group-text input-addon icon-container">
                        <MdAttachEmail />
                    </span>
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        className="form-control rounded-0"
                        style={{ backgroundColor: '#F5F5F5', borderLeft: 'none' }}
                        onChange={e => setValues({ ...values, email: e.target.value })}
                    />
                </div>

                <div className="mb-3 input-group">
                    <span className="input-group-text input-addon icon-container">
                        <IoIosLock />
                    </span>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Senha"
                        name="senha"
                        className="form-control rounded-0"
                        style={{ backgroundColor: '#F5F5F5', borderLeft: 'none' }}
                        onChange={(e) => {
                            setValues({ ...values, senha: e.target.value });
                            e.target.setCustomValidity(''); 
                        }}
                        pattern=".{8,}"
                        required
                        title="Mínimo 8 caracteres"
                    />

                    <button
                        type="button"
                        className="btn btn-light rounded-start-0 rounded-end-3" // Adicionado 'rounded-start-0' para borda quadrada à esquerda
                        style={{
                            backgroundColor: '#f5f5f5',
                            border: '1px solid #e0e4e7',
                            borderLeft: 'none',
                        }}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <IoEyeSharp />}
                    </button>
                </div>

                <div className="mb-3 form-check d-flex align-items-center justify-content-center">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label mx-2 mt-1" htmlFor="exampleCheck1">
                        Lembrar de mim
                    </label>
                </div>

                <button type="submit" className="btn btn-dark w-100 rounded-4 mb-3">Cadastre-se</button>

                <div className="text-center">
                    <p> ou continue com</p>
                </div>

                <div className="d-flex align-items-center justify-content-center">
                    <div className="border border-1 border-solid rounded-3 px-3 py-2 mr-2 icon-container">
                        <FaFacebook size={25} />
                    </div>
                    <div className="border border-1 border-solid rounded-3 mx-5 px-3 py-2 ml-2 icon-container">
                        <FcGoogle size={25} />
                    </div>
                    <div className="border border-1 border-solid rounded-3 px-3 py-2 mr-2 icon-container">
                        <FaApple size={25} />
                    </div>
                </div>

                <div className="text-center mt-4">
                    <p>Ja tem uma conta?
                        <Link to="/login" style={{ color: '#1BAC4B', textDecoration: 'none', marginLeft: '3px' }}>
                            Faça login
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default Cadastro;