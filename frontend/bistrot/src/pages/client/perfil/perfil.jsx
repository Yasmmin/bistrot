//---Dependências------------------------------------------------------------------------------//
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './style.css';

//---icons------------------------------------------------------------------------------//
import { IoIosArrowBack } from 'react-icons/io';
import { CiUser } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
//---tela perfil do usuário------------------------------------------------------------------------------//
function Perfil() {

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [rua, setRua] = useState("");
  const [perfil, setPerfil] = useState(false);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get("http://localhost:6969/Perfil-user")
      .then(res => {
        console.log("Resposta da requisição:", res.data);
        if (res.data.Status === "Sucesso!") {
          setPerfil(true);
          setNome(res.data.nome);
          setEmail(res.data.email);
          setRua(res.data.rua);
          
        } else {
          setPerfil(false);
        }
      })
      .catch(err => console.log("Erro na requisição:", err));
  }, []);

  // Função para realizar o logout
  const handleLogout = () => {
    axios.get("http://localhost:6969/logout")
      .then(() => {
        window.location.href = "/login";
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      {perfil ? (
        <div className='container-fluid'>
          <div className="d-flex flex-column text-center ">

            <div className="d-flex align-items-center mt-4 mx-1">
              <button className="btn border-0" >
                <IoIosArrowBack size={32} />
              </button>
              <h2 className="ms-2 mb-2">Editar perfil</h2>
            </div>

            <div className="m-3 text-center" style={{ flex: '100%', minWidth: '400px' }}>
              <img
                className="mt-3 mb-3 img-fluid"
                src={`https://s2-oglobo.glbimg.com/-0dni84YWVLwPxS6-f6_Wqkmy-4=/0x0:850x572/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2022/d/v/kFDwF0T3q2wkwvGH0DjA/whatsapp-image-2022-10-03-at-15.34.37.jpeg`}
                alt=""
                style={{
                  width: '15rem',
                  height: '15rem',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
            </div>

            {/*input de nome*/}
            <label className='text-start fw-bold mx-1'>nome</label>
            <div className="mb-2 mr-2 " style={{ minWidth: '350px' }}>
              <div className="input-group mb-4 text-center">
                <span className="input-group-text fundo">
                  <CiUser />
                </span>
                <input
                  type="text"
                  className="form-control "
                  placeholder="Nome"
                  style={{ backgroundColor: '#f8f9fa' }}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
            </div>

            {/*input de email*/}
            <label className='text-start fw-bold mx-1'>Email</label>
            <div className="mb-2 mr-2" style={{ minWidth: '350px' }}>
              <div className="input-group mb-4 text-center">
                <span className="input-group-text fundo">
                  <MdOutlineEmail />
                </span>
                <input
                  type="text"
                  className="form-control "
                  placeholder="Email"
                  style={{ backgroundColor: '#f8f9fa' }}
                  value={email}

                />
              </div>
            </div>

            {/*input bairro*/}
            <label className='text-start fw-bold mx-1'>Bairro</label>
            <div className="mb-3 mr-2 " style={{ minWidth: '350px' }}>
              <div className="input-group mb-4 text-center">
                <span className="input-group-text fundo">
                  <CiUser />
                </span>
                <input
                  type="text"
                  className="form-control "
                  placeholder="Bairro"
                  style={{ backgroundColor: '#f8f9fa' }}
                />
              </div>

              {/*input rua*/}
              <div className='row'>
                <div className='col coluna-direita'>
                  <div className="mb-3">
                    <label className='fw-bold mx-1' style={{ textAlign: 'left', display: 'block' }}>Rua</label>
                    <div className="input-group mb-4 text-center">
                      <span className="input-group-text fundo">
                        <CiUser />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Rua"
                        style={{ backgroundColor: '#f8f9fa' }}
                        value={rua}
                      />
                    </div>
                  </div>
                </div>

                {/*input nº casa*/}
                <div className='col coluna-esquerda'>
                  <div className="mb-3 w-100">
                    <label className='fw-bold mx-1' style={{ textAlign: 'left', display: 'block' }}>Nº da casa</label>
                    <div className="input-group mb-4 text-center">
                      <span className="input-group-text fundo">
                        <CiUser />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nº da casa"
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button className='btn btn-primary w-100 mb-2 mt-3' style={{ minWidth: '350px' }}>Editar</button>
            <button onClick={handleLogout} className='btn btn-danger w-100 mb-5' style={{ minWidth: '350px' }}>Sair</button>

          </div>

        </div>
      ) : (
        // se o usuario não tiver permissão para acessar mostrará uma mensagem
        <div>
          <p>Você não tem autorização para acessar essa página</p>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default Perfil;
