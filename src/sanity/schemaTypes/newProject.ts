import { defineField, defineType } from "sanity";
import { AutoSlugInput } from "../components/AutoSlugInput";
import { RegistrationStatusInput } from "../components/RegistrationStatusInput";
import { LOCATION_OPTIONS, PROPERTY_TYPE_OPTIONS } from "../constants";

export const newProject = defineType({
  name: "newProject",
  title: "Projek Baru",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nama Projek",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      components: { input: AutoSlugInput },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "developer",
      title: "Pemaju",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Lokasi",
      type: "string",
      options: {
        list: LOCATION_OPTIONS,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priceFrom",
      title: "Harga Dari (RM)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "propertyType",
      title: "Jenis Hartanah",
      type: "string",
      options: {
        list: PROPERTY_TYPE_OPTIONS,
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tenure",
      title: "Pegangan",
      type: "string",
      options: {
        list: [
          { title: "Pajakan", value: "leasehold" },
          { title: "Pegangan Bebas", value: "freehold" },
          { title: "Tanah Rezab Melayu", value: "malay-reserve" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "completionYear",
      title: "Tahun Siap Jangkaan",
      type: "number",
    }),
    defineField({
      name: "description",
      title: "Keterangan",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "image",
      title: "Imej Utama",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) =>
        Rule.custom(async (value, context) => {
          if (!value?.asset?._ref) return true;
          const client = context.getClient({ apiVersion: "2024-01-01" });
          const size = await client.fetch(`*[_id == $id][0].size`, {
            id: value.asset._ref,
          });
          if (size > 150 * 1024) {
            return `Saiz imej (${Math.round(size / 1024)} KB) melebihi had 150 KB, sila kompres imej.`;
          }
          return true;
        }),
    }),
    defineField({
      name: "gallery",
      title: "Galeri",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          validation: (Rule) =>
            Rule.custom(async (value, context) => {
              if (!value?.asset?._ref) return true;
              const client = context.getClient({ apiVersion: "2024-01-01" });
              const size = await client.fetch(`*[_id == $id][0].size`, {
                id: value.asset._ref,
              });
              if (size > 150 * 1024) {
                return `Saiz imej (${Math.round(size / 1024)} KB) melebihi had 150 KB, sila kompres imej.`;
              }
              return true;
            }),
        },
      ],
    }),
    defineField({
      name: "registrationOpen",
      title: "Status Pendaftaran",
      type: "boolean",
      components: { input: RegistrationStatusInput },
      initialValue: true,
    }),
    defineField({
      name: "publishedAt",
      title: "Tarikh Diterbitkan",
      type: "date",
      initialValue: () => new Date().toISOString().split("T")[0],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "location",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      const loc = LOCATION_OPTIONS.find(l => l.value === subtitle);
      return { title, subtitle: loc?.title ?? subtitle, media };
    },
  },
});
