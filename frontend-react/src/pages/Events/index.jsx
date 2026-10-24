import { useState } from "react";
import Layout from "@/components/Layout";
import { events, groupByTerm } from "@/lib/events";
import HeroSection from "./components/HeroSection";
import FilterBar from "./components/FilterBar";
import TimelineSection from "./components/TimelineSection";

export default function Events() {
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? events : events.filter((e) => e.type === filter);

  return (
    <Layout>
      <div className="tl-progress" aria-hidden="true" />
      <HeroSection />
      <FilterBar filter={filter} setFilter={setFilter} />
      <TimelineSection terms={groupByTerm(visible)} showBeginning={filter === "all"} />
    </Layout>
  );
}
