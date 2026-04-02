import { useState } from 'react';
import { Button, CopyButton } from '../../../shared/ui/Button/Button';
import { useTrial } from '../../../shared/context/TrialContext';

export const FilterCmd = () => {
  const { trialCommands, updateTrialCommand } = useTrial();
  const [updatedInput, setUpdatedInput] = useState({});

  const handleUpdate = ({ id, text }) => {
    updateTrialCommand(id, text);
    setUpdatedInput((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <main className='main-content cmd-list-view'>
      <div className='search-section' style={{ marginBottom: '32px' }}>
        <h1 className='search-title'>Filter all Commands</h1>
      </div>

      <div className='cmd-list'>
        {trialCommands.length > 0 ? (
          trialCommands.map((command) => {
            const currentText = updatedInput[command._id] ?? command.text;
            return (
              <article key={command._id} className='card' aria-labelledby={`title-${command._id}`}>
                <div className='entry-header'>
                  <span id={`title-${command._id}`} className='entry-title'>{command.command}</span>
                  <div className='entry-buttons'>
                    <CopyButton textToCopy={command.text} />
                    <Button
                      content='Update'
                      disabled={currentText === command.text}
                      handle={() => handleUpdate({ id: command._id, text: currentText })}
                      className='btn-primary'
                    />
                  </div>
                </div>
                <div className='entry-edit'>
                  <textarea
                    rows={4}
                    value={currentText}
                    onChange={(e) =>
                      setUpdatedInput((prev) => ({
                        ...prev,
                        [command._id]: e.target.value,
                      }))
                    }
                    className='entry-textarea'
                    placeholder="Enter the command response..."
                    aria-label={`Edit response for command ${command.command}`}
                  />
                </div>
              </article>
            );
          })
        ) : (
          <p role="status">No commands yet — go to Create to add your first one!</p>
        )}
      </div>
    </main>
  );
};
