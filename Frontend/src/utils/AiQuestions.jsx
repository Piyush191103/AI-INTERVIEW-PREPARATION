import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Pin, PinOff, ChevronDown } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const AiQuestions = () => {
  const param = useParams();
  const queryClient = useQueryClient();

  const getSessionDetail = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/v1/session/getMySessionById/${param.id}`,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["sessionDetail", param.id],
    queryFn: getSessionDetail,
  });

  const togglePinApi = async (id) => {
    const res = await axios.post(
      `http://localhost:5000/api/v1/question/toggleQuestion/${id}`,
      {},
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: togglePinApi,
    onSuccess: () => {
      toast.success("Question pin status changed");
      queryClient.invalidateQueries({ queryKey: ["sessionDetail", param.id] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update pin");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-16 animate-pulse rounded-xl border border-white/10 bg-white/5"
          />
        ))}
      </div>
    );
  }

  const questions = data?.session?.questions || [];

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center">
        <h3 className="text-lg font-semibold text-white">No questions yet</h3>
        <p className="mt-1 text-slate-400">
          Click "Generate AI Questions" to get started.
        </p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="space-y-3">
      <AnimatePresence>
        {questions.map((item) => (
          <motion.div
            key={item._id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3 }}
          >
            <AccordionItem
              value={item._id}
              className={`overflow-hidden rounded-xl border bg-white/5 backdrop-blur transition data-[state=open]:bg-white/10 ${
                item.isPinned
                  ? "border-cyan-400/50"
                  : "border-white/10 hover:border-white/25"
              }`}
            >
              <div className="relative flex items-center [&>h3]:flex-1">
                <AccordionTrigger className="group flex w-full items-center justify-between gap-3 px-4 py-4 pr-24 text-left text-base font-medium text-white hover:no-underline focus-visible:ring-2 focus-visible:ring-cyan-400/40 [&>svg]:hidden">
                  <span className="flex-1">{item?.question}</span>
                </AccordionTrigger>

                {/* Right side: pin + arrow */}
                <div className="pointer-events-none absolute right-3 flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={item?.isPinned ? "Unpin question" : "Pin question"}
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate(item._id)}
                    className={`pointer-events-auto rounded-lg p-2 transition hover:bg-white/10 ${
                      item?.isPinned
                        ? "text-cyan-300"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {item?.isPinned ? (
                      <Pin size={18} className="fill-current" />
                    ) : (
                      <PinOff size={18} />
                    )}
                  </button>
                  <ChevronDown
                    size={18}
                    className="text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180"
                  />
                </div>
              </div>

              <AccordionContent className="border-t border-white/10 px-4 pb-4 pt-3 text-slate-300">
                <p className="leading-relaxed">{item?.answer}</p>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </AnimatePresence>
    </Accordion>
  );
};

export default AiQuestions;