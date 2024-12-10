import { Pressable, Text, View, TextInput, Image } from "react-native";
import React, { Component } from "react";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../assets/logo.png";
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  render() {
    return (
      <View className="flex-1 bg-white justify-center items px-10">
        <View className="flex w-full gap-4  items-center">
          <Image className="w-[300px] h-[300px]" source={Logo} />
          <Pressable className="flex flex-row bg-slate-200 px-4 w-full items-center rounded-md">
            <Ionicons
              className="mr-2"
              size={20}
              name="person-outline"
              aria-modal
            />
            <TextInput placeholder="Login" className="py-4 text-xl w-full" />
          </Pressable>
          <Pressable className="flex flex-row bg-slate-200 px-4 w-full items-center rounded-md">
            <Ionicons
              className="mr-2"
              size={20}
              name="lock-closed-outline"
              aria-modal
            />
            <TextInput
              placeholder="Senha"
              className="py-4 text-xl w-full"
              secureTextEntry
            />
          </Pressable>
          <Pressable className="w-full bg-blue-500 px-4 py-4 justify-center items-center mt-8  rounded-md flex flex-row gap-4 ">
            <Text className="text-white flex text-xl font-semibold">
              Entrar
            </Text>
            <Ionicons
              className="flex"
              name="arrow-forward-circle-outline"
              color={"white"}
              size={22}
              aria-modal
            ></Ionicons>
          </Pressable>
        </View>
      </View>
    );
  }
}
