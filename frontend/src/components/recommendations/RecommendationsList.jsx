import RecommendationCard from "./RecommendationCard";
import { recommendationsData } from "./recommendations.data";

export default function RecommendationsList() {
  return (
    <section className="bg-blue-50 p-6 rounded-2xl mt-6">
      <h3 className="text-lg font-semibold mb-4">
         Recommandations IA
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {recommendationsData.map((item) => (
          <RecommendationCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
