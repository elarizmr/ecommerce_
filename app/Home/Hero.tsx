export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <img
        src="./images/hero.jpg"
        alt="New Collection"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/10" />
      
    </section>
  );
}