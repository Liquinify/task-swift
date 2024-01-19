import { Box, Modal } from "@mui/material";
import React from "react";

const TaskModal = ({ modal, setModal }) => {
  const handleModal = () => {
    setModal(false);
  };
  return (
    <Modal
      open={modal}
      onClose={handleModal}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box sx={{ width: 400 }}>
        <h2 id="parent-modal-title">Text in a modal</h2>
        <p id="parent-modal-description">
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </p>
      </Box>
    </Modal>
  );
};

export default TaskModal;