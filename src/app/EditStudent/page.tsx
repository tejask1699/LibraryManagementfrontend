"use client";

import React, { useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm, FieldValues } from "react-hook-form";
import { useUpdate } from "@refinedev/core";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";
import Header from "../Header/header";
import { Student } from "../student-page/studentcolumns";

const EditStudent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentUuid = searchParams.get("id"); // Should be student_uuid from URL

  // Memoize initialData to prevent re-computation on every render
  const initialData = useMemo(() => {
    const parsedStudent = searchParams.get("student");
    let data: Student = {} as Student;
    try {
      if (parsedStudent) {
        data = JSON.parse(decodeURIComponent(parsedStudent)) as Student;
        console.log("Parsed initialData:", data);
      }
    } catch (error) {
      console.error("Failed to parse student data from URL", error);
    }
    return data;
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<
    Student & {
      current_password?: string;
      password?: string;
      confirm_password?: string;
    }
  >({
    defaultValues: {
      student_name: "",
      department: "",
      email: "",
      phone_no: "",
      address: "",
      roll_no: 0,
      year_of_admission: "",
      current_password: "",
      password: "",
      confirm_password: "",
    },
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData && initialData.student_uuid) {
      reset({
        student_name: initialData.student_name || "",
        department: initialData.department || "",
        email: initialData.email || "",
        phone_no: initialData.phone_no || "",
        address: initialData.address || "",
        roll_no: initialData.roll_no || 0,
        year_of_admission: initialData.year_of_admission || "",
        current_password: "",
        password: "",
        confirm_password: "",
      });
    } else {
      console.warn("No valid student_uuid in initialData:", initialData);
    }
  }, [initialData, reset]);

  const { mutate } = useUpdate();

  const onSubmit = (data: FieldValues) => {
    const hardcodedInstituteId = "828f0d33-258f-4a92-a235-9c1b30d8882b";

    // Use studentUuid from URL, falling back to initialData.student_uuid
    const validStudentUuid = studentUuid && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(studentUuid)
      ? studentUuid
      : initialData.student_uuid;
    
    console.log("studentUuid from URL:", studentUuid);
    console.log("initialData.student_uuid:", initialData.student_uuid);
    console.log("validStudentUuid:", validStudentUuid);

    if (!validStudentUuid || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(validStudentUuid)) {
      toast.error("Invalid student UUID format. A valid UUID is required.", { position: "top-center" });
      return;
    }

    const studentData: Partial<Student> = {
      student_id: initialData.student_id,
      student_uuid: validStudentUuid,
      student_name: data.student_name,
      department: data.department,
      email: data.email,
      phone_no: data.phone_no,
      address: data.address,
      roll_no: Number(data.roll_no),
      year_of_admission: data.year_of_admission,
      institute_id: hardcodedInstituteId,
    };

    // Handle password update only if new_password is provided
    const newPassword = data.new_password;
    const confirmNewPassword = data.confirm_new_password;
    if (newPassword && newPassword.trim() !== "") {
      if (newPassword !== confirmNewPassword) {
        toast.error("New password and confirm password do not match.", { position: "top-center" });
        return;
      }
      studentData.password = newPassword;
      studentData.confirm_password = confirmNewPassword;
    }

    console.log("Payload:", studentData);

    mutate(
      {
        resource: "student/edit",
        id: validStudentUuid,
        values: studentData,
      },
      {
        onSuccess: () => {
          toast.success("Student updated successfully!", { position: "top-center" });
          setTimeout(() => router.push("/student-page"), 500);
        },
        onError: (error: any) => {
          console.error("Update error:", error);
          toast.error(
            `Error updating student: ${error.message || "Please try again later."}`,
            { position: "top-center" }
          );
        },
      }
    );
  };

  return (
    <>
      <Header />
      <section className="p-10">
        <div className="container mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Edit Student</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Student Name */}
              <div>
                <Label>Student Name</Label>
                <Input
                  type="text"
                  {...register("student_name", { required: "Student Name is required" })}
                  placeholder="Enter Student Name"
                />
                {errors.student_name && (
                  <p className="text-red-500 text-sm">{errors.student_name.message}</p>
                )}
              </div>
              {/* Department */}
              <div>
                <Label>Department</Label>
                <Input
                  type="text"
                  {...register("department", { required: "Department is required" })}
                  placeholder="Enter Department"
                />
                {errors.department && (
                  <p className="text-red-500 text-sm">{errors.department.message}</p>
                )}
              </div>
              {/* Email */}
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Enter Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              {/* Phone Number */}
              <div>
                <Label>Phone Number</Label>
                <Input
                  type="text"
                  {...register("phone_no", { required: "Phone Number is required" })}
                  placeholder="Enter Phone Number"
                />
                {errors.phone_no && (
                  <p className="text-red-500 text-sm">{errors.phone_no.message}</p>
                )}
              </div>
              {/* Address */}
              <div>
                <Label>Address</Label>
                <Input
                  type="text"
                  {...register("address", { required: "Address is required" })}
                  placeholder="Enter Address"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address.message}</p>
                )}
              </div>
              {/* Roll No. */}
              <div>
                <Label>Roll No.</Label>
                <Input
                  type="number"
                  {...register("roll_no", {
                    required: "Roll No. is required",
                    valueAsNumber: true,
                  })}
                  placeholder="Enter Roll No."
                />
                {errors.roll_no && (
                  <p className="text-red-500 text-sm">{errors.roll_no.message}</p>
                )}
              </div>
              {/* Year of Admission */}
              <div>
                <Label>Year of Admission</Label>
                <Input
                  type="text"
                  {...register("year_of_admission", { required: "Year of Admission is required" })}
                  placeholder="Enter Year of Admission (e.g., 2023)"
                />
                {errors.year_of_admission && (
                  <p className="text-red-500 text-sm">{errors.year_of_admission.message}</p>
                )}
              </div>
              {/* Current Password */}
              <div>
                <Label>Current Password (optional)</Label>
                <Input
                  type="password"
                  {...register("current_password")}
                  placeholder="Enter Current Password"
                />
              </div>
              {/* New Password */}
              <div>
                <Label>New Password (optional)</Label>
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="Enter New Password"
                />
              </div>
              {/* Confirm New Password */}
              <div>
                <Label>Confirm New Password (optional)</Label>
                <Input
                  type="password"
                  {...register("confirm_password")}
                  placeholder="Confirm New Password"
                />
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => router.push("/student-page")}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#1E40AF] text-white rounded-[10px] hover:bg-[#1E40AF]">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default EditStudent;