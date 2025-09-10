import { useCallback } from "react";
import Particles from "@tsparticles/react";

export default function ParticlesBg() {
  const init = useCallback(async (_engine) => {}, []);
  return (
    <div className="fixed inset-0 -z-10">
      <Particles
        id="tsparticles"
        init={init}
        options={{
          background: { color: { value: "transparent" } },
          particles: {
            number: { value: 60 },
            size: { value: 2 },
            move: { enable: true, speed: 0.6 },
            links: { enable: true, opacity: 0.3 },
            color: { value: "#22D3EE" },
          },
        }}
      />
    </div>
  );
}