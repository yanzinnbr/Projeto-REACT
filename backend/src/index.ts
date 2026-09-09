import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import helmet from "helmet";

const app: Express = express();
app.use(cors());
//Aceitar JSON no corpo da requisição
app.use(express.json());

const port = process.env.PORT || 3000;

//Registros de req HTTP do morgan
app.use(morgan('dev'));

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
app.get("/api/contatos", (req: Request, res: Response) => {
  res.json(contatos);
});

//POST: Requisição para adicionar um novo contato
app.post("/api/contatos", (req: Request, res: Response) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
  }

  const novoId = contatos.length > 0 ? Math.max(...contatos.map(c => c.id)) + 1 : 1

  const novoContato = {id: novoId, name, email};
  contatos.push(novoContato);

  return res.status(201).json(novoContato);

});

//PUT: Requisição para atualizar um contato existente
app.put("/api/contatos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const {name, email} = req.body;

  const index = contatos.findIndex(c => c.id === id);

  if(index === -1){
    return res.status(404).json({ erro: "Contato não encontrado"})
  }

  //contatos[index] = {
   // ...contatos[index],
    name: //name ?? contatos[index]?.name,
   // email: email ?? contatos[index]?.email
  //};

  res.json(contatos[index]);
});

app.listen(port, () => {
  console.log(`Servidor iniciado em: http://localhost:${port}`);
});
