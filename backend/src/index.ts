import "dotenv/config";

import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { Pool } from "pg";
import { prisma } from "./lib/prisma.js";

const app: Express = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//Registros de req HTTP do morgan
app.use(morgan("dev"));

//Cabeçalho de segurança helmet
app.use(helmet());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

//GET: Requisição para buscar contatos
app.get("/api/contatos", async (req: Request, res: Response) => {
  try {
    const result = await prisma.contato.findMany();
    res.json(result);
  } catch (error) {
    console.error("Erro ao conectar com o BD: ", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

//POST: Requisição para adicionar um novo contato
app.post("/api/contatos", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ erro: "Nome e email são obrigatórios" });
  }

  try {
    const novoContato = await prisma.contato.create({
      data: {
        name,
        email,
      },
    });
    res.status(201).json(novoContato);
  } catch (error) {
    console.error("Erro ao cadastrar contato: ", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// PUT: Requisição para atualizar um contato existente
app.put("/api/contatos/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, email } = req.body;

  try {
    const contato = await prisma.contato.findUnique({
      where: { id },
    });

    if (!contato) {
      return res.status(404).json({ error: "Contato não encontrado" });
    }

    const contatoAtualizado = await prisma.contato.update({
      where: { id },
      data: { name: name ?? contato.name, email: email ?? contato.email },
    });
    res.json(contatoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar contato: ", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

//DELETE: Requisição para deletar um contato existente
app.delete("/api/contatos/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const contato = await prisma.contato.findUnique({
      where: { id },
    });

    if (!contato) {
      return res.status(404).json({ error: "Contato não encontrado" });
    }

    await prisma.contato.delete({
      where: { id },
    });
    res.json({ message: "Contato deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar contato: ", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

app.listen(port, () => {
  console.log(`Servidor iniciado em: http://localhost:${port}`);
});
