import ProblemForm from "@/components/ProblemForm";

export default function AddRecordComponent() {
  return (
    <div className="flex flex-col p-4 min-h-[calc(100vh-10rem)]">
      <div className="flex flex-col p-4">
        <div className="text-3xl pb-8">Add record</div>
        <ProblemForm />
      </div>
    </div>
  );
}
