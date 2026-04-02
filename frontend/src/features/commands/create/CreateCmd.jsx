import { useState } from 'react';
import { useTrial } from '../../../shared/context/TrialContext';

export const CreateCmd = ({ refresh }) => {
  const [commandInput, setCommandInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { canCreate, addTrialCommand, openModal } = useTrial();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canCreate) {
      openModal();
      return;
    }

    if (!commandInput.trim() || !textInput.trim() || !nameInput.trim()) {
      alert('Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      command: commandInput.trim(),
      text: textInput.trim(),
      name: nameInput.trim(),
    };

    try {
      addTrialCommand(payload);
      alert('Command created successfully');
      refresh && refresh();
      setCommandInput('');
      setTextInput('');
      setNameInput('');
    } catch (error) {
      console.error('Error saving command:', error);
      alert('Failed to create command');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='main-content'>
      <div className='search-section' style={{ alignItems: 'center', marginBottom: '40px' }}>
        <h1 className='search-title'>Create New Command</h1>
      </div>

      <form onSubmit={handleSubmit} className='form-card' aria-label="Command creation form">
        <div className='field-group'>
          <label className='field-label' htmlFor="command-input">COMMAND</label>
          <div className='field-input-wrapper'>
            <input
              id="command-input"
              type='text'
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder='/command'
              className='field-input'
              required
              aria-required="true"
            />
          </div>
        </div>

        <div className='field-group'>
          <label className='field-label' htmlFor="name-input">NAME</label>
          <div className='field-input-wrapper'>
            <input
              id="name-input"
              type='text'
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder='Enter a unique identifier'
              className='field-input'
              required
              aria-required="true"
            />
          </div>
        </div>

        <div className='field-group'>
          <label className='field-label' htmlFor="text-input">TEXT RESPONSE</label>
          <div className='field-textarea-wrapper'>
            <textarea
              id="text-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder='Enter the text response for this command...'
              className='field-textarea'
              required
              aria-required="true"
              rows={5}
            />
          </div>
        </div>

        <button
          type='submit'
          className='submit-btn'
          disabled={isSubmitting}
          aria-live="polite"
        >
          {isSubmitting ? 'Registering...' : !canCreate ? 'Trial limit reached' : 'Register Command'}
        </button>
      </form>
    </main>
  );
};
