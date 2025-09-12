'use client'

import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-5xl lg:text-5xl pt-5 text-gray-900 leading-tight">
          The most realistic voice AI platform
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-md text-black max-w-4xl font-bold mx-auto leading-relaxed">
          AI voice models and products powering millions of developers, creators, and enterprises. From
          low-latency conversational agents to the leading AI voice generator for voiceovers and audiobooks.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            size="lg"
            className="bg-black hover:bg-gray-800 text-white font-bold px-4 py-1 text-base rounded-3xl font-medium cursor-pointer"
          >
            SIGN UP
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="text-gray-700 bg-gray-100 text-black hover:text-gray-900 px-4 py-1 font-bold text-base rounded-3xl font-medium cursor-pointer"
          >
            CONTACT SALES
          </Button>
        </div>
      </div>
    </section>
  )
}
