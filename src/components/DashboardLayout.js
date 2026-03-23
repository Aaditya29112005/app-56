import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, useWindowDimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Haptics from '../utils/Haptics';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const DashboardLayout = ({ children, activeTab, onTabPress }) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const isLargeScreen = width >= 1024; 

  const handleLogout = () => {
    Haptics.selection();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.contentContainer}>
          {isLargeScreen && (
            <Sidebar 
                activeTab={activeTab} 
                onTabPress={onTabPress} 
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                onLogout={handleLogout}
            />
          )}
          <View style={[styles.mainContent, { backgroundColor: colors.background }]}>
            <TopBar />
            <View style={[styles.childrenWrapper, !isLargeScreen && styles.mobilePadding]}>
              {children}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
  },
  childrenWrapper: {
    flex: 1,
    padding: 24,
  },
  mobilePadding: {
    padding: 16,
  },
});

export default DashboardLayout;
