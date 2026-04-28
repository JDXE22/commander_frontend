import { useState } from 'react';
import { useTrial } from '../../../shared/context/TrialContext';
import { sileo } from 'sileo';
import { normalizeCommandTrigger } from '../../../shared/utils/commandUtils';
import './CreateCmd.css';

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
        description:
          'Fill in the name, trigger, and content to save your template.',
        fill: '#ef4444',
      });
      return;
    }

    setIsSubmitting(true);
    const commandPayload = {
      command: normalizeCommandTrigger(triggerInput),
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
          styles: {
            title: 'sileo-text-white',
            description: 'sileo-text-white',
            badge: 'sileo-badge-fix',
          },
        });
        onRefresh && onRefresh();
        setTriggerInput('');
        setContentInput('');
        setNameInput('');
      } else {
        sileo.error({
          title: "Couldn't save",
          description:
            creationResponse?.message ||
            'Something went wrong. Try again in a moment.',
          fill: '#ef4444',
        });
      }
    } catch (creationError) {
      console.error('Command registration failed:', creationError);
      sileo.error({
        title: 'Something went wrong',
        description: "We couldn't save your template. Try again in a moment.",
        fill: '#ef4444',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className='main-content create-view'>
      <h1 className='visually-hidden'>Create New Template</h1>
      <div className='page-container'>
        <section className='search-section'>
          <div className='terminal-status-line'>
            <div className='status-left'>
              <span className='status-indicator' />
              <span className='status-path'>~/commander/create_template</span>
            </div>
          </div>
        </section>

        <form onSubmit={handleCreateSubmit} className='create-form'>
          <div className='form-grid'>
            <div className='form-group'>
              <label htmlFor='command-name'>NAME_LABEL</label>
              <input
                id='command-name'
                type='text'
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
                placeholder='e.g. Meeting Follow-up'
                className='form-input'
                maxLength={80}
                required
              />
              <span className='form-hint'>
                Internal identifier for retrieval.
              </span>
            </div>

            <div className='form-group'>
              <label htmlFor='trigger-trigger'>TRIGGER_PATH</label>
              <div className='input-container'>
                <span className='input-prefix' aria-hidden='true'>
                  /
                </span>
                <input
                  id='trigger-trigger'
                  type='text'
                  value={triggerInput}
                  onChange={(event) => setTriggerInput(event.target.value)}
                  placeholder='followup'
                  className='form-input-prefixed'
                  maxLength={40}
                  required
                />
              </div>
              <span className='form-hint'>
                Technical shortcut used in terminal.
              </span>
            </div>

            <div className='form-group full-width'>
              <label htmlFor='content-textarea'>DATA_CONTENT</label>
              <textarea
                id='content-textarea'
                value={contentInput}
                onChange={(event) => setContentInput(event.target.value)}
                placeholder='Enter technical template data here...'
                className='form-textarea'
                maxLength={5000}
                required
              />
              <span className='form-hint'>
                Data string payload for clipboard update.
              </span>
            </div>
          </div>

          <button
            type='submit'
            className='submit-btn'
            disabled={isSubmitting}
            aria-live='polite'>
            {isSubmitting
              ? 'EXECUTING_SAVE...'
              : !canCreate
                ? 'LIMIT_REACHED'
                : 'INITIALIZE_TEMPLATE'}
          </button>
        </form>
      </div>
    </main>
  );
};
