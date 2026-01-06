import { FiAlertTriangle, FiInfo, FiCheckCircle } from "react-icons/fi";

const icons = {
  warning: <FiAlertTriangle className="text-orange-500" />,
  info: <FiInfo className="text-blue-500" />,
  success: <FiCheckCircle className="text-green-500" />,
};

export default function AlertCard({ alert }) {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
      <div className="text-2xl">{icons[alert.type]}</div>

      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{alert.title}</h4>
        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>

        {alert.action && (
          <button className="mt-2 text-sm text-blue-600 hover:underline">
            {alert.action}
          </button>
        )}
      </div>
    </div>
  );
}