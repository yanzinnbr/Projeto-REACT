import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import helmet from "helmet";
import { Pool } from "pg";

const app: Express = express();
app.use(cors());
//Aceitar JSON no corpo da requisição
app.use(express.json());

const port = process.env.PORT || 3000;

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

async function testarBanco() {
  try {
    const result = await pool.query('SELECT * FROM contatos');
    console.log("Banco de dados conectado", result.rows);
  } catch (error) {
    console.error('Erro ao conectar com o BD: ', error);
  }
}

//Registros de req HTTP do morgan
app.use(morgan("dev"));

//Cabeçalho de segurança helmet
app.use(helmet());

const contatos = [
  { id: 1, name: "Mauro", email: "canivete@teste.com" },
  { id: 2, name: "Samuel", email: "samuelemauro@teste.com" },
  { id: 3, name: "Gu", email: "passeio@teste.com" },
];

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

//GET: Requisição para buscar contatos
app.get("/api/contatos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM contatos');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao conectar com o BD: ', error);
    res.status(500).json({error:"Erro interno no servidor"})
    
  }
});

//POST: Requisição para adicionar um novo contato
app.post("/api/contatos", (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ erro: "Nome e email são obrigatórios" });
  }

  const novoId = contatos.length > 0 ? Math.max(...contatos.map((c) => c.id)) + 1 : 1;

  const novoContato = {
    id: novoId,
    name,
    email,
  };
  contatos.push(novoContato);

  res.status(201).json(novoContato);
});

// PUT: Requisição para atualizar um contato existente
app.put("/api/contatos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, email } = req.body;

  const index = contatos.findIndex((c) => c.id === id);

  const contatoExistente = contatos[index];

  if (!contatoExistente) {
    return res.status(404).json({
      erro: "Contato não encontrado",
    });
  }

  const contatoAtualizado = {
    ...contatoExistente,
    name: name ?? contatoExistente.name,
    email: email ?? contatoExistente.email,
  };

  contatos[index] = contatoAtualizado;

  return res.json(contatoAtualizado);
});

//DELETE: Requisição para deletar um contato existente
app.delete("/api/contatos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = contatos.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({
      erro: "Contato não encontrado",
    });
  }

  contatos.splice(index,1);
  
  //Retorna (No Content) para indicar que a exclusão foi bem-sucedida, mas não há conteúdo para retornar
  return res.status(204).send();

});

app.listen(port, () => {
  console.log(`Servidor iniciado em: http://localhost:${port}`);
  testarBanco();
});
