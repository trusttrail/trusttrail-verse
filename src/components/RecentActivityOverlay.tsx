
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { Sparkles, Gift } from "lucide-react";

const typeConfig = {
  review: {
    icon: <Sparkles className="text-trustpurple-500" size={20} />,
    bg: "bg-gradient-to-r from-purple-800/90 to-blue-700/90",
    border: "border-purple-400",
  },
  reward: {
    icon: <Gift className="text-amber-400" size={20} />,
    bg: "bg-gradient-to-r from-yellow-600/80 to-amber-400/70",
    border: "border-amber-300",
  }
};

const RecentActivityOverlay: React.FC = () => {
  const { notifications } = useRecentActivity();

  return (
    <div className="fixed z-[200] top-6 right-4 w-[325px] max-w-[96vw] space-y-2 pointer-events-none select-none">
      <AnimatePresence>
        {notifications.map((notif) => {
          const type = typeConfig[notif.type];
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, translateX: 80, scale: 0.98 }}
              animate={{ opacity: 1, translateX: 0, scale: 1 }}
              exit={{ opacity: 0, translateX: 80, scale: 0.92 }}
              transition={{ duration: 0.35, type: "spring", bounce: 0.25 }}
              className={`rounded-xl shadow-lg border p-4 flex items-center gap-3 ${type.bg} ${type.border} backdrop-blur-md`}
              style={{ pointerEvents: "auto" }}
            >
              {type.icon}
              <div className="flex-1">
                <div className="font-semibold text-white/90 text-base">{notif.message}</div>
                {notif.wallet && (
                  <div className="text-xs text-white/65 font-mono truncate">
                    {notif.wallet}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default RecentActivityOverlay;
