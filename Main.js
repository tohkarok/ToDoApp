import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  Platform,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

import { DataTable } from "react-native-paper";
import axios from "axios";

import { useCookies } from "react-cookie";

import Credit from "./Credit";

import { Provider as PaperProvider } from "react-native-paper";
import { MD3LightTheme } from "react-native-paper";

import { useFonts, Kanit_700Bold } from "@expo-google-fonts/kanit";

import { Icon } from "react-native-elements";

import DateTimePicker from "@react-native-community/datetimepicker";

import { Snackbar } from "react-native-paper";

function formatDate(inputDateString) {
  const inputDate = new Date(inputDateString);

  // Define options for formatting
  const options = {
    year: "numeric",
    month: "short", // Short month name (e.g., "Jan", "Feb")
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  // Format the date
  const dateFormatter = new Intl.DateTimeFormat("th-TH", options);
  const formattedDate = dateFormatter.format(inputDate);

  const part = formattedDate.split(" ");
  const result = `${part[0]} ${part[1]} ${part[2].substring(2)} เวลา ${
    part[3]
  }`;

  return result; // Output: "1 ต.ค. 65 เวลา 20:44 น"
}

function HomeScreen({ navigation }) {
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([5, 10, 15]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );
  const [cookies, setCookie] = useCookies(["token"]);

  const [items, setItems] = useState([]);

  const [test, setTest] = useState([]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isModal2Visible, setModal2Visible] = useState(false);
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [visible, setVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  const [id, setId] = useState("");

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  let [fontsLoaded, fontError] = useFonts({
    Kanit_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const theme = {
    ...MD3LightTheme, // or MD3LightTheme
    roundness: 2,
    colors: {
      ...MD3LightTheme.colors,
      primary: "#3498db",
      secondary: "#f1c40f",
      tertiary: "#a1b2c3",
    },
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleModal2 = () => {
    setModal2Visible(!isModal2Visible);
  };

  const handleConfirm = () => {
    // Add your logic for handling the confirmed data here
    console.log("Name:", name);
    console.log("Date:", new Date(selectedDate.getTime() + 7 * 60 * 60 * 1000));

    addHandle(name, new Date(selectedDate.getTime() + 7 * 60 * 60 * 1000));

    // Close the modal
    toggleModal();
    setName("");
    setSelectedDate(new Date());
  };

  const handleCancel = () => {
    // Clear any entered data and close the modal
    setName();
    setSelectedDate(new Date());
    toggleModal();
  };

  const handleConfirm2 = () => {
    // Add your logic for handling the confirmed data here
    console.log("Name:", name);
    console.log("Date:", new Date(selectedDate.getTime() + 7 * 60 * 60 * 1000));

    editHandle(name, new Date(selectedDate.getTime() + 7 * 60 * 60 * 1000));

    // Close the modal
    toggleModal2();
    setName("");
    setSelectedDate(new Date());
    setId("");
  };

  const handleCancel2 = () => {
    // Clear any entered data and close the modal
    setName("");
    setSelectedDate(new Date());
    toggleModal2();
  };

  const onDateChange = (event, date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
    }
  };

  axios
    .get("https://cache111.com/todoapi/activities", {
      headers: { Authorization: "Bearer " + cookies["token"] },
      timeout: 10 * 1000,
    })
    .then((response) => {
      response.data.forEach((item) => {
        item.whenA = item.when;
        item.when = formatDate(item.when);
      });
      setItems(response.data);
    })
    .catch((error) => {
      // if (error.code === "ECONNABORTED") {
      //   setSnackbarText("Timeout");
      // } else {
      //   setSnackbarText(error.message);
      //   onToggleSnackBar();
      // }
    });

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  function editHandle(name, when) {
    const newData = { name, when };
    new Promise((resolve, reject) => {
      setTimeout(() => {
        axios
          .put(
            "https://cache111.com/todoapi/activities/" + id,
            { name: newData.name, when: newData.when },
            {
              headers: {
                Authorization: "Bearer " + cookies["token"],
              },
              timeout: 10 * 1000,
            }
          )
          .then((response) => {
            setSnackbarText("แก้ไขข้อมูลสำเร็จ");
            onToggleSnackBar();
          })
          .catch((error) => {
            setSnackbarText(error.message);
            onToggleSnackBar();
          });
        resolve();
      }, 1000);
    });
  }

  const deleteHandle = (item) => {
    const oldData = item;
    new Promise((resolve, reject) => {
      setTimeout(() => {
        axios
          .delete("https://cache111.com/todoapi/activities/" + oldData.id, {
            headers: {
              Authorization: "Bearer " + cookies["token"],
            },
            timeout: 10 * 1000,
          })
          .then((response) => {
            setSnackbarText("ลบข้อมูลสำเร็จ");
            onToggleSnackBar();
          })
          .catch((error) => {
            setSnackbarText(error.message);
            onToggleSnackBar();
          });
        resolve();
      }, 1000);
    });
  };

  function addHandle(name, when) {
    const newData = { name, when };
    new Promise((resolve, reject) => {
      setTimeout(() => {
        axios
          .post(
            "https://cache111.com/todoapi/activities",
            { name: newData.name, when: newData.when },
            {
              headers: {
                Authorization: "Bearer " + cookies["token"],
              },
              timeout: 10 * 1000,
            }
          )
          .then((response) => {
            //False error
            // throw new Error("Injection");
            // newData.id = response.data.id;
            // setItems([...items, newData]);
            setSnackbarText("เพิ่มข้อมูลสำเร็จ");
            onToggleSnackBar();
          })
          .catch((error) => {
            // if (error.code === "ECONNABORTED") {
            //   // setSnackbarText("Timeout");
            // } else {
            setSnackbarText(error.message);
            onToggleSnackBar();
            // }
          });
        resolve();
      }, 1000);
    });
  }

  return (
    <PaperProvider theme={theme}>
      <DataTable style={{ backgroundColor: "#fff" }}>
        <DataTable.Header>
          <DataTable.Title>
            <Text style={{ fontFamily: "Kanit_700Bold" }}>กิจกรรม</Text>
          </DataTable.Title>
          <DataTable.Title numeric>
            <Text style={{ fontFamily: "Kanit_700Bold" }}>เวลา</Text>
          </DataTable.Title>
          <DataTable.Title style={{ justifyContent: "center" }}>
            <Text style={{ fontFamily: "Kanit_700Bold" }}>เครื่องมือ</Text>
          </DataTable.Title>
        </DataTable.Header>

        {items.slice(from, to).map((item) => (
          <DataTable.Row key={item.key}>
            <DataTable.Cell>{item.name}</DataTable.Cell>
            <DataTable.Cell numeric>{item.when}</DataTable.Cell>
            <DataTable.Cell style={{ justifyContent: "space-around" }}>
              <TouchableOpacity
                style={styles.IconButton}
                onPress={() => {
                  setName(item.name);
                  setSelectedDate(new Date(item.whenA));
                  setId(item.id);
                  toggleModal2();
                }}
              >
                <Icon name={"edit"} type="feather" size={20} color="#555" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.IconButton}
                onPress={() => deleteHandle(item)}
              >
                <Icon name={"trash-2"} type="feather" size={20} color="#555" />
              </TouchableOpacity>
            </DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(items.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} of ${items.length}`}
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          showFastPaginationControls
          selectPageDropdownLabel={"Rows per page"}
        />
      </DataTable>
      <Text>{test}</Text>

      <TouchableOpacity style={styles.button} onPress={toggleModal}>
        <Text style={styles.buttonText}>เพิ่มข้อมูล</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles2.modalContainer}>
          <View style={styles2.modalContent}>
            <Text>Enter Name:</Text>
            <TextInput
              style={styles2.input}
              placeholder="Name"
              value={name}
              onChangeText={(text) => setName(text)}
            />

            <Text>Enter Date:</Text>
            <DateTimePicker
              value={selectedDate}
              mode="datetime"
              display="default"
              onChange={onDateChange}
              style={{ width: 200, height: 60 }}
            />

            <View style={styles2.buttonContainer}>
              <Button title="Cancel" onPress={handleCancel} />
              <Button title="Confirm" onPress={handleConfirm} />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModal2Visible}
        onRequestClose={handleCancel2}
      >
        <View style={styles2.modalContainer}>
          <View style={styles2.modalContent}>
            <Text style={{ textAlign: "center", fontFamily: "Kanit_700Bold" }}>
              Edit
            </Text>
            <Text>Enter Name:</Text>
            <TextInput
              style={styles2.input}
              placeholder="Name"
              value={name}
              onChangeText={(text) => setName(text)}
            />

            <Text>Enter Date:</Text>
            <DateTimePicker
              value={selectedDate}
              mode="datetime"
              display="default"
              onChange={onDateChange}
              style={{ width: 200, height: 60 }}
            />

            <View style={styles2.buttonContainer}>
              <Button title="Cancel" onPress={handleCancel2} />
              <Button title="Confirm" onPress={handleConfirm2} />
            </View>
          </View>
        </View>
      </Modal>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={{
          label: "Close",
          onPress: () => {
            // Do something
          },
        }}
        key={'top-center'}
      >
        {snackbarText}
      </Snackbar>
    </PaperProvider>
  );
}

function CreditScreen() {
  return <Credit />;
}

const Drawer = createDrawerNavigator();

export default function Main({ navigation }) {
  function SignOutScreen() {
    useEffect(() => {
      navigation.navigate("sign-out");
    }, []);
  }

  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Credit" component={CreditScreen} />
        <Drawer.Screen name="SignOut" component={SignOutScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  flatList: {
    marginTop: 10,
  },
  flatListContent: {
    marginTop: 10,
    paddingBottom: 50,
  },
  flatListItems: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#cde",
    marginBottom: 8,
    padding: 10,
  },
  itemActivity: {
    fontSize: 18,
    fontWeight: "bold",
    color: "blue",
  },
  itemWhen: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },
  button: {
    backgroundColor: "#2980b9", // Button color
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff", // Button text color
    textAlign: "center",
    fontWeight: "bold",
  },
  IconButton: {
    // backgroundColor: "#fff", // Button color
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
});

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});