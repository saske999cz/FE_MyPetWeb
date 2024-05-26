import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ modules, value, placeholder, onChange }) => {
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "code-block",
  ]

  const handleOnChange = (newVal) => {
    if (newVal.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
      newVal = ""; // that's for handling empty tags
    }
    onChange(newVal);
  };

  return (
    <ReactQuill
      value={value}
      formats={formats}
      modules={modules}
      theme="snow"
      onChange={handleOnChange}
      placeholder={placeholder}
    />
  );
}

export default TextEditor;
