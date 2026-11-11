import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Target, MessageSquareText, TrendingUp, ArrowRight } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const features = [
  {
    icon: Target,
    title: "Role-based questions",
    desc: "Pick your role, experience and topics. Get questions that match them.",
  },
  {
    icon: MessageSquareText,
    title: "Instant answers",
    desc: "Every question comes with a clear model answer you can learn from.",
  },
  {
    icon: TrendingUp,
    title: "Track your sessions",
    desc: "Pin tough questions and come back to your sessions any time.",
  },
];

const MainPage = () => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-gradient-to-b from-slate-950 via-[#0f1b3d] to-slate-900 px-4 py-16 text-white">
      {/* background glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/30 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        <motion.span
          variants={item}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-sm text-cyan-300"
        >
          <Sparkles size={14} /> AI-powered interview prep
        </motion.span>

        <motion.h1
          variants={item}
          className="text-4xl font-bold leading-tight md:text-6xl"
        >
          Prepare for your interview with your personal{" "}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            AI Coach
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-2xl text-base text-slate-300 md:text-lg"
        >
          Practice with questions made for your role, learn from clear answers,
          and walk into your next interview with confidence.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap justify-center gap-4">
          <Button
            asChild
            className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-6 text-lg font-semibold shadow-lg shadow-blue-500/30 transition hover:scale-105 hover:shadow-blue-500/50"
          >
            <Link to="/session">
              Get Started <ArrowRight className="ml-2" size={18} />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-20 grid w-full gap-5 text-left sm:grid-cols-3"
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-400/40"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
                <Icon size={20} />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-slate-400">{desc}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MainPage;