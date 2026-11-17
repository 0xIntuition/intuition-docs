import { createRoot } from 'react-dom/client';
import { useId, useState } from 'react';
import {
  fields,
  maxFieldLength,
  previewRecording,
  type RecordingDraft,
} from './form-model.ts';

export function CreationForm() {
  const prefix = useId();
  const [draft, setDraft] = useState<RecordingDraft>({});
  const [result, setResult] = useState<ReturnType<typeof previewRecording>>();
  const issues = result?.ok === false ? result.issues : [];

  return (
    <form
      aria-label="Recording preview"
      noValidate
      style={{ maxWidth: '65ch' }}
      onSubmit={(event) => {
        event.preventDefault();
        setResult(previewRecording(draft));
      }}
    >
      {/* Native controls keep the host's focus and color scheme. */}
      {fields.map((field) => {
        // #region field-control
        const id = prefix + field.key;
        const error = issues.find((issue) => issue.field === field.key);
        const props = {
          id,
          value: draft[field.key] ?? '',
          required: field.required,
          placeholder: field.placeholder,
          maxLength: maxFieldLength,
          'aria-invalid': Boolean(error),
          'aria-describedby': error ? id + '-error' : undefined,
          style: {
            width: '100%',
            boxSizing: 'border-box' as const,
            font: 'inherit',
          },
          onChange: (
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => {
            setDraft({ ...draft, [field.key]: event.currentTarget.value });
            setResult(undefined);
          },
        };
        const control = (
          <div key={field.key} style={{ marginBlockEnd: '1rem' }}>
            <label htmlFor={id}>
              {field.label} ({field.required ? 'required' : 'optional'})
              {field.fieldType === 'string[]' && ' — one web URL per line'}
            </label>
            {field.fieldType === 'string[]' ? (
              <textarea {...props} />
            ) : (
              <input type="text" {...props} />
            )}
            {error && <div id={id + '-error'}>{error.message}</div>}
          </div>
        );
        // #endregion
        return control;
      })}
      <button type="submit">Preview recording</button>
      <div role="status" style={{ overflowWrap: 'anywhere' }}>
        {result?.ok && (
          <dl>
            <dt>Identifier</dt>
            <dd>{result.anchor.iid ?? 'No identifier derived'}</dd>
            <dt>Profile</dt>
            <dd>{result.anchor.profile.toUpperCase()}</dd>
            <dt>Atom data</dt>
            <dd>
              <code>{result.anchor.data}</code>
            </dd>
            <dt>Atom ID</dt>
            <dd>
              <code>{result.anchor.id}</code>
            </dd>
          </dl>
        )}
        {result?.ok === false &&
          (issues.find((issue) => !issue.field)?.message ??
            'Check the marked fields and preview again.')}
      </div>
    </form>
  );
}

// #region mount
export function mountCreationForm(container: HTMLElement) {
  const root = createRoot(container);
  root.render(<CreationForm />);
  return () => root.unmount();
}
// #endregion
