import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom"; 

// Ícones
import { IoIosArrowBack } from 'react-icons/io';
import { CiUser } from 'react-icons/ci';
import { MdOutlineEmail } from 'react-icons/md';

// Imagem padrão
import userPadrao from '../../../../../../backend/image/users/userPadrao.svg';

// Componente de loading e sem permissão
import SemPermissao from '../../../components/permissão/semPermissao';
import Loading from '../../../components/loading/loading';

// Estilos
import './perfil.css';

function Perfil() {
  const [auth, setAuth] = useState(false);
  const { id } = useParams();
  const [foto, setFoto] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [rua, setRua] = useState('');
  const [casa, setCasa] = useState('');
  const [bairro, setBairro] = useState('');
  const [complemento, setComplemento] = useState('');
  const [editando, setEditando] = useState(false);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate("/login");
          return;
        }
  
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('http://localhost:6969/perfil');
        if (response.data.Status === 'Sucesso!') {
          const userData = response.data;
          setFoto(userData.foto ? `http://localhost:6969/users/${userData.foto}` : userPadrao);
          setNome(userData.nome);
          setEmail(userData.email);
          setTelefone(userData.telefone);
          setRua(userData.rua);
          setCasa(userData.casa);
          setBairro(userData.bairro);
          setComplemento(userData.complemento);
          setAuth(true);
        } else {
          console.error('Erro ao carregar perfil:', response.data.Error);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []); 

  useEffect(() => {
    if (imagemSelecionada) {
      setFoto(URL.createObjectURL(imagemSelecionada));
    }
  }, [imagemSelecionada]);
  
  

  const handleSave = async () => {
    const formData = new FormData();
    if (imagemSelecionada) {
      formData.append('foto', imagemSelecionada);
    }
    formData.append('id', id);
    formData.append('nome', nome);
    formData.append('email', email);
    formData.append('telefone', telefone);
    formData.append('rua', rua);
    formData.append('casa', casa);
    formData.append('bairro', bairro);
    formData.append('complemento', complemento);
  
    try {
      const response = await axios.put(`http://localhost:6969/perfil`, formData, { withCredentials: true });
      console.log('Resposta do servidor:', response.data);
      if (response.data.foto) {
        setFoto(response.data.foto);
      }
      setEditando(false);
    } catch (error) {
      console.error('Erro ao salvar dados do perfil:', error);
    }
  };
  

  const handleLogout = () => {
    if (editando) {
      setEditando(false);
    } else {
      Swal.fire({
        title: 'Você tem certeza?',
        text: 'Você será desconectado da sua conta.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#1BAC4B',
        confirmButtonText: 'Sim, desconectar-se!',
        cancelButtonText: 'Cancelar',
        position: 'center'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.get('http://localhost:6969/logout', { withCredentials: true })
            .then(() => {
              // Limpar localStorage
              localStorage.clear();

              Swal.fire(
                'Desconectado!',
                'Indo para página de Login',
                'success'
              );

              setTimeout(() => {
                window.location.href = '/login';
              }, 1000);
            })
            .catch(err => {
              console.log(err);
              Swal.fire(
                'Erro!',
                'Ocorreu um erro ao desconectar-se. Por favor, tente novamente.',
                'error'
              );
            });
        }
      });
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : auth ? (
        <div className='container-fluid ' style={{ minWidth: '400px' }}>
          <div className='d-flex flex-column text-center '>
            <div className='d-flex align-items-center mt-4'>
              <Link to='/'>
                <button className='btn border-0'>
                  <IoIosArrowBack size={32} />
                </button>
              </Link>
              <h2 className='ms-2 mb-2'>{editando ? 'Salvar perfil' : 'Editar perfil'}</h2>
            </div>

         <div className="d-flex justify-content-center align-items-center">
  <label htmlFor="fotoInput">
    <img
      className="mt-3 mb-3 img-fluid"
      src={foto || userPadrao}
      alt="Foto de perfil"
      style={{
        width: '12rem',
        height: '12rem',
        objectFit: 'cover',
        borderRadius: '50%',
        cursor: editando ? 'pointer' : 'default',
        maxWidth: '600px'
      }}
    />
  </label>
  {editando && (
    <input
      id="fotoInput"
      type="file"
      style={{ display: 'none' }}
      onChange={(e) => {
        const file = e.target.files[0];
        setImagemSelecionada(file);
      }}
    />
  )}
</div>


            <div className='mb-2 mr-2 ' style={{ minWidth: '350px' }}>
              <div className='input-group mb-3 text-center'>
                <span className='input-group-text fundo'>
                  <CiUser />
                </span>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Nome'
                  style={{ backgroundColor: '#f8f9fa', cursor: editando ? 'text' : 'default' }}
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  readOnly={!editando}
                />
              </div>
            </div>

            <div className='mb-2 mr-2' style={{ minWidth: '350px' }}>
              <div className='input-group mb-3 text-center'>
                <span className='input-group-text fundo'>
                  <MdOutlineEmail />
                </span>
                <input
                  type='text'
                  className='form-control '
                  placeholder='Email'
                  style={{ backgroundColor: '#f8f9fa' }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  readOnly={!editando}
                />
              </div>
            </div>

            <div className='mb-3 w-100'>
              <label className='fw-bold mx-1' style={{ textAlign: 'left', display: 'block' }}>Telefone</label>
              <div className='input-group text-center'>
                <span className='input-group-text fundo'>
                  <CiUser />
                </span>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Telefone'
                  style={{ backgroundColor: '#f8f9fa' }}
                  value={telefone}
                  readOnly={!editando}
                  onChange={e => setTelefone(e.target.value)}
                />
              </div>
            </div>

            <div className='mb-3 w-100'>
              <label className='fw-bold mx-1' style={{ textAlign: 'left', display: 'block' }}>Bairro</label>
              <div className='input-group mb-3 text-center'>
                <span className='input-group-text fundo'>
                  <CiUser />
                </span>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Bairro'
                  style={{ backgroundColor: '#f8f9fa' }}
                  value={bairro}
                  readOnly={!editando}
                  onChange={e => setBairro(e.target.value)}
                />
              </div>
            </div>

            <div className='mb-3 w-100'>
              <label className='fw-bold mx-1' style={{ textAlign: 'left', display: 'block' }}>Complemento</label>
              <div className='input-group mb-3 text-center'>
                <span className='input-group-text fundo'>
                  <CiUser />
                </span>
                <input
                  type='text'
                  className='form-control'
                  placeholder='casa, apt...'
                  style={{ backgroundColor: '#f8f9fa' }}
                  value={complemento}
                  readOnly={!editando}
                  onChange={e => setComplemento(e.target.value)}
                />
              </div>
            </div>

            <div className='mb-3 w-100'>
              <label className='fw-bold mx-1' style={{ textAlign: 'left', display: 'block' }}>Rua</label>
              <div className='input-group mb-3 text-center'>
                <span className='input-group-text fundo'>
                  <CiUser />
                </span>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Rua'
                  style={{ backgroundColor: '#f8f9fa' }}
                  value={rua}
                  readOnly={!editando}
                  onChange={e => setRua(e.target.value)}
                />
              </div>
            </div>

            <div className='mb-3 w-100'>
              <label className='fw-bold mx-1' style={{ textAlign: 'left', display: 'block' }}>Casa</label>
              <div className='input-group mb-3 text-center'>
                <span className='input-group-text fundo'>
                  <CiUser />
                </span>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Casa'
                  style={{ backgroundColor: '#f8f9fa' }}
                  value={casa}
                  readOnly={!editando}
                  onChange={e => setCasa(e.target.value)}
                />
              </div>
            </div>

            <div className='mb-2 text-center'>
              {editando ? (
                <button onClick={handleSave} className='btn btn-primary w-100 mb-2 mt-3' style={{ minWidth: '350px' }}>Salvar</button>
              ) : (
                <button onClick={() => setEditando(true)} className='btn btn-primary w-100 mb-2 mt-3' style={{ minWidth: '350px' }}>Editar</button>
              )}
              <button onClick={handleLogout} className='btn btn-danger w-100 mb-5' style={{ minWidth: '350px' }}>{editando ? 'Descartar' : 'Desconectar-se'}</button>
            </div>
          </div>
        </div>
      ) : (
        <SemPermissao />
      )}
    </div>
  );
}

export default Perfil;
