import {
  Box,
  Button,
  InputLabel,
  Modal,
  OutlinedInput,
  Typography,
} from "@mui/material";
import React, { SetStateAction, useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { FieldValues, useForm } from "react-hook-form";
import { useBoard } from "@/hooks/useBoard";
import boardSlice from "@/store/features/boardSlice";
import { style } from "@/styles/modal";

const CreateTask = ({
  createTaskModal,
  setCreateTaskModal,
  type,
  taskIndex,
  prevColIndex = 0,
}: {
  createTaskModal: boolean;
  setCreateTaskModal: React.Dispatch<SetStateAction<boolean>>;
  type: "add" | "edit";
  taskIndex: number;
  prevColIndex: number;
}) => {
  const { selectedBoard, dispatch } = useBoard();
  const { register, handleSubmit, setValue } = useForm();
  const columns = selectedBoard.columns;

  const [subtasks, setSubtasks] = useState([
    { id: Date.now(), title: "Make a Coffee", isCompleted: false },
  ]);

  const col = columns.find(
    (_: unknown, index: number) => index === prevColIndex
  );
  const task = col.tasks.find(
    (_: unknown, index: number) => index === taskIndex
  );
  const [newColIndex, setNewColIndex] = useState(prevColIndex);
  const [status, setStatus] = useState(columns[prevColIndex].name);

  const [selectedColumn, setSelectedColumn] = useState(columns[0].name);

  const handleClose = () => setCreateTaskModal(false);

  const handleDelete = (id: number) => {
    setSubtasks((prevState) =>
      prevState.filter((subtask) => subtask.id !== id)
    );
  };

  const onChange = (id: number, newValue: string) => {
    setSubtasks((prevState) => {
      const newState = [...prevState];
      const column = newState.find((col) => col.id === id);
      if (column) {
        column.title = newValue;
      }
      return newState;
    });
  };

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };

  const handleTask = (formData: FieldValues) => {
    const { title, description } = formData;

    if (type === "add") {
      dispatch(
        boardSlice.actions.addNewTask({
          title,
          description,
          selectedColumn,
          subtasks,
        })
      );
    } else {
      dispatch(
        boardSlice.actions.editTask({
          title,
          description,
          subtasks,
          status,
          taskIndex,
          prevColIndex,
          newColIndex,
        })
      );
    }
    handleClose();
  };

  useEffect(() => {
    if (type === "edit") {
      setSubtasks(
        task.subtasks.map((subtask) => {
          return { ...subtask, id: Math.random() };
        })
      );
      setValue("title", task.title);
      setValue("description", task.description);
    }
  }, [type]);

  return (
    <Modal open={createTaskModal} onClose={handleClose}>
      <Box
        sx={{ ...style, width: 720, minHeight: 640, bgcolor: "#2b2c37" }}
        component="form"
        onSubmit={handleSubmit(handleTask)}
      >
        <Typography variant="h6" sx={{ color: "white" }}>
          {type === "add" ? "Add New Task" : "Edit Task"}
        </Typography>
        <InputLabel sx={{ mt: 2, color: "white" }}>Title</InputLabel>
        <OutlinedInput
          placeholder="e.g Start learning new things"
          sx={{
            width: "100%",
            mt: 1,
            height: "2.8rem",
            color: "white",
            "&::placeholder": {
              color: "gray",
            },
          }}
          {...register("title")}
        />
        <InputLabel sx={{ mt: 2, color: "white" }}>
          Description (optional)
        </InputLabel>
        <OutlinedInput
          multiline
          sx={{
            width: "100%",
            mt: 1,
            height: "2.8rem",
            background: "none",
            color: "white",
            "&::placeholder": {
              color: "gray",
            },
          }}
          {...register("description")}
          placeholder="e.g Start learning new things"
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            mt: 2,
          }}
        >
          <InputLabel sx={{ mt: 2, color: "white" }}>Subtasks</InputLabel>
          {subtasks.map((subtask) => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                width: "100%",
              }}
              key={subtask.id}
            >
              <OutlinedInput
                fullWidth
                sx={{
                  mt: 1,
                  height: "2.8rem",
                  background: "none",
                  color: "white",
                  "&::placeholder": {
                    color: "gray",
                  },
                }}
                value={subtask.title}
                onChange={(e) => {
                  onChange(subtask.id, e.target.value);
                }}
              />
              <ClearIcon
                sx={{ cursor: "pointer" }}
                onClick={() => handleDelete(subtask.id)}
              />
            </Box>
          ))}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mt: 2,
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              sx={{ borderRadius: "50px", height: "3rem" }}
              onClick={() => {
                setSubtasks((state) => [
                  ...state,
                  { id: Date.now(), title: "", isCompleted: false },
                ]);
              }}
            >
              + Add New Subtask
            </Button>
            <InputLabel sx={{ mt: 2, color: "white", fontSize: 20 }}>
              Status
            </InputLabel>
            <select
              className="select-status text-L"
              onChange={onChangeSelect}
              style={{ height: "3rem", marginTop: "1rem", width: "100%" }}
              value={status}
            >
              {columns.map((col: { name: string }, index: number) => (
                <option className="status-options" key={index}>
                  {col.name}
                </option>
              ))}
            </select>
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2, borderRadius: "50px", height: "3rem" }}
            >
              {type === "add" ? "Create Task" : "Edit Task"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateTask;
