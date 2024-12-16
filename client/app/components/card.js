import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Registro({ registro}) {
  const [expandido, setExpandido] = useState(false);

  return (
    <View className="border border-gray-200 p-4 rounded-md mb-4" >
      <TouchableOpacity
        className="flex flex-row justify-between items-center"
        onPress={() => setExpandido(!expandido)}
      >
        <View className="flex gap-4 flex-row">
          <Ionicons size={22} name="calendar-clear-outline" />
          <Text className="text-center text-slate-500 text-xl font-bold">
            {registro[0]}
          </Text>
        </View>
        {expandido ? (
          <Ionicons name="chevron-up-outline" size={22}></Ionicons>
        ) : (
          <Ionicons name="chevron-down-outline" size={22}></Ionicons>
        )}
      </TouchableOpacity>

      {expandido && (
        <View className="flex flex-col gap-4 px-4 mt-4">
          {registro[1].map((hora, i) => (
            <View
              key={i}
              className="flex flex-row items-center justify-start gap-4"
            >
              <Ionicons
                size={36}
                color={i === 0 ? "#38bdf8" : "#fb7185"}
                name={
                  i === 0
                    ? "arrow-up-circle-outline"
                    : "arrow-down-circle-outline"
                }
              />
              <Text className="text-slate-500 text-lg font-semibold text-center py-3 rounded-sm">
                {hora}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
