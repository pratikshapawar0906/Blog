import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const ProfileContext = createContext();

// Provider Component
export const ProfileProvider = ({ children }) => {
  const [profilePhoto, setProfilePhoto] = useState("");

  // Load the profile photo from localStorage when the app starts
  useEffect(() => {
    const storedPhoto = localStorage.getItem("ProfilePhoto");
    if (storedPhoto) setProfilePhoto(storedPhoto);
  }, []);

  // Function to update the profile photo
  const updateProfilePhoto = (newPhotoUrl) => {
    setProfilePhoto(newPhotoUrl);
    localStorage.setItem("ProfilePhoto", newPhotoUrl);
  };

  return (
    <ProfileContext.Provider value={{ profilePhoto, updateProfilePhoto }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom Hook to Use Profile Context
export const useProfile = () => useContext(ProfileContext);
