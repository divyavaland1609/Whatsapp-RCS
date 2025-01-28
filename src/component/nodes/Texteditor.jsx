// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */
// import { Flex, Modal } from "antd";
// import { useEffect, useRef, useState } from "react";
// import { useTranslation } from "react-i18next";
// import ReactQuill, { Quill } from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import emojiData from "@emoji-mart/data";
// import Picker from "././EmojiPicker.jsx";
// import {
//   BoldOutlined,
//   CodeOutlined,
//   DollarOutlined,
//   ItalicOutlined,
//   SmileOutlined,
//   StrikethroughOutlined,
// } from "@ant-design/icons";

// const TextEditor = ({ onChange, value, showColumns = true }) => {
//   console.log("value", value);
//   const [text, setText] = useState(value);
//   const [showEmoji, setShowEmoji] = useState(false);
//   const [range, setRange] = useState(null);
//   const [reactQuillRef, setReactQuillRef] = useState(null);
//   const [editor, setEditor] = useState(null);
//   const { t, i18n } = useTranslation();
//   const quillRef = useRef(null);

//   useEffect(() => {
//     setText(value);
//   }, [value]);

//   // useEffect(() => {
//   //   if (reactQuillRef) {
//   //     if (typeof reactQuillRef.getEditor !== "function") return;
//   //     setEditor(reactQuillRef.getEditor());
//   //   }
//   // }, [reactQuillRef]);

//   const columnNameList = [
//     { name: t("name"), value: "name" },
//     { name: t("number"), value: "number" },

//     ...(showColumns
//       ? [
//           { name: t("variable", { __var__: 1 }), value: "var1" },
//           { name: t("variable", { __var__: 2 }), value: "var2" },
//           { name: t("variable", { __var__: 3 }), value: "var3" },
//           { name: t("variable", { __var__: 4 }), value: "var4" },
//           { name: t("variable", { __var__: 5 }), value: "var5" },
//           { name: t("variable", { __var__: 6 }), value: "var6" },
//           { name: t("variable", { __var__: 7 }), value: "var7" },
//           { name: t("variable", { __var__: 8 }), value: "var8" },
//           { name: t("variable", { __var__: 9 }), value: "var9" },
//           { name: t("variable", { __var__: 10 }), value: "var10" },
//         ]
//       : []),
//     { name: t("randomText"), value: "randomText" },
//   ];

//   useEffect(() => {
//     if (text !== value) {
//       onChange(text);
//     }
//   }, [text]);

//   // useEffect(() => {
//   //   if (editor) {
//   //     const onlyText = editor.getText().trim();
//   //     onChange(onlyText);
//   //   }
//   // }, [text]);

//   useEffect(() => {}, [range]);

//   function replaceRange(originalString, replacement, start, end) {
//     return (
//       originalString.slice(0, start) + replacement + originalString.slice(end)
//     );
//   }

//   const modifyText = (preffix, suffix, replace) => {
//     const quill = quillRef.current.getEditor();
//     const selection = quill.getSelection();
//     const startIndex = selection.index;
//     const endIndex = startIndex + selection.length;

//     // Get selected text
//     const selectedText = quill.getText(startIndex, endIndex);

//     let replaceText = "";

//     // Modify text based on selected text
//     if (
//       selectedText[0] === preffix &&
//       selectedText[selectedText.length - 1] === suffix
//     ) {
//       replaceText = selectedText.replace(preffix, "").replace(suffix, "");
//     } else {
//       replaceText = `${preffix}${replace ?? selectedText}${suffix}`;
//     }

//     // Insert the new text into the editor
//     quill.deleteText(startIndex, selection.length); // Remove the selected text
//     quill.insertText(startIndex, replaceText); // Insert the new text

//     // Move the cursor to the correct position after the update
//     quill.setSelection(startIndex + replaceText.length, 0);
//   };

//   // const modifyText = (preffix, suffix, replace, filter) => {
//   //   const text = editor.getText();

//   //   const startIndex = range?.index ?? 0;
//   //   const endIndex = (range?.index ?? 0) + (range?.length ?? 0);

//   //   const selectedText = text.slice(startIndex, endIndex);
//   //   var replaceText = "";

