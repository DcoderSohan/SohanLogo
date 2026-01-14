import React from "react";
import MessageModal from "../Common/MessageModal";

const SuccessModal = ({ isOpen, onClose }) => {
  return (
    <MessageModal
      isOpen={isOpen}
      onClose={onClose}
      type="success"
      title="Message Sent Successfully!"
      message="We will get back to you soon."
      buttonText="Got it!"
    />
  );
};

export default SuccessModal;

