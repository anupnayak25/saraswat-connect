"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-[#f5e6d3] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              {/* Placeholder for logo - replace with actual image */}
              <span className="text-orange-600 font-bold text-xl">SC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Saraswath</h1>
              <p className="text-sm text-gray-600">Connect</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-orange-600 transition">
              Home
            </Link>
            <Link href="/trip-planner" className="text-gray-700 hover:text-orange-600 transition">
              Plan Trip
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-orange-600 transition">
              About Us
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-orange-600 transition">
              Services
            </Link>
            <Link href="/packages" className="text-gray-700 hover:text-orange-600 transition">
              Tour Packages
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-orange-600 transition">
              Contact
            </Link>
            <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition">
              Book Now
            </button>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-700 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-700 hover:text-orange-600 transition">
                Home
              </Link>
              <Link href="/trip-planner" className="text-gray-700 hover:text-orange-600 transition">
                Plan Trip
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-orange-600 transition">
                About Us
              </Link>
              <Link href="/services" className="text-gray-700 hover:text-orange-600 transition">
                Services
              </Link>
              <Link href="/packages" className="text-gray-700 hover:text-orange-600 transition">
                Tour Packages
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-orange-600 transition">
                Contact
              </Link>
              <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition w-full">
                Book Now
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
