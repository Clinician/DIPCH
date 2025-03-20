import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, SafeAreaView } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useProcedures } from '../../context/ProcedureContext';

interface ProcedureListProps {
  onNavigate?: (screen: string, params?: any) => void;
  onBack?: () => void;
}

const ProcedureList: React.FC<ProcedureListProps> = ({
  onNavigate = () => {},
  onBack = () => {},
}) => {
  const { t } = useLanguage();
  const { procedures, deleteProcedure } = useProcedures();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedProcedure, setExpandedProcedure] = useState<string | null>(null);

  // Filter procedures based on search term and sort by date (newest first)
  const filteredProcedures = procedures
    .filter((procedure) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        procedure.procedureType.toLowerCase().includes(searchLower) ||
        procedure.hospital.toLowerCase().includes(searchLower) ||
        procedure.surgeon.toLowerCase().includes(searchLower) ||
        procedure.date.includes(searchTerm)
      );
    })
    .sort((a, b) => {
      // Sort by date, newest first
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

  // Handle procedure deletion
  const handleDeleteProcedure = (id: string) => {
    Alert.alert(
      t("procedureList.deleteConfirm.title"),
      t("procedureList.deleteConfirm.description"),
      [
        {
          text: t("procedureList.deleteConfirm.cancel"),
          style: "cancel",
        },
        {
          text: t("procedureList.deleteConfirm.confirm"),
          onPress: () => {
            deleteProcedure(id);
            setExpandedProcedure(null);
          },
          style: "destructive",
        },
      ]
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Render procedure actions
  const renderProcedureActions = (id: string) => {
    return (
      <View style={styles.actionsContainer}>
        <View style={styles.actionButtonsRow}