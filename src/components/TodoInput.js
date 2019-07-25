import React, { useState } from 'react';
import uuid from 'uuid/v4';
import { addTodo } from '../redux';

import { useSelector, useActions } from 'react-redux';


//bugbug
import { player_next } from '../redux';

const TodoInput = (props) => {
  const [todo, setTodo] = useState('Value');
  // Have to give a different name here to avoid a name issue, otherwise `addTodo` is undefined
  const addTodoAction = useActions(addTodo);





  const players = useSelector((state) => state.players);
  var player_color = players.all[players.current].color;

  const next_player = useActions(player_next);


  const onChange = (event) => {
    setTodo(event.target.value);
  };
  const onSubmit = (event) => {
    event.preventDefault();
    if (todo.trim() === '') return;
    addTodoAction({
      id: uuid(),
      name: todo,
      complete: false
    });

    //bugbug
    console.log('COLOR: ' + player_color);
  //  move({ color: player_color}); //get_current.color});
    next_player();


    setTodo('');
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-div">
        <input
          type="text"
          name="todo"
          placeholder="Add a todo"
          value={todo}
          onChange={onChange}
        />
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

export default TodoInput;
