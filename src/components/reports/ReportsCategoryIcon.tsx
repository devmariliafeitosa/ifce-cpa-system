import {
  Award,
  BookOpen,
  Building2,
  GraduationCap,
  Layers,
  Users,
} from "lucide-react";

interface ReportsCategoryIconProps {
  category: string;
}

export function ReportsCategoryIcon({
  category,
}: ReportsCategoryIconProps) {
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes("infra")) {
    return <Building2 className="w-4 h-4 text-[#006837]" />;
  }

  if (normalizedCategory.includes("biblio")) {
    return <BookOpen className="w-4 h-4 text-blue-600" />;
  }

  if (normalizedCategory.includes("ensino")) {
    return <GraduationCap className="w-4 h-4 text-[#006837]" />;
  }

  if (
    normalizedCategory.includes("gestã") ||
    normalizedCategory.includes("gestao")
  ) {
    return <Award className="w-4 h-4 text-amber-600" />;
  }

  if (
    normalizedCategory.includes("assistê") ||
    normalizedCategory.includes("estudant")
  ) {
    return <Users className="w-4 h-4 text-purple-600" />;
  }

  return <Layers className="w-4 h-4 text-[#006837]" />;
}