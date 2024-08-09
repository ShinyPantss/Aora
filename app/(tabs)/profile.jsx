import { View, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "../../constants";
import EmpytState from "../../components/EmpytState";
import { getUserPost, signOut } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import InfoBox from "../../components/InfoBox";
import { router } from "expo-router";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => getUserPost(user.$id));

  
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.push("/sign-in");
  };
  return (
    <SafeAreaView className="bg-primary h-full ">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => {
          return <VideoCard video={item} />;
        }}
        ListHeaderComponent={() => {
          return (
            <View className="w-full justify-center items-center mt-6 mb-12 px-4">
              <TouchableOpacity
                className="w-full items-end mb-10"
                onPress={logout}
              >
                <Image
                  source={icons.logout}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </TouchableOpacity>
              <View className="w-16 h-16 justify-center border-2  border-red-500 rounded-lg items-center  ">
                <Image
                  source={{ uri: user?.avatar }}
                  className="w-[%90] h-[90%] rounded-lg"
                  resizeMode="cover"
                />
              </View>
              <InfoBox
                title={user?.username}
                containerStyles="mt-5"
                titleStyles="text-lg text-white"
              />

              <View className="mt-5 flex-row">
                <InfoBox
                  title={posts.length || 0}
                  containerStyles="mr-10"
                  titleStyles="text-xl"
                  subtitle="Posts"
                />
                <InfoBox
                  title="1.2k"
                  subtitle="Followers"
                  titleStyles="text-xl"
                />
              </View>
            </View>
          );
        }}
        ListEmptyComponent={() => {
          return (
            <EmpytState
              title="No Videos Found"
              subtitle="No videos found for query"
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

export default Profile;
