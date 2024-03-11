import backgroundImage from "../images/yellow-bubble-noise.jpg";

export default function ImageMega() {
  return (
    <>
      <div className="md:col-span-1">
        <img
          src={backgroundImage}
          alt="Logo"
          className="absolute inset-0 w-full h-full object-cover 
          md:static md:h-auto md:max-h-screen"
        />
      </div>

      {/* --------------Overlay-------------- */}
      <div
        className="
        absolute inset-0 bg-stone-400 opacity-50 
        md:hidden"
      ></div>
    </>
  );
}