//   //   if (filter == "bulleted-list" || filter == "quote") {
//   //     const lines = selectedText.split("\n");
//   //     replaceText = lines
//   //       .map((line) => {
//   //         if (line.startsWith(preffix)) {
//   //           return `${line.slice(preffix.length)}`;
//   //         } else {
//   //           return `${preffix}${line}`;
//   //         }
//   //       })
//   //       .join("\n");
//   //   } else {
//   //     if (
//   //       selectedText[0] == preffix &&
//   //       selectedText[selectedText.length - 1] == suffix
//   //     ) {
//   //       replaceText = selectedText.replaceAll(preffix, "");
//   //       replaceText = selectedText.replaceAll(suffix, "");
//   //     } else {
//   //       replaceText = `${preffix}${replace ?? selectedText}${suffix}`;
//   //     }
//   //   }
//   //   const newText = replaceRange(text, replaceText, startIndex, endIndex);
//   //   editor.setText(newText);
//   // };

//   const onBoldText = () => {
//     modifyText("*", "*");
//   };

//   const onItalicText = () => {
//     modifyText("_", "_");
//   };

//   const onStrikeText = () => {
//     modifyText("~", "~");
//   };

//   const onEmojiText = (value) => {
//     modifyText("", "", value.native);
//     setShowEmoji(false);
//   };

//   const handleChangeSelection = (range) => {
//     if (range) {
//       setRange(range);
//     }
//   };

//   const handleFocus = (range) => {
//     if (range) {
//       setRange(range);
//     }
//   };

//   return (
//     <>
//       <Modal
//         width={600}
//         footer={null}
//         closable={false}
//         title={null}
//         open={showEmoji}
//         onCancel={() => setShowEmoji(false)}
//       >
//         <Flex justify="center">
//           <Picker
//             theme="light"
//             autoFocus={true}
//             data={emojiData}
//             perLine={15}
//             centered={true}
//             onEmojiSelect={(emoji) => onEmojiText(emoji)}
//           />
//         </Flex>
//       </Modal>

//       <div
//         style={{
//           border: "1px solid #ccc",
//           borderRadius: "6px",
//           padding: "8px",
//           maxWidth: "500px",
//           background: "#fff",
//         }}
//       >
//         <div
//           style={{
//             height: "100px",
//             maxHeight: "100px",
//             overflowY: "auto",
//             // padding:"0px"
//           }}
//         >
//           <ReactQuill
//             className="quill ql-editor"
//             id="editor"
//             theme="snow"
//             ref={quillRef}
//             // ref={(el) => {
//             //   if (el) {
//             //     setReactQuillRef(el);
//             //     // setEditor(el.getEditor());
//             //   }
//             // }}
//             value={text}
//             onChangeSelection={handleChangeSelection}
//             onFocus={handleFocus}
//             onChange={(value) => setText(value)}
//             placeholder={t("message")}
//             modules={{
//               toolbar: false,
//             }}

//             style={{
//               border: "none",
//               outline: "none",
//               padding: "0px",
//             }}
//           />
//         </div>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-around",
//             paddingTop: "8px",
//             borderTop: "1px solid #ccc",
//           }}
//         >
//           <SmileOutlined
//             style={{ fontSize: "18px", cursor: "pointer" }}
//             onClick={() => setShowEmoji(true)}
//           />
//           <BoldOutlined
//             style={{ fontSize: "18px", cursor: "pointer" }}
//             onClick={onBoldText}
//           />
//           <ItalicOutlined
//             style={{ fontSize: "18px", cursor: "pointer" }}
//             onClick={onItalicText}
//           />
//           <StrikethroughOutlined
//             style={{ fontSize: "18px", cursor: "pointer" }}
//             onClick={onStrikeText}
//           />
//           <DollarOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
//           <CodeOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
//         </div>
//       </div>
//     </>
//   );
// };

// export default TextEditor;




/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Flex, Modal, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import emojiData from "@emoji-mart/data";
import Picker from "./EmojiPicker.jsx";
import {
  BoldOutlined,
  CodeOutlined,
  DollarOutlined,
  ItalicOutlined,
  SmileOutlined,
  StrikethroughOutlined,
} from "@ant-design/icons";

