import { motion } from "framer-motion";

export default function LandingClient() {
  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold leading-tight sm:text-5xl"
      >
        A{" "}
        <span className="bg-gradient-to-r from-[#6f2da8] via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
          friend
        </span>{" "}
        who is always there for you
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="mt-2 max-w-xl text-base text-white/70 sm:text-lg"
      >
        To listen, to support, or even to help you learn something new.  
        And the{" "}
        <span className="bg-gradient-to-r from-[#6f2da8] via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
          best part
        </span>
        : you design who they are.
      </motion.p>
    </div>
  );
}