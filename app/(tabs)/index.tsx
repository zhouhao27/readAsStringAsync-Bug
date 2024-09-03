import { Button, StyleSheet, Image } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function TabOneScreen() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async (): Promise<string | null> => {
    console.log('pickImage');
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
  
    // return uri to let Image component display the image is faster than display in base64 format.
    // but there is a bug to read the binary data from uri in iOS
    if (!result.canceled) {
      return result.assets[0].uri;
    }
  
    return null;
  };

  const uriToBinary = async (uri: string): Promise<string | null> => {
    console.log(`uri: ${uri}`);

    return FileSystem.readAsStringAsync(uri, {});
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {/* <EditScreenInfo path="app/(tabs)/index.tsx" /> */}
      <Button
        title="Pick an image from camera roll"
        onPress={() => {
          pickImage().then(async (image) => {
            console.log(`image uri: ${image}`);
            if (image) {
              setImage(image);

              // Covert to binary
              try {
                const binary = await uriToBinary(image);

                console.log(`image binary data: ${binary}`);                  
              } catch (error) {
                console.error(error);
              }
            }
          });
        }}
      />
      {image && <Image source={{uri: image }} style={styles.image} />}      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  image: {
    width: 200,
    height: 200,
  },
});
