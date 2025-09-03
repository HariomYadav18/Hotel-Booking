import { useBooking } from '../../context/BookingContext';

export default function GuestDetails() {
  const { state, dispatch } = useBooking();

  const onChange = (e) => {
    dispatch({ type: 'SET_GUEST_DETAILS', payload: { [e.target.name]: e.target.value } });
  };

  return (
    <div className="space-y-4">
      <input
        className="input-field"
        name="name"
        placeholder="Full name"
        value={state.guestDetails.name}
        onChange={onChange}
      />
      <input
        className="input-field"
        name="email"
        type="email"
        placeholder="Email"
        value={state.guestDetails.email}
        onChange={onChange}
      />
      <input
        className="input-field"
        name="phone"
        placeholder="Phone"
        value={state.guestDetails.phone}
        onChange={onChange}
      />
    </div>
  );
}


