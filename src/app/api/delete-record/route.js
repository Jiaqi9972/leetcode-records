import { query } from "../../../../db";

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await query(`DELETE FROM problem_records WHERE id = $1`, [id]);

    return new Response(
      JSON.stringify({ message: "Record deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting record:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
