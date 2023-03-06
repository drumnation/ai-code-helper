import { DiffEditor } from '@monaco-editor/react';
import { getNumLines } from '../../../../App.logic';
import { IMonacoDiffEditorProps } from '../../../../types';

export const MonacoDiffEditor = ({
  modified,
  original,
  originalHeading,
  modifiedHeading,
}: IMonacoDiffEditorProps) => {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <h3 style={{ flex: 1 }}>{originalHeading}</h3>
        <h3 style={{ flex: 1 }}>{modifiedHeading}</h3>
      </div>
      <div
        style={{
          border: '3px solid black',
        }}
      >
        <DiffEditor
          theme='vs-dark'
          language='typescript'
          width='100%'
          options={{
            readOnly: true,
            renderSideBySide: true,
            ignoreTrimWhitespace: false, // Include whitespace differences in the diff
          }}
          height={getNumLines(original) * 25}
          original={original}
          modified={modified}
        />
      </div>
    </div>
  );
};
