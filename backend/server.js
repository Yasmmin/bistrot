// Importação de dependências do projeto

import express from "express";
import mysql from "mysql2";
import cors from 'cors';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from 'path'
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Configuração do valor de "salt" para o bcrypt
const salt = 10;

// Inicialização da aplicação Express
const app = express();

// Configuração de middleware para processar dados JSON e cookies
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "DELETE", "UPDATE", "PUT"],
    credentials: true
}));
app.use(cookieParser());

// Conexão com o banco de dados "cafebistrot"
dotenv.config();
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port:process.env.DB_PORT
});

// lidar com a recuperação de fotos cadastradas
const __filename = fileURLToPath(import.meta.url); //Obter o caminho absoluto do arquivo atual
const __dirname = path.dirname(__filename);
const imagePath = path.join(__dirname, 'image', 'produtos'); //Caminho para o diretório de imagens de produtos
app.use('/files', express.static(imagePath)); //rota para arquivos estáticos (fotos de produtos)

// Endpoint para lidar com o cadastro de usuários
app.post('/cadastro', (req, res) => {
    bcrypt.hash(req.body.senha.toString(), salt, (err, hash) => {
        if (err) {
            console.error("Erro ao criptografar a senha:", err);
            return res.json({ Error: "Erro ao criptografar a senha" });
        }

        const sql = "INSERT INTO cliente (`nome`, `email`, `senha`, `role`) VALUES (?, ?, ?, 'cliente')";
        const values = [req.body.nome, req.body.email, hash];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Erro ao inserir dados no servidor:", err);
                return res.json({ Error: "Erro ao inserir dados no servidor", details: err.message });
            }

            console.log("Dados inseridos com sucesso:", result);
            return res.json({ Status: "Sucesso!" });
        });
    });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "../backend/image/produtos")
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({ storage })

// Endpoint para lidar com o cadastro de produtos
app.post('/Produtos', upload.single('file'), (req, res) => {
    // Converta o valor formatado de volta para um número
    const precoNumerico = parseFloat(req.body.preco.replace(/[^\d]/g, '')) / 100;

    if (!req.file || !req.file.filename) {
        return res.json({ Error: "Arquivo não encontrado" })
    }

    const sql = "INSERT INTO produto (`nome`,`preco`,`descricao`,`categoria`,`tamanho`,`restricaoalergica`, `foto`) VALUES (?,?,?,?,?,?,?)";
    const values = [req.body.nome, precoNumerico, req.body.descricao, req.body.categoria, req.body.tamanho, req.body.restricaoalergica, req.file.filename];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Erro ao inserir dados no servidor:", err);
            return res.json({ Error: "Erro ao inserir dados no servidor", details: err.message });
        }

        console.log("Dados inseridos com sucesso:", result);
        return res.json({ Status: "Sucesso!" });
    })
})

app.get('/Produtos', async (req, res) => {
    const produtos = "SELECT * FROM produto";
    db.query(produtos, (err, data) => {
        if (err) {
            console.log(err);
            return res.json({ Error: "Erro ao buscar produtos", details: err.message });
        }
        return res.json(data);
    });
});

app.delete("/produtos/:id", (req, res) => {

    const produtoId = req.params.id;
    const q = " DELETE FROM produto WHERE id = ? ";

    db.query(q, [produtoId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

// edição de produtos
app.get('/edit/:id', (req, res) => {
    const sql = "SELECT * FROM  produto WHERE id = ?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: err })
        return res.json(result)
    })
})

app.put('/edit/:id', (req, res) => {
    const sql = "UPDATE produto SET `nome`= ?, `descricao`= ?,`preco`= ?,`categoria`= ?,`tamanho`= ?,`restricaoalergica`= ?,`foto`= ? WHERE id = ?";
    const id = req.params.id;
    db.query(sql, [req.body.nome, req.body.descricao,req.body.preco,req.body.categoria,req.body.tamanho,req.body.restricaoalergica,req.body.foto, id], (err, result) => {
        if (err) return res.json({ error: err });
        return res.json({ atualizado: true });
    });
});

// Middleware para verificar a autenticação do usuário e seu papel (role)
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "Você não está autenticado" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token está com falhas" });
            } else {
                req.nome = decoded.nome;
                req.role = decoded.role;
                next();
            }
        });
    }
};

// Endpoint protegido por autenticação para retornar informações do usuário autenticado
app.get('/', verifyUser, (req, res) => {
    return res.json({ Status: "Sucesso!", nome: req.nome, role: req.role });
});
app.get('/sidebar', verifyUser, (req, res) => {
    return res.json({ Status: "Sucesso!", nome: req.nome, role: req.role });
});

// Endpoint para lidar com o login de usuários
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.json({ Error: "Por favor, forneça um email e uma senha" });
    }

    const sql = "SELECT * FROM cliente WHERE email = ?";
    db.query(sql, [email], (err, data) => {
        if (err) {
            console.error("Erro no servidor ao fazer login:", err);
            return res.json({ Error: "Erro no servidor ao fazer login" });
        }

        if (data.length === 0) {
            return res.json({ Error: "Email não encontrado" });
        }

        const user = data[0];

        bcrypt.compare(senha.toString(), user.senha, (err, response) => {
            if (err) {
                console.error("Erro ao comparar senhas:", err);
                return res.json({ Error: "Erro ao comparar senhas" });
            }

            if (response) {
                const { nome, role } = user;
                const token = jwt.sign({ nome, role }, "jwt-secret-key", { expiresIn: '1d' });
                res.cookie('token', token);
                return res.json({ Status: "Sucesso!", role });
            } else {
                return res.json({ Error: "Senha incorreta" });
            }
        });
    });
});

// Endpoint para realizar o logout do usuário
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Sucesso!" })
});

// Inicialização do servidor na porta 8081
app.listen(6969, () => {
    console.log("Rodando na porta 6969")
});
