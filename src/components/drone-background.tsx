import Image from "next/image";

const drones = [
  {
    src: "/imagens/drone-1.png",
    className:
      "left-[76%] top-[14%] hidden w-20 opacity-40 [animation-delay:-2s] sm:block sm:w-28",
  },
  {
    src: "/imagens/drone-2.png",
    className:
      "left-[72%] top-[68%] hidden w-24 opacity-32 [animation-delay:-8s] sm:block sm:w-32",
  },
  {
    src: "/imagens/drone-3.png",
    className:
      "left-[72%] top-[55%] hidden w-16 opacity-45 [animation-delay:-13s] sm:block sm:w-24",
  },
];

export function DroneBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {drones.map((drone) => (
        <Image
          alt=""
          className={`drone-float absolute h-auto drop-shadow-[0_18px_28px_rgba(0,0,0,0.34)] ${drone.className}`}
          height={140}
          key={drone.src}
          src={drone.src}
          width={180}
        />
      ))}
    </div>
  );
}
