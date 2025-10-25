export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-warm-50 to-warm-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-warm-800 mb-4">404</h1>
        <p className="text-xl text-warm-600 mb-8">Página no encontrada</p>
        <a 
          href="/" 
          className="px-6 py-3 bg-warm-800 text-white rounded-lg hover:bg-warm-900 transition-colors"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  )
}
