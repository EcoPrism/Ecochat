import React from "react";
import SignInButton from './assets/SignInButton.png';

interface LinkedInLoginButtonProps {
  onLoginSuccess: (data: any) => void;
  onLoginFailure: (error: any) => void;
}

const LinkedInLoginButton: React.FC<LinkedInLoginButtonProps> = ({
  onLoginSuccess,
  onLoginFailure,
}) => {
  const handleSuccess = (data: any) => {
    onLoginSuccess(data);
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86gnz36rjrwspk&redirect_uri=http://127.0.0.1:50505/&state=STATE&scope=profile`;
  };

  const handleFailure = (error: any) => {
    onLoginFailure(error);
  };

  const linkedInLogin = () => {
    handleSuccess({});
  };

  const buttonContainerStyle = {
    width: "100%", 
    height: "auto", 
    cursor: "pointer",
    marginBottom: "70%", 
  };

  return (
    <div style={buttonContainerStyle}>
      <img
        src={SignInButton} 
        alt="LinkedIn Logo"
        style={{ width: "100%", height: "auto" }}
        onClick={linkedInLogin}
      />
    </div>
  );
};

export default LinkedInLoginButton;
