import classNames from "classnames";

const H2 = ({ children, className = "", ...props }) => {
  const hasCustomSize = /\btext-(xs|sm|base|lg|xl|\d+xl)\b/.test(className);
  const hasCustomWeight =
    /\bfont-(thin|light|normal|medium|semibold|bold|extrabold|black)\b/.test(
      className
    );
  const hasCustomMargin = /\bmb-\d+\b/.test(className);

  return (
    <h2
      className={classNames(
        !hasCustomSize && "text-3xl lg:text-4xl",
        !hasCustomWeight && "font-semibold",
        !hasCustomMargin && "mb-4",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
};

export default H2;
