import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from './redux/user/userSlice';  // import logout handler

/* Inactivity Logout Handler to log out the user after 2 mins of leaving idle */
const InactivityLogoutHandler = ({ children }) => {
  const dispatch = useDispatch();
  const timer = useRef(null);

  const logoutUser = () => {
    dispatch(logout());  // logout redirects to login page
  };

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(logoutUser, 2 * 60 * 1000); // 2 mins AFK 
  };

  // events of activity that will reset the timer
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    // for each event specified, add an event listener to reset the timer
    for (let event of events) {
      window.addEventListener(event, resetTimer);
    }

    resetTimer(); // start the timer

    return () => {
      for (let event of events) {
        window.removeEventListener(event, resetTimer);
      }
      clearTimeout(timer.current);
    };
  }, []);

  return <>{children}</>;
};

export default InactivityLogoutHandler;
