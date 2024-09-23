import { query } from "../../../../db";

export async function GET(req) {
  try {
    // Execute the database query
    const result = await query(`
      SELECT pr.*, p.cn_link, p.en_link, p.title, p.translated_title, p.difficulty
      FROM problem_records pr
      JOIN problem p ON pr.problem_id = p.problem_id
      ORDER BY pr.date ASC
    `);

    const records = result.rows;

    // Return the records as a JSON response with a 200 status
    return new Response(JSON.stringify(records), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Return an error response with a 500 status
    return new Response(
      JSON.stringify({
        message: "Failed to fetch data",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
