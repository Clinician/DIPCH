import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useProcedures } from '../../context/ProcedureContext';

interface ProcedureDetailProps {
  navigation?: any;
  route?: any;
}

const ProcedureDetail: React.FC<ProcedureDetailProps> = ({ navigation, route }) => {
  const { t } = useLanguage();
  const { getProcedure, deleteProcedure } = useProcedures();
  const [activeTab, setActiveTab] = useState<'details' | 'implants'>('details');
  
  // Get procedure ID from route params
  const procedureId = route?.params?.id;
  
  // Get procedure data
  const procedure = getProcedure(procedureId);
  
  // Handle procedure not found
  if (!procedure) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t("procedures.view")}</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>{t("procedures.notFound")}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('ProcedureList')}
          >
            <Text style={styles.buttonText}>{t("procedures.backToList")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle procedure deletion
  const handleDeleteProcedure = () => {
    Alert.alert(
      t("procedures.delete"),
      t("procedures.confirmDelete"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.delete"),
          onPress: () => {
            deleteProcedure(procedureId);
            navigation.navigate('ProcedureList');
          },
          style: "destructive",
        },
      ]
    );
  };

  // Render procedure details
  const renderProcedureDetails = () => {
    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t("procedures.date")}:</Text>
          <Text style={styles.detailValue}>{formatDate(procedure.date)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t("procedures.type")}:</Text>
          <Text style={styles.detailValue}>{procedure.procedureType}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t("procedures.hospital")}:</Text>
          <Text style={styles.detailValue}>{procedure.hospital}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t("procedures.surgeon")}:</Text>
          <Text style={styles.detailValue}>{procedure.surgeon}</Text>
        </View>
        
        {procedure.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>{t("procedures.notes")}:</Text>
            <Text style={styles.notesText}>{procedure.notes}</Text>
          </View>
        )}
      </View>
    );
  };

  // Render implants list
  const renderImplantsList = () => {
    if (procedure.implants.length === 0) {
      return (
        <View style={styles.emptyImplantsContainer}>
          <Text style={styles.emptyImplantsText}>{t("procedures.noImplants")}</Text>
        </View>
      );
    }

    return (
      <View style={styles.implantsContainer}>
        {procedure.implants.map((implant, index) => (
          <View key={implant.id} style={styles.implantCard}>
            <View style={styles.implantHeader}>
              <Text style={styles.implantTitle}>{implant.name}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('ImplantDetail', { procedureId, implantId: implant.id })}
              >
                <Text style={styles.viewDetailsText}>{t("common.viewDetails")}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.implantDetails}>
              <View style={styles.implantDetailRow}>
                <Text style={styles.implantDetailLabel}>{t("procedures.manufacturer")}:</Text>
                <Text style={styles.implantDetailValue}>{implant.manufacturer}</Text>
              </View>
              
              <View style={styles.implantDetailRow}>
                <Text style={styles.implantDetailLabel}>{t("procedures.articleNumber")}:</Text>
                <Text style={styles.implantDetailValue}>{implant.articleNumber}</Text>
              </View>
              
              <View style={styles.implantDetailRow}>
                <Text style={styles.implantDetailLabel}>{t("procedures.lotNumber")}:</Text>
                <Text style={styles.implantDetailValue}>{implant.lotNumber}</Text>
              </View>
              
              {implant.position && (
                <View style={styles.implantDetailRow}>
                  <Text style={styles.implantDetailLabel}>{t("procedures.position")}:</Text>
                  <Text style={styles.implantDetailValue}>{implant.position}</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t("procedures.view")}</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('ProcedureForm', { id: procedureId })}
        >
          <Text style={styles.editButtonText}>{t("common.edit")}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'details' && styles.activeTab]}
          onPress={() => setActiveTab('details')}
        >
          <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>
            {t("procedures.details")}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'implants' && styles.activeTab]}
          onPress={() => setActiveTab('implants')}
        >
          <Text style={[styles.tabText, activeTab === 'implants' && styles.activeTabText]}>
            {t("procedures.implants")} ({procedure.implants.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'details' ? renderProcedureDetails() : renderImplantsList()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => navigation.navigate('ExportOptions', { procedureId })}
        >
          <Text style={styles.exportButtonText}>{t("procedures.export")}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteProcedure}
        >
          <Text style={styles.deleteButtonText}>{t("procedures.delete")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    color: '#2196f3',
    fontWeight: '500',
  },
  placeholder: {
    width: 40,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196f3',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2196f3',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontWeight: '500',
    color: '#666',
    flex: 1,
  },
  detailValue: {
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  notesLabel: {
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  notesText: {
    color: '#333',
    lineHeight: 20,
  },
  implantsContainer: {
    marginBottom: 16,
  },
  implantCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  implantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  implantTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  viewDetailsText: {
    color: '#2196f3',
    fontSize: 12,
  },
  implantDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  implantDetailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  implantDetailLabel: {
    fontWeight: '500',
    color: '#666',
    width: 120,
  },
  implantDetailValue: {
    color: '#333',
    flex: 1,
  },
  emptyImplantsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  emptyImplantsText: {
    color: '#666',
    textAlign: '