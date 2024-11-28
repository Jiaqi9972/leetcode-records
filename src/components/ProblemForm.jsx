"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { useContext, useEffect } from "react";
import { format, formatISO, parse } from "date-fns";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { DateContext } from "@/context/DateContext";

const recordFormSchema = z.object({
  problemId: z.string().min(0, { message: "Problem ID is required" }),
  cnLink: z.string().url("Invalid CN Link URL").optional(),
  enLink: z.string().url("Invalid EN Link URL").optional(),
  title: z.string().min(0, { message: "Title is required" }),
  difficulty: z.enum(["Easy", "Medium", "Hard"], "Invalid difficulty level"),
  translatedTitle: z.string().optional(),
  date: z.string().min(0, { message: "Date is required" }),
  remarks: z.string().optional(),
});

const fileFormSchema = z.object({
  file: z
    .any()
    .refine((files) => files instanceof FileList && files.length > 0, {
      message: "Please upload a valid CSV file.",
    }),
});

export default function ProblemForm() {
  const { toast } = useToast();
  const user = useContext(UserContext).user;
  const router = useRouter();
  const { setActiveIndex } = useContext(DateContext);

  /*
      Record Form
      type the cnlink or enlink and get the details automatically
  */
  const recordForm = useForm({
    resolver: zodResolver(recordFormSchema),
    defaultValues: {
      problemId: "",
      cnLink: "",
      enLink: "",
      title: "",
      difficulty: "",
      translatedTitle: "",
      date: format(new Date(), "yyyy-MM-dd"),
      remarks: "",
    },
  });

  /*
    Function to get leetcode problem details and update the form
  */
  const cnLink = recordForm.watch("cnLink");
  const enLink = recordForm.watch("enLink");

  useEffect(() => {
    const fetchLeetcodeData = async (link) => {
      if (!link) return;

      try {
        const response = await fetch(`/api/get-leetcode-data?link=${link}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();

          if (data.question) {
            const {
              questionFrontendId,
              title,
              titleSlug,
              translatedTitle,
              difficulty,
            } = data.question;

            recordForm.setValue("problemId", questionFrontendId);
            recordForm.setValue("title", title);
            recordForm.setValue("translatedTitle", translatedTitle);
            recordForm.setValue("difficulty", difficulty);
            recordForm.setValue(
              "cnLink",
              link.includes("leetcode.cn")
                ? link
                : `https://leetcode.cn/problems/${titleSlug}/`
            );
            recordForm.setValue(
              "enLink",
              link.includes("leetcode.com")
                ? link
                : `https://leetcode.com/problems/${titleSlug}/`
            );
          }
        } else {
          console.error("Failed to fetch problem data");
        }
      } catch (error) {
        console.error("Error fetching problem data:", error);
      }
    };

    if (cnLink) fetchLeetcodeData(cnLink);
    else if (enLink) fetchLeetcodeData(enLink);
  }, [cnLink, enLink, recordForm]);

  /*
      Upload records csv file
  */
  const fileForm = useForm({
    resolver: zodResolver(fileFormSchema),
    defaultValues: {
      file: null,
    },
  });

  /*
      Add single record
  */
  const onSubmitRecord = async (data) => {
    if (!user) {
      toast({
        variant: "destructive",
        description: "Sorry, it's only available for the author.",
      });
      return;
    }

    if (data.date) {
      const selectedDate = parse(data.date, "yyyy-MM-dd", new Date()); // Parses as local time
      data.date = formatISO(selectedDate); // Formats to ISO string with local time
    }

    const token = await user.getIdToken();

    try {
      const response = await fetch("/api/add-record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const result = await response.json();
        console.log("Data successfully saved:", result);
        toast({
          description: "Record successfully saved",
        });
        recordForm.reset();
        setActiveIndex(0);
        router.push("/");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: `Error saving data: ${error.error}`,
      });
    }
  };

  /*
      Add multiple records with csv file
  */
  const onSubmitFile = async (data) => {
    if (!user) {
      toast({
        variant: "destructive",
        description: "Sorry, it's only available for the author.",
      });
      return;
    }

    const token = await user.getIdToken();

    const file = data.file[0];
    if (!file) {
      toast({
        variant: "destructive",
        description: "No file selected",
      });
      return;
    }

    let totalRecords = 0;
    let successCount = 0;
    let failureCount = 0;

    // process file with papa
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const records = results.data;
        totalRecords = records.length;

        // send api
        for (const record of records) {
          const {
            problem_id: problemId,
            cn_link: cnLink,
            en_link: enLink,
            title,
            translated_title: translatedTitle,
            difficulty,
            date,
            remarks,
          } = record;

          const payload = {
            problemId,
            cnLink,
            enLink,
            title,
            translatedTitle,
            difficulty,
            date,
            remarks,
          };

          if (payload.date) {
            const selectedDate = parse(payload.date, "yyyy-MM-dd", new Date()); // Parses as local time
            payload.date = formatISO(selectedDate); // Formats to ISO string with local time
          }

          try {
            const response = await fetch("/api/add-record", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(payload),
            });

            if (response.ok) {
              successCount++;
            } else {
              failureCount++;
              console.error(`Failed to upload record for ${title}.`);
            }
          } catch (error) {
            failureCount++;
            console.error(`Error uploading record for ${title}:`, error);
          }
        }

        // show the result
        toast({
          description: `Total Records: ${totalRecords}, Success: ${successCount}, Failure: ${failureCount}`,
        });

        fileForm.reset();
        router.push("/");
      },
      error: (error) => {
        toast({
          variant: "destructive",
          description: `Error parsing CSV: ${error.error}`,
        });
      },
    });
  };

  /*
      Download records
  */
  async function downloadCSV() {
    try {
      // Fetch the records from the API
      const response = await fetch("/api/get-records");

      if (!response.ok) {
        throw new Error("Failed to fetch records");
      }

      const records = await response.json();

      // Create the CSV header
      const header =
        "problem_id,cn_link,en_link,title,translated_title,difficulty,date,remarks\n";

      // Create the CSV rows
      const rows = records
        .map((record) => {
          const {
            problem_id,
            cn_link,
            en_link,
            title,
            translated_title,
            difficulty,
            date,
            remarks,
          } = record;

          // Format each field as needed and concatenate them into a single string for each row
          return `${problem_id},${cn_link},${en_link},${title},${translated_title},${difficulty},${
            new Date(date).toISOString().split("T")[0]
          },${remarks || ""}`;
        })
        .join("\n");

      // Combine the header and the rows
      const csvContent = header + rows;

      // Create a Blob object to store the CSV data
      const blob = new Blob([csvContent], { type: "text/csv" });

      // Create a link element to trigger the download
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "problem_records.csv";

      // Append the link to the body and trigger the download
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Clean up by removing the link
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
        {/* Left column - Main Form */}
        <div className="md:col-span-8">
          <Card className="h-full">
            <CardHeader className="relative">
              <CardTitle>Add single request</CardTitle>
              <CardDescription>
                Paste the leetcode link in the form.
              </CardDescription>
              <Button
                type="submit"
                form="record-form"
                className="absolute right-4 top-4"
              >
                Submit
              </Button>
            </CardHeader>
            <CardContent>
              <Form {...recordForm}>
                <form
                  id="record-form"
                  onSubmit={recordForm.handleSubmit(onSubmitRecord)}
                  className="space-y-6"
                >
                  {/* Links Section */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={recordForm.control}
                      name="cnLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CN Link</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Paste CN leetcode link here."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={recordForm.control}
                      name="enLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>EN Link</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Paste US leetcode link here."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Remarks Section */}
                  <FormField
                    control={recordForm.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter remarks"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Problem Details Section */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormField
                      control={recordForm.control}
                      name="problemId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Problem ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter problem ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={recordForm.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={recordForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Title Section */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={recordForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={recordForm.control}
                      name="translatedTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Translated Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter translated title"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Right column - File Upload and Download */}
        <div className="md:col-span-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add records with csv file</CardTitle>
              <CardDescription>
                Upload csv file at one time with all you records.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...fileForm}>
                <form
                  onSubmit={fileForm.handleSubmit(onSubmitFile)}
                  className="space-y-4"
                >
                  <FormField
                    control={fileForm.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload CSV File</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".csv"
                            onChange={(e) => field.onChange(e.target.files)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Upload and Process File
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="relative">
              <CardTitle>Download your records</CardTitle>
              <CardDescription>
                Download your records as a csv file.
              </CardDescription>
              <Button className="absolute right-4 top-4" onClick={downloadCSV}>
                Download
              </Button>
            </CardHeader>
            <CardContent>
              <div>The csv file format is:</div>
              <div className="text-sm mt-2 break-words text-primary font-mono">
                problem_id,cn_link,en_link,title,translated_title,difficulty,date,remarks
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
