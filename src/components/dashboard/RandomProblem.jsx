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
        <Button className="absolute right-4" onClick={handleRandomProblem}>
          Random problem
        </Button>
      </AlertDialogTrigger>
      {randomProblem && (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{randomProblem.id}</AlertDialogTitle>
            <AlertDialogDescription>
              Difficulty: {randomProblem.difficulty}
              <br />
              <a
                href={randomProblem.cn_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                CN Link {randomProblem.translated_title}
              </a>
              <br />
              <a
                href={randomProblem.en_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                EN Link {randomProblem.title}
              </a>
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
