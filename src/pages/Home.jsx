import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            LinkOut
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Tu compañero en la búsqueda de empleo. Gestiona tus candidaturas, 
            libera el estrés y mantén el ánimo alto durante tu búsqueda de trabajo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn btn-primary text-lg px-8 py-3"
            >
              Comenzar ahora
            </Link>
            <Link
              to="/login"
              className="btn btn-secondary text-lg px-8 py-3"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Gestiona tus candidaturas</h3>
            <p className="text-gray-600">
              Mantén un registro organizado de todas tus postulaciones y su estado actual.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Libera el estrés</h3>
            <p className="text-gray-600">
              Escribe tus frustraciones y recibe apoyo emocional personalizado.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Mantén el ánimo</h3>
            <p className="text-gray-600">
              Recibe retos físicos y consejos para mantener una actitud positiva.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 