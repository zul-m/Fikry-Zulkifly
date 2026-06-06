import { defineField, defineType } from "sanity";
import { AutoSlugInput } from "../components/AutoSlugInput";
import { RegistrationStatusInput } from "../components/RegistrationStatusInput";
import { AMENITY_ICON_OPTIONS, LOCATION_OPTIONS, PROPERTY_TYPE_OPTIONS } from "../constants";

export const newProject = defineType({
  name: "newProject",
  title: "Projek Baru",
  type: "document",
  fields: [
    // Identity
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
    // Status & CTA
    defineField({
      name: "registrationOpen",
      title: "Status Pendaftaran",
      type: "boolean",
      components: { input: RegistrationStatusInput },
      initialValue: true,
    }),
    defineField({
      name: "ctaLink",
      title: "Pautan WhatsApp",
      type: "url",
      validation: (Rule) =>
        Rule.uri({ scheme: ["https"] }).warning(
          "Pautan mestilah URL WhatsApp yang sah (https://wa.me/...).",
        ),
    }),
    // Media
    defineField({
      name: "image",
      title: "Imej Utama",
      type: "image",
    }),
    defineField({
      name: "gallery",
      title: "Galeri",
      type: "array",
      of: [
        {
          type: "image",
        },
      ],
      validation: (Rule) =>
        Rule.min(4).error(
          "Galeri mesti mengandungi sekurang-kurangnya 4 imej.",
        ),
    }),
    // Core details
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
      name: "priceFrom",
      title: "Harga Dari (RM)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "developer",
      title: "Pemaju",
      type: "string",
    }),
    defineField({
      name: "tenure",
      title: "Hak Milik",
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
      name: "totalUnits",
      title: "Jumlah Unit",
      type: "number",
      validation: (Rule) => Rule.positive().integer(),
    }),
    defineField({
      name: "size",
      title: "Saiz (kaki persegi)",
      type: "string",
    }),
    defineField({
      name: "bedrooms",
      title: "Bilik Tidur",
      type: "number",
      validation: (Rule) => Rule.positive().integer(),
    }),
    defineField({
      name: "bathrooms",
      title: "Bilik Air",
      type: "number",
      validation: (Rule) => Rule.positive().integer(),
    }),
    defineField({
      name: "parking",
      title: "Parkir",
      type: "number",
      validation: (Rule) => Rule.positive().integer(),
    }),
    defineField({
      name: "completionYear",
      title: "Tahun Siap Jangkaan",
      type: "string",
      placeholder: "cth. Q4 2027",
    }),
    // Content
    defineField({
      name: "description",
      title: "Tentang Projek",
      type: "array",
      of: [{ type: "block" }],
    }),
    // Amenities
    defineField({
      name: "amenities",
      title: "Kemudahan",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: AMENITY_ICON_OPTIONS,
        layout: "grid",
      },
    }),
    // Admin
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
      const loc = LOCATION_OPTIONS.find((l) => l.value === subtitle);
      return { title, subtitle: loc?.title ?? subtitle, media };
    },
  },
});
