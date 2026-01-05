export default function RecommendationCard({ item }) {
  return (
    <div className="p-4 border rounded-xl bg-white hover:shadow-md transition">
      <h4 className="font-semibold text-gray-800">{item.title}</h4>
      <p className="text-sm text-gray-600 mt-1">{item.description}</p>

      <div className="mt-2 text-sm font-medium text-green-600">
        Gain estimé : {item.gain}
      </div>
    </div>
  );
}
