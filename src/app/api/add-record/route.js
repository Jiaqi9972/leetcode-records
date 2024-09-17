import { query } from "../../../../db";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      problemId,
      cnLink,
      enLink,
      title,
      translatedTitle,
      difficulty,
      date,
      remarks,
    } = body;

    await query(
      `INSERT INTO problem (problem_id, cn_link, en_link, title, translated_title, difficulty)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (problem_id) DO UPDATE SET
           cn_link = EXCLUDED.cn_link,
           en_link = EXCLUDED.en_link,
           title = EXCLUDED.title,
           translated_title = EXCLUDED.translated_title,
           difficulty = EXCLUDED.difficulty`,
      [problemId, cnLink, enLink, title, translatedTitle, difficulty]
    );

    await query(
      `INSERT INTO problem_records (problem_id, date, remarks)
         VALUES ($1, $2, $3)`,
      [problemId, date, remarks]
    );

    return new Response(
      JSON.stringify({ message: "Record added successfully!" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
