export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">

      <h1 className="text-3xl font-bold mb-4">
        Trade Analytics
      </h1>

      <p className="mb-6 text-gray-600">
        Analise seus trades de forma simples e objetiva
      </p>

      <a
        href="/login"
        className="bg-black text-white px-4 py-2 rounded"
      >
        Entrar
      </a>

    </div>
  )
}