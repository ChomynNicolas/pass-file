import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

interface Props {
  progress: number;
}

const ProgressBar = ({ progress }: Props) => {
  const widthAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnimation, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false, // Necesario porque estamos animando width, que es una propiedad de estilo
    }).start();
  }, [progress,widthAnimation]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: widthAnimation.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 20,
    width: "100%",
    backgroundColor: "#e0e0df",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#458f26",
  },
});

export default ProgressBar;
