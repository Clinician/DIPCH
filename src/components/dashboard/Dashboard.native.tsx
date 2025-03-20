import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { useProcedures } from "../../context/ProcedureContext";
import { Shield, Info, LogOut, Globe } from "lucide-react";
import ProcedureOverview from "./ProcedureOverview.native";
import ActionButtons from "./ActionButtons.native";
import { loadSampleData } from "@/lib/sample-data";
import { getAllProcedures } from "@/lib/db";

interface DashboardProps {
  userName?: string;
  onLogout?: () => void;
  onNavigate?: (screen: string, params?: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  userName = "Patient",
  onLogout = () => {},
  onNavigate = () => {},
}) => {
  const { t } = useLanguage();
  const { procedures, addProcedure, deleteProcedure } = useProcedures();
  const [activeView, setActiveView] = useState<
    "home" | "scan" | "list" | "form" | "settings"
  >("home");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [localProcedures, setLocalProcedures] = useState<any[]>([]);

  // Sync with context
  useEffect(() => {
    setLocalProcedures(procedures);
  }, [procedures]);

  // Load sample data if no procedures exist
  useEffect(() => {
    const checkAndLoadSampleData = async () => {
      try {
        const existingProcedures = await getAllProcedures();
        if (existingProcedures.length === 0) {
          await loadSampleData();
        }
      } catch (error) {
        console.error("Error checking/loading sample data:", error);
      }
    };

    checkAndLoadSampleData();
  }, []);

  const handleScanQR = () => {
    onNavigate("QRScanner");
  };

  const handleViewProcedures = () => {
    onNavigate("ProcedureList");
  };

  const handleSettings = () => {
    onNavigate("Settings");
  };

  const handleManualEntry = () => {
    onNavigate("ProcedureForm");
  };

  const handleLogout = () => {
    onLogout();
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get recent procedures (last 3)
  const recentProcedures = procedures.slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.logoText}>🔒</Text>
          <Text style={styles.title}>{t("dashboard.title")}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.welcomeText}>
            {t("dashboard.welcome")}, {userName}
          </Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Recent Procedures */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t("dashboard.recent")}</Text>
          <TouchableOpacity onPress={handleViewProcedures}>
            <Text style={styles.viewAllText}>{t("dashboard.viewAll")}</Text>
          </TouchableOpacity>
        </View>

        {recentProcedures.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t("dashboard.noProcedures")}</Text>
          </View>
        ) : (
          <View style={styles.proceduresList}>
            {recentProcedures.map((procedure) => (
              <TouchableOpacity
                key={procedure.id}
                onPress={() =>
                  onNavigate("ProcedureDetail", { id: procedure.id })
                }
                style={styles.procedureCard}
              >
                <View style={styles.procedureHeader}>
                  <Text style={styles.procedureDate}>
                    {formatDate(procedure.date)}
                  </Text>
                  <Text style={styles.procedureType}>
                    {procedure.procedureType}
                  </Text>
                </View>
                <View style={styles.procedureBody}>
                  <Text style={styles.procedureHospital}>
                    {procedure.hospital}
                  </Text>
                  <Text style={styles.procedureSurgeon}>
                    {procedure.surgeon}
                  </Text>
                </View>
                <View style={styles.procedureFooter}>
                  <Text style={styles.implantCount}>
                    {procedure.implants?.length || 0}{" "}
                    {procedure.implants?.length !== 1
                      ? t("dashboard.implants_plural")
                      : t("dashboard.implants")}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, styles.actionsTitle]}>
          {t("dashboard.whatToDo")}
        </Text>
        <ActionButtons
          onScanQR={handleScanQR}
          onViewProcedures={handleViewProcedures}
          onManualEntry={handleManualEntry}
        />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {t("footer.copyright")} &copy; {new Date().getFullYear()}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 14,
    color: "#666",
    marginRight: 12,
  },
  logoutButton: {
    padding: 8,
  },
  logoutIcon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
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
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
  },
  proceduresList: {
    marginBottom: 24,
  },
  procedureCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
  },
  procedureHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  procedureDate: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  procedureType: {
    fontSize: 14,
    color: "#666",
  },
  procedureBody: {
    marginBottom: 8,
  },
  procedureHospital: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  procedureSurgeon: {
    fontSize: 14,
    color: "#666",
  },
  procedureFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  implantCount: {
    fontSize: 12,
    color: "#2196f3",
    fontWeight: "500",
  },
  actionsTitle: {
    marginTop: 8,
    marginBottom: 16,
  },
  footer: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#666",
  },
});

export default Dashboard;
