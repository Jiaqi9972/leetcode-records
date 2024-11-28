import ProblemForm from "@/components/ProblemForm";

export default async function AddRecordComponent() {
  return (
    <div className="flex-1 p-4 min-h-[calc(100vh-4rem)] overflow-x-hidden">
      <h1 className="text-3xl mb-8">Add record</h1>
      <ProblemForm />
    </div>
  );
}
