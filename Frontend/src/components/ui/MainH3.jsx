import classNames from "classnames";

const H3 = ({ children, className = "", ...props }) => {
  const hasCustomSize = /\btext-(xs|sm|base|lg|xl|\d+xl)\b/.test(className);
  const hasCustomWeight =
    /\bfont-(thin|light|normal|medium|semibold|bold|extrabold|black)\b/.test(
      className
    );
  const hasCustomMargin = /\bmb-\d+\b/.test(className);

  return (
    <h3
      className={classNames(
        !hasCustomSize && "text-xl lg:text-2xl",
        !hasCustomWeight && "font-semibold",
        !hasCustomMargin && "mb-4",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

export default H3;
