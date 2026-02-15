import { cn } from "@/utils/cn";

const gradientBg =
  "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}) => {
  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      {/* Blurred glow layer */}
      <div
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] opacity-0 blur-xl transition duration-500",
          animate && "animate-gradient-shift",
          gradientBg
        )}
        style={animate ? { backgroundSize: "400% 400%" } : undefined}
      />
      {/* Visible gradient border */}
      <div
        className={cn(
          "absolute inset-0 rounded-3xl z-[1]",
          animate && "animate-gradient-shift",
          gradientBg
        )}
        style={animate ? { backgroundSize: "400% 400%" } : undefined}
      />

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
