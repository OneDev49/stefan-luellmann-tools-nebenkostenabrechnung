import z from "zod";
import { StringFormatParams } from "zod/v4/core";

export const DISTRIBUTION_TYPES = ["AREA", "PERSONS", "UNITS"] as const;

// The Period of the Invoice of additional costs (Nebenkostenabrechnung)
export const periodSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine((data) => data.to > data.from, {
    message: "Das Enddatum muss nach dem Startdatum liegen.",
    path: ["to"],
  });

// Landlord Information
export const landlordSchema = z.object({
  name: z
    .string()
    .min(1, "Name des Vermieters ist erforderlich")
    .max(100, "Name zu lang"),
  street: z
    .string()
    .min(1, "Straße ist erforderlich")
    .max(100, "Straße darf nicht länger als 100 Buchstaben lang sein"),
  zip: z
    .string()
    .min(5, "PLZ muss mind. 5 Zeichen haben")
    .max(10, "PLZ darf nicht länger als 10 Zeichen sein"),
  city: z
    .string()
    .min(1, "Stadt ist erforderlich")
    .max(100, "Stadt darf nicht länger als 100 Buchstaben lang sein"),
  email: z.email("Ungültige E-Mail").optional().or(z.literal("")),
  phone: z.string().optional(),
  iban: z
    .string()
    .min(15, "IBAN zu kurz")
    .max(34, "IBAN zu lang")
    .optional()
    .or(z.literal("")),
  bankName: z.string().max(100).optional(),
  bic: z.string().max(11, "BIC zu lang").optional(),
});

// Adress and Object Information
export const propertySchema = z.object({
  street: z
    .string()
    .min(1, "Straße ist erforderlich")
    .max(100, "Straße darf nicht länger als 100 Buchstaben lang sein"),
  zip: z
    .string()
    .min(5, "PLZ muss mind. 5 Zeichen haben")
    .max(10, "PLZ darf nicht länger als 10 Zeichen sein"),
  city: z
    .string()
    .min(1, "Stadt ist erforderlich")
    .max(100, "Stadt darf nicht länger als 100 Buchstaben lang sein"),
  totalArea: z
    .number()
    .min(1, "Gesamtfläche muss größer als 0 sein")
    .max(
      1000000,
      "Gesamtflächen größer als 1 Million werden noch nicht unterstützt"
    ),
  totalUnits: z
    .number()
    .int()
    .min(1, "Anzahl Wohneinheiten muss größer als 0 sein")
    .max(1000, "Mehr als 1000 Wohneinheiten werden noch nicht unterstützt"),
  totalPersons: z
    .number()
    .int()
    .min(0, "Gesamtpersonenanzahl muss 0 oder größer sein")
    .max(1000, "Mehr als 1000 werden nicht unterstützt"),
});

// The tenant Information
export const tenantSchema = z.object({
  name: z
    .string()
    .min(1, "Name ist erforderlich")
    .max(100, "Name darf nicht länger als 100 Zeichen lang sein"),
  currentArea: z
    .number()
    .min(1, "Wohnfläche muss größer als 0 sein")
    .max(
      1000000,
      "Wohnflächen größer als 1 Million werden noch nicht unterstützt"
    ),
  persons: z
    .number()
    .int()
    .min(1, "Personenanzahl muss größer als 0 sein")
    .max(
      10000,
      "Personenanzahl größer als zehntausend wird noch nicht unterstützt"
    ),
  prepayments: z
    .number()
    .min(0, "Vorauszahlungen dürfen nicht negativ sein")
    .max(
      1000000,
      "Vorauszahlungen größer als 1 Million werden noch nicht unterstützt"
    ),
});

// Cost Item Information
export const costItemSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(1, "Bezeichnung ist erforderlich")
    .max(50, "Bezeichnung zu lang"),
  amount: z
    .number()
    .min(0.01, "Betrag muss größer als 0 sein")
    .max(1000000, "Beträge größer als 1 Million werden noch nicht unterstützt"),
  distributionType: z.enum(
    DISTRIBUTION_TYPES,
    "Bitte einen Verteilerschlüssel wählen"
  ),
});

// The main schema
export const calculationSchema = z.object({
  landlord: landlordSchema,
  billingPeriod: periodSchema,
  usagePeriod: periodSchema,
  property: propertySchema,
  tenant: tenantSchema,
  items: z.array(costItemSchema),
});

export type Period = z.infer<typeof periodSchema>;
export type LandLordData = z.infer<typeof landlordSchema>;
export type PropertyData = z.infer<typeof propertySchema>;
export type TenantData = z.infer<typeof tenantSchema>;
export type CostItem = z.infer<typeof costItemSchema>;
export type DistributionType = (typeof DISTRIBUTION_TYPES)[number];

export type CalculationData = z.infer<typeof calculationSchema>;
