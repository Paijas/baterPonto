import { Alert ,Pressable, Text, View, TextInput, Image} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../assets/logo.png";
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const navigation = useNavigation()

  const handleLogin = (login, senha) => {
    if (login.trim() === "" || senha.trim() === "" || login === null || senha === null) {
      Alert.alert("Preencha todas os campos.");
    } else {
      navigation.navigate('Home')
    }
  };

  return (
    <View className="flex-1 bg-white justify-center items px-10">
      <View className="flex w-full gap-4  items-center">
        <Image className="w-[300px] h-[300px]" source={Logo} />
        <Pressable className="flex flex-row  bg-slate-200 px-4 w-full items-center rounded-md">
          <Ionicons className="mr-2" size={20} name="person-outline" aria-modal />
          <TextInput
            value={login}
            onChangeText={setLogin} 
            placeholder="Login"
            className="py-4 text-xl w-full"
          />
        </Pressable>
        <Pressable className="flex flex-row bg-slate-200 px-4 w-full items-center rounded-md">
          <Ionicons className="mr-2" size={20} name="lock-closed-outline" aria-modal />
          <TextInput
            value={senha}
            onChangeText={setSenha}  
            placeholder="Senha"
            className="py-4 text-xl w-full"
            secureTextEntry
          />
        </Pressable>
        <Pressable
          onPress={() => handleLogin(login, senha)}
          className="w-full bg-blue-500 px-4 py-4 justify-center items-center mt-8 rounded-md flex flex-row gap-4"
        >
          <Text className="text-white flex text-xl font-semibold">Entrar</Text>
          <Ionicons className="flex" name="arrow-forward-circle-outline" color={"white"} size={22} aria-modal />
        </Pressable>
      </View>
    </View>
  );
}
