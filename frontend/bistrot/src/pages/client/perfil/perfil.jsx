//dependencias
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

//icones
import { IoIosArrowBack } from 'react-icons/io';
import { CiUser } from 'react-icons/ci';
import { MdOutlineEmail } from 'react-icons/md';
//arquivos
import userPadrao from '../../../../../../backend/image/users/userPadrao.svg';
import SemPermissao from '../../../components/permissão/semPermissao';
import Loading from '../../../components/loading/loading';
import './perfil.css'

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

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:6969/perfil', { withCredentials: true })
      .then(res => {
        if (res.data.Status === 'Sucesso!') {
          setAuth(true);
          setFoto(res.data.foto);
          setNome(res.data.nome);
          setEmail(res.data.email);
          setTelefone(res.data.telefone);
          setRua(res.data.rua);
          setCasa(res.data.casa);
          setBairro(res.data.bairro);
          setComplemento(res.data.complemento);
          setLoading(false);
        } else {
          console.error('Erro ao carregar perfil:', res.data.Error);
          setAuth(false);
          setLoading(false);
        }
      })
      .catch(err => {
        console.log('Erro na requisição:', err);
        setLoading(false);
      });
  }, []);



  const handleSave = () => {
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

    axios.put(`http://localhost:6969/perfil`, formData, { withCredentials: true })
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        setFoto(response.data.foto);
        setEditando(false);
        //window.location.reload();
      })
      .catch(error => {
        console.error('Erro ao salvar dados do perfil:', error);
      });
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
              localStorage.removeItem('pedidoFinalizado');

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
                  src={imagemSelecionada ? URL.createObjectURL(imagemSelecionada) : (foto ? `http://localhost:6969/users/${foto}` : userPadrao)}
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

            <label className='text-start fw-bold mx-1'>Nome</label>
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

            <label className='text-start fw-bold mx-1'>Email</label>
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

            <div className='row'>
              <div className='col coluna-esquerda'>
                <div className='mb-3 w-100'>
                  <label className='fw-bold mx-1' style={{ textAlign: 'left', display: 'block' }}>Rua</label>
                  <div className='input-group mb-4 text-center'>
                    <span className='input-group-text fundo'>
                      <CiUser />
                    </span>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='Nº da casa'
                      style={{ backgroundColor: '#f8f9fa' }}
                      value={rua}
                      readOnly={!editando}
                      onChange={e => setRua(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className='col coluna-direita'>
                <div className='mb-3 w-100'>
                  <label className='fw-bold mx-1' style={{ textAlign: 'left', display: 'block' }}>Nº da casa</label>
                  <div className='input-group mb-4 text-center'>
                    <span className='input-group-text fundo'>
                      <CiUser />
                    </span>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='Nº da casa'
                      style={{ backgroundColor: '#f8f9fa' }}
                      value={casa}
                      readOnly={!editando}
                      onChange={e => setCasa(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {editando ? (
              <button onClick={handleSave} className='btn btn-primary w-100 mb-2 mt-3' style={{ minWidth: '350px' }}>Salvar</button>
            ) : (
              <button onClick={() => setEditando(true)} className='btn btn-primary w-100 mb-2 mt-3' style={{ minWidth: '350px' }}>Editar</button>
            )}

            <button onClick={handleLogout} className='btn btn-danger w-100 mb-5' style={{ minWidth: '350px' }}>{editando ? 'Descartar' : 'Desconectar-se'}</button>
          </div>
        </div>
      ) : (
        // Se não autenticado, exibe mensagens e botão de login
        <div>
          <SemPermissao />
        </div>
      )}
    </div>
  );
}

export default Perfil;
