import { Award, BookOpen, Layers, Settings, Zap } from "lucide-react";

export const SITE_NAV_ITEMS = [
  { label: "Fundamentals", category: "Fundamentals", icon: BookOpen },
  { label: "Types", category: "Testing Types", icon: Layers },
  { label: "Strategy", category: "Strategy", icon: Zap },
  { label: "Tools", category: "Tools", icon: Settings },
  { label: "Practices", category: "Best Practices", icon: Award },
];

export const CATEGORY_NAV_EVENT = "site:category-select";
