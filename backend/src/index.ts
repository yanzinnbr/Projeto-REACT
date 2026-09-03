import express, { type Express, type Request, type Response } from 'express';

const app: Express = express();
const port = 3000;

const contatos = [
    { id: 1, nome: "Samuel", email: "samucaps@gmail.fodase"},
    { id: 2, nome: "Mauro", email: "mauro.canivete@gmail.fodase"},
    { id: 3, nome: "Marlon", email: "marloncheirasofa@gmail.fodase"}
];

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/api/contatos', (req: Request, res: Response) => {
  res.send(contatos);
});

app.listen(port, () => {
  console.log(`Servidor iniado em: http://localhost:${port}`);
});