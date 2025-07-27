import { Link } from "react-router-dom"

const PageHeader = ({ breadcrumbs = [], title, subtitle, fullWidth = false }) => {
  return (
    <div className={`bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-sm shadow-lg rounded-2xl border-white/30 mb-8 ${fullWidth ? "w-full" : "max-w-7xl mx-auto"}`}>
      <div className="px-6 py-8">
        <nav className="text-sm mb-6">
          <div className="flex items-center space-x-2">
                {breadcrumbs.map((crumb, index) => (
                  <span key={index}>
                    {crumb.to ? (
                      <Link to={crumb.to} className="hover:underline !text-[#a47148]">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-[#a47148] font-medium">{crumb.label}</span>
                    )}
                    {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                  </span>
                ))}
              </div>
            </nav>

            {/* Header Contenido/Título */}
            <div className="md:flex md:items-center md:justify-between">
              <div className="mb-4 md:mb-0 md:px-0 px-0">
                <h1 className="text-lg md:text-2xl font-bold text-gray-800 leading-tight text-left">
                  {title}
                </h1>
              </div>
            </div>
          </div>
        </div>
  )
}

export default PageHeader

