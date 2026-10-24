import { useState } from "react";
import Layout from "@/components/Layout";
import { events, groupByTerm } from "@/lib/events";
import HeroSection from "./components/HeroSection";
import FilterBar from "./components/FilterBar";
import TimelineSection from "./components/TimelineSection";

export default function Events() {
  const [filter, setFilter] = useState("all");
  const [series, setSeries] = useState("all");
  const [filterHeight, setFilterHeight] = useState(52);
  const visible = events.filter((event) =>
    (filter === "all" || event.type === filter) &&
    (series === "all" || event.seriesFilter === series)
  );

  function changeFilter(nextFilter) {
    if (nextFilter !== filter) setSeries("all");
    setFilter(nextFilter);
  }

  return (
    <Layout>
      <div className="tl-progress" aria-hidden="true" />
      <HeroSection />
      <FilterBar filter={filter} setFilter={changeFilter} series={series} setSeries={setSeries} onHeightChange={setFilterHeight} />
      <TimelineSection terms={groupByTerm(visible)} showBeginning={filter === "all"} filterHeight={filterHeight} />
    </Layout>
  );
}
