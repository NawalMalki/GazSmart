import RecommendationsList from "../components/recommendations/RecommendationsList";
import AlertsList from "../components/Alerts/AlertsList";

export default function RecommendationsPage() {
  return (
    <div className="space-y-6">
      <AlertsList />
      <RecommendationsList />
    </div>
  );
}
