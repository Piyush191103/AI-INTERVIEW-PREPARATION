import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20";

const CreateSessionButton = () => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const queryClient = useQueryClient();

  const createSessionApi = async (formdata) => {
    const res = await axios.post(
      "http://localhost:5000/api/v1/session/createSession",
      formdata,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res;
  };

  const mutation = useMutation({
    mutationFn: createSessionApi,
    onSuccess: () => {
      toast.success("Session Created");
      reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create session");
    },
  });

  const SessionFormHandler = (formdata) => {
    mutation.mutate(formdata);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:scale-105">
          <Plus size={18} /> Create Session
        </button>
      </DialogTrigger>

      <DialogContent className="border border-white/10 bg-[#0f1b3d] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">New prep session</DialogTitle>
          <DialogDescription className="text-slate-400">
            Tell us about the role and we will generate questions for it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(SessionFormHandler)} className="mt-2 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Role</label>
            <input
              type="text"
              placeholder="e.g. Frontend Developer"
              className={inputClass}
              {...register("role", { required: "Role is required" })}
            />
            {errors.role && (
              <p className="mt-1 text-xs text-red-400">{errors.role.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-300">
              Experience (years)
            </label>
            <input
              type="number"
              min="0"
              placeholder="0 for fresher"
              className={inputClass}
              {...register("experience", { required: "Experience is required" })}
            />
            {errors.experience && (
              <p className="mt-1 text-xs text-red-400">
                {errors.experience.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-300">
              Topics to focus
            </label>
            <input
              type="text"
              placeholder="e.g. React, JavaScript, CSS"
              className={inputClass}
              {...register("topicsToFocus", { required: "Add at least one topic" })}
            />
            <p className="mt-1 text-xs text-slate-500">Separate topics with commas.</p>
            {errors.topicsToFocus && (
              <p className="mt-1 text-xs text-red-400">
                {errors.topicsToFocus.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:opacity-90 disabled:opacity-60"
          >
            {mutation.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Creating...
              </>
            ) : (
              "Create Session"
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSessionButton;