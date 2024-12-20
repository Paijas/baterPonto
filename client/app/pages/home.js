import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import Card from '../components/card'
import axiosConfig from '../../services/axiosConfig'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const [horario, setHorario] = useState("");
  const [registros, setRegistros] = useState([null, null]);
  const [isPressed, setIsPressed] = useState(false);
  const [pressDuration, setPressDuration] = useState(0);
  const [buttonColor, setButtonColor] = useState("bg-blue-400");
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const updateHora = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const timeString = `${hours}:${minutes}:${seconds}`;
      setHorario(timeString);
    };

    const interval = setInterval(updateHora, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer;
    if (isPressed) {
      timer = setInterval(() => {
        setPressDuration((prev) => prev + 1);
      }, 100);
    } else {
      setPressDuration(0);
      setButtonColor("bg-blue-400");
    }

    if (pressDuration >= 10) {
      setButtonColor("bg-blue-600");
    }

    return () => clearInterval(timer);
  }, [isPressed, pressDuration]);

  const registraPonto = () => {
    if (pressDuration >= 10) {
      const indexVazio = registros.findIndex((registro) => registro === null);

      if (indexVazio !== -1) {
        const horaAtual = new Date().toLocaleTimeString();
        const novosRegistros = [...registros];
        novosRegistros[indexVazio] = horaAtual;
        setRegistros(novosRegistros);

        if (novosRegistros.every((registro) => registro !== null)) {
          const data = new Date();
          const ano = data.getFullYear();
          let mes = data.getMonth() + 1;
          let dia = data.getDate();

          if (dia < 10) dd = "0" + dd;
          if (mes < 10) mm = "0" + mm;

          const dataAtual = dia + "/" + mes + "/" + ano;

          setHistorico([...historico, [dataAtual, novosRegistros]]);
          setRegistros([null, null]);
        }
      } else {
        alert("Todos os pontos já foram registrados!");
      }
    } else {
      alert("Segure o botão por 2 segundos para registrar o ponto!");
    }
  };



  return (
    <ScrollView className="flex-1 bg-white">
      <View className="w-full border-b h-[72px] items-end justify-center px-4 border-slate-200 bg-blue-500">
        <Ionicons name="person-circle-outline" color={"white"} size={52} />
      </View>

      <View className="flex-1 w-full bg-white items-center py-4 px-4">
        <View className="w-full flex border border-slate-200 shadow-sm bg-white items-center justify-center h-auto py-2 rounded-xl ">
          <Text className="font-bold text-slate-400 text-[60px]">
            {horario}
          </Text>
        </View>

        <View className="flex flex-row w-full gap-2 mt-4 justify-center items-center">
          <Pressable
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onPress={() => registraPonto()}
            className={`flex-1 py-4 ${buttonColor} rounded-md justify-center items-center`}
          >
            <Text className="flex text-white font-bold text-1xl">
              Registrar Ponto
            </Text>
          </Pressable>
        </View>

        <View className="flex w-full mt-6">
          <Text className="text-slate-400 border-b pb-2 border-slate-200 font-semibold text-3xl mt-4">
            Ultimos Registros
          </Text>
          <View className="gap-2 mt-4">
            {historico.map((registro) => (
             <Card registro={registro} />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
