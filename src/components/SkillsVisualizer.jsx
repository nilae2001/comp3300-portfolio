"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { skills } from "@/skills";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

const levelColor = {
  beginner: "bg-blue-200",
  intermediate: "bg-blue-400",
  expert: "bg-blue-700",
};

export default function SkillsVisualizer() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredSkills = skills.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || section.category === filter;
      return matchesSearch && matchesFilter;
    }),
  }));

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto mt-10 space-y-6">
        
        <h1 className="text-3xl font-bold">Tech Stack & Skills</h1>


        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search skills..."
            className="border px-4 py-2 rounded-xl w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border px-4 py-2 rounded-xl"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {skills.map((s) => (
              <option key={s.category} value={s.category}>
                {s.category}
              </option>
            ))}
          </select>
        </div>


        {filteredSkills.map(
          (section) =>
            section.items.length > 0 && (
              <div key={section.category} className="space-y-3">
                <h2 className="text-xl font-semibold">{section.category}</h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {section.items.map((skill) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`p-4 rounded-xl shadow text-white cursor-pointer ${levelColor[skill.level]}`}
                          >
                            <p className="font-medium">{skill.name}</p>
                            <p className="text-sm opacity-80 capitalize">{skill.level}</p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{skill.years} year(s) experience</p>
                        </TooltipContent>
                      </Tooltip>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </TooltipProvider>
  );
}
