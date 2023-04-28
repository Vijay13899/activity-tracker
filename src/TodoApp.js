import { useEffect, useReducer, useState } from "react";
import "./Todostyle.css";
import deskImage from "./assets/desk.jpg";

const ACTION = {
  ADD: "add_todo",
  DELETE: "delete_todo",
  COMPLETE: "completed",
  EDIT: "edit_todo",
  DELETE_ALL: "delete_all"
};

function reducer(todos, action) {
  switch (action.type) {
    case ACTION.ADD:
      return [...todos, getTodo(action.payload.name)];
    case ACTION.TOGGLE:
      return todos.map((todo) => {
        if (todo.id === action.payload.id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
    case ACTION.DELETE:
      return todos.filter((todo) => todo.id !== action.payload.id);
    case ACTION.EDIT:
      return todos.map((todo) => {
        if (todo.id === action.payload.id) {
          return { ...todo, name: action.payload.name };
        }
        return todo;
      });
    case ACTION.DELETE_ALL:
      return [];
    default:
      return todos;
  }
}

function getTodo(name) {
  return { id: Date.now(), name: name, completed: false };
}

function Todo({ todo, dispatch }) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(todo.name);
  const textStyle = todo.completed
    ? { color: "#aaa", textDecoration: "line-through" }
    : { color: "#000" };

  const handleDoubleClick = () => {
    setEditMode(true);
  };

  const handleBlur = () => {
    dispatch({ type: ACTION.EDIT, payload: { id: todo.id, name } });
    setEditMode(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      dispatch({ type: ACTION.EDIT, payload: { id: todo.id, name } });
      setEditMode(false);
    } else if (e.key === "Escape") {
      setName(todo.name);
      setEditMode(false);
    }
  };
  return (
    <div className="todo">
      {!editMode ? (
        <span style={textStyle} onDoubleClick={handleDoubleClick}>
          {todo.name}
        </span>
      ) : (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      )}
      <div className="btns">
        <button
          onClick={() => {
            dispatch({ type: ACTION.TOGGLE, payload: { id: todo.id } });
          }}
        >
          Complete
        </button>
        <button
          onClick={() => {
            dispatch({ type: ACTION.DELETE, payload: { id: todo.id } });
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function TodoApp() {
  const [todos, dispatch] = useReducer(reducer, [], () => {
    const storedData = localStorage.getItem("todos");
    return storedData ? JSON.parse(storedData) : [];
  });
  const [name, setName] = useState("");
  function submitHandler(e) {
    e.preventDefault();
    dispatch({ type: ACTION.ADD, payload: { name: name } });
    setName("");
  }
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const style = {
    background: `linear-gradient(0deg, rgba(0,0,0, 0.5), rgba(0,0,0,0.5)),url(${deskImage}) no-repeat center center/cover`,
    color: "white",
    marginTop: "-22px",
    padding: "3vh"
  };
  return (
    <>
      <div className="hero" style={style}>
        <h1>Activity Tracker</h1>
        <p>Keep track of your activities!!!!!</p>
        <p>Double Click on the text to edit...</p>
        <form onSubmit={submitHandler}>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </form>
        {todos.length > 0 && (
          <button
            onClick={() => {
              dispatch({ type: ACTION.DELETE_ALL });
            }}
          >
            Delete all
          </button>
        )}
      </div>
      {todos.map((todo) => {
        return <Todo key={todo.id} todo={todo} dispatch={dispatch} />;
      })}
      {/* <button onClick={e=>{dispatch({type:ACTION.INCREMENT})}}>+</button>
    {state.count}
    <button onClick={e=>{dispatch({type:ACTION.DECREMENT})}}>-</button> */}
    </>
  );
}
