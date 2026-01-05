import React from "react";

const EventModal = ({ event, onClose, onAttendToggle }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      
      <div className="
        w-full max-w-lg
        rounded-3xl
        bg-white/20
        backdrop-blur-2xl
        border border-white/30
        shadow-[0_30px_80px_rgba(0,0,0,0.4)]
        p-8
        text-white
        animate-fade-in
      ">
        <h2 className="text-3xl font-bold mb-4">
          {event.title}
        </h2>

        <div className="space-y-2 text-white/90">
          <p>📅 {event.date}</p>
          <p>⏰ {event.time}</p>
          <p>📍 {event.location}</p>

          <p className="mt-4 text-white/80">
            {event.description}
          </p>

          <p className="text-sm text-white/70">
            👥 {event.participants}
          </p>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => onAttendToggle(event.id)}
            className={`
              px-5 py-2 rounded-xl font-medium transition
              ${
                event.attending
                  ? "bg-red-500/80 hover:bg-red-600"
                  : "bg-emerald-500/80 hover:bg-emerald-600"
              }
            `}
          >
            {event.attending ? "Cancel" : "Attend"}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
