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
        ? "bg-slate-200"
        : "bg-amber-500";
  const textColor = variant === "secondary" ? "text-slate-900" : "text-slate-900";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        tw`${bg} py-3 px-4 rounded-xl items-center`,
        (disabled || loading) && tw`opacity-50`,
        pressed && tw`opacity-80`,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color="#0f172a" />
      ) : (
        <Text style={tw`${textColor} font-bold text-base`}>{label}</Text>
      )}
    </Pressable>
  );
}
