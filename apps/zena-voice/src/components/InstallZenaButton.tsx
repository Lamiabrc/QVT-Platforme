import { usePWAInstall } from "@/hooks/usePWAInstall";

export default function InstallZenaButton() {
  const { canInstall, installed, install } = usePWAInstall();

  if (installed) return null;

  return (
    <button
      onClick={install}
      disabled={!canInstall}
      className="px-4 py-2 mt-4 rounded-2xl shadow bg-[#5B4B8A] text-white disabled:opacity-40"
    >
      {canInstall ? "Installer ZÉNA" : "Installation indisponible"}
    </button>
  );
}
