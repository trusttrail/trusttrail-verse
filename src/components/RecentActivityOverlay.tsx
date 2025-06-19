
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { Sparkles, Gift, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const typeConfig = {
  review: {
    icon: <Sparkles className="text-amber-400" size={18} />,
    bg: "bg-gradient-to-r from-amber-50/95 via-amber-100/95 to-orange-100/95 dark:from-purple-900/50 dark:to-amber-900/70",
    border: "border-amber-200/80 dark:border-purple-400/60",
    text: "text-orange-800 dark:text-amber-200",
    wallet: "text-xs font-mono text-orange-500 dark:text-amber-200/80",
  },
  reward: {
    icon: <Gift className="text-rose-400" size={18} />,
    bg: "bg-gradient-to-r from-orange-50/95 via-amber-50/95 to-rose-100/95 dark:from-amber-800/50 dark:via-rose-900/40 dark:to-rose-900/70",
    border: "border-rose-200/80 dark:border-amber-400/60",
    text: "text-rose-800 dark:text-amber-200",
    wallet: "text-xs font-mono text-rose-500 dark:text-amber-200/80",
  }
};

const RecentActivityOverlay: React.FC = () => {
  const { notifications, dismissNotification } = useRecentActivity();

  return (
    <div className="fixed z-50 top-20 right-4 w-80 max-w-[calc(100vw-2rem)] space-y-3 pointer-events-none select-none">
      <AnimatePresence>
        {notifications.map((notif) => {
          const type = typeConfig[notif.type];
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ 
                duration: 0.4, 
                type: "spring", 
                stiffness: 100,
                damping: 15
              }}
              className={`rounded-lg border px-4 py-3 flex items-center gap-3 ${type.bg} ${type.border} backdrop-blur-sm shadow-lg pointer-events-auto`}
            >
              <div className="flex-shrink-0">{type.icon}</div>
              <div className="flex-1 min-w-0">
                <div className={`font-medium ${type.text} text-sm leading-tight`}>
                  {notif.message}
                </div>
                <div className={`${type.wallet} mt-1 truncate`}>
                  {notif.wallet}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-black/10 dark:hover:bg-white/10"
                onClick={() => dismissNotification(notif.id)}
              >
                <X size={14} />
              </Button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default RecentActivityOverlay;
