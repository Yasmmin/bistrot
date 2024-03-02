import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { CiUser } from 'react-icons/ci';
import { MdOutlineEmail } from 'react-icons/md';
import './style.css';

function Perfil() {
  const { id } = useParams();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [rua, setRua] = useState('');
  const [casa, setCasa] = useState('');
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:6969/perfil', { withCredentials: true })
      .then(res => {
        if (res.data.Status === 'Sucesso!') {
          setNome(res.data.nome);
          setEmail(res.data.email);
          setRua(res.data.rua);
          setCasa(res.data.casa);
        } else {
          console.error('Erro ao carregar perfil:', res.data.Error);
        }
      })
      .catch(err => console.log('Erro na requisição:', err));
  }, []);

  const handleSave = () => {
    console.log('Dados a serem enviados:', { nome, email, rua, casa, id });
    axios.put(`http://localhost:6969/perfil`, { 
      id, // Adicionando o ID aqui
      nome,
      email,
      rua,
      casa
    }, { withCredentials: true })
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        console.log('Dados do perfil atualizados com sucesso:', response.data);
        // Atualize os estados com os novos valores
        setNome(response.data.nome);
        setEmail(response.data.email);
        setRua(response.data.rua);
        setCasa(response.data.casa);
        setEditando(false);
      })
      .catch(error => {
        console.error('Erro ao salvar dados do perfil:', error);
      });
  };

  const handleLogout = () => {
    axios.get('http://localhost:6969/logout', { withCredentials: true })
      .then(() => {
        window.location.href = '/login';
      })
      .catch(err => console.log(err));
  };

  return (
    <div className='container-fluid ' style={{minWidth:'400px'}}>
      <div className='d-flex flex-column text-center '>
        <div className='d-flex align-items-center mt-4 mx-1'>
          <button className='btn border-0'>
            <IoIosArrowBack size={32} />
          </button>
          <h2 className='ms-2 mb-2'>{editando ? 'Salvar perfil' : 'Editar perfil'}</h2>
        </div>

        <label className='text-start fw-bold mx-1'>Nome</label>
        <div className='mb-2 mr-2 ' style={{ minWidth: '350px' }}>
          <div className='input-group mb-4 text-center'>
            <span className='input-group-text fundo'>
              <CiUser />
            </span>
            <input
              type='text'
              className='form-control '
              placeholder='Nome'
              style={{ backgroundColor: '#f8f9fa' }}
              value={nome}
              onChange={e => setNome(e.target.value)}
              readOnly={!editando}
            />
          </div>
        </div>

        <label className='text-start fw-bold mx-1'>Email</label>
        <div className='mb-2 mr-2' style={{ minWidth: '350px' }}>
          <div className='input-group mb-4 text-center'>
            <span className='input-group-text fundo'>
              <MdOutlineEmail />
            </span>
            <input
              type='text'
              className='form-control '
              placeholder='Email'
              style={{ backgroundColor: '#f8f9fa' }}
              value={email}
              readOnly={!editando}
            />
          </div>
        </div>

        <div className='mb-3 w-100'>
          <label className='fw-bold mx-1' style={{ textAlign: 'left', display: 'block' }}>Rua</label>
          <div className='input-group mb-4 text-center'>
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

        {editando ? (
          <button onClick={handleSave} className='btn btn-primary w-100 mb-2 mt-3' style={{ minWidth: '350px' }}>Salvar</button>
        ) : (
          <button onClick={() => setEditando(true)} className='btn btn-primary w-100 mb-2 mt-3' style={{ minWidth: '350px' }}>Editar</button>
        )}

        <button onClick={handleLogout} className='btn btn-danger w-100 mb-5' style={{ minWidth: '350px' }}>Sair</button>
      </div>
    </div>
  );
}

export default Perfil;
