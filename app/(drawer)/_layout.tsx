import { Tabs } from 'expo-router';
import { MoreHorizontal, QrCode } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface AnimatedIconProps {
  focused: boolean;
  color: string;
  IconComponent: React.ComponentType<any>;
  label: string;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({ focused, color, IconComponent, label }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      animatedValue.setValue(0); // Reset the value
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [focused]);

  const circleScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const underlineWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  return (
    <View style={styles.iconLabelContainer}>
      <View style={styles.iconWrapper}>
        <Animated.View
          style={[
            styles.iconBackground,
            {
              transform: [{ scale: circleScale }],
              backgroundColor: '#FDB623',
            },
          ]}
        />
        <IconComponent color={focused ? '#000' : '#fff'} size={28} />
      </View>
      <Text style={[styles.tabLabel, { color }]}>{label}</Text>
      <Animated.View
        style={[
          styles.underline,
          {
            backgroundColor: color,
            width: underlineWidth,
          },
        ]}
      />
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FDB623',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          backgroundColor: '#333',
          borderTopWidth: 0,
          height: 90,
          width: '100%',
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.7,
          shadowRadius: 8,
          bottom: 0,
          left: '10%',
          borderRadius: 15,
          paddingTop: 25,
          alignItems: 'center',
        },
        tabBarLabel: () => null,
        tabBarIcon: ({ focused, color }) => {
          const IconComponent = route.name === 'scanner' ? QrCode : MoreHorizontal;
          const label = route.name === 'scanner' ? 'Scanner' : 'More';
          return (
            <AnimatedIcon
              focused={focused}
              color={color}
              IconComponent={IconComponent}
              label={label}
            />
          );
        },
      })}>
      <Tabs.Screen name="scanner" options={{ title: 'Scanner' }} />
      <Tabs.Screen name="more" options={{ title: 'More' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBackground: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
    width: '100%',
  },
  underline: {
    height: 2,
    position: 'absolute',
    bottom: -10,
  },
});
