import { useState } from 'react';
import { useTrial } from '../../../shared/context/TrialContext';

export const CreateCmd = ({ onRefresh }) => {
  const [triggerInput, setTriggerInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { canCreate, addTrialCommand, openModal } = useTrial();

  const handleCreateSubmit = async (event) => {
    event.preventDefault();

    if (!canCreate) {
      openModal();
      return;
    }

    if (!triggerInput.trim() || !contentInput.trim() || !nameInput.trim()) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    const commandPayload = {
      command: triggerInput.trim(),
      text: contentInput.trim(),
      name: nameInput.trim(),
    };

    try {
      const creationResponse = await addTrialCommand(commandPayload);
      if (creationResponse && !creationResponse.error) {
        alert('Command registered successfully');
        onRefresh && onRefresh();
        setTriggerInput('');
        setContentInput('');
        setNameInput('');
      } else {
        alert(creationResponse?.message || 'Failed to register command');
      }
    } catch (creationError) {
      console.error('Command registration failed:', creationError);
      alert('A technical error occurred while registering the command');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='main-content create-view'>
      <div className='page-container'>
      <div className='search-section'>
        <h1 className='search-title'>Register a Command</h1>
      </div>

      <form onSubmit={handleCreateSubmit} className='create-form'>
        <div className='form-grid'>
          <div className='form-group'>
            <label htmlFor="command-name">Command Name</label>
            <input
              id="command-name"
              type='text'
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder='e.g. Greeting Macro'
              className='form-input'
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor="trigger-trigger">Trigger Command</label>
            <div className='input-container'>
              <span className='input-prefix' aria-hidden="true">/</span>
              <input
                id="trigger-trigger"
                type='text'
                value={triggerInput}
                onChange={(event) => setTriggerInput(event.target.value)}
                placeholder='h1'
                className='form-input-prefixed'
                required
              />
            </div>
          </div>

          <div className='form-group full-width'>
            <label htmlFor="content-textarea">Command Content</label>
            <textarea
              id="content-textarea"
              value={contentInput}
              onChange={(event) => setContentInput(event.target.value)}
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
