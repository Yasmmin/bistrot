import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import logoLogin from '../../../assets/LogoLogin.svg'
import Swal from 'sweetalert2'

import Loading from './../../../components/loading/loading'

import './login.css'
// Import de icones do react-icons
import { MdAttachEmail } from "react-icons/md";
import { IoIosLock } from 'react-icons/io';
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);


  const [values, setValues] = useState({
    email: '',
    senha: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validação do formato do email
    if (!isValidEmail(values.email)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "O email deve ter um formato válido!",
      });
      return;
    }

    // Validação da senha
    if (values.senha.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "A senha deve ter pelo menos 8 caracteres!",
      });
      return;
    }

    axios.post('http://localhost:6969/login', values)
      .then(res => {
        if (res.data.Status === "Sucesso!") {
          // Verifica o papel (role) do usuário e redireciona com base nele
          if (res.data.role === 'admin') {
            navigate('/produtos');
          } else {
            navigate('/');
          }
        } else {
          // Se ocorrer erro, exibe uma mensagem usando Swal
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.data.Error,
          });
        }
      })
      .catch(err => {
        console.log(err);
        // Em caso de erro, exibe uma mensagem genérica
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Erro ao fazer login. Verifique o console para mais detalhes.",
        });
      });
  }

  // Função para validar o formato do email
  const isValidEmail = (email) => {
    // Expressão regular para verificar o formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  return (
    loading ? (
      <Loading />
    ) : (
      <div className=" body container-fluid d-flex flex-column align-items-center vh-100">
        <div className="row d-flex flex-column align-items-center mb-4">
          <img src={logoLogin} alt="Logo verde login" className="img-fluid no-select mb-2" />
          <h2 className="text-center fw-bold">Vamos Fazer Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="col-sm-6 w-100 mx-4">
          {/* Campo email */}
          <div className="mb-3 input-group">
            <span className="input-group-text input-addon icon-container">
              <MdAttachEmail style={{ fontSize: '1.5em' }} />
            </span>
            <input
              placeholder="Email"
              name="email"
              className="form-control rounded-start-0 rounded-3"
              style={{ fontSize: '1em' }}
              onChange={e => setValues({ ...values, email: e.target.value })}
            />
          </div>

          {/* Campo Senha */}
          <div className="mb-3 input-group">
            <span className="input-group-text input-addon icon-container">
              <IoIosLock style={{ fontSize: '1.5em' }} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              name="senha"
              className="form-control rounded-0"
              style={{ fontSize: '1em' }}
              onChange={e => setValues({ ...values, senha: e.target.value })}
            />
            <button
              type="button"
              className="btn btn-light rounded-start-0 rounded-end-3"
              style={{
                backgroundColor: '#f5f5f5',
                border: '1px solid #e0e4e7',
                borderLeft: 'none',
                fontSize: '1em'
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <IoEyeSharp />}
            </button>
          </div>

          {/* Botão login */}
          <button type="submit" className="btn btn-success w-100 rounded-4 mb-3">Faça Login </button>

          {/* Rota/botão criar uma conta e recuperar senha*/}
          <div className="text-center mb-0">
            <p>Esqueceu seu login? <Link to="/senha" className="recCad">Recupere aqui!</Link></p>
            <p>Não tem uma conta? <Link to="/cadastro" className="recCad" >Cadastre-se</Link></p>
          </div>
        </form>
      </div>
    ));
}

export default Login;
