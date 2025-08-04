import React from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import CategoryCard from '../components/CategoryCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AllCategoriesScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container} key={route?.key}>
      <AnimatedBackground style={styles.animatedBackground} />

      <ScrollView
        style={{ flex: 1, paddingTop: insets.top }}
        contentContainerStyle={styles.scroll}
      >
        <Animatable.Text animation="fadeInUp" delay={200} style={styles.title}>
          ¡Explora todas las categorías!
        </Animatable.Text>

        <View style={styles.grid}>
          <CategoryCard 
            title="Home" 
            description="Learn about home" 
            sub="Aprende sobre tu casa" 
            color="#FFC3A0" 
            delay={100} 
            onPress={() => navigation.navigate('HouseGameIntro')} 
          />
          <CategoryCard 
            title="Food" 
            description="Learn about food" 
            sub="Aprende sobre comida" 
            color="#FFD700" 
            delay={500} 
            onPress={() => navigation.navigate('FoodGameIntro', { progress: 0 })}
          />
          <CategoryCard 
            title="Weather" 
            description="Learn weather" 
            sub="Aprende sobre el clima" 
            color="#ADD8E6" 
            delay={700} 
            onPress={() => navigation.navigate('WeatherGameIntro', { progress: 0 })}
          />
          <CategoryCard 
            title="Family" 
            description="Learn about family" 
            sub="Aprende sobre la familia" 
            color="#FFDAB9" 
            delay={900} 
            locked={true}
            onPress={() => navigation.navigate('FamilyGameIntro', { progress: 0 })}
          />
          <CategoryCard 
            title="Technology" 
            description="Learn about technology" 
            sub="Aprende sobre tecnología" 
            color="#98FB98" 
            delay={1000} 
            locked={true}
            onPress={() => navigation.navigate('TechnologyGameIntro', { progress: 0 })}
          />
          <CategoryCard 
            title="Clothing" 
            description="Learn clothing" 
            sub="Aprende sobre ropa" 
            color="#D3D3D3" 
            delay={1100} 
            onPress={() => navigation.navigate('ClothingGameIntro', { progress: 0 })}
          />
          <CategoryCard 
            title="Nature" 
            description="Learn about nature" 
            sub="Aprende sobre naturaleza" 
            color="#32CD32" 
            delay={1400} 
            locked={true}
            onPress={() => navigation.navigate('NatureGameIntro', { progress: 0 })}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEB3B',
  },
  animatedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1, 
  },
  scroll: {
    alignItems: 'center',
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF4081',
    marginBottom: 30,
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
    letterSpacing: 2,
    transform: [{ rotate: '-0.5deg' }],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
});
