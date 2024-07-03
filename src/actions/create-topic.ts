"use server";

import { Topic } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/db";
import paths from "@/paths";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/^[a-z-]+$/, {
      message: "Only lowercase letters and dashes are allowed",
    }),
  description: z.string().min(10),
});

interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
}

export async function createTopic(
  formState: CreateTopicFormState,
  formData: FormData
): Promise<CreateTopicFormState> {
  const result = CreateTopicSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!result.success) {
    // console.error(result.error.flatten().fieldErrors);
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  //check that user is logged in before creating a topic
  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be logged in to create a topic"],
      },
    };
  }

  let topic: Topic;

  try {
    topic = await db.topic.create({
      data: {
        slug: result.data.name,
        description: result.data.description,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["An unknown error occurred"],
        },
      };
    }
  }

  // revalidate the homepage after creating a topic
  revalidatePath(paths.home());
  redirect(paths.topicShow(topic.slug));
}
