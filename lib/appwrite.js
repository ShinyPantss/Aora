import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  project_id: "66b14d240032adec5896",
  platform: "com.mmc.aora",
  db_id: "66b14e4100067209ad43",
  db_user_collection_id: "66b14e57003d4f14b044",
  db_videos_collection_id: "66b14ec0002a5e66d237",
  db_videoStorage_id: " 66b1509a0003d4ec379b",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.project_id) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw new Error("Account not created");

    const avatarUrl = avatars.getInitials(username);
    console.log(avatarUrl, "appwirte ici  avatar url");
    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.db_id,
      config.db_user_collection_id,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export async function signIn(email, password) {
  try {
    console.log(email, password);
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export async function signOut() {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw new Error("Account not found");

    const currentUser = await databases.listDocuments(
      config.db_id,
      config.db_user_collection_id,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw new Error("User not found");

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.db_id,
      config.db_videos_collection_id
    );

    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.db_id,
      config.db_videos_collection_id,
      [Query.orderDesc("$createdAt", Query.limit(7))]
    );

    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const searchPosts = async (query) => {
  try {
    console.log(query);

    const posts = await databases.listDocuments(
      config.db_id,
      config.db_videos_collection_id,
      [Query.search("title", query)]
    );
    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getUserPost = async (userId) => {
  try {
    console.log(userId, "getpost");
    const posts = await databases.listDocuments(
      config.db_id,
      config.db_videos_collection_id,
      [Query.equal("users", userId)]
    );
    console.log(posts);
    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
export const getFilePreview = async (fileId, type) => {
  let fileUrl;
  try {
    if (type === "video") {
      fileUrl = storage.getFileView(config.db_videoStorage_id, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.db_videoStorage_id,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }
    if (!fileUrl) {
      throw new Error();
    }
    return fileUrl;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const uploadFile = async (file, type) => {
  try {
    if (!file) return;
    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest };

    const fileData = await storage.createFile(
      config.db_videoStorage_id,
      ID.unique(),
      asset
    );
    const fileUrl = await getFilePreview(fileData.$id, type);
    return fileData.$id;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      config.db_id,
      config.db_videos_collection_id,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );
    return newPost;
  } catch (error) {
    throw new Error(error);
  }
};
