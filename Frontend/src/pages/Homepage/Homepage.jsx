import ContactSection from '../Contact/contact_us';
import ProductFeatures from '../../components/ProductFeatures';
import ImageCarousel from '../../components/ImageCarousel';
import FeaturedProducts from '../../components/FeaturedProducts';

function Homepage() {

  const slides = [
  { id: 1, src: "/images/artesano1.jpg", alt: "Artesanía Típica" },
  { id: 2, src: "/images/artesano2.png", alt: "Juguete de Madera" },
  { id: 3, src: "/images/artesano3.avif", alt: "Tralalero Decorativo" },
];

  const featuredProducts = [
    {
      id: 1,
      name: "Jardinera",
      price: "$79.990",
      originalPrice: "$89.990",
      image: "/jardinera.jpg",
      rating: 4.8,
      reviews: 12,
      badge: "Oferta",
    },
    {
      id: 2,
      name: "Macetero",
      price: "$9.990",
      originalPrice: "$12.990",
      image: "/macetero.webp",
      rating: 4.5,
      reviews: 8,
      badge: "Oferta",
    },
    {
      id: 3,
      name: "Medallero",
      price: "$29.990",
      originalPrice: null,
      image: "/medallero.webp",
      rating: 3.0,
      reviews: 2,
      badge: "Nuevo",
    },
    {
      id: 4,
      name: "Escaño",
      price: "$119.990",
      image: "/escaño.webp",
      rating: 4,
      reviews: 1,
      badge: "Nuevo",

    },
  ];

  return (
    <>
      <ImageCarousel slides={slides} />

      <ProductFeatures />

      <FeaturedProducts products={featuredProducts} />

        <ContactSection />
    </>
  );
}

export default Homepage;