
import { Link } from "react-router-dom";
import img from "./../../assets/404erro.svg";

function SemPermissao() {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", textAlign:'center' }}>
            <img src={img} style={{ width: "40%" }} alt="Erro 404" />
            <h3>Você não tem permissão!</h3>
            <span className="mb-4">Você não esta logado e por isso não tem permissão para ver esta página</span>
            <Link to="/login" className="btn btn-danger">
                Faça login para ter acesso!
            </Link>

        </div>
    );
}

export default SemPermissao;
