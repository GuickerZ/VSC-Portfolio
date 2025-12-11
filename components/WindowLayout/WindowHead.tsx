import { useContext, useState } from "react";
import {
  VscLayoutSidebarLeftOff,
  VscLayoutPanelOff,
  VscLayoutSidebarRightOff,
  VscLayout,
} from "react-icons/vsc";

import { MotionWindowContext } from "@contexts/MotionWindowContext";
import { useTheme } from "@contexts/ThemeContext";

export default function WindowHead() {
  const { handleStartDrag } = useContext(MotionWindowContext);
  const { colors } = useTheme();
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMinimize = () => {
    console.log("Minimizar janela");
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    console.log("Maximizar/Restaurar janela");
  };

  const handleClose = () => {
    if (confirm("Deseja realmente fechar o portfólio?")) {
      window.close();
    }
  };

  return (
    <div
      onPointerDown={handleStartDrag}
      className="col-span-2 grid grid-cols-3 items-center justify-between rounded-t-md border-x-[1px] border-t-[1px] p-2 group-data-[show-explorer=true]:col-span-3"
      style={{
        backgroundColor: colors.bg.secondary,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-center gap-2">
        <div
          onClick={handleClose}
          className="h-3 w-3 cursor-pointer rounded-full bg-red-400 transition-all duration-150 hover:bg-red-500 hover:shadow-lg"
        />
        <div
          onClick={handleMinimize}
          className="h-3 w-3 cursor-pointer rounded-full bg-yellow-500 transition-all duration-150 hover:bg-yellow-600 hover:shadow-lg"
        />
        <div
          onClick={handleMaximize}
          className="h-3 w-3 cursor-pointer rounded-full bg-green-500 transition-all duration-150 hover:bg-green-600 hover:shadow-lg"
        />
      </div>
      <span
        className="line-clamp-1 select-none text-ellipsis text-center text-xs"
        style={{ color: colors.text.tertiary }}
      >
        Guilherme Matias - Visual Studio Code
      </span>
      <div className="flex items-center justify-end gap-1">
        <VscLayoutSidebarLeftOff
          className="text-md cursor-pointer transition-colors"
          style={{ color: colors.text.tertiary }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = colors.text.secondary)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = colors.text.tertiary)
          }
        />
        <VscLayoutPanelOff
          className="text-md cursor-pointer transition-colors"
          style={{ color: colors.text.tertiary }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = colors.text.secondary)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = colors.text.tertiary)
          }
        />
        <VscLayoutSidebarRightOff
          className="text-md cursor-pointer transition-colors"
          style={{ color: colors.text.tertiary }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = colors.text.secondary)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = colors.text.tertiary)
          }
        />
        <div
          className="h-4 w-[1px]"
          style={{ backgroundColor: colors.text.tertiary }}
        />
        <VscLayout
          className="text-md cursor-pointer transition-colors"
          style={{ color: colors.text.tertiary }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = colors.text.secondary)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = colors.text.tertiary)
          }
        />
      </div>
    </div>
  );
}
