import { useCallback } from 'react';
import { set } from 'sanity';
import type { BooleanInputProps } from 'sanity';
import { Flex, Switch, Text } from '@sanity/ui';

export function RegistrationStatusInput(props: BooleanInputProps) {
  const { value = true, onChange, elementProps } = props;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(set(e.currentTarget.checked));
    },
    [onChange]
  );

  return (
    <Flex align="center" gap={3}>
      <Switch {...elementProps} checked={value} onChange={handleChange} />
      <Text size={1} weight="semibold" style={{ color: value ? 'green' : 'red' }}>
        {value ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'}
      </Text>
    </Flex>
  );
}
