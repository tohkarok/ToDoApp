import { useEffect } from "react";
import { useCookies } from "react-cookie";

import { Text, View } from "react-native";

export default function SignOut({ navigation}) {
  let [cookies, removeCookie] = useCookies(["token"]);
  useEffect(() => {
    removeCookie("token");
    navigation.navigate("sign-in");
  }, []);

  return (
    <View>
      <Text>กำลังออกจากระบบ</Text>
    </View>
  );
}