import { query } from "../../../../db";

export async function GET(req) {
  try {
    const countsQuery = `
      SELECT 
        TO_CHAR(pr.date, 'YYYY-MM') AS month, 
        p.difficulty, 
        COUNT(*) AS count
      FROM problem_records pr
      JOIN problem p ON pr.problem_id = p.problem_id
      GROUP BY month, p.difficulty
      ORDER BY month ASC;
    `;

    const result = await query(countsQuery);

    const counts = {};

    result.rows.forEach((row) => {
      const month = row.month;
      const difficulty = row.difficulty.toLowerCase();
      const count = parseInt(row.count, 10);

      if (!counts[month]) {
        counts[month] = {
          total: 0,
          easy: 0,
          medium: 0,
          hard: 0,
        };
      }

      counts[month][difficulty] += count;
      counts[month].total += count;
    });

    const totalCounts = {
      total: 0,
      easy: 0,
      medium: 0,
      hard: 0,
    };

    Object.values(counts).forEach((monthCounts) => {
      totalCounts.easy += monthCounts.easy;
      totalCounts.medium += monthCounts.medium;
      totalCounts.hard += monthCounts.hard;
      totalCounts.total += monthCounts.total;
    });

    return new Response(
      JSON.stringify({
        counts,
        totalCounts,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching counts:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch counts" }), {
      status: 500,
    });
  }
}
