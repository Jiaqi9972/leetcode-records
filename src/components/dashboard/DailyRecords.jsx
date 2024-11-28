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
import { Link2, Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

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
    <Card className="flex flex-col pt-4 gap-4 h-[calc(100vh-12rem)] overflow-y-scroll ">
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
            <Card
              key={record.id}
              className="relative bg-background hover:shadow-md transition-shadow"
            >
              {/* Delete Button */}
              {user && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl">
                        Delete Record
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this record? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteRecord(record.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              <CardHeader>
                <div className="flex items-center gap-3">
                  <CardTitle className="text-xl">
                    Problem {record.problem_id}
                  </CardTitle>
                  <Badge variant={record.difficulty.toLowerCase()}>
                    {record.difficulty}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      EN Version
                    </p>
                    <a
                      href={record.en_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Link2 className="h-4 w-4" />
                      {record.title}
                    </a>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      CN Version
                    </p>
                    <a
                      href={record.cn_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Link2 className="h-4 w-4" />
                      {record.translated_title}
                    </a>
                  </div>
                </div>

                {record.remarks && (
                  <div className="pt-2">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Remarks
                    </p>
                    <p className="text-sm">{record.remarks}</p>
                  </div>
                )}
              </CardContent>
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
