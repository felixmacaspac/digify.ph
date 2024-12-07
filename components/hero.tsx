import Image from "next/image";

const Hero = () => {
  return (
    <section
      className="bg-primary w-full py-48 relative h-full border-b border-b-black overflow-hidden bg-repeat bg-cover bg-blend-luminosity"
      style={{ backgroundImage: `url('/bg-paper.svg')` }}
    >
      <div className="container relative z-10">
        <h1 className="text-center text-[5rem] leading-snug uppercase font-bold text-black">
          Capture Memories, <br /> Relive the{" "}
          <span className="font-serif italic font-bold">Classic</span>
        </h1>
      </div>
    </section>
  );
};

export default Hero;
