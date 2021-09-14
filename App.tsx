import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { withSafeAreaInsets } from "react-native-safe-area-context";

interface InterClientes {
  name: string;
  email: string;
  phone: string;
}

const initialState: InterClientes = {
  name: "",
  email: "",
  phone: "",
};

export default function App() {
  const [users, setUsers] = useState<InterClientes[]>([]);
  const [user, setUser] = useState<InterClientes>(initialState);

  function handleRegister(): void {
    if (user.name === "" || user.email === "" || user.phone === "") {
      Alert.alert("Todos os campos devem ser preenchidos");
      return;
    }

    const filterEmail = users.filter((item) => {
      return user.email === item.email
    })

    if (filterEmail.length > 0) {
      Alert.alert("Email já cadastrado")
      return; 
    }
    setUsers([...users, user]);
  }


  useEffect(() => {
    async function pushUsers() {
      const sUsers = await AsyncStorage.getItem("@s_Users");

      if (sUsers) setUsers(JSON.parse(sUsers));
    }
    pushUsers();
  }, []);

  useEffect(() => {
    async function resgisterUsers() {
      await AsyncStorage.setItem("@s_Users", JSON.stringify(users));
    }
    resgisterUsers();
    setUser(initialState);
  }, [users]);

  function handleDelete(user: InterClientes): void {
    const deleteUser = users.filter((item) => {
      return item.email !== user.email;
    });
    setUsers(deleteUser);
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Nome"
            style={styles.input}
            onChangeText={(value) => {
              setUser({ ...user, name: value });
              
            }}
            value={user.name}
          />
          <TextInput
            placeholder="E-mail"
            style={styles.input}
            onChangeText={(value) => {
              setUser({ ...user, email: value });
            
            }}
            value={user.email}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Telefone"
            style={styles.input}
            onChangeText={(value) => {
              setUser({ ...user, phone: value });
              
            }}
            value={user.phone}
            keyboardType="phone-pad"
          />

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              handleRegister();
            }}
          >
            <Text style={styles.btnText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          <FlatList
            data={users}
            renderItem={({ item }) => (
              <TouchableOpacity
              onLongPress={() => {
                handleDelete(item);

              }}
              style={styles.card}
            >
              <View style={styles.textContainer}>
                <Text style={[styles.text, { fontSize: 16 }]}>{item.name}</Text>
                <Text style={[styles.text, { fontSize: 12 }]}>
                  {item.email}
                </Text>
                <Text style={[styles.text, { fontSize: 10 }]}>
                  {item.phone}
                </Text>
               
                
                
              </View>
              </TouchableOpacity>
            )}
            keyExtractor={({ email }) => email}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e4e4e4",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },

  addBtn: {
    width: 330,
    height: 60,
    backgroundColor: "#3e00a1",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 8,
    shadowColor: "#7a7a7a",
    shadowOpacity: 0.9,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    elevation: 3,
  },

  input: {
    color: "#151515",
    height: 40,
    margin: 12,
    padding: 10,
    borderColor: "black",
    width: "100",
    borderWidth: "2"
  },

  list: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginBottom: 50,
  },

  text: {
    marginHorizontal: 8,
    textAlign: "center",
    color: "white",
  },

  textContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginBottom: 20,
    flexDirection: "row",
  },
  card: {
    width: "100%",
    padding: 10,
    backgroundColor: "#0057c9",
    borderRadius: 15,
    marginBottom: 5,
  }
});
