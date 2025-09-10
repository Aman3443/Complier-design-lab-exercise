import dynamic from "next/dynamic";
const RiveComponent = dynamic(() => import("@rive-app/react-canvas").then(m => m.RiveComponent), { ssr: false });

export default function AuthBackdrop() {
  return (
    <div className="absolute inset-0 -z-10 opacity-60">
      <RiveComponent src="https://public.rive.app/community/runtime-files/5-1972-animated-shapes.riv" />
    </div>
  );
}