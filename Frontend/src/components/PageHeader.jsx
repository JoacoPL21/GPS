
import { Link } from "react-router-dom"

const PageHeader = ({ breadcrumbs = [], title, subtitle }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-4">
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {crumb.to ? (
                <Link to={crumb.to} className="hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#a47148] font-medium ">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
            </span>
          ))}
        </nav>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{title}</h1>
            <p className="text-gray-600">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageHeader
