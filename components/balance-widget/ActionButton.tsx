import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { createStyles } from './styles';
import { useThemeColors } from '../../hooks/use-theme-color';

/**
 * ActionButton
 *
 * Small presentational button used inside the `BalanceWidget`.
 *
 * Props:
 * - `name`: icon name from FontAwesome6
 * - `label`: visible label text
 * - `onPress?`: optional press handler
 * - `variant?`: 'column' (default) renders icon above label, 'row' renders icon + label inline
 */
interface Props {
  name: React.ComponentProps<typeof FontAwesome6>['name'];
  label: string;
  onPress?: () => void;
  variant?: 'column' | 'row';
}

export const ActionButton: React.FC<Props> = ({
  name,
  label,
  onPress,
  variant = 'column',
}) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const containerStyle = variant === 'row' ? styles.actionButton_ : styles.actionButton;
  const labelStyle = variant === 'row' ? styles.actionLabelRow : styles.actionLabel;

  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <FontAwesome6 style={styles.actionIcon} name={name} size={variant === 'row' ? 20 : 24} />
      <Text style={labelStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

export default ActionButton;
