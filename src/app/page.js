export const dynamic = "force-dynamic";

import CalendarComponent from "@/components/dashboard/CalendarComponent";
import Counts from "@/components/dashboard/Counts";
import RecordsChart from "@/components/dashboard/RecordsChart";
import DailyRecords from "@/components/dashboard/DailyRecords";
import { query } from "../../db";
import { Card, CardContent } from "@/components/ui/card";
import RandomProblem from "@/components/dashboard/RandomProblem";

export default async function DashboardComponent() {
  const result = await query(`
    SELECT pr.*, p.cn_link, p.en_link, p.title, p.translated_title, p.difficulty
    FROM problem_records pr
    JOIN problem p ON pr.problem_id = p.problem_id
    ORDER BY pr.date ASC
  `);
  const records = result.rows;

  return (
    <div className="flex flex-col md:flex-row p-4">
      <div className="flex flex-col w-full md:w-1/2 p-4">
        <div className="text-3xl pb-8 relative">
          Dashboard
          <RandomProblem records={records} />
        </div>
        <DailyRecords records={records} />
      </div>
      <div className="flex flex-col w-full md:w-1/2 max-h-screen gap-4 items-center p-4">
        <Card className="w-full flex flex-row items-center gap-4 justify-center overflow-x-auto">
          <CardContent className="min-w-[300px] w-1/2 p-4">
            <CalendarComponent />
          </CardContent>
          <CardContent className="min-w-[150px] flex-1 p-4">
            <Counts records={records} />
          </CardContent>
        </Card>
        <RecordsChart records={records} />
      </div>
    </div>
  );
}
