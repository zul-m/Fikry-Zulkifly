import { useEffect, useRef } from 'react';
import { set, unset, useFormValue } from 'sanity';
import { TextInput, Button, Flex, Box } from '@sanity/ui';
import type { ObjectInputProps } from 'sanity';

type SlugValue = { _type: 'slug'; current?: string } | undefined;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function AutoSlugInput(props: ObjectInputProps<SlugValue>) {
  const { value, onChange, readOnly, elementProps } = props;
  const title = useFormValue(['title']) as string | undefined;

  const currentRef = useRef(value?.current ?? '');
  currentRef.current = value?.current ?? '';

  // Tracks the last value we auto-generated so we know if the user has
  // manually edited the slug since the last auto-generation.
  const lastGenerated = useRef('');

  useEffect(() => {
    if (!title) return;
    const cur = currentRef.current;
    if (cur === '' || cur === lastGenerated.current) {
      const generated = slugify(title);
      lastGenerated.current = generated;
      if (generated !== cur) {
        onChange(set({ _type: 'slug', current: generated }));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    // Detach auto-generation — user is now in control of the slug.
    lastGenerated.current = '';
    onChange(val ? set({ _type: 'slug', current: val }) : unset());
  }

  function handleRegenerate() {
    if (!title) return;
    const generated = slugify(title);
    lastGenerated.current = generated;
    onChange(set({ _type: 'slug', current: generated }));
  }

  return (
    <Flex gap={2} align="center">
      <Box flex={1}>
        <TextInput
          {...elementProps}
          value={value?.current ?? ''}
          onChange={handleChange}
          readOnly={readOnly}
        />
      </Box>
      <Button
        text="Reset"
        mode="ghost"
        fontSize={1}
        padding={3}
        onClick={handleRegenerate}
        disabled={!title || readOnly}
      />
    </Flex>
  );
}
