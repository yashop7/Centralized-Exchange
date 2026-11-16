import { NotFoundGlitch } from "@/components/motion/not-found/glitch";

export default function NotFound() {
  return (
    <div className="hero-glow flex flex-1 flex-col items-center justify-center rounded-[inherit] p-8">
      <NotFoundGlitch
        browseHref="/trade/TATA_INR"
        browseLabel="Trade TATA / INR"
        description="That market or page isn't listed here."
        homeHref="/markets"
        homeLabel="Back to markets"
        title="Nothing at this address"
      />
    </div>
  );
}
