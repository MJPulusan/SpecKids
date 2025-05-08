import '../TherapyModal.css';

export function TherapyModal({
  therapyName,
  timeOfDay,
  onClose,
}: {
  therapyName: string;
  timeOfDay: string;
  onClose: () => void; //  Only declare the type of the function
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="therapy-modal">
          <img
            src="/images/therapy-reminder.png"
            alt="therapy-reminder"
            className="therapyReminder-img"
          />
        </div>
        <h2>Therapy Time!</h2>

        <p>
          "Hey there, superstar! It's almost time for your
          <span> {therapyName} </span> therapy session at{' '}
          <span>{timeOfDay}</span>. Time to pack-up and get ready.
        </p>
        <button className="ok-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}
