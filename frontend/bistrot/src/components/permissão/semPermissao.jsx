import { Link } from "react-router-dom";
import img from "./../../assets/404erro.svg";
import { useEffect, useState } from "react";
import Loading from "../loading/loading";
import { IoIosArrowBack } from 'react-icons/io';

function SemPermissao() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        loading ? (
            <Loading />
        ) : (
            <div>
                <Link to='/'>
                    <button className='btn mt-4'>
                        <IoIosArrowBack size={32} />
                    </button>
                </Link>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", textAlign: 'center' }}>
                    <img src={img} style={{ width: "40%" }} alt="Erro 404" />
                    <h3>Faça login para continuar!</h3>
                    <span className="mb-5 mx-3">Você não está logado e por isso não tem permissão para ver esta página</span>
                    <Link to="/login" className="btn btn-danger mb-5">
                        Faça login agora!
                    </Link>
                </div>
            </div>
        )
    );
}

export default SemPermissao;
