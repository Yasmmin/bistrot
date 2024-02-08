import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import logo from '../../../assets/logoCadastro.svg';
import Swal from 'sweetalert2'
import './senha.css'; // corrigido o nome do arquivo de estilo

// import de icones
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa6';
import { IoIosLock } from 'react-icons/io';
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { MdAttachEmail } from "react-icons/md";

function Senha() {
    const [values, setValues] = useState({
        email: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    }

    axios.post('http://localhost:6969/senha', { ...values, role: 'cliente' })
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aqui você pode adicionar a lógica para enviar os dados do formulário para a API de recuperação de senha
        console.log('Dados do formulário:', values);
    }



    return (
        <div className="container-fluid d-flex flex-column align-items-center justify-content-start bg-white mx-0">
          <div className="d-flex flex-column align-items-center mb-3 mt-5">
                <img src={logo} alt="Logo de cadastro" className="img-fluid no-select mb-3 mt-5" />
                <h3 className="text-center">Recuperação de Senha</h3>
                <p>Para recuperar suas credenciais coloque seu email no cap</p>
          </div>
            <form onSubmit={handleSubmit} className="w-100 ">
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

                <div className="text-center mt-3">
                    <button type="submit" className="btn btn-primary">Enviar</button>
                </div>

                <div className="text-center mt-3">
                <p>Voltar para tela de Login ? <Link to="/login" className="recCad">Clique aqui!</Link></p>
                </div>
            </form>
        </div>
    );
}

export default Senha;
