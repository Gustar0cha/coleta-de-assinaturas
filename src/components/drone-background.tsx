import Image from "next/image";

const drones = [
  {
    src: "/imagens/drone-1.png",
    className:
      "left-[58%] top-[16%] w-20 opacity-55 [animation-delay:-2s] sm:left-[72%] sm:top-[18%] sm:w-28",
  },
  {
    src: "/imagens/drone-2.png",
    className:
      "left-[12%] top-[69%] w-24 opacity-40 [animation-delay:-8s] sm:left-[54%] sm:top-[68%] sm:w-32",
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
