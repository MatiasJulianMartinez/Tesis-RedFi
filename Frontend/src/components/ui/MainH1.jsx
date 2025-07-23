import classNames from "classnames";

const H1 = ({
  children,
  className = "",
  icon: Icon = null,
  variant = "",
  ...props
}) => {
  const hasCustomSize = /\btext-(xs|sm|base|lg|xl|\d+xl)\b/.test(className);
  const hasCustomWeight =
    /\bfont-(thin|light|normal|medium|semibold|bold|extrabold|black)\b/.test(
      className
    );
  const hasCustomMargin = /\bmb-\d+\b/.test(className);

  const applyFlex = variant !== "noflex";

  return (
    <h1
      className={classNames(
        applyFlex && "flex",
        "items-center justify-center text-center",
        !hasCustomSize && "text-4xl lg:text-5xl",
        !hasCustomWeight && "font-extrabold",
        !hasCustomMargin && "mb-4",
        className
      )}
      {...props}
    >
      {Icon && <Icon size={48} className="inline-block mr-2 text-acento" />}
      {children}
    </h1>
  );
};

export default H1;
