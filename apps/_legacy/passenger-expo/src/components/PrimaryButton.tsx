import {
  ActivityIndicator,
  Pressable,
  Text,
  type PressableProps,
} from "react-native";
import tw from "tailwind-react-native-classnames";

interface PrimaryButtonProps extends PressableProps {
  label: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

export function PrimaryButton({
  label,
  loading,
  variant = "primary",
  disabled,
  ...rest
}: PrimaryButtonProps) {
  const bg =
    variant === "danger"
      ? "bg-red-600"
      : variant === "secondary"
        ? "bg-gray-200"
        : "bg-teal-700";
  const textColor = variant === "secondary" ? "text-gray-900" : "text-white";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        tw`${bg} py-3 px-4 rounded-lg items-center`,
        (disabled || loading) && tw`opacity-50`,
        pressed && tw`opacity-80`,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === "secondary" ? "#0f172a" : "#fff"} />
      ) : (
        <Text style={tw`${textColor} font-semibold text-base`}>{label}</Text>
      )}
    </Pressable>
  );
}
