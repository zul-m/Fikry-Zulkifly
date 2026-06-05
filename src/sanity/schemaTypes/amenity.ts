import type { ComponentType } from "react";
import { defineField, defineType } from "sanity";
import * as Icons from "lucide-react";
import { AmenityIconInput } from "../components/AmenityIconInput";
import { AMENITY_ICON_OPTIONS } from "../constants";

function toPascalCase(kebab: string): string {
  return kebab
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

export const amenity = defineType({
  name: "amenity",
  title: "Kemudahan",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Nama Kemudahan",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Ikon",
      type: "string",
      components: { input: AmenityIconInput },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "icon",
    },
    prepare({ title, subtitle }) {
      const Icon = (Icons as Record<string, unknown>)[
        toPascalCase(subtitle ?? "")
      ] as ComponentType | undefined;
      return { title, subtitle, media: Icon };
    },
  },
});
