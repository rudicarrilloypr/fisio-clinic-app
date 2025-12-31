import Image from "next/image";

export default function Loading() {
  return (
    <div
      className="flex h-dvh w-full items-center justify-center"
      style={{ background: "var(--cefix-bg)" }}
    >
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="relative h-20 w-[260px]">
          <Image
            src="/cefix-logo.png"
            alt="CEFIX"
            fill
            className="object-contain"
            priority
          />
        </div>

        <span className="text-xs text-zinc-400 tracking-wide">
          Centro Fisioterapéutico
        </span>
      </div>
    </div>
  );
}
