"use client";

import Editor from "react-simple-wysiwyg";

interface RichTextEditorProps {
  value: string;
  setValue: (value: string) => void;
}

function RichTextEditor({ value, setValue }: RichTextEditorProps) {
  function onChange(e) {
    setValue(e.target.value);
  }

  return <Editor  containerProps={{ style: { minHeight:'200px' } }} value={value} onChange={onChange} />;
}

export default RichTextEditor;
