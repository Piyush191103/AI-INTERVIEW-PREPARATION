import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import CreateSessionButton from "@/utils/CreateSessionButton";
import { RiDeleteBin5Line } from "react-icons/ri";
import { ArrowRight, Calendar, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const Session = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const getSession = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/v1/session/getMySession",
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: getSession,
  });

  const deleteSessionApi = async (id) => {
    const res = await axios.delete(
      `http://localhost:5000/api/v1/session/deleteMySession/${id}`,
      { withCredentials: true }
    );
    return res.data;
  };

  const deleteMutation = useMutation({
    mutationFn: deleteSessionApi,
    onSuccess: () => {
      toast.success("Session deleted successfully ✅");
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete session ❌");
    },
  });

  const sessions = data?.session || [];

  const expLabel = (exp) =>
    Number(exp) === 0 ? "Fresher" : `${exp} yr${Number(exp) > 1 ? "s" : ""} exp`;

  const splitTopics = (t) =>
    String(t || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

  return (
    <div className="min-h-[88vh] w-full bg-gradient-to-b from-[#0b1226] via-[#111c3d] to-[#0f172a] px-4 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header row */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white md:text-4xl">
              Your sessions
            </h1>
            <p className="mt-1 text-slate-400">
              Pick up where you left off or start a new prep session.
            </p>
          </div>
          <CreateSessionButton />
        </div>

        {/* Loading skeletons */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-56 animate-pulse rounded-2xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        ) : sessions.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/session/${item._id}`)}
                className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-white/10 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(item._id);
                  }}
                  disabled={deleteMutation.isPending}
                  aria-label="Delete session"
                  className="absolute right-3 top-3 rounded-lg p-2 opacity-0 transition hover:bg-red-500/10 group-hover:opacity-100"
                >
                  <RiDeleteBin5Line size={18} className="text-red-400" />
                </button>

                <div>
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                    {expLabel(item.experience)}
                  </span>

                  <h3 className="mt-4 text-2xl font-semibold capitalize text-white">
                    {item.role}
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {splitTopics(item.topicsToFocus).map((topic) => (
                      <span
                        key={topic}
                        className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare size={14} />
                      {item.questions?.length || 0} questions
                    </span>
                    {item.createdAt && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    )}
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-cyan-300 transition group-hover:translate-x-1"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 py-24 text-center">
            <h2 className="text-2xl font-semibold text-white">No sessions yet</h2>
            <p className="mt-2 text-slate-400">
              Create your first session to get AI-generated questions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Session;