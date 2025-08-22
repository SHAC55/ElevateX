import React from "react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const Skeleton = ({
  className,
  variant = "rectangular",
  animation = "pulse",
  width,
  height,
  style,
  ...props
}) => {
  const baseClasses = cn(
    "bg-gray-200 rounded-md",
    {
      "animate-pulse": animation === "pulse",
      "animate-wave": animation === "wave",
      "rounded-full": variant === "circular",
      "rounded-md": variant === "rectangular" || variant === "text",
    },
    className
  );

  const styles = {
    width,
    height,
    ...style,
  };

  return <div className={baseClasses} style={styles} {...props} />;
};



export { Skeleton };