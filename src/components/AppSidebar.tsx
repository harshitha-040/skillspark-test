import {
  Home,
  LayoutDashboard,
  ClipboardList,
  GraduationCap,
  Settings,
  ShieldCheck,
  CreditCard,
  LogOut,
  ChevronRight,
  User,
  Zap,
  HelpCircle,
  Menu,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navigationGroups = [
  {
    label: "Dashboard",
    items: [
      { title: "Home", icon: Home, path: "/" },
      { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    ],
  },
  {
    label: "Assessment",
    items: [
      { title: "Take Test", icon: Zap, path: "/select" },
      { title: "My Results", icon: ClipboardList, path: "/history" },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Pricing", icon: CreditCard, path: "/pricing" },
      { title: "Profile", icon: User, path: "/profile" },
      { title: "Settings", icon: Settings, path: "/settings" },
    ],
  },
];

export function AppSidebar({ user, handleLogout }: any) {
  const location = useLocation();
  const { state, isMobile, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
    >
      {/* 1. MODERN LOGO AREA */}
      <SidebarHeader 
        className={cn("transition-all duration-300 cursor-pointer", isCollapsed ? "p-2" : "p-6")}
        onClick={() => toggleSidebar()}
      >
        <div className="flex items-center gap-3 group relative">
          <div className="relative flex-shrink-0">
            <div className={cn(
              "rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-110 transition-all duration-500 group-hover:rotate-3",
              isCollapsed ? "w-10 h-10" : "w-12 h-12"
            )}>
              <ShieldCheck className={cn("transition-all", isCollapsed ? "w-6 h-6" : "w-7 h-7")} />
            </div>
            {/* SUBTLE GLOW */}
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col overflow-hidden"
              >
                <span className="font-black text-xl tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  SkillSpark
                </span>
                <span className="text-[9px] uppercase font-black tracking-[0.2em] text-primary mt-1.5">
                  Pro Assessment
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SidebarHeader>

      {/* 3. SECTION ORGANIZATION */}
      <SidebarContent className={cn("px-4 py-2 space-y-8 scrollbar-none transition-all duration-300", isCollapsed && "px-2")}>
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label} className="p-0">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">
                    {group.label}
                  </SidebarGroupLabel>
                </motion.div>
              )}
            </AnimatePresence>
            
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        onClick={() => toggleSidebar()}
                        className={cn(
                          "relative h-14 w-full rounded-2xl px-3 transition-all duration-300 group/item overflow-hidden border border-transparent",
                          isActive 
                            ? "bg-primary/10 border-primary/20 text-primary font-bold shadow-sm" 
                            : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground",
                          isCollapsed && "px-0 justify-center h-12"
                        )}
                      >
                        <Link to={item.path} className="flex items-center gap-4">
                          {/* ICON CONTAINER */}
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                            isActive 
                              ? "bg-primary text-white shadow-lg shadow-primary/30" 
                              : "bg-secondary group-hover/item:bg-primary/20 group-hover/item:text-primary",
                            isCollapsed && "w-9 h-9"
                          )}>
                            <item.icon className={cn(
                              "w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110",
                              isActive ? "stroke-[2.5px]" : "stroke-[2px]"
                            )} />
                          </div>
                          
                          <AnimatePresence>
                            {!isCollapsed && (
                              <motion.span 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="text-sm tracking-tight"
                              >
                                {item.title}
                              </motion.span>
                            )}
                          </AnimatePresence>

                          {isActive && !isCollapsed && (
                            <motion.div 
                              layoutId="active-indicator"
                              className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                            />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* ADMIN SECTION */}
        {user?.role === "admin" && (
          <SidebarGroup className="p-0">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-purple-500/60 mb-3">
                    Management
                  </SidebarGroupLabel>
                </motion.div>
              )}
            </AnimatePresence>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Admin Panel"
                  onClick={() => toggleSidebar()}
                  className={cn(
                    "h-12 w-full rounded-2xl px-4 transition-all duration-300 group/admin",
                    location.pathname === "/admin"
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20 font-bold"
                      : "hover:bg-purple-500/10 text-muted-foreground hover:text-purple-500",
                    isCollapsed && "px-0 justify-center"
                  )}
                >
                  <Link to="/admin" className="flex items-center gap-4">
                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="text-sm font-bold">Admin Console</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* 9. USER CARD AT BOTTOM */}
      <SidebarFooter className={cn("bg-sidebar/50 border-t border-sidebar-border backdrop-blur-xl transition-all duration-300", isCollapsed ? "p-2" : "p-4")}>
        {user ? (
          <div className="space-y-4">
            <div className={cn(
              "flex items-center gap-3 rounded-[1.25rem] bg-card/50 border border-sidebar-border shadow-sm transition-all duration-300",
              isCollapsed ? "p-1.5 justify-center" : "p-3"
            )}>
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-black shadow-md ring-2 ring-background">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-background rounded-full" />
              </div>

              {!isCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold truncate">{user.username}</span>
                    {/* 10. PREMIUM BADGE */}
                    {user.plan?.toLowerCase() === 'pro' && (
                      <div className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-[8px] font-black px-1.5 py-0.5 rounded-md border border-yellow-500/20">
                        PRO
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground truncate font-medium">{user.email}</span>
                </div>
              )}
            </div>

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  tooltip="Logout"
                  className="w-full h-11 rounded-xl px-4 text-red-500 hover:bg-red-500/10 transition-all font-bold group/logout"
                >
                  <LogOut className="w-5 h-5 group-hover/logout:scale-110 transition-transform" />
                  {!isCollapsed && <span className="text-sm uppercase tracking-widest text-[10px]">Sign Out</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => window.dispatchEvent(new Event("open-login"))}
                tooltip="Sign In"
                className="w-full h-12 rounded-2xl px-4 bg-primary text-white hover:opacity-90 shadow-xl shadow-primary/20 transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3"
              >
                <ShieldCheck className="w-5 h-5" />
                {!isCollapsed && <span>Get Started</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
