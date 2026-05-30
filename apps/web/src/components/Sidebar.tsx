import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/monsters", label: "Monsters" },
];

export function Sidebar() {
  return (
    <aside className="w-56 border-r border-slate-800 bg-slate-900/60 p-4">
      <h1 className="mb-6 text-lg font-bold text-emerald-300">Game Tracker</h1>
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm ${isActive ? "bg-emerald-700/30 text-emerald-200" : "text-slate-300 hover:bg-slate-800"}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
