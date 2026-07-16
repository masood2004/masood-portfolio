"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters.")
    .max(80, "Name is too long."),

  email: z.string().trim().email("Please enter a valid email address."),

  phone: z.string().trim().max(25, "Phone number is too long.").optional(),

  subject: z
    .string()
    .trim()
    .min(3, "Subject must contain at least 3 characters.")
    .max(120, "Subject is too long."),

  message: z
    .string()
    .trim()
    .min(10, "Message must contain at least 10 characters.")
    .max(1000, "Message must not exceed 1000 characters."),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormData) {
    setSubmitted(false);

    // Temporary simulation for Task 2.
    // Supabase and Prisma will replace this during Task 4.
    await new Promise((resolve) => setTimeout(resolve, 700));

    console.log("Validated contact data:", data);

    setSubmitted(true);
    reset();
  }

  const inputClasses =
    "mt-2 w-full rounded-sm border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition focus:border-neutral-400";

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-28 py-20"
    >
      <div className="mb-8 flex items-center gap-4">
        <h2
          id="contact-heading"
          className="text-lg uppercase tracking-widest text-white"
        >
          Contact
        </h2>

        <div className="h-px flex-grow bg-neutral-800" />
      </div>

      <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h3 className="text-3xl font-bold tracking-tight text-white">
            Let&apos;s build something useful.
          </h3>

          <p className="mt-5 leading-7 text-neutral-400">
            Share your project, opportunity, or technical problem. This form
            currently performs frontend validation. Database storage will be
            connected during the Supabase integration task.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="border border-neutral-800 bg-neutral-900/40 p-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="text-sm text-neutral-300">
                Name *
              </label>

              <input
                id="name"
                type="text"
                {...register("name")}
                className={inputClasses}
                aria-invalid={Boolean(errors.name)}
              />

              {errors.name && (
                <p className="mt-2 text-xs text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="text-sm text-neutral-300">
                Email *
              </label>

              <input
                id="email"
                type="email"
                {...register("email")}
                className={inputClasses}
                aria-invalid={Boolean(errors.email)}
              />

              {errors.email && (
                <p className="mt-2 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="text-sm text-neutral-300">
                Phone
              </label>

              <input
                id="phone"
                type="tel"
                {...register("phone")}
                className={inputClasses}
              />

              {errors.phone && (
                <p className="mt-2 text-xs text-red-400">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="subject" className="text-sm text-neutral-300">
                Subject *
              </label>

              <input
                id="subject"
                type="text"
                {...register("subject")}
                className={inputClasses}
                aria-invalid={Boolean(errors.subject)}
              />

              {errors.subject && (
                <p className="mt-2 text-xs text-red-400">
                  {errors.subject.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="message" className="text-sm text-neutral-300">
              Message *
            </label>

            <textarea
              id="message"
              rows={6}
              {...register("message")}
              className={`${inputClasses} resize-y`}
              aria-invalid={Boolean(errors.message)}
            />

            {errors.message && (
              <p className="mt-2 text-xs text-red-400">
                {errors.message.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 border border-neutral-600 bg-white px-6 py-3 text-sm font-bold text-neutral-950 transition hover:bg-neutral-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Validating..." : "Submit enquiry"}
          </button>

          {submitted && (
            <p
              role="status"
              className="mt-5 border border-green-900 bg-green-950/30 p-4 text-sm text-green-300"
            >
              Form validation successful. Database submission will be connected
              during the Supabase integration stage.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
