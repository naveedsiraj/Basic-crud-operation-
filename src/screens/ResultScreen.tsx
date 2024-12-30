import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Video from 'react-native-video';
import { useRoute } from '@react-navigation/native';

const ResultScreen = () => {
  const route = useRoute();
  const { notificationData }: any = route.params || {}; // Get notification data
  const videoUrl = notificationData?.url; // Extract video URL from notificationData

  const [isBuffering, setIsBuffering] = useState(false); // State to track buffering status

  // Callback to handle buffering state
  const onBuffer = (buffer: any) => {
    console.log('Buffering status:', buffer);
    setIsBuffering(buffer.isBuffering); // Update buffering state based on event
  };

  console.log("=================================");
  console.log('Received Video URL in ResultScreen:', videoUrl); // Log video URL
  console.log("=================================");

  return (
    <View style={styles.container}>
      {videoUrl ? (
        <Video
          source={{ uri: videoUrl }} // Use videoUrl
          style={styles.video}
          controls
          resizeMode="contain"
          onBuffer={onBuffer}
        />
      ) : (
        <Text style={styles.noVideoText}>No video available to display.</Text>
      )}
    </View>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  video: {
    width: Dimensions.get('window').width * 0.9, // 90% of screen width
    height: Dimensions.get('window').height * 0.5, // 50% of screen height
    backgroundColor: '#000',
  },
  noVideoText: {
    fontSize: 18,
    color: '#333',
  },
});
