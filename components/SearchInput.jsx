import { View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../constants";
import { router, usePathname } from "expo-router";

const SearchInput = ({ initalQuery }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initalQuery || "");

  const handleSearch = () => {
    if (!query) {
      return Alert.alert(
        "Missing Query",
        "please input something to search results "
      );
    }
    if (pathname.startsWith("/search")) {
      router.setParams({ query });
    } else {
      router.push(`/search/${query}`);
    }
  };

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16  px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary">
      <TextInput
        className=" text-base mt-0.5 text-white flex-1 font-pregular h-full w-full "
        value={query}
        placeholder={"Search for a video topic"}
        placeholderTextColor={"#7b7b8b"}
        onChangeText={(e) => setQuery(e)}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity onPress={handleSearch}>
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
