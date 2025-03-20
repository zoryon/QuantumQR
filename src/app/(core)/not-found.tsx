"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
export default function NotFound() {
    return (
      <div className="relative flex items-center justify-center h-screen bg-black text-white overflow-hidden px-8">
        
        {/* Gradient + Grid Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 via-black to-blue-900 opacity-60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#6b21a8_1px,transparent_1px)] [background-size:25px_25px] opacity-10 pointer-events-none" />
  
        {/* Floating Quantum Orbs */}
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute w-72 h-72 bg-purple-700 opacity-20 rounded-full top-16 left-16 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
          className="absolute w-72 h-72 bg-cyan-500 opacity-20 rounded-full bottom-16 right-16 blur-3xl"
        />
  
        {/* Main Content */}
        <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl w-full z-10">
          {/* Left Side: Big 404 */}
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="text-[10rem] font-extrabold bg-gradient-to-r from-blue-500 via-cyan-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg leading-none"
          >
            404
          </motion.h1>
  
          {/* Right Side: Text & Button */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-start text-left space-y-6 max-w-md"
          >
            <p className="text-xl text-gray-300 leading-relaxed">
              You've slipped through a quantum tunnel.<br />
              Unfortunately, this page doesn&apos;t exists.
            </p>
            <Button
              variant="secondary"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg hover:scale-105 transition-transform px-6 py-3 text-lg"
              onClick={() => window.location.href = "/"}
            >
              <ArrowLeft className="w-5 h-5" />
              Return to Reality
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }
  
