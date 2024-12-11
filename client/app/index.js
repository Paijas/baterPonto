import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Importando as Páginas
import Login from "./pages/login";
import Home from "./pages/home";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
