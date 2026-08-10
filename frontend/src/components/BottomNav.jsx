import { NavLink } from "react-router-dom";
import { Home, Compass, Sparkles, ShoppingBag, User, Shield } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function BottomNav() {
  const { profile } = useAppContext();
  const isAdmin = profile?.email === 'admin@gmail.com';

  const navItems = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/explore", icon: Compass, label: "Explore" },
    { to: "/ai-try-on", icon: Sparkles, label: "Try On", isPrimary: true },
    { to: "/wardrobe", icon: ShoppingBag, label: "Wardrobe" },
    isAdmin 
      ? { to: "/admin", icon: Shield, label: "Admin" }
      : { to: "/account", icon: User, label: "Account" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-between px-6 pb-6 pt-3 z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        
        if (item.isPrimary) {
          return (
            <NavLink 
              key={item.label}
              to={item.to}
              className="flex flex-col items-center gap-1 -mt-5"
            >
              <div className="w-14 h-14 bg-[#6344D4] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#6344D4]/30">
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <span className="text-[10px] font-medium text-gray-500">{item.label}</span>
            </NavLink>
          );
        }

        return (
          <NavLink 
            key={item.label}
            to={item.to}
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 ${isActive ? "text-[#6344D4]" : "text-gray-400 hover:text-gray-600"}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={24} strokeWidth={isActive ? 2 : 1.5} />
                <span className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </div>
  );
}
