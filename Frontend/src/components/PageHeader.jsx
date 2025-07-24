import { Link } from "react-router-dom"

const PageHeader = ({ breadcrumbs = [], title, subtitle }) => {
  return (
    <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-sm shadow-lg rounded-2xl border-white/30 mb-8">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <nav className="text-sm mb-6">
          <div className="flex items-center space-x-2">
            {breadcrumbs.map((crumb, index) => (
               <span key={index}>
              {crumb.to ? (
                <Link to={crumb.to} className="hover:underline !text-[#a47148] ">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#a47148] font-medium ">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
            </span>
            ))}
          </div>
        </nav>

        {/* Header Contenido/Título */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-lg md:text-2xl font-bold text-gray-800  leading-tight">{title}</h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageHeader

