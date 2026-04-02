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
      const res = await addTrialCommand(payload);
      if (res && !res.error) {
        alert('Command created successfully');
        refresh && refresh();
        setCommandInput('');
        setTextInput('');
        setNameInput('');
      } else {
        alert(res?.message || 'Failed to create command');
      }
    } catch (error) {
      console.error('Error saving command:', error);
      alert('Failed to create command');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='main-content'>
      <div className='page-container'>
        <div className='search-section'>
          <h1 className='search-title'>Register a Command</h1>
        </div>

        <form onSubmit={handleSubmit} className='create-form'>
        <div className='form-grid'>
          <div className='form-group'>
            <label htmlFor="name-input">Command Name</label>
            <input
              id="name-input"
              type='text'
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder='Help Text 1'
              className='form-input'
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor="trigger-input">Trigger Command</label>
            <div className='input-container'>
              <span className='input-prefix' aria-hidden="true">/</span>
              <input
                id="trigger-input"
                type='text'
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder='h1'
                className='form-input-prefixed'
                required
              />
            </div>
          </div>

          <div className='form-group full-width'>
            <label htmlFor="content-input">Command Content</label>
            <textarea
              id="content-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder='This command will return...'
              className='form-textarea'
              required
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
      </div>
    </main>
  );
};
