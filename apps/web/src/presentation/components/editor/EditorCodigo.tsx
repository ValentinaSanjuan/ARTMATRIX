import Editor, { loader, type OnMount } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';

// Monaco Editor (diagrama de despliegue). Se carga desde jsDelivr.
loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs' } });

interface Props {
  valor: string;
  onCambio: (v: string) => void;
  lineaError?: number | null;
  mensajeError?: string | null;
  soloLectura?: boolean;
}

type Monaco = Parameters<OnMount>[1];
type EditorIns = Parameters<OnMount>[0];

/** RF-10: editor de código Java. */
export function EditorCodigo({ valor, onCambio, lineaError, mensajeError, soloLectura }: Props) {
  const editorRef = useRef<EditorIns | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const alMontar: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    monaco.editor.defineTheme('artmatrix', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c586c0' },
        { token: 'number', foreground: 'b5cea8' },
        { token: 'string', foreground: 'f2b84b' },
      ],
      // Fondo semitransparente: deja ver un poco la sala detrás del editor.
      colors: {
        'editor.background': '#0e1a2b00',
        'editorGutter.background': '#0e1a2b00',
        'editor.lineHighlightBackground': '#ffffff12',
        'editor.lineHighlightBorder': '#00000000',
      },
    });
    monaco.editor.setTheme('artmatrix');
  };

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const modelo = editor?.getModel();
    if (!editor || !monaco || !modelo) return;
    const marcas = lineaError && lineaError > 0
      ? [{
          startLineNumber: lineaError, endLineNumber: lineaError, startColumn: 1,
          endColumn: modelo.getLineMaxColumn(Math.min(lineaError, modelo.getLineCount())),
          message: mensajeError ?? 'Error', severity: monaco.MarkerSeverity.Error,
        }]
      : [];
    monaco.editor.setModelMarkers(modelo, 'artmatrix', marcas);
    if (lineaError && lineaError > 0) editor.revealLineInCenter(lineaError);
  }, [lineaError, mensajeError]);

  return (
    <Editor
      height="100%"
      language="java"
      value={valor}
      onChange={(v) => onCambio(v ?? '')}
      onMount={alMontar}
      loading={<div className="consola__info" style={{ padding: 8 }}>Cargando editor…</div>}
      options={{
        fontSize: 14,
        fontFamily: 'JetBrains Mono, monospace',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        tabSize: 4,
        readOnly: soloLectura,
        automaticLayout: true,
      }}
    />
  );
}
