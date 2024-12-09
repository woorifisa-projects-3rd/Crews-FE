import styles from './DuesCheckbox.module.css';
import { Box, Checkbox, Flex, Text } from '@radix-ui/themes';

export default function DuesCheckBox({ children, checked, onCheckedChange }) {
  return (
    <Box className={styles.checkbox}>
      <Text as="label" size="2">
        <Flex as="p" gap="2">
          <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
          <Text as="span" weight="medium">
            {children}
          </Text>
        </Flex>
      </Text>
    </Box>
  );
}
