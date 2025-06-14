
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { Sparkles, Gift } from "lucide-react";

const typeConfig = {
  review: {
    icon: <Sparkles className="text-amber-400" size={18} />,
    bg: "bg-gradient-to-r from-amber-50/85 via-amber-100/90 to-orange-100/90 dark:from-purple-900/40 dark:to-amber-900/60",
    border: "border-amber-200 dark:border-purple-400/50 shadow-2xl",
    text: "text-orange-800 dark:text-amber-200",
    wallet: "text-xs font-mono text-orange-500 dark:text-amber-200/80",
  },
  reward: {
    icon: <Gift className="text-rose-400" size={18} />,
    bg: "bg-gradient-to-r from-orange-50/85 via-amber-50/90 to-rose-100/90 dark:from-amber-800/40 dark:via-rose-900/30 dark:to-rose-900/60",
    border: "border-rose-200 dark:border-amber-400/50 shadow-2xl",
    text: "text-rose-800 dark:text-amber-200",
    wallet: "text-xs font-mono text-rose-500 dark:text-amber-200/80",
  }
};

const RecentActivityOverlay: React.FC = () => {
  const { notifications } = useRecentActivity();

  return (
    <div className="fixed z-[90] top-7 right-3 w-[312px] max-w-[96vw] space-y-2 pointer-events-none select-none">
      <AnimatePresence>
        {notifications.map((notif) => {
          const type = typeConfig[notif.type];
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, translateY: 18, scale: 0.97 }}
              animate={{ opacity: 0.93, translateY: 0, scale: 1 }}
              exit={{ opacity: 0, translateY: 18, scale: 0.95 }}
              transition={{ duration: 0.55, type: "tween", ease: [0.49,0,0.34,1] }}
              className={`rounded-xl border px-4 py-3 flex items-center gap-2.5 ${type.bg} ${type.border} backdrop-blur-sm`}
              style={{ pointerEvents: "auto", boxShadow: "0 1px 18px 0 rgba(250,120,42,0.04)" }}
            >
              <div className="flex-shrink-0 shrink-0">{type.icon}</div>
              <div className="flex-1 min-w-0">
                <div className={`font-medium ${type.text} text-sm truncate`}>{notif.message}</div>
                <div className={type.wallet + " mt-0.5 truncate"}>{notif.wallet}</div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default RecentActivityOverlay;
