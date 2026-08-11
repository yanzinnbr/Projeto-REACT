
import Botao from "../componentes/botao";


function Home(){
    return (
     <main className="flex items-center justify-center bg-amber-400 min-h-screen">
    <div className="bg-amber-50 shadow-lg rounded-xl p-8">
      <h1 className="text-5x1 font-bold text-blue-800">Hello Word!</h1>
      <p className="mt-3">Bem vindo ao react com tailwind</p>
      <div className="flex gap-2 align-middle justify-center mt-5">
      <Botao texto="Usar" cor="bg-green-700" hover="hover:bg-zinc-400"></Botao>
      <Botao texto="Desligar" cor ="bg-red-700" hover="hover:bg-red-400"></Botao>
      </div>
    </div>
    </main>
    );
}

export default Home;