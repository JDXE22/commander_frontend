import { useState } from 'react';
import { useTrial } from '../../../shared/context/TrialContext';
import { sileo } from 'sileo';
import "./CreateCmd.css";

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
      sileo.error({
        title: 'Missing fields',
        description: 'Fill in the name, trigger, and content to save your template.',
        fill: '#ef4444',
      });
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
        sileo.success({
          title: 'Template saved',
          description: 'You can now use this trigger in the Terminal.',
          fill: '#171717',
          styles: { title: 'sileo-text-white', description: 'sileo-text-white', badge: 'sileo-badge-fix' }
        });
        onRefresh && onRefresh();
        setTriggerInput('');
        setContentInput('');
        setNameInput('');
      } else {
        sileo.error({
          title: 'Couldn\'t save',
          description: creationResponse?.message || 'Something went wrong. Try again in a moment.',
          fill: '#ef4444',
        });
      }
    } catch (creationError) {
      console.error('Command registration failed:', creationError);
      sileo.error({
        title: 'Something went wrong',
        description: 'We couldn\'t save your template. Try again in a moment.',
        fill: '#ef4444',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='main-content create-view'>
      <div className='page-container'>
      <div className='search-section'>
        <h1 className='search-title'>New template</h1>
      </div>

      <form onSubmit={handleCreateSubmit} className='create-form'>
        <div className='form-grid'>
          <div className='form-group'>
            <label htmlFor="command-name">Name</label>
            <input
              id="command-name"
              type='text'
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder='e.g. Meeting Follow-up'
              className='form-input'
              required
            />
            <span className='form-hint'>A label to help you find this template later.</span>
          </div>

          <div className='form-group'>
            <label htmlFor="trigger-trigger">Trigger</label>
            <div className='input-container'>
              <span className='input-prefix' aria-hidden="true">/</span>
              <input
                id="trigger-trigger"
                type='text'
                value={triggerInput}
                onChange={(event) => setTriggerInput(event.target.value)}
                placeholder='followup'
                className='form-input-prefixed'
                required
              />
            </div>
            <span className='form-hint'>The shortcut you'll type in the Terminal to retrieve this template.</span>
          </div>

          <div className='form-group full-width'>
            <label htmlFor="content-textarea">Content</label>
            <textarea
              id="content-textarea"
              value={contentInput}
              onChange={(event) => setContentInput(event.target.value)}
              placeholder='Hi [Name], thanks for taking the time to meet today...'
              className='form-textarea'
              required
            />
            <span className='form-hint'>The text that gets returned when you run the trigger.</span>
          </div>
        </div>

        <button
          type='submit'
          className='submit-btn'
          disabled={isSubmitting}
          aria-live="polite"
        >
          {isSubmitting ? 'Saving...' : !canCreate ? 'Trial limit reached' : 'Save template'}
        </button>
      </form>
      </div>
    </main>
  );
};
