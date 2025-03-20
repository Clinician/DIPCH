import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { useProcedures } from "../../context/ProcedureContext";

interface ProcedureOverviewProps {
  onScanQR?: () => void;
  onViewProcedures?: () => void;
  onManualEntry?: () => void;
  onSettings?: () => void;
}

const ProcedureOverview: React.FC<ProcedureOverviewProps> = ({
  onScanQR = () => console.log("Scan QR clicked"),
  onViewProcedures = () => console.log("View Procedures clicked"),
  onManualEntry = () => console.log("Manual Entry clicked"),
  onSettings = () => console.log("Settings clicked"),
}) => {
  const { t } = useLanguage();
  const { procedures } = useProcedures();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Sort procedures by date (newest first)
  const sortedProcedures = [...procedures].sort((a, b) => {
    const dateA = new Date(a.date || "");
    const dateB = new Date(b.date || "");
    return dateB.getTime() - dateA.getTime();
  });

  // Filter procedures based on search term
  const filteredProcedures = sortedProcedures.filter((procedure) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (procedure.procedureType || "").toLowerCase().includes(searchLower) ||
      (procedure.hospital || "").toLowerCase().includes(searchLower) ||
      (procedure.surgeon || "").toLowerCase().includes(searchLower)
    );
  });

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.logoText}>🔒</Text>
          <Text style={styles.title}>{t("dashboard.title")}</Text>
        </View>
        <TouchableOpacity onPress={onSettings} style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Procedures */}
      <View style={styles.recentContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t("dashboard.recent")}</Text>
          <TouchableOpacity onPress={onViewProcedures}>
            <Text style={styles.viewAllText}>{t("dashboard.viewAll")}</Text>
          </TouchableOpacity>
        </View>

        {filteredProcedures.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t("dashboard.noProcedures")}</Text>
          </View>
        ) : (
          <ScrollView style={styles.proceduresList}>
            {filteredProcedures.slice(0, 5).map((procedure) => (
              <TouchableOpacity
                key={procedure.id}
                style={styles.procedureCard}
                onPress={() => console.log(`View procedure ${procedure.id}`)}
              >
                <View style={styles.procedureHeader}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.calendarIcon}>📅</Text>
                  </View>
                  <View style={styles.procedureInfo}>
                    <Text style={styles.procedureType}>
                      {procedure.procedureType}
                    </Text>
                    <View style={styles.procedureDetails}>
                      <Text style={styles.procedureHospital}>
                        {procedure.hospital}
                      </Text>
                      <Text style={styles.procedureDate}>
                        {formatDate(procedure.date || "")}
                      </Text>
                    </View>
                    <Text style={styles.implantCount}>
                      {procedure.implants?.length || 0}{" "}
                      {procedure.implants?.length !== 1
                        ? t("dashboard.implants_plural")
                        : t("dashboard.implants")}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onManualEntry}>
          <View style={[styles.actionIconContainer, styles.blueIcon]}>
            <Text style={styles.actionIcon}>➕</Text>
          </View>
          <Text style={styles.actionText}>{t("dashboard.addNew")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onViewProcedures}
        >
          <View style={[styles.actionIconContainer, styles.purpleIcon]}>
            <Text style={styles.actionIcon}>📋</Text>
          </View>
          <Text style={styles.actionText}>{t("dashboard.allRecords")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log("Export Guide")}
        >
          <View style={[styles.actionIconContainer, styles.orangeIcon]}>
            <Text style={styles.actionIcon}>📤</Text>
          </View>
          <Text style={styles.actionText}>{t("dashboard.exportGuide")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onSettings}>
          <View style={[styles.actionIconContainer, styles.greenIcon]}>
            <Text style={styles.actionIcon}>⚙️</Text>
          </View>
          <Text style={styles.actionText}>{t("dashboard.settings")}</Text>
        </TouchableOpacity>
      </View>

      {/* Add Procedure Dialog would be implemented with a Modal in React Native */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 24,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 20,
  },
  recentContainer: {
    flex: 1,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  viewAllText: {
    fontSize: 14,
    color: "#2196f3",
  },
  emptyContainer: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
  },
  proceduresList: {
    maxHeight: 300,
  },
  procedureCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  procedureHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  calendarIcon: {
    fontSize: 20,
  },
  procedureInfo: {
    flex: 1,
  },
  procedureType: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  procedureDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  procedureHospital: {
    fontSize: 14,
    color: "#666",
  },
  procedureDate: {
    fontSize: 14,
    color: "#666",
  },
  implantCount: {
    fontSize: 12,
    color: "#2196f3",
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    width: "48%",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  blueIcon: {
    backgroundColor: "#e3f2fd",
  },
  purpleIcon: {
    backgroundColor: "#f3e5f5",
  },
  orangeIcon: {
    backgroundColor: "#fff3e0",
  },
  greenIcon: {
    backgroundColor: "#e8f5e9",
  },
  actionIcon: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default ProcedureOverview;
