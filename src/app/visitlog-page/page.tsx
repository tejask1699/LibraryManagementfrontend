"use client";

import React, { useState, useEffect } from "react";
import Header from "../Header/header";
import {
  visitLogColumns,
  fallbackVisitLogData,
  VisitLog,
} from "./columns";
import { DataTable } from "@/components/data-tables/data-table";

const Page = () => {
  const [visitLogs, setVisitLogs] = useState<VisitLog[]>([]);

  useEffect(() => {
    const fetchVisitLogs = async () => {
      try {
        const res = await fetch("/api/visitlogs");
        // If response fails or data is empty, fallback to local data
        const data = !res.ok ? fallbackVisitLogData : await res.json();
        setVisitLogs(data?.length > 0 ? data : fallbackVisitLogData);
      } catch (error) {
        console.error("Error fetching visit logs:", error);
        setVisitLogs(fallbackVisitLogData);
      }
    };

    fetchVisitLogs();
  }, []);

  return (
    <>
      <Header />
      
        <div className="border border-[#E0E2E7] rounded-[10px] w-[90%] ml-10 mt-6">
          <DataTable columns={visitLogColumns} data={visitLogs} />
        </div>
    </>
  );
};

export default Page;
