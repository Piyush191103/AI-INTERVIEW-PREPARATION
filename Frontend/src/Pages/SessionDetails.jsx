import AiQuestions from "@/utils/AiQuestions";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";

const SessionDetails = () => {
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

  const GenerateAiQuestionApi = async (payload) => {
    const res = await axios.post(
      "http://localhost:5000/api/v1/question/addQuestion",
      payload,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: GenerateAiQuestionApi,
    onSuccess: () => {
      toast.success("AI Questions Generated");
      queryClient.invalidateQueries({ queryKey: ["sessionDetail", param.id] });
    },
    onError: (error) => {
      console.error("Mutation failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const AiQuestion = () => {
    if (mutation.isPending) return;
    mutation.mutate({
      role: data?.session?.role,
      experience: data?.session?.experience,
      topicsToFocus: data?.session?.topicsToFocus,
      sessionId: param?.id,
    });
  };

  const session = data?.session;
  const topics = String(session?.topicsToFocus || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const expLabel =
    Number(session?.experience) === 0
      ? "Fresher"
      : `${session?.experience} yr${Number(session?.experience) > 1 ? "s" : ""} exp`;

  if (isLoading) {
    return (
      <div className="min-h-[88vh] bg-gradient-to-b from-[#0b1226] via-[#111c3d] to-[#0f172a] px-4 py-10">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="h-36 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-16 animate-pulse rounded-xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[88vh] w-full bg-gradient-to-b from-[#0b1226] via-[#111c3d] to-[#0f172a] px-4 py-10 md:px-10">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/session"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-300"
        >
          <ArrowLeft size={16} /> Back to sessions
        </Link>

        {/* Session info card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-cyan-300">Role</p>
              <h1 className="mt-1 text-3xl font-bold capitalize text-white">
                {session?.role}
              </h1>
            </div>
            <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-300">
              {expLabel}
            </span>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">
              Topics to focus
            </p>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-sm text-slate-200"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Questions header with generate button */}
        <div className="mb-4 mt-10 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-white">
            Interview questions
            <span className="ml-2 text-sm font-normal text-slate-400">
              ({session?.questions?.length || 0})
            </span>
          </h2>

          <Button
            onClick={AiQuestion}
            disabled={mutation.isPending}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={16} /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2" size={16} /> Generate AI Questions
              </>
            )}
          </Button>
        </div>

        <AiQuestions />
      </div>
    </div>
  );
};

export default SessionDetails;