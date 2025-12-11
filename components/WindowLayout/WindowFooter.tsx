import { useContext } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MdOutlineRoundedCorner } from "react-icons/md";
import { VscSourceControl, VscError, VscWarning } from "react-icons/vsc";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { MotionWindowContext } from "@contexts/MotionWindowContext";
import { useTheme } from "@contexts/ThemeContext";
import { useAudio } from "@contexts/AudioContext";

export default function WindowFooter() {
  const { handleResizeWindow } = useContext(MotionWindowContext);
  const { colors } = useTheme();
  const { isMuted, toggle, trackName } = useAudio();

  return (
    <div
      className="col-span-2 flex w-full items-center justify-between rounded-b-md border-x-[1px] border-b-[1px] group-data-[show-explorer=true]:col-span-3"
      style={{
        backgroundColor: colors.accent.primary,
        borderColor: colors.accent.secondary,
      }}
    >
      <div className="flex items-center">
        <Link
          href="https://github.com/GuickerZ/GuickerZ"
          className="outline-none"
        >
          <div
            className="flex cursor-pointer items-center gap-1 rounded-bl-md px-2 py-1 transition-colors"
            style={{ backgroundColor: "transparent" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = colors.accent.secondary)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <VscSourceControl
              className="text-sm"
              style={{ color: colors.text.primary }}
            />
            <span
              className="hidden select-none text-xs font-light sm:inline"
              style={{ color: colors.text.primary }}
            >
              master
            </span>
          </div>
        </Link>

        <div
          className="hidden cursor-pointer items-center gap-1 px-2 py-1 transition-colors sm:flex"
          style={{ backgroundColor: "transparent" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = colors.accent.secondary)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <VscError
            className="text-sm"
            style={{ color: colors.text.primary }}
          />
          <span
            className="select-none text-xs font-light"
            style={{ color: colors.text.primary }}
          >
            0
          </span>
          <VscWarning
            className="text-sm"
            style={{ color: colors.text.primary }}
          />
          <span
            className="select-none text-xs font-light"
            style={{ color: colors.text.primary }}
          >
            0
          </span>
        </div>

        <button
          onClick={toggle}
          className="flex cursor-pointer items-center gap-1.5 px-2 py-1 transition-colors"
          style={{ backgroundColor: "transparent" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = colors.accent.secondary)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
          title={isMuted ? "Tocar música" : "Pausar música"}
        >
          {isMuted ? (
            <HiVolumeOff
              className="text-sm"
              style={{ color: colors.text.primary }}
            />
          ) : (
            <HiVolumeUp
              className="text-sm"
              style={{ color: colors.text.primary }}
            />
          )}
          <span
            className="hidden max-w-[100px] select-none truncate text-xs font-light sm:inline"
            style={{ color: colors.text.primary }}
          >
            {isMuted ? "♪ play" : trackName}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span
          className="hidden select-none rounded px-1.5 py-0.5 text-xs font-light sm:inline"
          style={{
            color: colors.text.primary,
            backgroundColor: colors.accent.secondary,
          }}
          title="Abrir Command Palette"
        >
          Ctrl+K
        </span>
        <motion.div
          drag
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          dragElastic={0}
          dragMomentum={false}
          dragTransition={{ power: 0 }}
          onDrag={handleResizeWindow}
        >
          <MdOutlineRoundedCorner
            className="mr-[3px] rotate-90 cursor-nwse-resize text-lg"
            style={{ color: colors.text.primary }}
          />
        </motion.div>
      </div>
    </div>
  );
}
