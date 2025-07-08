import { FaHandSparkles, FaTree, FaTools, FaPalette } from 'react-icons/fa';

const features = [
  {
    icon: <FaTree className="text-3xl mb-3 text-white" />,
    title: "Madera Local",
    description: "Utilizamos exclusivamente madera chilena de la región",
  },
  {
    icon: <FaHandSparkles className="text-3xl mb-3 text-white" />,
    title: "Hecho a Mano",
    description: "Cada pieza es única y elaborada artesanalmente",
  },
  {
    icon: <FaTools className="text-3xl mb-3 text-white" />,
    title: "Empresa Familiar",
    description: "Tradición y amor por la artesanía de generación en generación",
  },
  {
    icon: <FaPalette className="text-3xl mb-3 text-white" />,
    title: "Diseños Personalizados",
    description: "Creamos productos únicos que se adaptan a tus ideas",
  },
];

function ProductFeatures() {
  return (
    <section className="features rounded-2xl min-w-full py-16 mb-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#a47148]">¿Por Qué Elegirnos?</h2>
          <p className="text-[#a47148] text-opacity-90 max-w-2xl mx-auto">
            Nuestros valores y compromiso están presentes en cada producto que elaboramos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 bg-[#a47148] rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center mb-3">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-white text-opacity-90">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductFeatures;