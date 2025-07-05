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

  return (
    <>
      <ImageCarousel slides={slides} />

      <ProductFeatures />

      <FeaturedProducts />

        <ContactSection />
    </>
  );
}

export default Homepage;