const TextEditor = ({ onChange, value, showColumns = true }) => {
  const [text, setText] = useState(value); // Local state for the editor
  const [showEmoji, setShowEmoji] = useState(false);
  const [range, setRange] = useState(null);
  const [reactQuillRef, setReactQuillRef] = useState(null);

  const quillRef = useRef(null);
  const { t } = useTranslation();
  const { Paragraph } = Typography;

  useEffect(() => {
    if (value !== text) {
      setText(value);
    }
  }, [value]);

  useEffect(() => {
    if (reactQuillRef && typeof reactQuillRef.getEditor === "function") {
      const editorInstance = reactQuillRef.getEditor();
      quillRef.current = editorInstance;
    }
  }, [reactQuillRef]);

  const columnNameList = [
    { name: t("name"), value: "name" },
    { name: t("number"), value: "number" },
    ...(showColumns
      ? Array.from({ length: 10 }, (_, i) => ({
          name: t("variable", { __var__: i + 1 }),
          value: `var${i + 1}`,
        }))
      : []),
    { name: t("randomText"), value: "randomText" },
  ];

  function replaceRange(originalString, replacement, start, end) {
    return (
      originalString.slice(0, start) + replacement + originalString.slice(end)
    );
  }

  const modifyText = (preffix, suffix, replace, filter) => {
    const editor = quillRef.current;
    if (!editor) return;

    const text = editor.getText();
    const startIndex = range?.index ?? 0;
    const endIndex = (range?.index ?? 0) + (range?.length ?? 0);

    const selectedText = text.slice(startIndex, endIndex);
    let replaceText = "";

    if (filter === "bulleted-list" || filter === "quote") {
      const lines = selectedText.split("\n");
      replaceText = lines
        .map((line) => {
          if (line.startsWith(preffix)) {
            return `${line.slice(preffix.length)}`;
          } else {
            return `${preffix}${line}`;
          }
        })
        .join("\n");
    } else {
      if (
        selectedText[0] === preffix &&
        selectedText[selectedText.length - 1] === suffix
      ) {
        replaceText = selectedText.replaceAll(preffix, "");
        replaceText = replaceText.replaceAll(suffix, "");
      } else {
        replaceText = `${preffix}${replace ?? selectedText}${suffix}`;
      }
    }

    const newText = replaceRange(text, replaceText, startIndex, endIndex);
    editor.setText(newText);
    editor.setSelection(startIndex + replaceText.length, 0); // Restore cursor position
  };

  const onBoldText = () => modifyText("*", "*");
  const onItalicText = () => modifyText("_", "_");
  const onStrikeText = () => modifyText("~", "~");
  const onEmojiText = (emoji) => {
    modifyText("", "", emoji.native);
    setShowEmoji(false);
  };

  const handleChangeSelection = (range) => {
    if (range) {
      setRange(range);
    }
  };

  const handleChangeText = (value) => {
    setText(value);
    if (onChange) onChange(value);
  };

  const handleFocus = (range) => {
    if (range) {
      setRange(range);
    }
  };

  return (
    <>
      <Modal
        width={600}
        footer={null}
        closable={false}
        title={null}
        open={showEmoji}
        onCancel={() => setShowEmoji(false)}
      >
        <Flex justify="center">
          <Picker
            theme="light"
            autoFocus
            data={emojiData}
            perLine={15}
            centered
            onEmojiSelect={(emoji) => onEmojiText(emoji)}
          />
        </Flex>
      </Modal>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "6px",
          padding: "8px",
          maxWidth: "500px",
          background: "#fff",
        }}
      >
        <div
          style={{
            height: "100px",
            maxHeight: "100px",
            overflowY: "auto",
          }}
        >
          <ReactQuill
            className="quill ql-editor"
            id="editor"
            theme="snow"
            ref={(el) => {
              if (el) {
                setReactQuillRef(el);
              }
            }}
            value={text}
            onChange={handleChangeText}
            onFocus={handleFocus}
            onChangeSelection={handleChangeSelection}
            placeholder={t("message")}
            modules={{ toolbar: false }}
            style={{ border: "none", outline: "none", padding: "0px" }}
          />
        </div>
        
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            paddingTop: "8px",
            borderTop: "1px solid #ccc",
          }}
        >
          <SmileOutlined
            style={{ fontSize: "18px", cursor: "pointer"}}
            onClick={() => setShowEmoji(true)}
          />
          <BoldOutlined
            style={{ fontSize: "18px", cursor: "pointer"}}
            onClick={onBoldText}
          />
          <ItalicOutlined
            style={{ fontSize: "18px", cursor: "pointer"}}
            onClick={onItalicText}
          />
          <StrikethroughOutlined
            style={{ fontSize: "18px", cursor: "pointer" }}
            onClick={onStrikeText}
          />
          <DollarOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
          <CodeOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
        </div>

      </div>
    </>
  );
};

export default TextEditor;

