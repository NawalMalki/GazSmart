// src/components/Events/EventsCalendar.jsx
import React, { useState } from "react";
import { eventsData } from "./eventsData";
import EventModal from "./EventModal";

const EventsCalendar = () => {
  const [events, setEvents] = useState(
    eventsData.map(event => ({ ...event, attending: false }))
  );
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleAttendToggle = (eventId) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId
          ? { ...event, attending: !event.attending }
          : event
      )
    );

    setSelectedEvent(prev =>
      prev ? { ...prev, attending: !prev.attending } : prev
    );
  };

  return (
    <div className="min-h-screen px-8 py-10 bg-gray-50">
      
      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
     Mes Événements
      </h1>

      {/* Events cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {events.map(event => (
          <div
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            className="
              cursor-pointer
              rounded-2xl
              bg-gradient-to-br from-emerald-500 to-teal-500
              text-white
              shadow-lg
              p-6
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <h2 className="text-xl font-semibold">
              {event.title}
            </h2>

            <p className="text-white/90 mt-2">
              📅 {event.date}
            </p>

            {event.attending && (
              <span className="inline-block mt-4 px-3 py-1 text-sm rounded-full 
                bg-white/20 text-white border border-white/30">
                ✔ Participating
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onAttendToggle={handleAttendToggle}
      />
    </div>
  );
};

export default EventsCalendar;
