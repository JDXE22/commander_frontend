import { saveCommand } from '../../../features/commands/api/apiCommands';
import { useState } from 'react';

export const CreateCmd = ({ refresh }) => {
  const [commandInput, setCommandInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [textInput, setTextInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commandInput || !textInput || !nameInput) {
      alert('Please fill all fields');
      return;
    }
    const payload = {
      command: commandInput,
      text: textInput,
      name: nameInput,
    };
    try {
      const res = await saveCommand({ command: payload });
      if (res) {
        alert('Command created successfully');
        refresh && refresh();
        setCommandInput('');
        setTextInput('');
        setNameInput('');
      } else {
        alert('Failed to create command');
      }
    } catch (error) {
      console.error('Error saving command:', error);
      alert('Failed to create command');
    }
  };

  return (
    <div className='main-content'>
      <div
        className='search-section'
        style={{ alignItems: 'center', marginBottom: '40px' }}>
        <h1 className='search-title'>Create New Command</h1>
      </div>

      <form onSubmit={handleSubmit} className='form-card'>
        <div className='field-group'>
          <label className='field-label'>COMMAND</label>
          <div className='field-input-wrapper'>
            <input
              type='text'
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder='/command'
              className='field-input'
            />
          </div>
        </div>

        <div className='field-group'>
          <label className='field-label'>NAME</label>
          <div className='field-input-wrapper'>
            <input
              type='text'
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder='Enter a unique identifier for this command'
              className='field-input'
            />
          </div>
        </div>

        <div className='field-group'>
          <label className='field-label'>TEXT</label>
          <div className='field-textarea-wrapper'>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder='Enter the text response that should be returned when this command is triggered...'
              className='field-textarea'
            />
          </div>
        </div>

        <button type='submit' className='submit-btn'>
          Register Command
        </button>
      </form>
    </div>
  );
};
