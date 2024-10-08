import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import logo from '../../../assets/logoCadastro.svg';
import Swal from 'sweetalert2'
import './cadastro.css';
import Loading from "../../../components/loading/loading";

// import de icones
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (values.nome.length < 3) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "O nome deve ter pelo menos 3 caracteres!",
            });
            return;
        }

        if (!isValidEmail(values.email)) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "O email deve ter um formato válido!",
            });
            return;
        }

        if (values.senha.length < 8) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "A senha deve ter pelo menos 8 caracteres!",
            });
            return;
        }

        axios.post('http://localhost:6969/cadastro', { ...values, role: 'cliente' })
            .then(res => {
                console.log(res.data);
                if (res.data.Status === "Sucesso!") {
                    navigate('/login');
                } else if (res.data.Error === "E-mail já cadastrado") {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "O e-mail já está cadastrado!",
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Erro ao cadastrar. Tente novamente mais tarde.",
                    });
                }
            })
            .catch(err => {
                console.log(err);
                alert("Erro ao cadastrar. Verifique o console para mais detalhes.");
            });
    }

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setValues({ ...values, senha: password });
    }

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    return (
        loading ? (
            <Loading />
        ) : (
            <div className="body-cadastro container-fluid d-flex flex-column align-items-center justify-content-start">
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
                            className="form-control rounded-start-0 rounded-3"
                            style={{ backgroundColor: '#F5F5F5', borderLeft: 'none' }}
                            onChange={(e) => {
                                setValues({ ...values, nome: e.target.value });
                                e.target.setCustomValidity('');
                            }}
                        />
                    </div>

                    <div className="mb-3 input-group">
                        <span className="input-group-text input-addon icon-container">
                            <MdAttachEmail />
                        </span>
                        <input
                            placeholder="Email"
                            name="email"
                            className="form-control rounded-start-0 rounded-3"
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
                            onChange={handlePasswordChange}
                        />

                        <button
                            type="button"
                            className="btn btn-light rounded-start-0 rounded-end-3"
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


                    <button type="submit" className="btn btn-dark w-100 rounded-4 mb-2" >Cadastre-se</button>

    

                    <div className="text-center mt-4">
                        <p>Ja tem uma conta?
                            <Link to="/login" style={{ color: '#1BAC4B', textDecoration: 'none', marginLeft: '3px' }}>
                                Faça login
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        )
    );
}

export default Cadastro;
