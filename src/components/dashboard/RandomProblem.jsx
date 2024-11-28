"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Sparkles, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RandomProblem({ records }) {
  const [randomProblem, setRandomProblem] = useState(null);

  // Function to select a random problem from the records
  const handleRandomProblem = () => {
    const randomIndex = Math.floor(Math.random() * records.length);
    setRandomProblem(records[randomIndex]);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="absolute right-4 bg-primary hover:bg-primary/90"
          onClick={handleRandomProblem}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Random Problem
        </Button>
      </AlertDialogTrigger>
      {randomProblem && (
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl">
              Problem {randomProblem.problem_id}
              <Badge variant={randomProblem.difficulty.toLowerCase()}>
                {randomProblem.difficulty}
              </Badge>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium">CN Version</p>
                  <a
                    href={randomProblem.cn_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Link2 className="h-4 w-4" />
                    {randomProblem.translated_title}
                  </a>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium">EN Version</p>
                  <a
                    href={randomProblem.en_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Link2 className="h-4 w-4" />
                    {randomProblem.title}
                  </a>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
}
