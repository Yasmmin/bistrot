import { useState, useRef } from "react";
import axios from 'axios';
import { MdAttachEmail } from "react-icons/md";
import logo from '../../../assets/logoCadastro.svg';
import './senha.css';
import CryptoJS from 'crypto-js';
import Loading from "../../../components/loading/loading";
import { useNavigate } from 'react-router-dom';
function Senha() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const otpInputs = useRef([]);

    const generateRandomCode = () => {
        return Math.floor(100000 + Math.random() * 900000);
    }

    const encryptCode = (code) => {
        const secretKey = 'secretkey';
        return CryptoJS.AES.encrypt(code.toString(), secretKey).toString();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true); 
            localStorage.setItem('userEmail', email);
            if (emailSent) {
                const enteredOtp = otp.join('');
                const storedEncryptedCode = localStorage.getItem('otp');
                const decryptedCode = CryptoJS.AES.decrypt(storedEncryptedCode, 'secretkey').toString(CryptoJS.enc.Utf8);

                if (enteredOtp === decryptedCode) {
                    navigate('/redefinir');
                } else {
                    setErrorMessage("Código incorreto. Por favor, tente novamente.");
                }
            } else {
                const code = generateRandomCode();
                const encryptedCode = encryptCode(code);
                localStorage.setItem('otp', encryptedCode);
                const response = await axios.post('http://localhost:6969/redefinir-senha', { email, code, encryptedCode });
                console.log(response.data);
                if (response.status === 200) {
                    setEmailSent(true);
                } else {
                    setErrorMessage(response.data.error || "Erro ao solicitar redefinição de senha.");
                }
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Email não encontrado! Tente outro email");
        } finally {
            setLoading(false);
        }
    }

    const handleOtpChange = (index, value) => {

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value.length === 1 && index < otpInputs.current.length - 1) {
            otpInputs.current[index + 1].focus();
        }
        if (value === '' && index > 0) {
            otpInputs.current[index - 1].focus();
        }
    }

    return (
        <div className="container-fluid d-flex flex-column align-items-center justify-content-start bg-white mx-0">

            <div className="d-flex flex-column align-items-center mb-3 mt-5">
                <img src={logo} alt="Logo de cadastro" className="img-fluid no-select mb-3 mt-5" />
                <h3 className="text-center">Recuperação de Senha</h3>
                {emailSent ? (
                    <p>Insira o código de verificação enviado para o seu email</p>
                ) : (
                    <p>Insira o email para recuperar sua conta</p>
                )}
            </div>
            <form onSubmit={handleSubmit} className="w-100">
                {loading && <Loading />}
                {emailSent ? (
                    <div className="mb-3 otp-container">
                        {otp.map((digit, index) => (
                            <input
                                type="number"
                                key={index}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                className="otp-input"
                                maxLength={1}
                                ref={(input) => (otpInputs.current[index] = input)}
                            />
                        ))}
                    </div>
                ) : (

                    <div className="input-group">
                        <MdAttachEmail className="email-icon" />
                        <input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-email"
                            style={{ backgroundColor: '#F5F5F5' }}
                        />
                    </div>
                )}
                {errorMessage && (
                    <div className="text-center mt-3">
                        <p className="text-danger">{errorMessage}</p>
                    </div>
                )}
                <div className="text-center mt-3">
                    <button type="submit" className="btn btn-primary mt-3">
                        {emailSent ? "Verificar Código" : "Enviar Email"}
                    </button>
                </div>
            </form>
        </div>
    );
}
export default Senha;
