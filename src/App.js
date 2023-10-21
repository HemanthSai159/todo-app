import './App.css';
import React, { useState, useEffect, useReducer } from 'react';
import { Pane, TextInput, Textarea, Dialog, Button } from 'evergreen-ui'
import { List, ListItem, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, action.actionToDo];
    case 'DELETE_TASK':
      return state.filter((_, index) => index !== action.actionToDo);
    default:
      return state;
  }
};

function App() {
  const [isShown, setIsShown] = useState(false);

  const [task, dispatch] = useReducer(taskReducer, []);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("")

  const cancelTask = () => {
    setTitle("");
    setSummary("");
  }

  const submitTask = () => {
    dispatch({
      type: 'ADD_TASK',
      actionToDo: {
        title: title,
        summary: summary,
      }
    });

    localStorage.setItem("tasks", 
    JSON.stringify([
      ...task,{
        title: title,
        summary: summary,
      },
    ])
    );

    cancelTask();
  };

  const localSavedData = () => {
    const tasks = localStorage.getItem("tasks");
    if (tasks) dispatch({ type: 'ADD_TASK', actionToDo: JSON.parse(tasks) });
  };

  useEffect(() => {
    localSavedData();
  }, []);

  const deleteTask = (index) => {
    dispatch({ type: 'DELETE_TASK', actionToDo: index });
  };

  return (
    
    <div>
      <center><header style={{ marginTop:"2rem"}}>TODO APPLICATION</header>
        <List>
          {
            task.map((item, index) => {
              return <ListItem className='list-item' key={index} sx={{width:"350px"}} >
                <ListItemText primary={item.title} secondary={item.summary} />
                <DeleteIcon
                  onClick={() => deleteTask(index)}
                  color="error"
                  sx={{ cursor: "pointer" }}
                />
              </ListItem>
            })
          }
        </List>

        <Pane>
          <Dialog
            isShown={isShown}
            title="Create Task"
            onCloseComplete={() => {
              setIsShown(false)
              cancelTask()
            }}
            confirmLabel="Create"
            onConfirm={() => {
              submitTask()
            }}
          >
            <TextInput value={title} onChange={e => setTitle(e.target.value)} width={"25rem"} style={{ marginBottom: "10px" }} name="text-input-name" placeholder="Enter Title" />
            <Textarea value={summary} onChange={e => setSummary(e.target.value)} width={"25rem"} name="text-input-name" placeholder="Enter Summary" />
          </Dialog>

          <Button onClick={() => {
            setIsShown(true)
            submitTask()
          }}>Create Task</Button>

        </Pane></center>
      
    </div>
  );
}

export default App;



