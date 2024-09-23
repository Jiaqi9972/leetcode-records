"use client";

import { DateContext } from "@/context/DateContext";
import { useContext } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { isSameDay } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserContext } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

export default function DailyRecords({ records }) {
  const { currentDate } = useContext(DateContext);

  const currentDayRecords = records.filter((record) => {
    return isSameDay(record.date, currentDate);
  });

  const user = useContext(UserContext).user;
  const { toast } = useToast();

  const deleteRecord = async (id) => {
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/delete-record`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        toast({
          description: "Record deleted successfully",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: `Error deleting record: ${error.error}`,
      });
    }
  };

  return (
    <Card className="flex flex-col pt-4 gap-4 h-[calc(100vh-8rem)] overflow-y-scroll ">
      <CardHeader>
        <CardTitle>
          <div className="pb-4">
            {currentDate.toLocaleString("default", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <div className="pb-4">{currentDayRecords.length} problems</div>
          <Button onClick={() => console.log(currentDate)}>Test</Button>
        </CardTitle>
        {currentDayRecords.length > 0 ? (
          <CardDescription>Not bad huh.</CardDescription>
        ) : (
          <CardDescription>
            What?? You haven&apos;t done a single problem today? Get back to
            studying right now!
          </CardDescription>
        )}
      </CardHeader>
      {currentDayRecords.length > 0 ? (
        currentDayRecords.map((record) => (
          <CardContent key={record.id}>
            <Card key={record.id} className="relative bg-background">
              <CardHeader>
                <CardTitle>{record.problem_id}</CardTitle>
                <CardDescription>{record.difficulty}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-row flex-wrap gap-8">
                <a
                  href={record.en_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {record.title}
                </a>
                <a
                  href={record.cn_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {record.translated_title}
                </a>
              </CardContent>
              <CardContent>
                <Button onClick={() => console.log(record)}>test</Button>
              </CardContent>
              <CardContent>Remarks: {record.remarks}</CardContent>
              {user && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                    >
                      <Trash2 />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete this record?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your record.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteRecord(record.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </Card>
          </CardContent>
        ))
      ) : (
        <CardContent className="flex flex-col gap-4 text-3xl items-center text-center">
          <div>Hey what are you waiting for? Please go please!! </div>
          <div>Write some codes and solve some leetcode problems!!</div>
          <div>Run Jackie Run!!!</div>
        </CardContent>
      )}
    </Card>
  );
}
