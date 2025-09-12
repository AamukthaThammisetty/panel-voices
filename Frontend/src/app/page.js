import Image from "next/image";
import Header from "@/components/header";
import HeroSection from "@/components/hero";
import TextToSpeech from "@/components/text-to-speech";
export default function Home() {
  return (
    <div className="px-17">
      <Header />
      <HeroSection />
      <TextToSpeech />
    </div>
  );
}
