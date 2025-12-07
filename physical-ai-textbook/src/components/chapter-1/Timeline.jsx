import React, { useState } from 'react';
import styles from './Timeline.module.css';

const Timeline = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  if (!events || events.length === 0) {
    return <div className={styles.timelineEmpty}>No timeline events available</div>;
  }

  const handleEventClick = (index) => {
    setSelectedEvent(selectedEvent === index ? null : index);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleEventClick(index);
    } else if (e.key === 'Escape') {
      setSelectedEvent(null);
    }
  };

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timeline}>
        {events.map((event, index) => (
          <div
            key={index}
            className={`${styles.timelineEvent} ${selectedEvent === index ? styles.selected : ''}`}
            onClick={() => handleEventClick(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            role="button"
            tabIndex={0}
            aria-label={`${event.year}: ${event.event}`}
            aria-expanded={selectedEvent === index}
          >
            <div className={styles.timelineYear}>{event.year}</div>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <h4>{event.event}</h4>
              {selectedEvent === index && (
                <p className={styles.eventDetail}>{event.detail}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {selectedEvent !== null && (
        <div className={styles.eventDetailPanel} role="dialog" aria-labelledby="event-detail-title">
          <h3 id="event-detail-title">
            {events[selectedEvent].event} ({events[selectedEvent].year})
          </h3>
          <p>{events[selectedEvent].detail}</p>
          <button
            onClick={() => setSelectedEvent(null)}
            className={styles.closeButton}
            aria-label="Close event detail"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Timeline;
