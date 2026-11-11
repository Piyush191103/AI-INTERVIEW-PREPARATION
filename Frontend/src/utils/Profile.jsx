import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { User, LogOut } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Logout from "./Logout";
import UpdateProfile from "./UpdateProfile";

const Profile = () => {
  const getProfile = async () => {
    const res = await axios.get("http://localhost:5000/api/v1/user/getUser", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["getProfile"],
    queryFn: getProfile,
  });

  const user = data?.user;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex cursor-pointer items-center gap-3 rounded-full py-1 pl-4 pr-1 transition hover:bg-white/10">
          {isLoading ? (
            <div className="h-5 w-20 animate-pulse rounded bg-white/10" />
          ) : (
            <span className="hidden text-lg font-semibold text-slate-200 sm:block">
              {user?.fullName}
            </span>
          )}

          {user?.profilPhoto ? (
            <img
              src={user.profilPhoto}
              alt="profile"
              className="h-10 w-10 rounded-full border-2 border-cyan-400/50 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-cyan-400/50 bg-white/10 text-slate-200">
              <User size={20} />
            </div>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-56 border border-white/10 bg-[#0f1b3d] p-2 text-white shadow-xl"
      >
        <div className="mb-2 border-b border-white/10 px-3 pb-3">
          <p className="truncate font-semibold capitalize">{user?.fullName}</p>
          <p className="truncate text-xs text-slate-400">{user?.email}</p>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-slate-200 transition hover:bg-white/10">
            <User size={16} className="text-cyan-300" />
            <UpdateProfile />
          </div>

          <div className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-slate-200 transition hover:bg-red-500/10 hover:text-red-300">
            <LogOut size={16} className="text-red-400" />
            <Logout />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Profile;