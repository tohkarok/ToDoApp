import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useCookies } from 'react-cookie';

import { PaperProvider } from 'react-native-paper';
import { Icon } from 'react-native-elements';

import { Button, Snackbar } from 'react-native-paper';

export default function SignIn({ navigation }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [cookies, setCookie] = useCookies(['token']);

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [visible, setVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  const signIn = () => {
    axios
      .post(
        'https://cache111.com/todoapi/tokens',
        { id: id, password: password },
        { headers: {}, timeout: 10 * 1000 }
      )
      .then((response) => {
        setCookie('token', response.data.token);
        navigation.navigate('main');
      })
      .catch((error) => {
        setSnackbarText(error.message);
        onToggleSnackBar();
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>เข้าสู่ระบบ</Text>
      <TextInput
        style={styles.input}
        placeholder="เลขประจำตัวประชาชน"
        keyboardType="numeric"
        onChangeText={setId}
      />
     <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
          placeholder="รหัสผ่าน"
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.toggleButton} onPress={togglePasswordVisibility}>
          <Icon
            name={showPassword ? 'eye-off' : 'eye'}
            type="feather"
            size={20}
            color="#555"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
      </TouchableOpacity>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Close',
          onPress: () => {
            // Do something
          },
        }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F13596', // Background color
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Text color
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff', // Border color
    borderRadius: 5,
    padding: 10,
    margin: 10,
    width: '80%',
    backgroundColor: '#fff', // Input background color
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#fff',
    padding: 10,
    margin: 10,
    width: '80%',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2980b9', // Button color
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff', // Button text color
    textAlign: 'center',
    fontWeight: 'bold',
  },
});