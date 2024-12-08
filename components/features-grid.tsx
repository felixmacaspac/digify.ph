import { FaCameraRetro, FaPhotoVideo, FaCamera } from "react-icons/fa";
import { MdCameraAlt } from "react-icons/md";

const FeaturesGrid = () => {
  const features = [
    {
      title: "Vintage Collection",
      description: "Explore a curated selection of timeless digital cameras.",
      icon: <FaCameraRetro className="text-4xl text-black mb-4" />,
    },
    {
      title: "Capture Every Moment",
      description:
        "Relive the golden era of photography with retro digital cameras.",
      icon: <FaCamera className="text-4xl text-black mb-4" />,
    },
    {
      title: "Film-Style Photography",
      description: "Get that timeless film look with our cameras.",
      icon: <FaPhotoVideo className="text-4xl text-black mb-4" />,
    },
  ];

  return (
    <section className="bg-white py-40">
      <div className="container mx-auto">
        <h2 className="text-6xl font-bold font-serif italic text-start mb-20">
          WHY US?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="relative block h-64 sm:h-80 lg:h-96">
              <span className="absolute inset-0 bg-black"></span>
              <div className="relative flex h-full transform items-center border border-black bg-white transition-transform -translate-x-2 -translate-y-2">
                <div className="p-4 w-full transition-opacity relative opacity-100 sm:p-6 lg:p-8 flex flex-col items-center text-center">
                  {feature.icon}
                  <h3 className="mt-4 text-xl font-medium sm:text-2xl">
                    {feature.title}
                  </h3>

                  <p className="mt-4 text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
