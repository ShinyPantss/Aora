import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "../constants/icons";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPass, setShowPass] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}   `}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary  flex-row   items-center">
        <TextInput
          className=" flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor={"#7b7b8b"}
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" ? !showPass : false}
          {...props}
        />
        {title === "Password" && (
          <TouchableOpacity
            onPress={() => setShowPass(!showPass)}
            className="text-white  text-base  items-center justify-center"
          >
            <Image
              className="w-6 h-6"
              source={!showPass ? icons.eye : icons.eyeHide}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
