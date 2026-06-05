import { useCallback, useEffect, useState } from "react";
import type { ComponentType } from "react";
import { set, useClient, useFormValue } from "sanity";
import type { StringInputProps } from "sanity";
import { Box, Card, Flex, Grid, Text, Tooltip } from "@sanity/ui";
import * as Icons from "lucide-react";
import { AMENITY_ICON_OPTIONS } from "../constants";

function toPascalCase(kebab: string): string {
  return kebab
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

export function AmenityIconInput(props: StringInputProps) {
  const { value, onChange } = props;
  const client = useClient({ apiVersion: "2024-01-01" });
  const documentId = useFormValue(["_id"]) as string | undefined;
  const [usedIcons, setUsedIcons] = useState<string[]>([]);

  useEffect(() => {
    const id = documentId?.replace(/^drafts\./, "") ?? "";
    client
      .fetch<
        string[]
      >(`*[_type == "amenity" && defined(icon) && _id != $id && _id != ("drafts." + $id)].icon`, { id })
      .then(setUsedIcons);
  }, [client, documentId]);

  const handleSelect = useCallback(
    (iconValue: string) => onChange(set(iconValue)),
    [onChange],
  );

  return (
    <Grid columns={4} gap={2}>
      {AMENITY_ICON_OPTIONS.map(({ title, value: iconValue }) => {
        const isUsed = usedIcons.includes(iconValue);
        const isSelected = value === iconValue;
        const disabled = isUsed && !isSelected;
        const Icon = (Icons as Record<string, unknown>)[
          toPascalCase(iconValue)
        ] as ComponentType<{ size?: number }> | undefined;

        const card = (
          <Card
            key={iconValue}
            as="button"
            type="button"
            padding={3}
            radius={2}
            tone={isSelected ? "primary" : "default"}
            selected={isSelected}
            disabled={disabled}
            onClick={() => !disabled && handleSelect(iconValue)}
            style={{
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.35 : 1,
              border: "none",
              width: "100%",
            }}
          >
            <Flex direction="column" align="center" gap={2}>
              {Icon && <Icon size={22} />}
              <Text size={0} align="center">
                {title}
              </Text>
            </Flex>
          </Card>
        );
        if (disabled) {
          return (
            <Tooltip
              key={iconValue}
              content={
                <Box padding={2}>
                  <Text size={1}>Ikon sudah digunakan</Text>
                </Box>
              }
              portal
            >
              <span>{card}</span>
            </Tooltip>
          );
        }
        return card;
      })}
    </Grid>
  );
}
