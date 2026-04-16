import type { ReactNode } from "react";
import lightningBgUrl from "../assets/lightning-bg.png";
import disruptSideBannerUrl from "../assets/disrupt-side-banner.png";

type Props = {
  children: ReactNode;
};
export default function AppLayout({ children }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background image */}
      <img
        src={lightningBgUrl}
        alt=""
        className="pointer-events-none absolute left-0 top-0 h-full w-full object-cover opacity-[0.18]"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1500px] gap-6 px-4 py-6 lg:px-6 xl:pr-[100px]">
  {children}
</div>
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden xl:block w-[170px]">
  <div
    className="absolute inset-y-6 right-4 w-[145px] opacity-[0.55]"
    style={{
      backgroundImage: `url(${disruptSideBannerUrl})`,
      backgroundRepeat: "repeat-y",
      backgroundPosition: "top center",
      backgroundSize: "145px auto",
    }}
  />
</div>
    </div>
    
  );
}