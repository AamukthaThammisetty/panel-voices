'use client'

import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export default function Header() {
  return (
    <header className="px-8  bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold">IIElevenLabs</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-1 cursor-pointer">
              <span className="text-gray-700">Creative Platform</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex items-center space-x-1 cursor-pointer">
              <span className="text-gray-700">Agents Platform</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex items-center space-x-1 cursor-pointer">
              <span className="text-gray-700">Developers</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex items-center space-x-1 cursor-pointer">
              <span className="text-gray-700">Resources</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
            <span className="text-gray-700 cursor-pointer">Enterprise</span>
            <span className="text-gray-700 cursor-pointer">Pricing</span>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-700 rounded-3xl cursor-pointer">
              Log in
            </Button>
            <Button className="bg-black hover:bg-gray-800 text-white rounded-3xl cursor-pointer">
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
