import AlertCard from "./AlertCard";
import { alertsData } from "./alerts.data";

export default function AlertsList() {
  return (
    <section className="bg-gray-50 p-6 rounded-2xl">
      <h3 className="text-lg font-semibold mb-4">
        🔔 Alertes personnalisées
      </h3>

      <div className="space-y-3">
        {alertsData.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </section>
  );
}
