import { useState } from "react";
import { IconLoader2 } from "@tabler/icons-react";
import classNames from "classnames";

const Avatar = ({ fotoUrl, nombre = "Usuario", size = 20, className = "" }) => {
  const [loaded, setLoaded] = useState(false);

  const initials = nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const dimension = size * 4;
  const dynamicFontSize = `${size * 1.2}px`;

  return (
    <div
      className={classNames(
        "rounded-full border-2 border-acento shadow-md overflow-hidden flex items-center justify-center bg-white/10 text-texto font-bold",
        className
      )}
      style={{
        width: `${dimension}px`,
        height: `${dimension}px`,
        fontSize: dynamicFontSize,
      }}
    >
      {fotoUrl ? (
        <>
          {!loaded && (
            <IconLoader2
              className="animate-spin text-texto/70"
              size={size * 2}
            />
          )}
          <img
            src={fotoUrl}
            alt="Avatar"
            onLoad={() => setLoaded(true)}
            className={classNames(
              "w-full h-full object-cover rounded-full",
              !loaded && "hidden"
            )}
          />
        </>
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
